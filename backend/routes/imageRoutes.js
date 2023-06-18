const express = require('express')
const router = express.Router()
const { uploadImage, getImage, updateImage, uploadPress, getPress, deleteImage } = require('../controllers/imageController')
const { protect } = require('../middleware/authMiddleware')
const multer  = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.route('/').post(protect).post(upload.single('Image'), uploadImage)
  .get(protect, getImage)
router.route('/:id').put(protect).put(upload.single('Image'), updateImage)
  .delete(protect, deleteImage)
router.route('/press').post(protect).post(upload.array('Press'), uploadPress)
  .get(protect, getPress)
router.route('/press/:id').put(protect).put(upload.array('Press'))

module.exports = router