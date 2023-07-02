const express = require('express')
const router = express.Router()
const { postEndpoint } = require('../controllers/purchaseController')
const bodyParser = require('body-parser')

router.route('').post(express.raw({type: 'application/json'}), postEndpoint)

module.exports = router