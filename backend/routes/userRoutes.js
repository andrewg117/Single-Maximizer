const express = require("express");
const router = express.Router();
const {
  loginUser,
  logoutUser,
  registerUser,
  checkRegisterEmail,
  forgotPassword,
  resetPassword,
  updateUser,
  getMe,
  emailData,
  checkUserToken,
  wakeDemoServer,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const {
  loginLimiter,
  emailLimiter,
} = require("../middleware/rateLimitMiddleware");

router.post("/", registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", logoutUser);
router.route("/email").post(emailLimiter, checkRegisterEmail);
router.route("/email/:token").get(emailData);
router.route("/reset").post(emailLimiter, forgotPassword).put(resetPassword);
router.route("/me").get(protect, getMe).put(protect, updateUser);
router.route("/token").get(checkUserToken);
router.route("/wakeserver").get(wakeDemoServer);

module.exports = router;
