const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const nodemailer = require('nodemailer')
const EMAILUSER = process.env.EMAILUSER
const EMAILPASS = process.env.EMAILPASS

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { fname, lname, username, email, password } = req.body

  if (!fname || !lname || !username || !email || !password) {
    res.status(400)
    throw new Error('Add all fields')
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User exists, use a different email or login')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    fname,
    lname,
    username,
    email,
    password: hashedPassword
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      fname: user.fname,
      lname: user.lname,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})


// @desc    Register new user
// @route   POST /api/users
// @access  Public
const checkEmail = asyncHandler(async (req, res) => {
  const { email } = req.body


  const userExists = await User.findOne({ email })
  // console.log(userExists)

  if (userExists) {
    res.status(409)
    throw new Error('User exists, use a different email or login')
  }

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAILUSER,
      pass: EMAILPASS
    }
  })

  const link = "http://localhost:3000/home/signup?" + email

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"TRACKSTARZ" ' + EMAILUSER, // sender address
    to: email, // list of receivers
    subject: 'Register Account', // Subject line
    text: "Continue creating your account: " + link, // plain text body
    html: `<p>Continue creating your account: ${link}</p>` // html body
  }

  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions)

  // console.log('Message sent: %s', info.messageId)

  res.status(200).json(info)
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    const userBody = {
      ...user['_doc'],
    }
    delete userBody['password']
    delete userBody['__v']

    res.json({
      ...userBody,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user)
})

// @desc    Update user data
// @route   PUT /api/users/
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  let updatedUser

  updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true
  })

  res.json(updatedUser)
})

const expire = '2h'

// Generate JWT 
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expire
  })
}

module.exports = {
  registerUser,
  checkEmail,
  loginUser,
  updateUser,
  getMe
}