const express = require('express')
const router = express.Router()
const { payment, getPayment } = require('../controllers/purchaseController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, payment).get(protect, getPayment)

module.exports = router