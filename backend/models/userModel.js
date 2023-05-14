const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Add name']
  },
  email: {
    type: String,
    required: [true, 'Add email'],
    trim: true,
    unique: true
  }, 
  password: {
    type: String,
    required: [true, 'Add password'],
    trim: true,
  },
  website: {
    type: String,
    required: false
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false
  },
},
{
  timestamps: true,
})

module.exports = mongoose.model('User', userSchema)