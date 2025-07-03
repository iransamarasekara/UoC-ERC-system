const { User, Admin, Committee, CommitteeMember } = require('../models');
const db = require('../models'); // Add this line to import the db object
const bcrypt = require('bcrypt');
const { sendMail } = require('../utils/email-service');
const { generateRandomPassword } = require('../utils/password-utils');
const e = require('express');

// Account Management Controllers
const adminController = {
  // 3.1.1, 3.1.2, 3.1.3 Create accounts for committee members, staff, chairs
async createUser(req, res) {
  try {
    const { email, firstName, lastName, role, committeeId, userType } = req.body;
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // If adding a committee member, check if committee exists
    // (Removed duplicate committee existence check here)
    
    // Find the maximum user_id and increment it
    const [maxIdResult] = await db.sequelize.query(
      "SELECT COALESCE(MAX(user_id), 0) + 1 as next_id FROM \"Users\"",
      { type: db.sequelize.QueryTypes.SELECT }
    );
    
    const nextId = maxIdResult.next_id;
    
    // Generate random password
    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create unique identity number
    const identityNumber = role.substring(0, 3).toUpperCase() + Date.now().toString().substring(7);
    
    // Create user with explicit user_id
    const user = await db.sequelize.query(`
      INSERT INTO "Users" (
        user_id, email, identity_number, first_name, last_name, 
        password, role, created_at, validity
      ) VALUES (
        ${nextId}, '${email}', '${identityNumber}', '${firstName}', '${lastName}', 
        '${hashedPassword}', '${role}', NOW(), false
      ) RETURNING user_id, email, role
    `, { type: db.sequelize.QueryTypes.INSERT });
    
    const userId = nextId; // Use the calculated ID
    
    // Based on role, create appropriate records
    if (role === 'ADMIN') {
      await db.sequelize.query(`
        INSERT INTO "Admins" (
          user_id, admin_type, created_at, updated_at
        ) VALUES (
          ${userId}, '${userType || 'ERC_TECHNICAL'}', NOW(), NOW()
        )
      `);
    } else if (role === 'COMMITTEE_MEMBER' || role === 'STAFF') {
      if (committeeId) {
        await db.sequelize.query(`
          INSERT INTO "CommitteeMembers" (
            user_id, committee_id, role, is_active, created_at, updated_at
          ) VALUES (
            ${userId}, ${committeeId}, '${role === 'COMMITTEE_MEMBER' ? 'MEMBER' : 'STAFF'}', 
            true, NOW(), NOW()
          )
        `);
      } else {
        // If no committee is specified, just create the user without a committee assignment
        console.log(`User ${email} created without committee assignment`);
      }
    }
    if ((role === 'COMMITTEE_MEMBER' || role === 'STAFF') && committeeId) {
        const committeeExists = await db.sequelize.query(
            `SELECT 1 FROM "Committees" WHERE committee_id = ${committeeId}`,
            { type: db.sequelize.QueryTypes.SELECT }
    );
    
    if (committeeExists.length === 0) {
        return res.status(400).json({ 
        error: `Committee with ID ${committeeId} does not exist. Please create the committee first.` 
        });
    }
    }
    
    const htmlEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://www.cmb.ac.lk/wp-content/themes/university/images/logo.png" alt="University of Colombo Logo" style="max-width: 150px;">
        <h2 style="color: #003366;">Ethics Review Committee System</h2>
      </div>

      <p>Dear ${firstName} ${lastName},</p>
      
      <p>Welcome to the <strong>University of Colombo Ethics Review Committee System</strong>. Your account has been created successfully.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Account Details:</strong></p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${password}</p>
      </div>
      
      <p>Please log in at <a href="https://erc.cmb.ac.lk/login" style="color: #0066cc;">https://erc.cmb.ac.lk/login</a> and change your password immediately for security reasons.</p>
      
      <p>If you have any questions or need assistance, please contact our support team.</p>
      
      <p>
        Best regards,<br>
        ERC Admin Team<br>
        <em>University of Colombo</em>
      </p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>If you did not request this account, please contact us immediately.</p>
      </div>
    </div>
    `;

      await sendMail({
        to: email,
        subject: 'Welcome to the UoC Ethics Review Committee System',
        text: `Welcome to the University of Colombo Ethics Review Committee System. Your account has been created. Email: ${email}, Temporary Password: ${password}`,
        html: htmlEmail
      });

      console.log('Email sent to:', email);
      // Return success response
      console.log('=== User Created ===');
      console.log(user);
      console.log('====================');
      console.log('User ID:', userId);
      console.log('Password:', password);
      console.log('====================');
      
      return res.status(201).json({ 
        message: 'User created successfully and credentials sent via email',
        userId: userId,
        password: password // Include password in response for testing (remove in production)
      });
      } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: error.message });
      }
    },

    // 3.1.3 list users
    async listUsers(req, res) {
      try {
        const users = await User.findAll({
          attributes: ["user_id", "email", "identity_number", "first_name", "last_name", 
            "password", "role", "created_at", "validity"],
          order: [['user_id', 'ASC']]
        });
        if (!users || users.length === 0) {
          return res.status(404).json({ error: 'No users found' });
        }
        // Return the list of users
        console.log('=== Users ===');
        console.log(users);
        console.log('================');
        return res.status(200).json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Failed to fetch users' });
      }
    },

    // Make the Account Deletion function more generic
    async deleteUser(req, res) {
      try {
        const userId = req.params.userId;
        
        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        // Delete the user
        await user.destroy();
        
        return res.status(200).json({
          message: 'User deleted successfully',
          userId
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: error.message });
      }
    },
  
async getTableStructure(req, res) {
  try {
    const { tableName } = req.params;
    
    if (!tableName) {
      return res.status(400).json({ error: 'Table name is required' });
    }
    
    const columns = await db.sequelize.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = '${tableName}'
      ORDER BY ordinal_position
    `, { type: db.sequelize.QueryTypes.SELECT });
    
    return res.status(200).json({
      tableName,
      columns
    });
  } catch (error) {
    console.error(`Error getting table structure for ${req.params.tableName}:`, error);
    return res.status(500).json({ error: error.message });
  }
},

  async fixSequence(req, res) {
    try {
      // Find the maximum user_id
      const [maxIdResult] = await db.sequelize.query(
        "SELECT COALESCE(MAX(user_id), 0) + 1 as max_id FROM \"Users\"",
        { type: db.sequelize.QueryTypes.SELECT }
      );
      
      const maxId = maxIdResult.max_id;
      
      // Reset the sequence to the max_id
      await db.sequelize.query(
        `ALTER SEQUENCE "Users_user_id_seq" RESTART WITH ${maxId}`
      );
      
      return res.status(200).json({
        message: "User ID sequence has been reset",
        newSequenceValue: maxId
      });
    } catch (error) {
      console.error('Error fixing sequence:', error);
      return res.status(500).json({ error: error.message });
    }
  },
  
  // 3.1.4 List all reviewers under each committee
  async listCommitteeReviewers(req, res) {
    try {
      const committees = await Committee.findAll({
        include: [
          {
            model: CommitteeMember,
            as: 'members',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['user_id', 'first_name', 'last_name', 'email', 'is_active']
              }
            ]
          }
        ]
      });
      
      return res.status(200).json(committees);
    } catch (error) {
      console.error('Error listing reviewers:', error);
      return res.status(500).json({ error: 'Failed to list reviewers' });
    }
  },
  
  // 3.1.5 Block/Remove accounts
  async updateUserStatus(req, res) {
    try {
      const { userId, action } = req.body;
      
      if (!userId || !action) {
        return res.status(400).json({ error: 'User ID and action are required' });
      }
      
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (action === 'block' && user.validity === false) {
        return res.status(400).json({ error: 'User is already blocked' });
      }
      if (action === 'unblock' && user.validity === true) {
        return res.status(400).json({ error: 'User is already unblocked' });
      }
      
      if (action === 'block') {
        user.validity = false;
      } else if (action === 'unblock') {
        user.validity = true;
      } else {
        return res.status(400).json({ error: 'Invalid action' });
      }
      
      await user.save();
      
      return res.status(200).json({
        message: `User ${action}ed successfully`,
        userId: user.user_id,
        validity: user.validity
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      return res.status(500).json({ error: error.message });
    }
  },

async updateDatabaseSchema(_, res) {
  try {
    //add columns applicant_category, first_name, last_name, email to Applicants table
    await db.sequelize.query(`
      ALTER TABLE "Applicants" 
      ADD COLUMN IF NOT EXISTS applicant_category VARCHAR(255),
      ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS last_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS email VARCHAR(255);
    `);

    //remove column user_id from Applicants table
    await db.sequelize.query(`
      ALTER TABLE "Applicants" 
      DROP COLUMN IF EXISTS user_id;
    `);
    
    } catch (error) {
    console.error('Error updating database schema:', error);
    return res.status(500).json({ error: error.message });
  }
},

async checkApplicationsTable(req, res) {
  try {
    // Check table structure
    const columns = await db.sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Applications'
      ORDER BY ordinal_position;
    `, { type: db.sequelize.QueryTypes.SELECT });
    
    // Count records
    const [countResult] = await db.sequelize.query(`
      SELECT COUNT(*) as count FROM "Applications";
    `, { type: db.sequelize.QueryTypes.SELECT });
    
    return res.status(200).json({
      tableStructure: columns,
      recordCount: countResult.count
    });
  } catch (error) {
    console.error("Error checking table structure:", error);
    return res.status(500).json({ error: error.message });
  }
},

async checkApplicantTable(req, res) {
  try {
    // Check if table exists
    const tableCheck = await db.sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'Applicants'
      );
    `, { type: db.sequelize.QueryTypes.SELECT });
    
    if (!tableCheck[0].exists) {
      return res.status(404).json({ error: 'Applicants table does not exist' });
    }
    
    // Check columns
    const columns = await db.sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Applicants'
      ORDER BY ordinal_position;
    `, { type: db.sequelize.QueryTypes.SELECT });
    
    return res.status(200).json({
      tableExists: true,
      columns
    });
  } catch (error) {
    console.error('Error checking Applicants table:', error);
    return res.status(500).json({ error: error.message });
  }
},

async checkModels(req, res) {
  try {
    // Get all model names
    const models = Object.keys(db).filter(
      key => typeof db[key] === 'function' && key !== 'Sequelize'
    );
    
    // Check Application model associations
    const applicationAssociations = [];
    if (db.Application && typeof db.Application.associations === 'object') {
      Object.keys(db.Application.associations).forEach(assoc => {
        const association = db.Application.associations[assoc];
        applicationAssociations.push({
          name: assoc,
          type: association.associationType,
          target: association.target.name,
          foreignKey: association.foreignKey
        });
      });
    }
    
    return res.status(200).json({
      models,
      applicationModel: db.Application ? true : false,
      applicantModel: db.Applicant ? true : false,
      applicationAssociations
    });
  } catch (error) {
    console.error('Error checking models:', error);
    return res.status(500).json({ error: error.message });
  }
},
  
  // 3.1.6 Group committee members
async createCommittee(req, res) {
  try {
    const { name, type } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ error: 'Committee name and type are required' });
    }
    
    // Find the maximum committee_id and increment it
    const [maxIdResult] = await db.sequelize.query(
      "SELECT COALESCE(MAX(committee_id), 0) + 1 as next_id FROM \"Committees\"",
      { type: db.sequelize.QueryTypes.SELECT }
    );
    
    const nextId = maxIdResult.next_id;
    
    // Insert committee with explicit ID, using the correct column names
    await db.sequelize.query(`
      INSERT INTO "Committees" (
        committee_id, committee_name, committee_type
      ) VALUES (
        ${nextId}, '${name}', '${type}'
      )
    `);
    
    return res.status(201).json({
      message: 'Committee created successfully',
      committeeId: nextId
    });
  } catch (error) {
    console.error('Error creating committee:', error);
    return res.status(500).json({ error: error.message });
  }
},

//see the list of committees
async listCommittees(req, res) {
  try {
    const committees = await Committee.findAll({
      attributes: ['committee_id', 'committee_name', 'committee_type'],
      order: [['committee_id', 'ASC']]
    });
    if (!committees || committees.length === 0) {
      return res.status(404).json({ error: 'No committees found' });  
    }
    // Return the list of committees
    console.log('=== Committees ===');
    console.log(committees);
    console.log('===================');
    return res.status(200).json(committees);
  } catch (error) {
    console.error('Error fetching committees:', error);
    return res.status(500).json({ error: 'Failed to fetch committees' });
  }
},
  
  async addMembersToCommittee(req, res) {
    try {
      const { committeeId, members } = req.body;
      
      const committee = await Committee.findByPk(committeeId);
      if (!committee) {
        return res.status(404).json({ error: 'Committee not found' });
      }
      
      const committeeMembers = members.map(member => ({
        user_id: member.userId,
        committee_id: committeeId,
        role: member.role || 'MEMBER',
        is_active: true
      }));
      
      await CommitteeMember.bulkCreate(committeeMembers);
      
      return res.status(200).json({
        message: 'Members added to committee successfully'
      });
    } catch (error) {
      console.error('Error adding members to committee:', error);
      return res.status(500).json({ error: 'Failed to add members to committee' });
    }
  }
};

module.exports = adminController;