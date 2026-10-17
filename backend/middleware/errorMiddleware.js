const { MulterError } = require("multer");

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  // Upload errors are the client's fault: an oversized file is 413, anything else
  // (wrong field name, too many files, etc.) is 400
  if (err instanceof MulterError) {
    statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
  }

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};
