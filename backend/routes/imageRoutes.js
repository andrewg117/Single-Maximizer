const express = require('express')
const router = express.Router()
const { uploadImage } = require('../controllers/imageController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, uploadImage)

module.exports = router