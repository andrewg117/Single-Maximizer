const express = require('express')
const router = express.Router()
const { getTracks, getSingle, setTrack, updateTrack, deleteTrack } = require('../controllers/trackController')
const { protect } = require('../middleware/authMiddleware')
const multer  = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.route('/').get(protect, getTracks).post(protect).post(upload.single('trackCover'), setTrack)
router.route('/:id').get(protect, getSingle).put(protect).put(upload.any(), updateTrack).delete(protect, deleteTrack)

module.exports = router