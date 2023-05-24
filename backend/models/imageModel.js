const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  trackID: {
    type: String,
    required: false,
    ref: 'Track'
  },
  file: {
    data: mongoose.Schema.Types.Mixed,
    type: String,
    required: true
  },
  section: {
    type: String,
    required: false
  }
},
{
  timestamps: true,
})

module.exports = mongoose.model('Image', imageSchema)