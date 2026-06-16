const sendResponse = require(
  "../utils/response"
);

const notFound = (
  req,
  res,
  next
) => {

  return sendResponse(res, {
    statusCode: 404,
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });

};

module.exports = notFound;