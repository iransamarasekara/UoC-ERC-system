const express = require('express');
const adminController = require('../controllers/admin-controller');
const adminReviewController = require('../controllers/admin-review-controller');
const meetingController = require('../controllers/meeting-controller');
const committeeInteractionController = require('../controllers/committee-interaction-controller');
const { isAuthenticated, isAdmin } = require('../middleware/auth-middleware');

const router = express.Router();

// Apply authentication and admin role check middleware to all routes
router.use(isAuthenticated, isAdmin);

// Account Management Routes (3.1.x)
router.post('/users', adminController.createUser);
router.get('/users', adminController.listUsers);
router.delete('/users/:userId', adminController.deleteUser);
router.get('/committees/reviewers', adminController.listCommitteeReviewers);
router.patch('/users/status', adminController.updateUserStatus);
router.post('/committees', adminController.createCommittee);
router.get('/committees', adminController.listCommittees);
router.post('/committees/members', adminController.addMembersToCommittee);
router.get('/table-structure/:tableName', adminController.getTableStructure);

// Preliminary Review Routes (3.2.x)
router.post('/update-schema', adminController.updateDatabaseSchema);
router.get('/check-applications-table', adminController.checkApplicationsTable);
router.get('/check-applicant-table', adminController.checkApplicantTable);
router.get('/check-models', adminController.checkModels);
router.get('/applications', adminReviewController.getApplications);
router.put('/applications/:applicationId/review', adminReviewController.reviewApplication);
router.post('/applications/:applicationId/email', adminReviewController.sendApplicantEmail);

// Committee Meeting Routes (3.3.x)
router.post('/meetings', meetingController.createMeeting);
router.put('/meetings/:meetingId/ratify', meetingController.ratifyDecisions);
router.get('/meetings/summary', meetingController.generateMeetingSummary);
router.get('/applications/:applicationId/letter', meetingController.generateLetter);

// Committee Interaction Routes (3.4.x)
router.put('/applications/:applicationId/assign', committeeInteractionController.assignToCommittee);
router.put('/applications/:applicationId/outcome', committeeInteractionController.reviewCommitteeOutcome);
router.post('/committees/:committeeId/email', committeeInteractionController.sendCommitteeEmail);
router.post('/applications/:applicationId/email-applicant', committeeInteractionController.sendApplicantEmail);

module.exports = router;