const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Add username']
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
  fname: {
    type: String,
    required: [true, 'Add first name'],
    trim: true,
  },
  lname: {
    type: String,
    required: [true, 'Add last name'],
    trim: true,
  },
  website: {
    type: String,
    required: false
  },
  profileImage: {
    type: mongoose.Schema.Types.Mixed,
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