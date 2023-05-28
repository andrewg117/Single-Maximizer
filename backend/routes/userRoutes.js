const express = require('express')
const router = express.Router()
const { loginUser, registerUser, updateUser, getMe } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const multer  = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/', registerUser)
router.post('/login', loginUser)
router.route('/me').get(protect, getMe)
router.route('/:file').put(protect).put(upload.any(), updateUser)

module.exports = router