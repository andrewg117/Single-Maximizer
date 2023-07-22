const nodemailer = require('nodemailer')
const Email = require('../models/emailModel')
const Track = require('../models/trackModel')
const asyncHandler = require('express-async-handler')
const schedule = require('node-schedule')
const EMAILTO = process.env.EMAILTO
const EMAILUSER = process.env.EMAILUSER
const EMAILPASS = process.env.EMAILPASS

// @desc    Send Scheduled Email
const sendScheduledEmail = async () => {
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

  let tracks

  // Reset isDelivered 
  // updateTracks = await Track.updateMany({}, {$set: {isDelivered: false}})
  // updateTracks = Track.updateMany({ deliveryDate: { $lt: curDate }, isDelivered: false }, { $set: { isDelivered: true } })

  // Updates tracks to be delivered
  const curDate = new Date()
  curDate.setHours(23, 59, 59, 999)

  tracks = await Track.find({ deliveryDate: { $lt: curDate }, isDelivered: false })

  for (const track in tracks) {
    const singleDoc = tracks[track]
    let emailContent = `<h1>New Single</h1>`

    emailContent += `<h3>Title: </h3><p>${singleDoc.trackTitle}</p>`
    emailContent += `<h3>Artist: </h3><p>${singleDoc.artist}</p>`
    emailContent += `<h3>Features: </h3><p>${singleDoc.features}</p>`
    emailContent += `<h3>Album Name: </h3><p>${singleDoc.album}</p>`
    emailContent += `<h3>Album Release Date: </h3><p>${singleDoc.albumDate}</p>`
    emailContent += `<h3>Genres: </h3><p>${singleDoc.genres}</p>`
    emailContent += `<h3>Producer: </h3><p>${singleDoc.producer}</p>`
    emailContent += `<h3>Spotify: </h3><p>${singleDoc.spotify}</p>`
    emailContent += `<h3>Apple: </h3><p>${singleDoc.apple}</p>`
    emailContent += `<h3>Soundcloud: </h3><p>${singleDoc.scloud}</p>`
    emailContent += `<h3>YouTube: </h3><p>${singleDoc.ytube}</p>`
    emailContent += `<h3>Track Summary: </h3><p>${singleDoc.trackSum}</p>`
    emailContent += `<h3>Recent Press: </h3><p>${singleDoc.pressSum}</p>`

    // setup email data with unicode symbols
    const mailOptions = {
      from: '"TRACKSTARZ" ' + EMAILUSER, // sender address
      to: EMAILTO, // list of receivers
      subject: 'New Single Release!', // Subject line
      html: emailContent // html body
    }

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending email:', error)
      } else {
        const updatedTrack = await Track.findByIdAndUpdate(singleDoc.id, { isDelivered: true }, {
          new: true
        })
        console.log('Email sent:', info.response)
      }
    })

    // console.log(singleDoc.id)
  }

  // const email = await Email.create({
  //   recipient: req.body.recipient,
  //   subject: req.body.subject,
  //   emailMessage: req.body.emailMessage,
  //   user: req.user.id,
  //   trackID: req.body.trackID,
  //   deliveryDate: req.body.deliveryDate,
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