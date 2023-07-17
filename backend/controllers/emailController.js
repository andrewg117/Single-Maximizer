const nodemailer = require('nodemailer')
const Email = require('../models/emailModel')
const Track = require('../models/trackModel')
const asyncHandler = require('express-async-handler')
const schedule = require('node-schedule')
const EMAILTO = process.env.EMAILTO
const EMAILUSER = process.env.EMAILUSER
const EMAILPASS = process.env.EMAILPASS

//
// @desc    Send Scheduled Email
const sendScheduledEmail = async () => {
  let tracks
  const curDate = new Date()
  curDate.setHours(23,59,59,999)

  tracks = await Track.find({ deliveryDate: { $lt: curDate }, isDelivered: false })
  
  for (const track in tracks) {
    console.log(tracks[track].trackTitle)
    console.log(tracks[track].deliveryDate) 
  }

  // const email = await Email.create({
  //   recipient: req.body.recipient,
  //   subject: req.body.subject,
  //   emailMessage: req.body.emailMessage,
  //   user: req.user.id,
  //   trackID: req.body.trackID,
  //   deliveryDate: req.body.deliveryDate,
  // })

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


  // setup email data with unicode symbols
  const mailOptions = {
    from: '"TRACKSTARZ" ' + EMAILUSER, // sender address
    to: EMAILTO, // list of receivers
    subject: 'Register Account', // Subject line
    text: "Continue creating your account: ", // plain text body
    html: `<p>Continue creating your account:</p>` // html body
  }

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.error('Error sending email:', error)
  //   } else {
  //     console.log('Email sent:', info.response)
  //   }
  // })


  // console.log('Message sent: %s', info.messageId)
}

// @desc    Send Email
// @route   POST /api/send
// @access  Private
const sendEmail = asyncHandler(async (req, res) => {
  if (!req.body.recipient) {
    res.status(400)
    throw new Error('Add recipient')
  } else if (!req.body.subject) {
    res.status(400)
    throw new Error('Add subject')
  } else if (!req.body.emailMessage) {
    res.status(400)
    throw new Error('Add message')
  }

  const email = await Email.create({
    recipient: req.body.recipient,
    subject: req.body.subject,
    emailMessage: req.body.emailMessage,
    user: req.user.id,
    trackID: req.body.trackID,
    deliveryDate: req.body.deliveryDate,
  })

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

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"TRACKSTARZ" ' + EMAILUSER, // sender address
    to: req.body.recipient, // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.emailMessage, // plain text body
    html: `<p>${req.body.emailMessage}</p>` // html body
  }

  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions)

  console.log('Message sent: %s', info.messageId)

  res.json(email)
  res.status(200)
})

module.exports = {
  sendEmail,
  sendScheduledEmail
}