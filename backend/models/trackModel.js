const mongoose = require('mongoose')

const trackSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  trackTitle: {
    type: String,
    trim: true,
    required: [true, 'Add track title']
  },
  artist: {
    type: String,
    trim: true,
    required: false
  },
  deliveryDate: {
    type: Date,
    required: false
  },
  trackURL: {
    type: String,
    required: false
  },
  trackCover: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  trackAudio: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  }
},
{
  timestamps: true,
})

module.exports = mongoose.model('Track', trackSchema)