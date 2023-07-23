const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  let token

  token = req.cookies.jwt

  // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
  if (token) {
    try {
      // token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      next()
    } catch (error) {
      // console.log(error)
      req.user = null
      res.status(401)
      throw new Error('Not authorized')
    }
  } else {
    req.user = null
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports = {
  protect
}