const express = require('express')
const router = express.Router()
const { uploadImage } = require('../controllers/imageController')
const { protect } = require('../middleware/authMiddleware')
const multer  = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.route('/').post(protect).post(upload.single('trackCover'), uploadImage)

module.exports = router