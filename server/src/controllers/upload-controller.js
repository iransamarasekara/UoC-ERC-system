const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept common document formats
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images and documents are allowed"));
    }
  },
});

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

// Multiple documents upload endpoint
exports.uploadDocuments = async (req, res) => {
  try {
    // Use multer middleware to handle multiple file uploads
    upload.array("documents", 10)(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res
              .status(400)
              .json({ message: "File size must be less than 10MB" });
          }
          if (err.code === "LIMIT_FILE_COUNT") {
            return res
              .status(400)
              .json({ message: "Too many files. Maximum 10 files allowed" });
          }
        }
        return res.status(400).json({ message: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      try {
        const uploadPromises = req.files.map(async (file) => {
          const result = await uploadToCloudinary(
            file.buffer,
            file.originalname
          );

          return {
            originalName: file.originalname,
            file_url: result.secure_url,
            public_id: result.public_id,
            size: file.size,
            mimetype: file.mimetype,
          };
        });

        const uploadResults = await Promise.all(uploadPromises);

        res.status(200).json({
          message: "Files uploaded successfully",
          files: uploadResults,
        });
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        res
          .status(500)
          .json({ message: "Failed to upload files to cloud storage" });
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Single document upload endpoint (for backward compatibility)
exports.uploadEvidence = async (req, res) => {
  try {
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
