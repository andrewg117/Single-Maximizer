const jwt = require('jsonwebtoken')

const generateToken = (res, userId, expire) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: expire,
  })

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    // maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
  })
}

module.exports = {
  generateToken
}