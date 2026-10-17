const { rateLimit } = require("express-rate-limit");

// Per-IP limits, kept in memory: fine for a single instance, but they reset on
// restart and aren't shared if the API is scaled out. The JSON message matches
// errorHandler's shape so the frontend shows it.
const limiter = (windowMinutes, limit, message, options = {}) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message },
    ...options,
  });

const apiLimiter = limiter(
  15,
  300,
  "Too many requests, please try again in a few minutes"
);

// Only failed logins count, so users who sign in normally are never blocked
const loginLimiter = limiter(
  15,
  10,
  "Too many failed login attempts, please try again in 15 minutes",
  { skipSuccessfulRequests: true }
);

// These routes send email, which costs mail quota and could spam other people
const emailLimiter = limiter(
  60,
  5,
  "Too many emails requested, please try again in an hour"
);

module.exports = {
  apiLimiter,
  loginLimiter,
  emailLimiter,
};
