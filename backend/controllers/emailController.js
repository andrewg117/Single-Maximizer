const nodemailer = require('nodemailer')
const Email = require('../models/emailModel')
const asyncHandler = require('express-async-handler')
const schedule = require('node-schedule')
const EMAILUSER = process.env.EMAILUSER
const EMAILPASS = process.env.EMAILPASS

//
// @desc    Send Email
// @route   POST /api/send
// @access  Private
const sendScheduledEmail = asyncHandler(async (req, res) => {

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
    to: email, // list of receivers
    subject: 'Register Account', // Subject line
    text: "Continue creating your account: " + link, // plain text body
    html: `<p>Continue creating your account: ${link}</p>` // html body
  }

  const date = new Date(2023, 6, 15, 4, 52, 0)

  const emailJob = schedule.scheduleJob('53 * * * *', function () {
    // send mail with defined transport object
    transporter.sendMail(mailOptions)
  })


  // console.log('Message sent: %s', info.messageId)

  res.status(200)
})

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