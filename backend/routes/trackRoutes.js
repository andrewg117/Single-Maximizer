const express = require('express')
const router = express.Router()
const { getTrack, setTrack, updateTrack, deleteTrack } = require('../controllers/trackController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getTrack).post(protect, setTrack)
router.route('/:id').put(protect, updateTrack).delete(protect, deleteTrack)

module.exports = router