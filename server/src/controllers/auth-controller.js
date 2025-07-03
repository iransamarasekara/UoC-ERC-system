const jwt = require("jsonwebtoken");
const db = require("../models");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF and image files (JPEG, JPG, PNG) are allowed"));
    }
  },
});

exports.validateToken = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // decode JWT token into token, secret_key, user_data & exp_time
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.validateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & Password is required" });
    }

    const user = await db.User.findOne({
      where: { email: email, password: password },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log("User: ", user.role);

    // Initialize userData with common fields
    const userData = {
      user_id: user.user_id,
      role: user.role,
      email: user.email,
    };

    // If user is an applicant, fetch the applicant record
    if (user.role === "applicant") {
      const applicant = await db.Applicant.findOne({
        where: { user_id: user.user_id },
      });

      if (applicant) {
        userData.applicant_id = applicant.applicant_id;
        userData.applicant_category = applicant.applicant_category;
      }
    }
    // If user is a committee member, fetch committee member record
    else if (user.role === "committee_member") {
      const committeeMember = await db.Committee_Member.findOne({
        where: { user_id: user.user_id },
      });

      if (committeeMember) {
        userData.member_id = committeeMember.member_id;
        userData.committee_id = committeeMember.committee_id;
        userData.is_active = committeeMember.is_active;
      }
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res
      .status(200)
      .json({ message: "User found.", auth: token, data: userData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to upload file to Cloudinary
const uploadToCloudinary = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // Automatically detect file type
        folder: "evidence_documents", // Organize files in a folder
        public_id: `evidence_${Date.now()}_${originalname.split(".")[0]}`,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

exports.registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      applicant_category,
      identity_number,
      address,
      evidence_url, // This will be set by the upload endpoint
    } = req.body;

    // Validate required fields
    if (
      !email ||
      !password ||
      !first_name ||
      !last_name ||
      !applicant_category ||
      !identity_number ||
      !address
    ) {
      return res.status(400).json({
        message:
          "Email, Password, Name, Applicant Category, Identity Number, and Address are required",
      });
    }

    // Check if evidence is required for non-student categories
    const requiresEvidence = applicant_category !== "students";
    if (requiresEvidence && !evidence_url) {
      return res.status(400).json({
        message: "Evidence document is required for this occupation category",
      });
    }

    // Check if email already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Begin transaction to ensure both user and applicant are created
    const transaction = await db.sequelize.transaction();

    try {
      // First create the user
      const user = await db.User.create(
        {
          email,
          password,
          first_name,
          last_name,
          phone,
          address,
          identity_number,
          role: "applicant",
          created_at: new Date(),
          validity: true, // Assuming new users are valid by default
        },
        { transaction }
      );

      // Then create the applicant record linked to this user
      const applicant = await db.Applicant.create(
        {
          user_id: user.user_id,
          applicant_category,
          evidence_url: evidence_url || null, // Store the evidence URL
        },
        { transaction }
      );

      // Commit the transaction
      await transaction.commit();

      // Generate token for authentication
      const token = jwt.sign(
        {
          id: user.user_id,
          email: user.email,
          role: user.role,
          applicant_id: applicant.applicant_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
      );

      const userData = {
        user_id: user.user_id,
        applicant_id: applicant.applicant_id,
        email: user.email,
        role: user.role,
        applicant_category: applicant.applicant_category,
      };

      res.status(201).json({
        message: "Applicant registered successfully",
        auth: token,
        data: userData,
      });
    } catch (error) {
      // If any error occurs, rollback the transaction
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
};

// File upload endpoint
exports.uploadEvidence = async (req, res) => {
  try {
    // Use multer middleware to handle file upload
    upload.single("evidence")(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res
              .status(400)
              .json({ message: "File size must be less than 10MB" });
          }
        }
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      try {
        // Upload to Cloudinary
        const result = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname
        );

        res.status(200).json({
          message: "File uploaded successfully",
          file_url: result.secure_url,
          public_id: result.public_id,
        });
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        res
          .status(500)
          .json({ message: "Failed to upload file to cloud storage" });
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Super admin endpoint to create admin users
exports.createAdminUser = async (req, res) => {
  try {
    // 1. First, verify that the requesting user is a super admin
    const requestingUserId = req.user.id; // Assuming you extract this from JWT in middleware
    const requestingUser = await db.User.findByPk(requestingUserId);

    if (!requestingUser || requestingUser.role !== "super_admin") {
      return res.status(403).json({
        message: "Unauthorized. Only super admins can create admin accounts.",
      });
    }

    // 2. Extract admin user data from request
    const { email, password, first_name, last_name, phone, role } = req.body;

    // 3. Validate required fields
    if (!email || !password || !first_name || !last_name || !role) {
      return res.status(400).json({
        message:
          "Email, Password, First Name, Last Name & Admin Role are required",
      });
    }

    // 4. Check if email already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // 5. Create the admin user
    const adminUser = await db.User.create({
      email,
      password, // Assuming you hash this password in a pre-save hook or before this point
      first_name,
      last_name,
      phone,
      role,
      created_at: new Date(),
      validity: true,
    });

    // 7. Return the created admin user (excluding sensitive data)
    const adminData = {
      user_id: adminUser.user_id,
      email: adminUser.email,
      first_name: adminUser.first_name,
      last_name: adminUser.last_name,
      role: adminUser.role,
    };

    // 8. Optionally trigger notification to the new admin
    // sendAdminWelcomeEmail(adminData.email, adminData.first_name);

    res.status(201).json({
      message: "Admin user created successfully",
      admin: adminData,
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    res.status(500).json({ error: error.message });
  }
};

// exports.createInitialAdmin = async (req, res) => {
//   try {
//     // Check if an admin already exists
//     const adminExists = await db.User.findOne({
//       where: { role: 'ADMIN' }
//     });
    
//     if (adminExists) {
//       return res.status(400).json({ 
//         message: "Admin user already exists", 
//         adminId: adminExists.user_id,
//         email: adminExists.email
//       });
//     }
    
//     // Check if email already exists
//     const emailExists = await db.User.findOne({
//       where: { email: 'admin@uoc.lk' }
//     });
    
//     if (emailExists) {
//       return res.status(400).json({ 
//         message: "Email already in use", 
//         userId: emailExists.user_id,
//         email: emailExists.email
//       });
//     }
    
//     // Create user with all required fields
//     const user = await db.User.create({
//       // Don't specify user_id, let the database assign it
//       email: 'admin@uoc.lk',
//       identity_number: 'ADMIN' + Date.now().toString().substring(7), // Make it unique
//       first_name: 'Admin',
//       last_name: 'User',
//       password: 'admin123', // In production use bcrypt to hash
//       role: 'ADMIN',
//       created_at: new Date(),
//       validity: false // Based on your schema
//     });
    
//     // Create admin record
//     await db.Admin.create({
//       user_id: user.user_id,
//       admin_type: 'ERC_TECHNICAL',
//       created_at: new Date(),
//       updated_at: new Date()
//     });
    
//     res.status(201).json({ 
//       message: 'Initial admin user created successfully',
//       userId: user.user_id,
//       email: 'admin@uoc.lk',
//       password: 'admin123'
//     });
//   } catch (error) {
//     console.error('Error creating initial admin:', error);
    
//     // More detailed error reporting
//     if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
//       const validationErrors = error.errors.map(err => ({
//         field: err.path,
//         message: err.message,
//         type: err.type,
//         value: err.value
//       }));
      
//       return res.status(400).json({ 
//         error: error.name, 
//         details: validationErrors 
//       });
//     }
    
//     res.status(500).json({ 
//       error: error.message,
//       name: error.name
//     });
//   }
// };

exports.createInitialAdmin = async (req, res) => {
  try {
    // Check if an admin already exists
    const adminUsers = await db.sequelize.query(
      "SELECT * FROM \"Users\" WHERE role = 'ADMIN'",
      { type: db.sequelize.QueryTypes.SELECT }
    );
    
    if (adminUsers.length > 0) {
      return res.status(200).json({ 
        message: "Admin user already exists", 
        adminId: adminUsers[0].user_id,
        email: adminUsers[0].email,
        password: "admin123" // Default password for testing
      });
    }
    
    // Find the maximum user_id in the Users table
    const [maxIdResult] = await db.sequelize.query(
      "SELECT COALESCE(MAX(user_id), 0) + 1 as next_id FROM \"Users\"",
      { type: db.sequelize.QueryTypes.SELECT }
    );
    
    const nextId = maxIdResult.next_id;
    
    // Insert the admin user with an explicit ID
    await db.sequelize.query(`
      INSERT INTO "Users" (
        user_id, email, identity_number, first_name, last_name, 
        password, role, created_at, validity
      ) VALUES (
        ${nextId}, 'admin@uoc.lk', 'ADMIN${Date.now()}', 'Admin', 'User', 
        'admin123', 'ADMIN', NOW(), false
      )
    `);
    
    // Create admin record
    await db.sequelize.query(`
      INSERT INTO "Admins" (
        user_id, admin_type, created_at, updated_at
      ) VALUES (
        ${nextId}, 'ERC_TECHNICAL', NOW(), NOW()
      )
    `);
    
    res.status(201).json({ 
      message: 'Initial admin user created successfully',
      userId: nextId,
      email: 'admin@uoc.lk',
      password: 'admin123'
    });
  } catch (error) {
    console.error('Error creating initial admin:', error);
    res.status(500).json({ 
      error: error.message,
      name: error.name,
      detail: error.parent?.detail || 'No details available'
    });
  }
};