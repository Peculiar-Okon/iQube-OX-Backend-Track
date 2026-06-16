// const sendResponse = require("../utils/response");

// const errorHandler = (
//   err,
//   req,
//   res,
//   next
// ) => {

//   const statusCode =
//     err.statusCode || 500;

//   return sendResponse(res, {
//     statusCode,
//     success: false,
//     message:
//       err.message ||
//       "Internal Server Error",
//   });

// };

// module.exports = errorHandler;

const sendResponse = require(
  "../utils/response"
);

const errorHandler = (
  err,
  req,
  res,
  next
) => {

  let statusCode =
    err.statusCode || 500;

  let message =
    err.message ||
    "Internal Server Error";

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(
      err.errors
    )
      .map((val) => val.message)
      .join(", ");
  }

  // Duplicate key errors
  if (
    err.code === 11000
  ) {
    statusCode = 409;

    const field =
      Object.keys(
        err.keyValue
      )[0];

    message =
      `${field} already exists`;
  }

  // JWT errors
  if (
    err.name ===
    "JsonWebTokenError"
  ) {
    statusCode = 401;
    message = "Invalid token";
  }

  // JWT expired
  if (
    err.name ===
    "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Token expired";
  }

  return sendResponse(res, {
    statusCode,
    success: false,
    message,
  });
};

module.exports =
  errorHandler;