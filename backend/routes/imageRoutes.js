const express = require('express')
const router = express.Router()
const { uploadImage, getImage, updateImage, deleteImage } = require('../controllers/imageController')
const { protect } = require('../middleware/authMiddleware')
const multer  = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.route('/').post(protect).post(upload.single('Image'), uploadImage)
  .get(protect, getImage)
router.route('/:file').put(protect).put(upload.single('Image'), updateImage)
  .delete(protect, deleteImage)

module.exports = router