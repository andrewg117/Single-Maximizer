const asyncHandler = require('express-async-handler')
const Track = require('../models/trackModel')
const User = require('../models/userModel')

// @desc    Get track
// @route   GET /api/track
// @access  Private
const getTrack = asyncHandler(async (req, res) => {
  const tracks = await Track.find({ user: req.user.id })

  res.json(tracks)
})

// @desc    Set track
// @route   POST /api/track
// @access  Private
const setTrack = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Add text field') 
  }

  const track = await Track.create({
    text: req.body.text,
    user: req.user.id
  })

  res.json(track)
})


// @desc    Update track
// @route   PUT /api/tracks/:id
// @access  Private
const updateTrack = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id)

  if(!track) {
    res.status(400)
    throw new Error('Track not found')
  }

  const user = await User.findById(req.user.id)

  if(!user) {
    res.status(401)
    throw new Error('User not found')
  }

  if(track.user.toString() !== user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedTrack = await Track.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })

  res.json(updatedTrack)
})

// @desc    Delete track
// @route   DELETE /api/tracks/:id
// @access  Private
const deleteTrack = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id)

  if(!track) {
    res.status(400)
    throw new Error('Track not found')
  }
  
  const user = await User.findById(req.user.id)

  if(!user) {
    res.status(401)
    throw new Error('User not found')
  }

  if(track.user.toString() !== user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const deleteTrack = await Track.findByIdAndDelete(req.params.id)

  res.json(deleteTrack.id)
})

module.exports = {
  getTrack,
  setTrack,
  updateTrack,
  deleteTrack
}