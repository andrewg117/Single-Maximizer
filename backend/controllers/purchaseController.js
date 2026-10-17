const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Track = require("../models/trackModel");
const { MAX_TRACKS } = require("../config/limits");

// @desc    Post demo purchase
// @route   POST /api/purchase
// @access  Private
const postDemoPayment = asyncHandler(async (req, res) => {
  // Tracks the user has plus unspent credits may not exceed MAX_TRACKS. A real
  // payment provider can't refuse a payment it has taken, so run this check
  // before sending the user to checkout if payments are added back.
  const trackCount = await Track.countDocuments({ user: req.user.id });

  // No payment is taken in the demo; a purchase adds one track credit. The
  // allowance condition is checked atomically, so quick repeat clicks can't
  // both pass.
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: req.user.id,
      trackAllowance: { $lt: MAX_TRACKS - trackCount },
    },
    {
      $inc: { trackAllowance: 1 },
    },
    {
      new: true,
    }
  );

  if (!updatedUser) {
    res.status(403);
    throw new Error(`Track limit reached (${MAX_TRACKS})`);
  }

  res.status(200).json("Purchase Made");
});

module.exports = {
  postDemoPayment,
};
