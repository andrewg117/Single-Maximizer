const asyncHandler = require("express-async-handler");
const Track = require("../models/trackModel");
const User = require("../models/userModel");
const { MAX_TRACKS } = require("../config/limits");

// Track metadata a user may set; owner, delivery, and file fields stay server-side
const TRACK_FIELDS = [
  "trackTitle",
  "artist",
  "deliveryDate",
  "spotify",
  "features",
  "apple",
  "producer",
  "scloud",
  "album",
  "trackLabel",
  "ytube",
  "albumDate",
  "genres",
  "trackSum",
  "pressSum",
];

// @desc    Get tracks
// @route   GET /api/track
// @access  Private
const getTracks = asyncHandler(async (req, res) => {
  const tracks = await Track.find({ user: req.user.id });

  res.json(tracks);
});

// @desc    Get track
// @route   GET /api/track/:id
// @access  Private
const getSingle = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id);

  if (!track) {
    res.status(400);
    throw new Error("Track not found");
  }

  // const user = await User.findById(req.user.id)

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (track.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.json(track);
});

// @desc    Set track
// @route   POST /api/track
// @access  Private
const setTrack = asyncHandler(async (req, res) => {
  if (!req.body.trackTitle) {
    res.status(400);
    throw new Error("Add track title");
  }

  // Also covers accounts that hold more credits than the cap allows
  const trackCount = await Track.countDocuments({ user: req.user.id });
  if (trackCount >= MAX_TRACKS) {
    res.status(403);
    throw new Error(`Track limit reached (${MAX_TRACKS})`);
  }

  // Spend one track credit atomically; refunded below if the track can't be saved
  const user = await User.findOneAndUpdate(
    { _id: req.user.id, trackAllowance: { $gte: 1 } },
    { $inc: { trackAllowance: -1 } }
  );

  if (!user) {
    res.status(403);
    throw new Error("No track allowance left");
  }

  let track;
  try {
    track = await Track.create({
      trackTitle: req.body.trackTitle,
      artist: req.body.artist,
      deliveryDate: req.body.deliveryDate,
      spotify: req.body.spotify,
      features: req.body.features,
      apple: req.body.apple,
      producer: req.body.producer,
      scloud: req.body.scloud,
      album: req.body.album,
      trackLabel: req.body.trackLabel,
      ytube: req.body.ytube,
      albumDate: req.body.albumDate || null,
      genres: req.body.genres,
      trackSum: req.body.trackSum,
      pressSum: req.body.pressSum,
      isDelivered: false,
      s3PressURL: [],
      user: req.user.id,
    });
  } catch (err) {
    await User.findByIdAndUpdate(req.user.id, { $inc: { trackAllowance: 1 } });
    throw err;
  }

  res.json(track);
});

// @desc    Update track
// @route   PUT /api/tracks/:id
// @access  Private
const updateTrack = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id);

  if (!track) {
    res.status(400);
    throw new Error("Tacrk not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (track.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // console.log('Track: ' + track)
  // console.log('Params: ' + JSON.stringify(req.params))
  // console.log('File: ' + JSON.stringify(req.files))

  const updates = {};
  for (const field of TRACK_FIELDS) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  const updatedTrack = await Track.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  });

  res.json(updatedTrack);
});

// @desc    Delete track
// @route   DELETE /api/tracks/:id
// @access  Private
const deleteTrack = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id);

  if (!track) {
    res.status(400);
    throw new Error("Track not found");
  }

  // const user = await User.findById(req.user.id)

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (track.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const deleteTrack = await Track.findByIdAndDelete(req.params.id);

  // A delivered track has used its credit, so only undelivered tracks are refunded
  if (!track.isDelivered) {
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { trackAllowance: 1 },
      },
      {
        new: true,
      }
    );
  }

  res.json(deleteTrack.id);
});

module.exports = {
  getTracks,
  getSingle,
  setTrack,
  updateTrack,
  deleteTrack,
};
