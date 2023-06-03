const asyncHandler = require('express-async-handler')
const Track = require('../models/trackModel')
// const User = require('../models/userModel')

// @desc    Get tracks
// @route   GET /api/track
// @access  Private
const getTracks = asyncHandler(async (req, res) => {
  const tracks = await Track.find({ user: req.user.id })

  res.json(tracks)
})

// @desc    Get track
// @route   GET /api/track/:id
// @access  Private
const getSingle = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id)

  if (!track) {
    res.status(400)
    throw new Error('Track not found')
  }

  // const user = await User.findById(req.user.id)

  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  if (track.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  res.json(track)
})

// @desc    Set track
// @route   POST /api/track
// @access  Private
const setTrack = asyncHandler(async (req, res) => {
  if (!req.body.trackTitle) {
    res.status(400)
    throw new Error('Add track title')
  }

  console.log(req.file)
  // console.log(req.body)

  const track = await Track.create({
    trackTitle: req.body.trackTitle,
    artist: req.body.artist,
    deliveryDate: req.body.deliveryDate,
    trackURL: req.body.trackURL,
    trackCover: req.file,
    trackCover: req.file,
    user: req.user.id
  })

  res.json(track)
})


// @desc    Update track
// @route   PUT /api/tracks/:file
// @access  Private
const updateTrack = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.body.id)

  if (!track) {
    res.status(400)
    throw new Error('Tacrk not found')
  }

  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  if (track.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  // console.log('Track: ' + track)
  // console.log('Params: ' + JSON.stringify(req.params))
  // console.log('File: ' + JSON.stringify(req.files))

  let updatedTrack

  if (req.files) {
    // console.log('File: ' + JSON.stringify(req.file))
    let trackCover

    req.files.map((file) => {
      if (file.fieldname === 'trackCover') {
        trackCover = file
        // console.log(file.fieldname)
      }
    })

    const newBody = {
      ...req.body,
      trackCover: trackCover
    }

    updatedTrack = await Track.findByIdAndUpdate(req.body.id, newBody, {
      new: true
    })
    // console.log('New Body: ' + JSON.stringify(newBody))
  } else {
    updatedTrack = await Track.findByIdAndUpdate(req.body.id, req.body, {
      new: true
    })
    // console.log('Body: ' + JSON.stringify(req.body))

  }

  res.json(updatedTrack)
})

// @desc    Delete track
// @route   DELETE /api/tracks/:id
// @access  Private
const deleteTrack = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id)

  if (!track) {
    res.status(400)
    throw new Error('Track not found')
  }

  // const user = await User.findById(req.user.id)

  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  if (track.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const deleteTrack = await Track.findByIdAndDelete(req.params.id)

  res.json(deleteTrack.id)
})

module.exports = {
  getTracks,
  getSingle,
  setTrack,
  updateTrack,
  deleteTrack
}