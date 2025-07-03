const { 
  CommitteeMeeting, 
  MeetingApplication, 
  Application, 
  Committee, 
  User, 
  Applicant,
  CommitteeMember,
  sequelize
} = require('../models');
const { sendMail } = require('../utils/email-service');
const { generateApprovalLetter, generateRejectionLetter } = require('../utils/document-generator');

const meetingController = {
  // Create a new committee meeting
  async createMeeting(req, res) {
    try {
      const { committeeId, meetingDate, agenda, applicationIds } = req.body;
      
      const committee = await Committee.findByPk(committeeId);
      if (!committee) {
        return res.status(404).json({ error: 'Committee not found' });
      }
      
      // Begin transaction
      const transaction = await sequelize.transaction();
      
      try {
        // Create meeting
        const meeting = await CommitteeMeeting.create({
          committee_id: committeeId,
          meeting_date: meetingDate,
          agenda,
          status: 'SCHEDULED'
        }, { transaction });
        
        // Add applications to meeting if provided
        if (applicationIds && applicationIds.length > 0) {
          const meetingApplications = applicationIds.map(appId => ({
            meeting_id: meeting.meeting_id,
            application_id: appId,
            decision: 'PENDING'
          }));
          
          await MeetingApplication.bulkCreate(meetingApplications, { transaction });
        }
        
        await transaction.commit();
        
        // Notify committee members about the meeting
        const committeeMembers = await CommitteeMember.findAll({
          where: { committee_id: committeeId, is_active: true },
          include: [{ model: User, as: 'user' }]
        });
        
        const emailPromises = committeeMembers.map(member => 
          sendMail({
            to: member.user.email,
            subject: `New ${committee.name} Meeting Scheduled`,
            text: `Dear ${member.user.first_name} ${member.user.last_name},\n\nA new committee meeting has been scheduled for ${new Date(meetingDate).toLocaleString()}.\n\nAgenda: ${agenda || 'Not specified'}\n\nPlease log in to the ERC system for more details.\n\nRegards,\nERC Admin Team`
          })
        );
        
        await Promise.all(emailPromises);
        
        return res.status(201).json({
          message: 'Committee meeting created successfully',
          meetingId: meeting.meeting_id
        });
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error('Error creating committee meeting:', error);
      return res.status(500).json({ error: 'Failed to create committee meeting' });
    }
  },
  
  // 3.3.1 Ratify decisions from committee meeting
  async ratifyDecisions(req, res) {
    try {
      const { meetingId } = req.params;
      const { decisions } = req.body;
      
      const meeting = await CommitteeMeeting.findByPk(meetingId, {
        include: [
          {
            model: Committee,
            as: 'committee'
          },
          {
            model: MeetingApplication,
            as: 'applications',
            include: [
              {
                model: Application,
                as: 'application',
                include: [
                  {
                    model: Applicant,
                    as: 'applicant',
                    include: [{ model: User, as: 'user' }]
                  }
                ]
              }
            ]
          }
        ]
      });
      
      if (!meeting) {
        return res.status(404).json({ error: 'Meeting not found' });
      }
      
      // Begin transaction
      const transaction = await sequelize.transaction();
      
      try {
        // Process each decision
        for (const decision of decisions) {
          const meetingApp = await MeetingApplication.findOne({
            where: { 
              meeting_id: meetingId, 
              application_id: decision.applicationId 
            },
            transaction
          });
          
          if (!meetingApp) {
            continue;
          }
          
          // Update meeting application with ratified decision
          meetingApp.decision = decision.decision;
          meetingApp.decision_comments = decision.comments;
          meetingApp.ratified = true;
          await meetingApp.save({ transaction });
          
          // Update the application status
          const application = await Application.findByPk(decision.applicationId, { transaction });
          
          if (decision.decision === 'APPROVED') {
            application.status = 'APPROVED';
            application.decision_date = new Date();
          } else if (decision.decision === 'REJECTED') {
            application.status = 'REJECTED';
            application.decision_date = new Date();
          } else if (decision.decision === 'REVISE') {
            application.status = 'RETURNED_FOR_RESUBMISSION';
          }
          
          application.admin_comments = decision.comments;
          await application.save({ transaction });
          
          // Get applicant details for email
          const fullApplication = await Application.findByPk(decision.applicationId, {
            include: [
              {
                model: Applicant,
                as: 'applicant',
                include: [{ model: User, as: 'user' }]
              }
            ],
            transaction
          });
          
          // Send email based on decision
          const applicantEmail = fullApplication.applicant.user.email;
          const applicantName = `${fullApplication.applicant.user.first_name} ${fullApplication.applicant.user.last_name}`;
          
          let emailSubject, emailText, attachment;
          
          if (decision.decision === 'APPROVED') {
            emailSubject = 'ERC Application Approved';
            emailText = `Dear ${applicantName},\n\nWe are pleased to inform you that your application has been approved by the ${meeting.committee.name}.\n\n${decision.comments ? `Comments: ${decision.comments}\n\n` : ''}Please find the approval letter attached.\n\nRegards,\nERC Admin Team`;
            attachment = {
              filename: `approval_letter_${decision.applicationId}.pdf`,
              content: generateApprovalLetter(fullApplication)
            };
          } else if (decision.decision === 'REJECTED') {
            emailSubject = 'ERC Application Rejected';
            emailText = `Dear ${applicantName},\n\nWe regret to inform you that your application has been rejected by the ${meeting.committee.name}.\n\n${decision.comments ? `Reason: ${decision.comments}\n\n` : ''}Please find the rejection letter attached.\n\nRegards,\nERC Admin Team`;
            attachment = {
              filename: `rejection_letter_${decision.applicationId}.pdf`,
              content: generateRejectionLetter(fullApplication)
            };
          } else if (decision.decision === 'REVISE') {
            emailSubject = 'ERC Application Requires Revision';
            emailText = `Dear ${applicantName},\n\nYour application has been reviewed by the ${meeting.committee.name} and requires revision.\n\n${decision.comments ? `Comments: ${decision.comments}\n\n` : ''}Please log in to the ERC system to revise and resubmit your application.\n\nRegards,\nERC Admin Team`;
          }
          
          await sendMail({
            to: applicantEmail,
            subject: emailSubject,
            text: emailText,
            attachments: attachment ? [attachment] : undefined
          });
        }
        
        // Update meeting status if all decisions are ratified
        const allRatified = await MeetingApplication.count({
          where: { 
            meeting_id: meetingId,
            ratified: false
          },
          transaction
        }) === 0;
        
        if (allRatified) {
          meeting.status = 'COMPLETED';
          await meeting.save({ transaction });
        }
        
        await transaction.commit();
        
        return res.status(200).json({
          message: 'Decisions ratified successfully',
          meetingId: meeting.meeting_id
        });
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error('Error ratifying decisions:', error);
      return res.status(500).json({ error: 'Failed to ratify decisions' });
    }
  },
  
  // 3.3.2 Generate summary of decisions
  async generateMeetingSummary(req, res) {
    try {
      const { dateFrom, dateTo, committeeId } = req.query;
      
      const where = {};
      
      if (dateFrom && dateTo) {
        where.meeting_date = {
          [sequelize.Op.between]: [new Date(dateFrom), new Date(dateTo)]
        };
      } else if (dateFrom) {
        where.meeting_date = {
          [sequelize.Op.gte]: new Date(dateFrom)
        };
      } else if (dateTo) {
        where.meeting_date = {
          [sequelize.Op.lte]: new Date(dateTo)
        };
      }
      
      if (committeeId) {
        where.committee_id = committeeId;
      }
      
      const meetings = await CommitteeMeeting.findAll({
        where,
        include: [
          {
            model: Committee,
            as: 'committee'
          },
          {
            model: MeetingApplication,
            as: 'applications',
            include: [
              {
                model: Application,
                as: 'application',
                include: [
                  {
                    model: Applicant,
                    as: 'applicant',
                    include: [{ 
                      model: User, 
                      as: 'user',
                      attributes: ['first_name', 'last_name', 'email'] 
                    }]
                  }
                ]
              }
            ]
          }
        ],
        order: [['meeting_date', 'DESC']]
      });
      
      // Process meetings to create a summary
      const summary = meetings.map(meeting => {
        const decisions = {
          APPROVED: 0,
          REJECTED: 0,
          REVISE: 0,
          PENDING: 0
        };
        
        meeting.applications.forEach(app => {
          decisions[app.decision]++;
        });
        
        return {
          meetingId: meeting.meeting_id,
          committeeId: meeting.committee_id,
          committeeName: meeting.committee.name,
          meetingDate: meeting.meeting_date,
          status: meeting.status,
          totalApplications: meeting.applications.length,
          decisions,
          applications: meeting.applications.map(app => ({
            applicationId: app.application_id,
            title: app.application.title,
            applicantName: `${app.application.applicant.user.first_name} ${app.application.applicant.user.last_name}`,
            decision: app.decision,
            ratified: app.ratified
          }))
        };
      });
      
      return res.status(200).json(summary);
    } catch (error) {
      console.error('Error generating meeting summary:', error);
      return res.status(500).json({ error: 'Failed to generate meeting summary' });
    }
  },
  
  // 3.3.3, 3.3.4 Generate approval/rejection letters
  async generateLetter(req, res) {
    try {
      const { applicationId } = req.params;
      const { letterType } = req.query;
      
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
      
      let letter;
      
      if (letterType === 'approval') {
        letter = generateApprovalLetter(application);
      } else if (letterType === 'rejection') {
        letter = generateRejectionLetter(application);
      } else {
        return res.status(400).json({ error: 'Invalid letter type' });
      }
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${letterType}_letter_${applicationId}.pdf`);
      
      return res.send(letter);
    } catch (error) {
      console.error('Error generating letter:', error);
      return res.status(500).json({ error: 'Failed to generate letter' });
    }
  }
};

module.exports = meetingController;