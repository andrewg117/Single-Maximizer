const mongoose = require('mongoose')

const trackSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  trackTitle: {
    type: String,
    required: [true, 'Add track title']
  },
  artist: {
    type: String,
    required: false
  },
  deliveryDate: {
    type: Date,
    required: false
  },
  trackURL: {
    type: String,
    required: false
  }
},
{
  timestamps: true,
})

module.exports = mongoose.model('Track', trackSchema)