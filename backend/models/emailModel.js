const mongoose = require('mongoose')

const emailSchema = mongoose.Schema({
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
  deliveryDate: {
    type: Date,
    required: false
  },
  recipient: {
    type: String,
    required: [true, 'Add recipient']
  },
  subject: {
    type: String,
    required: [true, 'Add subject']
  },
  emailMessage: {
    type: String,
    required: [true, 'Add message']
  }
},
{
  timestamps: true,
})

module.exports = mongoose.model('Email', emailSchema)