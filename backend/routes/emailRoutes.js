const express = require("express");
const router = express.Router();
const { sendEmail } = require("../controllers/emailController");
const { protect } = require("../middleware/authMiddleware");

// POST request to send an email
router.route("/").post(protect, sendEmail);

module.exports = router;
