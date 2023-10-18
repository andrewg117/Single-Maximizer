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

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.route("/email").post(checkRegisterEmail);
router.route("/email/:token").get(emailData);
router.route("/reset").post(forgotPassword).put(resetPassword);
router.route("/me").get(protect, getMe).put(protect, updateUser);
router.route("/token").get(checkUserToken);
router.route("/wakeserver").get(wakeDemoServer);

module.exports = router;
