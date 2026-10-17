const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Track = require("../models/trackModel");
const { generateToken } = require("../utils/generateToken.js");
const { sendMail } = require("../utils/mailer");
const EMAILUSER = process.env.EMAILUSER;

const NODE_ENV = process.env.NODE_ENV;
const RENDER_STATIC_URL = process.env.RENDER_STATIC_URL;
const API_URL =
  NODE_ENV === "production" ? RENDER_STATIC_URL : "http://localhost:3000";

// Fields a user may change on their own profile
const PROFILE_FIELDS = [
  "fname",
  "lname",
  "username",
  "website",
  "scloud",
  "twitter",
  "igram",
  "fbook",
  "spotify",
  "ytube",
  "tiktok",
  "bio_text",
];

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { fname, lname, username, token, password } = req.body;

  if (!fname || !lname || !username || !token || !password) {
    res.status(400);
    throw new Error("Add all fields");
  }

  // The email comes from the signup link's token, so it's always verified
  let email;
  try {
    email = decodeToken(token).id;
  } catch (error) {
    res.status(401);
    throw new Error("Signup link expired, request a new one");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User exists, use a different email or login");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    fname,
    lname,
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    generateToken(res, user._id, "10m");

    res.status(201).json({
      _id: user.id,
      fname: user.fname,
      lname: user.lname,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Email new user
// @route   POST /api/users/email
// @access  Public
const checkRegisterEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userExists = await User.findOne({ email });
  // console.log(userExists)

  if (userExists) {
    res.status(409);
    throw new Error("User exists, use a different email or login");
  }

  const token = makeToken(email, "30m");

  const link = `${API_URL}/home/signup/${token}`;

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"TRACKSTARZ" ' + EMAILUSER, // sender address
    to: email, // list of receivers
    subject: "Register Account", // Subject line
    text: "Continue creating your account: " + link, // plain text body
    html: `<p>Continue creating your account:</p><p>${link}</p>`, // html body
  };

  sendMail(mailOptions)
    .then((msg) => console.log(msg))
    .catch((err) => console.error(err));

  // console.log('Message sent: %s', info.messageId)

  res.status(200).json("Email sent");
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user._id, "10m");

    const userBody = {
      ...user["_doc"],
    };
    delete userBody["password"];
    delete userBody["__v"];

    res.json({
      ...userBody,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Forgot Password
// @route   POST /api/users/forgot
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  // console.log(user)

  if (!user) {
    res.status(409);
    throw new Error("User does not exists, use a different email or login");
  }

  const token = makeToken(user.email, "10m");

  const link = `${API_URL}/home/resetpass/${token}`;

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"TRACKSTARZ" ' + EMAILUSER, // sender address
    to: email, // list of receivers
    subject: "Forgot Password", // Subject line
    text: "Hello " + user.username + ",\n Reset Password: \n" + link, // plain text body
    html: `<p>Hello ${user.username},</p><p>Reset Password:</p><p>${link}</p>`, // html body
  };

  sendMail(mailOptions)
    .then((msg) => res.status(200).json(msg))
    .catch((err) => res.status(409).json(err));

  // console.log('Message sent: %s', info.messageId)

  // res.status(200).json(info)
});

// @desc    Update user password
// @route   PUT /api/users/reset
// @access  Private
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  let email;

  try {
    const decoded = decodeToken(token);
    email = decoded.id;
  } catch (error) {
    res.status(401);
    throw new Error(
      error === "TokenExpiredError: jwt expired" ? "Login Expired" : error
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await User.findByIdAndUpdate(user._id, { password: hashedPassword });

  res.json({ message: "Password updated" });
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // The count lets the client show the track limit without fetching every track
  const trackCount = await Track.countDocuments({ user: req.user.id });

  res.json({ ...req.user.toObject(), trackCount });
});

// @desc    Update user data
// @route   PUT /api/users/
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Only profile fields; allowance, admin, email, and password stay server-controlled
  const updates = {};
  for (const field of PROFILE_FIELDS) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  let updatedUser;

  updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
  }).select("-password");

  res.json(updatedUser);
});

// @desc    Get email data
// @route   GET /api/users/email
// @access  Private
const emailData = asyncHandler(async (req, res) => {
  const { token } = req.params;
  // console.log(token)
  try {
    const decoded = decodeToken(token);
    res.json(decoded);
  } catch (error) {
    res.status(401);
    throw new Error(
      error === "TokenExpiredError: jwt expired" ? "Login Expired" : error
    );
  }
});

// @desc    Get user data
// @route   GET /api/users/token
// @access  Private
const checkUserToken = asyncHandler(async (req, res) => {
  let token = req.cookies.jwt;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentTime = Date.now() / 1000;

    const isExpired = decoded.exp < currentTime;
    if (isExpired) {
      res.status(401).json(401);
    } else {
      res.status(200).json("Token");
    }
  } else {
    res.status(401).json(401);
  }
  // res.json(req.user)
});

// @desc    Wake up demo server
// @route   GET /api/users/wakeserver
// @access  Private
const wakeDemoServer = asyncHandler(async (req, res) => {
  try {
    res.json("Success");
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// Generate JWT
const makeToken = (id, expire) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expire,
  });
};

// Decode JWT
const decodeToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  registerUser,
  checkRegisterEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  updateUser,
  getMe,
  emailData,
  checkUserToken,
  wakeDemoServer,
};
