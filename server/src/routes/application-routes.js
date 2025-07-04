const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application-controller");
const uploadController = require("../controllers/upload-controller");

router.get("/", applicationController.getAllApplications);

router.get("/:id", applicationController.getApplicationById);

router.post("/", applicationController.createApplication);

router.put("/:id", applicationController.updateApplication);

router.delete("/:id", applicationController.deleteApplication);

// Upload routes
router.post("/upload/documents", uploadController.uploadDocuments);
router.post("/upload/evidence", uploadController.uploadEvidence);

router.get(
  "/applications/:applicationId/status",
  applicationController.getApplicationStatus
);
router.get(
  "/applications/:applicationId",
  applicationController.getApplicationDetails
);
router.get("/applications/", applicationController.getUserApplications);
router.get(
  "/applications/stats/overview",
  applicationController.getApplicationStats
);
router.put(
  "/applications/:applicationId/status",
  applicationController.updateApplicationStatus
);

module.exports = router;
