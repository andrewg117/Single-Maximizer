const mongoose = require('mongoose')

const audioSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  trackID: {
    type:  mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Track'
  },
  file: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
},
{
  timestamps: true,
})

module.exports = mongoose.model('Audio', audioSchema)