const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");

router.post("/login", authController.validateUser);

router.post("/register", authController.registerUser);

router.post("/create-admin", authController.createAdminUser);

router.get("/validate", authController.validateToken);

router.post("/init-admin", authController.createInitialAdmin);

router.post("/upload/evidence", authController.uploadEvidence);

router.post("/activate-admin", authController.activateAdminUser);

router.delete("/delete-admin", authController.deleteAdminUser);

module.exports = router;
