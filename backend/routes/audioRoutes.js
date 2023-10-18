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
const upload = multer({ storage: storage });

router.route("/").post(protect).post(upload.single("trackAudio"), uploadAudio);
router
  .route("/:id")
  .get(protect, getAudio)
  .put(protect)
  .put(upload.single("trackAudio"), updateAudio)
  .delete(protect, deleteAudio);

module.exports = router;
