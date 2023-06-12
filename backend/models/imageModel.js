const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  trackID: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Track'
  },
  section: {
    type: String,
    required: false
  },
  file: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
},
{
  timestamps: true,
})

module.exports = mongoose.model('Image', imageSchema)