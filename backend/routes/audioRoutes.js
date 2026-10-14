const express = require("express");
const router = express.Router();
const {
  uploadAudio,
  getAudio,
  updateAudio,
  deleteAudio,
} = require("../controllers/audioController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.memoryStorage();
// MongoDB caps documents at 16 MB, and files are stored inside them
const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 },
});

router.route("/").post(protect).post(upload.single("trackAudio"), uploadAudio);
router
  .route("/:id")
  .get(protect, getAudio)
  .put(protect)
  .put(upload.single("trackAudio"), updateAudio)
  .delete(protect, deleteAudio);

module.exports = router;
