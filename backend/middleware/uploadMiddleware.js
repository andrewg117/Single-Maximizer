const multer = require("multer");

// MongoDB caps documents at 16 MB, and files are stored inside them
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

// Any error while parsing an upload (malformed body, wrong field name, etc.) is
// the client's fault, so mark it 400; errorHandler raises oversized files to 413
const asClientError = (middleware, field, maxCount) => (req, res, next) =>
  middleware(req, res, (err) => {
    if (err) {
      res.status(400);
      // Multer reports too many files with the same code as a wrong field name
      if (
        maxCount &&
        err instanceof multer.MulterError &&
        err.code === "LIMIT_UNEXPECTED_FILE" &&
        err.field === field
      ) {
        err.message = `At most ${maxCount} files per upload`;
      }
    }
    next(err);
  });

const uploadSingle = (field) => asClientError(upload.single(field), field);
const uploadArray = (field, maxCount) =>
  asClientError(upload.array(field, maxCount), field, maxCount);

module.exports = {
  uploadSingle,
  uploadArray,
};
