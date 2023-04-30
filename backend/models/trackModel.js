const mongoose = require('mongoose')

const trackSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  text: {
    type: String,
    required: [true, 'Add text value']
  }
},
{
  timestamps: true,
})

module.exports = mongoose.model('Track', trackSchema)