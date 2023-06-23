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
  spotify: {
    type: String,
    required: false
  },
  features: {
    type: String,
    required: false
  },
  apple: {
    type: String,
    required: false
  },
  producer: {
    type: String,
    required: false
  },
  scloud: {
    type: String,
    required: false
  },
  album: {
    type: String,
    required: false
  },
  ytube: {
    type: String,
    required: false
  },
  albumDate: {
    type: String,
    required: false
  },
  genres: {
    type: String,
    required: false
  },
  trackSum: {
    type: String,
    required: false
  },
  pressSum: {
    type: String,
    required: false
  },
},
{
  timestamps: true,
})

module.exports = mongoose.model('Track', trackSchema)