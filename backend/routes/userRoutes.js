const express = require('express')
const router = express.Router()
const { loginUser, registerUser, checkEmail, updateUser, getMe } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/email', checkEmail)
router.post('/login', loginUser)
router.route('/me').get(protect, getMe).put(protect, updateUser)

module.exports = router