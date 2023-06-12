const Image = require('../models/imageModel')
const asyncHandler = require('express-async-handler')

// @desc    Post image
// @route   POST /api/image
// @access  Private
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // console.log('Body: ' + JSON.stringify(req.body))
  // console.log('File: ' + JSON.stringify(req.file))

  let image

  if (req.body.section === 'avatar') {
    image = await Image.create({
      user: req.user.id,
      section: req.body.section,
      file: req.file,
    })
  } else if (req.body.section === 'cover') {
    image = await Image.create({
      user: req.user.id,
      trackID: req.body.trackID,
      section: req.body.section,
      file: req.file,
    })
  }

  if (image) {
    res.json(image)
  }
})

// @desc    Get image
// @route   GET /api/image
// @access  Private
const getImage = asyncHandler(async (req, res) => {
  let image

  if (req.query.section === 'avatar') {
    image = await Image.findOne({ user: req.user.id })
  } else if (req.query.section === 'cover') {
    image = await Image.findOne({ trackID: req.query.trackID })
  }

  if (!image) {
    res.status(400)
    throw new Error('Image not found')
  }

  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  if (image.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  res.json(image)
})

// @desc    Update image
// @route   PUT /api/image/:file
// @access  Private
const updateImage = asyncHandler(async (req, res) => {
  let image = null
  if (req.body.section === 'avatar') {
    image = await Image.findOne({ user: req.user.id })
  } else if (req.body.section === 'cover') {
    image = await Image.findOne({ trackID: req.body.trackID })
  }

  if (image === null) {
    res.status(400)
    throw new Error('Image not found')
  }

  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  if (image.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  // console.log('Image: ' + track)
  // console.log('Params: ' + JSON.stringify(req.params))
  // console.log('File: ' + JSON.stringify(req.files))
  // console.log('Body: ' + JSON.stringify(req.body))

  const newBody = {
    ...req.body,
    file: req.file
  }
  console.log(newBody)

  const updatedImage = await Image.findOneAndUpdate({ trackID: req.body.trackID }, newBody, {
    new: true
  })


  res.json(updatedImage)
})

// @desc    Delete image
// @route   DELETE /api/image/
// @access  Private
const deleteImage = asyncHandler(async (req, res) => {
  let image
  image = await Image.findOne({ trackID: req.params.id })

  if (!image) {
    res.status(400)
    throw new Error('Image not found')
  }

  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  if (image.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const deleteImage = await Image.findOneAndDelete({ trackID: req.params.id })

  res.json(deleteImage.id)
})

module.exports = {
  uploadImage,
  getImage,
  updateImage,
  deleteImage,
}