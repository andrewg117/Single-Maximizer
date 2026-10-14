const Image = require("../models/imageModel");
const Track = require("../models/trackModel");
const asyncHandler = require("express-async-handler");

// @desc    Post image
// @route   POST /api/image
// @access  Private
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // console.log('Body: ' + JSON.stringify(req.body))
  // console.log('File: ' + JSON.stringify(req.file))

  let image;

  if (req.body.section === "avatar") {
    image = await Image.create({
      user: req.user.id,
      section: req.body.section,
      file: req.file,
    });
  } else if (req.body.section === "cover") {
    const track = await Track.exists({
      _id: req.body.trackID,
      user: req.user.id,
    });

    if (!track) {
      res.status(404);
      throw new Error("Track not found");
    }

    image = await Image.create({
      user: req.user.id,
      trackID: req.body.trackID,
      section: req.body.section,
      file: req.file,
    });
  } else {
    res.status(400);
    throw new Error("Invalid image section");
  }

  const uploadedImage = await Image.findByIdAndUpdate(
    image._id,
    {
      $set: {
        s3ImageURL:
          "https://singlemax-bucket.s3.amazonaws.com/" + image._id.toString(),
      },
    },
    {
      new: true,
    }
  );

  const updateTrack = await Track.findByIdAndUpdate(
    image.trackID,
    {
      $set: {
        s3ImageURL: {
          name: image.file.originalname,
          url:
            "https://singlemax-bucket.s3.amazonaws.com/" + image._id.toString(),
        },
      },
    },
    {
      new: true,
    }
  );

  if (image) {
    res.json(image);
  }
});

// @desc    Post press
// @route   POST /api/image/press
// @access  Private
const uploadPress = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // console.log('Body: ' + JSON.stringify(req.body))

  const track = await Track.exists({
    _id: req.body.trackID,
    user: req.user.id,
  });

  if (!track) {
    res.status(404);
    throw new Error("Track not found");
  }

  // Await each save so a failure reaches the error handler instead of crashing
  for (const file of req.files) {
    let image;
    // console.log(file.originalname)
    image = await Image.create({
      user: req.user.id,
      trackID: req.body.trackID,
      section: req.body.section,
      file: file,
    });

    const updatedImage = await Image.findByIdAndUpdate(
      image._id,
      {
        $set: {
          s3ImageURL:
            "https://singlemax-bucket.s3.amazonaws.com/" + image._id.toString(),
        },
      },
      {
        new: true,
      }
    );

    const updateTrack = await Track.findByIdAndUpdate(
      req.body.trackID,
      {
        $push: {
          s3PressURL: {
            name: file.originalname,
            url: updatedImage.s3ImageURL,
          },
        },
      },
      {
        new: true,
      }
    );
  }

  res.json("Files saved");
});

// @desc    Get image
// @route   GET /api/image
// @access  Private
const getImage = asyncHandler(async (req, res) => {
  let image;

  if (req.query.section === "avatar") {
    image = await Image.findOne({ user: req.user.id, section: "avatar" });
  } else if (req.query.section === "cover") {
    image = await Image.findOne({
      trackID: req.query.trackID,
      section: "cover",
    });
  }

  if (!image) {
    res.status(400);
    throw new Error("Image not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (image.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.json(image);
});

// @desc    Get press
// @route   GET /api/image/press
// @access  Private
const getPress = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // A track may have no press photos, so an empty list is a valid result
  const image = await Image.find({
    trackID: req.query.trackID,
    section: "press",
    user: req.user.id,
  });

  res.json(image);
});

// @desc    Update image
// @route   PUT /api/image/:file
// @access  Private
const updateImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  let image = null;
  if (req.body.section === "avatar") {
    image = await Image.findOne({ user: req.user.id, section: "avatar" });
  } else if (req.body.section === "cover") {
    image = await Image.findOne({
      trackID: req.body.trackID,
      section: "cover",
    });
  }

  if (image === null) {
    res.status(400);
    throw new Error("Image not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (image.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // console.log('Image: ' + track)
  // console.log('Params: ' + JSON.stringify(req.params))
  // console.log('File: ' + JSON.stringify(req.file))
  // console.log('Body: ' + JSON.stringify(req.body))

  // Only the file changes; owner, track, and section stay as they were
  const newBody = {
    file: req.file,
    s3ImageURL:
      "https://singlemax-bucket.s3.amazonaws.com/" + image._id.toString(),
  };

  const updatedImage = await Image.findByIdAndUpdate(image._id, newBody, {
    new: true,
  });

  if (image.section === "cover") {
    const updateTrack = await Track.findByIdAndUpdate(
      image.trackID,
      {
        $set: {
          s3ImageURL: {
            name: req.file.originalname,
            url:
              "https://singlemax-bucket.s3.amazonaws.com/" +
              image._id.toString(),
          },
        },
      },
      {
        new: true,
      }
    );
  }

  res.json(updatedImage);
});

// @desc    Delete image
// @route   DELETE /api/image/
// @access  Private
const deleteImage = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Succeeds even with no images, so deleting the track can continue
  await Image.deleteMany({ trackID: req.params.id, user: req.user.id });

  res.json(req.params.id);
});

// @desc    Delete press
// @route   DELETE /api/press/:id
// @access  Private
const deletePress = asyncHandler(async (req, res) => {
  let image;
  image = await Image.findById(req.params.id);

  if (!image) {
    res.status(400);
    throw new Error("Image not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (image.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updateTrack = await Track.findByIdAndUpdate(
    image.trackID,
    {
      $pull: { s3PressURL: { url: image.s3ImageURL } },
    },
    {
      new: true,
    }
  );

  const deleteImage = await Image.findByIdAndDelete(req.params.id);

  res.json(deleteImage.id);
});

module.exports = {
  uploadImage,
  uploadPress,
  getImage,
  getPress,
  updateImage,
  deleteImage,
  deletePress,
};
