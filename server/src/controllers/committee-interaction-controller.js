const { 
  Application, 
  Committee, 
  CommitteeMember, 
  User, 
  Applicant, 
  sequelize 
} = require('../models');
const { sendMail } = require('../utils/email-service');

const committeeInteractionController = {
  // 3.4.1 Assign applications to committees
  async assignToCommittee(req, res) {
    try {
      const { applicationId } = req.params;
      const { committeeId, comments } = req.body;
      
      const application = await Application.findByPk(applicationId);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      
      const committee = await Committee.findByPk(committeeId);
      if (!committee) {
        return res.status(404).json({ error: 'Committee not found' });
      }
      
      // Update application with committee assignment
      application.assigned_committee_id = committeeId;
      application.admin_comments = comments;
      
      // Set status based on committee type
      if (committee.type === 'CTSC') {
        application.status = 'CTSC_REVIEW';
      } else if (committee.type === 'ARWC') {
        application.status = 'ARWC_REVIEW';
      } else if (committee.type === 'ERC') {
        application.status = 'ERC_REVIEW';
      }
      
      await application.save();
      
      // Notify committee chair
      const committeeChair = await CommitteeMember.findOne({
        where: { 
          committee_id: committeeId,
          role: 'CHAIR',
          is_active: true
        },
        include: [{ model: User, as: 'user' }]
      });
      
      if (committeeChair) {
        await sendMail({
          to: committeeChair.user.email,
          subject: 'New Application Assigned to Your Committee',
          text: `Dear ${committeeChair.user.first_name} ${committeeChair.user.last_name},\n\nA new application has been assigned to your committee for review.\n\nApplication ID: ${applicationId}\n${comments ? `Comments: ${comments}\n\n` : ''}Please log in to the ERC system to view the application and proceed with the review.\n\nRegards,\nERC Admin Team`
        });
      }
      
      return res.status(200).json({
        message: 'Application assigned to committee successfully',
        applicationId,
        committeeId,
        status: application.status
      });
    } catch (error) {
      console.error('Error assigning application to committee:', error);
      return res.status(500).json({ error: 'Failed to assign application to committee' });
    }
  },
  
  // 3.4.2 View and ratify committee outcomes
  async reviewCommitteeOutcome(req, res) {
    try {
      const { applicationId } = req.params;
      const { ratify, adminComments } = req.body;
      
      const application = await Application.findByPk(applicationId, {
        include: [
          {
            model: Committee,
            as: 'assigned_committee'
          },
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
      
      // Update application with ratification
      if (ratify) {
        // If application is approved or rejected, set appropriate status
        if (application.committee_decision === 'APPROVED') {
          application.status = 'APPROVED';
          application.decision_date = new Date();
        } else if (application.committee_decision === 'REJECTED') {
          application.status = 'REJECTED';
          application.decision_date = new Date();
        } else if (application.committee_decision === 'REVISE') {
          application.status = 'RETURNED_FOR_RESUBMISSION';
        }
        
        application.is_ratified = true;
      } else {
        // If not ratified, set back to ERC review
        application.status = 'ERC_REVIEW';
        application.is_ratified = false;
      }
      
      application.admin_comments = adminComments;
      await application.save();
      
      // Notify applicant if ratified
      if (ratify) {
        let emailSubject, emailText;
        
        if (application.status === 'APPROVED') {
          emailSubject = 'ERC Application Approved';
          emailText = `Dear ${application.applicant.user.first_name} ${application.applicant.user.last_name},\n\nWe are pleased to inform you that your application has been approved by the ERC.\n\n${adminComments ? `Comments: ${adminComments}\n\n` : ''}Regards,\nERC Admin Team`;
        } else if (application.status === 'REJECTED') {
          emailSubject = 'ERC Application Rejected';
          emailText = `Dear ${application.applicant.user.first_name} ${application.applicant.user.last_name},\n\nWe regret to inform you that your application has been rejected by the ERC.\n\n${adminComments ? `Reason: ${adminComments}\n\n` : ''}Regards,\nERC Admin Team`;
        } else if (application.status === 'RETURNED_FOR_RESUBMISSION') {
          emailSubject = 'ERC Application Requires Revision';
          emailText = `Dear ${application.applicant.user.first_name} ${application.applicant.user.last_name},\n\nYour application requires revision before it can be approved.\n\n${adminComments ? `Comments: ${adminComments}\n\n` : ''}Please log in to the ERC system to revise and resubmit your application.\n\nRegards,\nERC Admin Team`;
        }
        
        await sendMail({
          to: application.applicant.user.email,
          subject: emailSubject,
          text: emailText
        });
      }
      
      return res.status(200).json({
        message: ratify ? 'Committee outcome ratified successfully' : 'Committee outcome returned for review',
        applicationId,
        status: application.status
      });
    } catch (error) {
      console.error('Error reviewing committee outcome:', error);
      return res.status(500).json({ error: 'Failed to review committee outcome' });
    }
  },
  
  // 3.4.3 Communicate with committees via email
  async sendCommitteeEmail(req, res) {
    try {
      const { committeeId } = req.params;
      const { subject, message, sendToAll } = req.body;
      
      const committee = await Committee.findByPk(committeeId);
      if (!committee) {
        return res.status(404).json({ error: 'Committee not found' });
      }
      
      let recipients;
      
      if (sendToAll) {
        // Send to all committee members
        recipients = await CommitteeMember.findAll({
          where: { 
            committee_id: committeeId,
            is_active: true
          },
          include: [{ model: User, as: 'user' }]
        });
      } else {
        // Send only to committee chair
        recipients = await CommitteeMember.findAll({
          where: { 
            committee_id: committeeId,
            role: 'CHAIR',
            is_active: true
          },
          include: [{ model: User, as: 'user' }]
        });
      }
      
      if (recipients.length === 0) {
        return res.status(404).json({ error: 'No recipients found' });
      }
      
      // Send emails to all recipients
      const emailPromises = recipients.map(recipient => 
        sendMail({
          to: recipient.user.email,
          subject,
          text: `Dear ${recipient.user.first_name} ${recipient.user.last_name},\n\n${message}\n\nRegards,\nERC Admin Team`
        })
      );
      
      await Promise.all(emailPromises);
      
      return res.status(200).json({
        message: `Email sent successfully to ${recipients.length} recipients`,
        committeeId,
        recipientCount: recipients.length
      });
    } catch (error) {
      console.error('Error sending committee email:', error);
      return res.status(500).json({ error: 'Failed to send committee email' });
    }
  },
  
  // 3.4.4 Communicate with applicants via email
  async sendApplicantEmail(req, res) {
    try {
      const { applicationId } = req.params;
      const { subject, message } = req.body;
      
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
      
      await sendMail({
        to: application.applicant.user.email,
        subject,
        text: `Dear ${application.applicant.user.first_name} ${application.applicant.user.last_name},\n\n${message}\n\nRegards,\nERC Admin Team`
      });
      
      return res.status(200).json({
        message: 'Email sent successfully to applicant',
        applicationId
      });
    } catch (error) {
      console.error('Error sending applicant email:', error);
      return res.status(500).json({ error: 'Failed to send applicant email' });
    }
  }
};

module.exports = committeeInteractionController;