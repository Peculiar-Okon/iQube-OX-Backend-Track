const validateBoard = (
  req,
  res,
  next
) => {
  const { title, owner } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  if (!owner) {
    return res.status(400).json({
      message: "Owner is required",
    });
  }

  next();
};

module.exports = validateBoard;