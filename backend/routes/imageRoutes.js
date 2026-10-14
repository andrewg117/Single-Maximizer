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
const multer = require("multer");

const storage = multer.memoryStorage();
// MongoDB caps documents at 16 MB, and files are stored inside them
const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 },
});

router
  .route("/")
  .post(protect)
  .post(upload.single("Image"), uploadImage)
  .get(protect, getImage);
router
  .route("/:id")
  .put(protect)
  .put(upload.single("Image"), updateImage)
  .delete(protect, deleteImage);
router
  .route("/press")
  .post(protect)
  .post(upload.array("Press"), uploadPress)
  .get(protect, getPress);
router.route("/press/:id").delete(protect, deletePress);

module.exports = router;
