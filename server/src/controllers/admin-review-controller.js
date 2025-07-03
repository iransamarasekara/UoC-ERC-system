const db = require('../models');  // Add this line to import the full db object
const { 
  Application, 
  User, 
  Applicant, 
  Committee, 
  CommitteeMember, 
  ApplicationReview,
  sequelize 
} = require('../models');
const { sendMail } = require('../utils/email-service');
const { generateApprovalLetter, generateRejectionLetter } = require('../utils/document-generator');
const { Op } = require('sequelize');


const adminReviewController = {
  // 3.2.1, 3.2.2 Get applications and their status
  getApplications: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;
      
      const whereClause = {};
      if (status) {
        whereClause.status = status;
      }
      
      console.log('Fetching applications with query:', { page, limit, status });
      
      // Use Application from destructuring instead of db.Application
      const { rows, count } = await Application.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: Applicant,
            as: "applicant",
            attributes: ["applicant_id", "applicant_category", "first_name", "last_name", "email"]
          },
          {
            model: Committee,
            as: "committee",
            attributes: ["committee_id", "committee_name", "committee_type"]
          }
        ],
        order: [["submission_date", "DESC"]]
      });
      
      console.log(`Found ${count} applications`);
      
      return res.status(200).json({
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        applications: rows
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
      return res.status(500).json({ 
        error: "Failed to fetch applications", 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  // 3.2.3, 3.2.4 Preliminary review of applications
  async reviewApplication(req, res) {
    try {
      const { applicationId } = req.params;
      const { 
        outcome, 
        comments, 
        committeeId, 
        reviewerIds, 
        dueDate 
      } = req.body;
      
      const application = await Application.findByPk(applicationId, {
        include: [
          {
            model: Applicant,
            as: 'applicant',
            include: [{ model: User, as: 'user' }]
          }
        ]
      });
      
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      
      // Begin transaction
      const transaction = await sequelize.transaction();
      
      try {
        // Update application based on outcome
        switch (outcome) {
          case 'RETURN_FOR_RESUBMISSION':
            application.status = 'RETURNED_FOR_RESUBMISSION';
            application.admin_comments = comments;
            
            // Send email to applicant
            await sendMail({
              to: application.applicant.user.email,
              subject: 'ERC Application Returned for Resubmission',
              text: `Dear ${application.applicant.user.first_name} ${application.applicant.user.last_name},\n\nYour application has been reviewed by the ERC admin and needs to be revised. Please log in to the ERC system to view the comments and resubmit your application.\n\nComments: ${comments}\n\nRegards,\nERC Admin Team`
            });
            break;
            
          case 'EXPEDITED_APPROVAL':
            application.status = 'EXPEDITED_APPROVED';
            application.admin_comments = comments;
            application.decision_date = new Date();
            
            // Generate approval letter
            const approvalLetter = generateApprovalLetter(application, true);
            
            // Send email with approval letter
            await sendMail({
              to: application.applicant.user.email,
              subject: 'ERC Application Expedited Approval',
              text: `Dear ${application.applicant.user.first_name} ${application.applicant.user.last_name},\n\nYour application has been granted expedited approval by the ERC admin. Please find attached the approval letter.\n\nRegards,\nERC Admin Team`,
              attachments: [
                {
                  filename: `approval_letter_${applicationId}.pdf`,
                  content: approvalLetter
                }
              ]
            });
            break;
            
          case 'ASSIGN_COMMITTEE':
            // Update application status based on assigned committee
            if (committeeId) {
              const committee = await Committee.findByPk(committeeId);
              
              if (!committee) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Committee not found' });
              }
              
              application.assigned_committee_id = committeeId;
              
              if (committee.type === 'ERC') {
                application.status = 'ERC_REVIEW';
                
                // Assign reviewers if provided
                if (reviewerIds && reviewerIds.length > 0) {
                  const reviewPromises = reviewerIds.map(reviewerId => 
                    ApplicationReview.create({
                      application_id: applicationId,
                      reviewer_id: reviewerId,
                      due_date: dueDate || null,
                      status: 'PENDING'
                    }, { transaction })
                  );
                  
                  await Promise.all(reviewPromises);
                  
                  // Send emails to assigned reviewers
                  const reviewers = await CommitteeMember.findAll({
                    where: { member_id: reviewerIds },
                    include: [{ model: User, as: 'user' }]
                  });
                  
                  const emailPromises = reviewers.map(reviewer => 
                    sendMail({
                      to: reviewer.user.email,
                      subject: 'New ERC Application Assigned for Review',
                      text: `Dear ${reviewer.user.first_name} ${reviewer.user.last_name},\n\nA new application has been assigned to you for review. Please log in to the ERC system to review the application.\n\nApplication ID: ${applicationId}\nDue Date: ${dueDate ? new Date(dueDate).toLocaleDateString() : 'Not specified'}\n\nRegards,\nERC Admin Team`
                    })
                  );
                  
                  await Promise.all(emailPromises);
                }
              } else if (committee.type === 'CTSC') {
                application.status = 'CTSC_REVIEW';
              } else if (committee.type === 'ARWC') {
                application.status = 'ARWC_REVIEW';
              }
            }
            
            application.admin_comments = comments;
            break;
            
          default:
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid outcome specified' });
        }
        
        // Mark as preliminary check completed
        application.preliminary_check_date = new Date();
        
        await application.save({ transaction });
        await transaction.commit();
        
        return res.status(200).json({
          message: 'Application reviewed successfully',
          applicationId: application.application_id,
          status: application.status
        });
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error('Error reviewing application:', error);
      return res.status(500).json({ error: 'Failed to review application' });
    }
  },
  
  // 3.2.7, 3.2.8 Generate approval letters and send emails
  async sendApplicantEmail(req, res) {
    try {
      const { applicationId } = req.params;
      const { subject, message, attachApprovalLetter } = req.body;
      
      const application = await Application.findByPk(applicationId, {
        include: [
          {
            model: Applicant,
            as: 'applicant',
            include: [{ model: User, as: 'user' }]
          }
        ]
      });
      
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      
      const emailOptions = {
        to: application.applicant.user.email,
        subject,
        text: message
      };
      
      // Add approval letter if requested
      if (attachApprovalLetter) {
        const approvalLetter = generateApprovalLetter(application);
        emailOptions.attachments = [
          {
            filename: `approval_letter_${applicationId}.pdf`,
            content: approvalLetter
          }
        ];
      }
      
      await sendMail(emailOptions);
      
      return res.status(200).json({
        message: 'Email sent successfully to applicant'
      });
    } catch (error) {
      console.error('Error sending email to applicant:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  }
};

module.exports = adminReviewController;