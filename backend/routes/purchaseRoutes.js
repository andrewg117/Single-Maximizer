const express = require('express')
const router = express.Router()
const { payment } = require('../controllers/purchaseController')
const { protect } = require('../middleware/authMiddleware')

router.route('/create-checkout-session').post(protect, payment)

module.exports = router