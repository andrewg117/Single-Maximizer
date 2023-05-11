const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Add name']
  },
  email: {
    type: String,
    required: [true, 'Add email'],
    unique: true
  }, 
  password: {
    type: String,
    required: [true, 'Add password']
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