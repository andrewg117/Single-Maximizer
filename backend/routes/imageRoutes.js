const express = require("express");
const router = express.Router();
const {
  uploadImage,
  getImage,
  updateImage,
  uploadPress,
  getPress,
  deleteImage,
  deletePress,
} = require("../controllers/imageController");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadSingle,
  uploadArray,
} = require("../middleware/uploadMiddleware");
const { MAX_PRESS } = require("../config/limits");

router
  .route("/")
  .post(protect)
  .post(uploadSingle("Image"), uploadImage)
  .get(protect, getImage);
router
  .route("/:id")
  .put(protect)
  .put(uploadSingle("Image"), updateImage)
  .delete(protect, deleteImage);
router
  .route("/press")
  .post(protect)
  .post(uploadArray("Press", MAX_PRESS), uploadPress)
  .get(protect, getPress);
router.route("/press/:id").delete(protect, deletePress);

module.exports = router;
