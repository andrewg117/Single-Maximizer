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
  name: {
    type: String,
    require: false
  },
  file: {
    data: Buffer,
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  }
},
{
  timestamps: true,
})

module.exports = mongoose.model('Image', imageSchema)