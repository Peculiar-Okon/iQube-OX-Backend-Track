const sendResponse = require("../utils/response");

const errorHandler = (
  err,
  req,
  res,
  next
) => {

  const statusCode =
    err.statusCode || 500;

  return sendResponse(res, {
    statusCode,
    success: false,
    message:
      err.message ||
      "Internal Server Error",
  });

};

module.exports = errorHandler;