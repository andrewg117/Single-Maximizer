const express = require("express");
const router = express.Router();
const {
  uploadAudio,
  getAudio,
  updateAudio,
  deleteAudio,
} = require("../controllers/audioController");
const { protect } = require("../middleware/authMiddleware");
const { uploadSingle } = require("../middleware/uploadMiddleware");

router.route("/").post(protect).post(uploadSingle("trackAudio"), uploadAudio);
router
  .route("/:id")
  .get(protect, getAudio)
  .put(protect)
  .put(uploadSingle("trackAudio"), updateAudio)
  .delete(protect, deleteAudio);

module.exports = router;
