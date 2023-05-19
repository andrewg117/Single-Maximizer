const Image = require('../models/imageModel')
const asyncHandler = require('express-async-handler')


const uploadImage = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }
  
  let image

  if(req.body.section === 'avatar') {
    image = await Image.create({
      user: req.user.id,
      name: req.body.name,
      file: '',
      section: req.body.section,
    })
  } else if(req.body.section === 'cover') {
    image = await Image.create({
      user: req.user.id,
      track: req.body.trackID,
      name: req.body.name,
      file: '',
      section: req.body.section
    })
  }

  res.json(image)
})

module.exports = {
  uploadImage
}