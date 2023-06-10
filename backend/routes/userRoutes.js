const express = require('express')
const router = express.Router()
const { loginUser, registerUser, updateUser, getMe } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.route('/me').get(protect, getMe).put(protect, updateUser)

module.exports = router