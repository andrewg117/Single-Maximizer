const express = require('express')
const router = express.Router()
const { loginUser, registerUser, checkRegisterEmail, forgotPassword, resetPassword, updateUser, getMe, emailData } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.route('/email').post(checkRegisterEmail)
router.route('/email/:token').get(emailData)
router.route('/reset').post(forgotPassword).put(resetPassword)
router.post('/login', loginUser)
router.route('/me').get(protect, getMe).put(protect, updateUser)

module.exports = router