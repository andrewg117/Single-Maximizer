const Audio = require('../models/audioModel')
const asyncHandler = require('express-async-handler')

// @desc    Post audio
// @route   GET /api/audio
// @access  Private
const uploadAudio = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // console.log('Body: ' + JSON.stringify(req.body))
  // console.log('File: ' + JSON.stringify(req.file))

  const audio = await Audio.create({
    user: req.user.id,
    trackID: req.body.trackID,
    file: req.file,
  })

  if (audio) {
    // console.log(audio)
    res.json(audio)
  }
})

// @desc    Get audio
// @route   GET /api/audio/:id
// @access  Private
const getAudio = asyncHandler(async (req, res) => {
  const audio = await Audio.findOne({ trackID: req.params.id })

  if (!audio) {
    res.status(400)
    throw new Error('Audio not found')
  }

  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  if (audio.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  res.json(audio)
})

// @desc    Update audio
// @route   PUT /api/audio/:file
// @access  Private
const updateAudio = asyncHandler(async (req, res) => {
  const audio = await Audio.findOne({ trackID: req.body.trackID })

  if (!audio) {
    res.status(400)
    throw new Error('Tacrk not found')
  }

  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  if (audio.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  // console.log('Audio: ' + track)
  // console.log('Params: ' + JSON.stringify(req.params))
  // console.log('File: ' + JSON.stringify(req.files))
  // console.log('Body: ' + JSON.stringify(req.body))

  const newBody = {
    ...req.body,
    file: req.file
  }
  console.log()
  
  const updatedAudio = await Audio.findOneAndUpdate({ trackID: req.body.trackID }, newBody, {
    new: true
  })

  res.json(updatedAudio)
})

// @desc    Delete audio
// @route   DELETE /api/audio/:id
// @access  Private
const deleteAudio = asyncHandler(async (req, res) => {
  const audio = await Audio.findOne({ trackID: req.params.id })

  if (!audio) {
    res.status(400)
    throw new Error('Audio not found')
  }

  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  if (audio.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const deleteAudio = await Audio.findByIdAndDelete(audio._id)

  res.json(deleteAudio.id)
})

module.exports = {
  uploadAudio,
  getAudio,
  updateAudio,
  deleteAudio,
}