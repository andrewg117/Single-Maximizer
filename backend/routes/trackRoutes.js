const express = require("express");
const router = express.Router();
const {
  getTracks,
  getSingle,
  setTrack,
  updateTrack,
  deleteTrack,
} = require("../controllers/trackController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getTracks).post(protect, setTrack);
router
  .route("/:id")
  .get(protect, getSingle)
  .put(protect, updateTrack)
  .delete(protect, deleteTrack);

module.exports = router;
