const Audio = require("../models/audioModel");
const Track = require("../models/trackModel");
const asyncHandler = require("express-async-handler");

// @desc    Post audio
// @route   GET /api/audio
// @access  Private
const uploadAudio = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // console.log('Body: ' + JSON.stringify(req.body))
  // console.log('File: ' + JSON.stringify(req.file))

  const track = await Track.exists({
    _id: req.body.trackID,
    user: req.user.id,
  });

  if (!track) {
    res.status(404);
    throw new Error("Track not found");
  }

  const audio = await Audio.create({
    user: req.user.id,
    trackID: req.body.trackID,
    file: req.file,
  });

  const updatedAudio = await Audio.findByIdAndUpdate(
    audio._id,
    {
      $set: {
        s3AudioURL:
          "https://singlemax-bucket.s3.amazonaws.com/" + audio._id.toString(),
      },
    },
    {
      new: true,
    }
  );

  const updateTrack = await Track.findByIdAndUpdate(
    audio.trackID,
    {
      $set: {
        s3AudioURL: {
          name: req.file.originalname,
          url:
            "https://singlemax-bucket.s3.amazonaws.com/" + audio._id.toString(),
        },
      },
    },
    {
      new: true,
    }
  );

  if (audio) {
    res.json(audio);
  }
});

// @desc    Get audio
// @route   GET /api/audio/:id
// @access  Private
const getAudio = asyncHandler(async (req, res) => {
  const audio = await Audio.findOne({ trackID: req.params.id });

  if (!audio) {
    res.status(400);
    throw new Error("Audio not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (audio.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.json(audio);
});

// @desc    Update audio
// @route   PUT /api/audio/:file
// @access  Private
const updateAudio = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const audio = await Audio.findOne({ trackID: req.body.trackID });

  if (!audio) {
    res.status(400);
    throw new Error("Tacrk not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (audio.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // console.log('Audio: ' + track)
  // console.log('Params: ' + JSON.stringify(req.params))
  // console.log('File: ' + JSON.stringify(req.files))
  // console.log('Body: ' + JSON.stringify(req.body))

  // Only the file changes; owner and track stay as they were
  const newBody = {
    file: req.file,
  };

  const updatedAudio = await Audio.findByIdAndUpdate(audio._id, newBody, {
    new: true,
  });

  const updateTrack = await Track.findByIdAndUpdate(
    audio.trackID,
    {
      $set: {
        s3AudioURL: {
          name: req.file.originalname,
          url:
            "https://singlemax-bucket.s3.amazonaws.com/" + audio._id.toString(),
        },
      },
    },
    {
      new: true,
    }
  );

  res.json(updatedAudio);
});

// @desc    Delete audio
// @route   DELETE /api/audio/:id
// @access  Private
const deleteAudio = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Succeeds even with no audio, so deleting the track can continue
  await Audio.deleteMany({ trackID: req.params.id, user: req.user.id });

  res.json(req.params.id);
});

module.exports = {
  uploadAudio,
  getAudio,
  updateAudio,
  deleteAudio,
};
