const validateList = (
  req,
  res,
  next
) => {
  const {
    title,
    boardId,
  } = req.body;

  if (
    !title ||
    title.trim() === ""
  ) {
    return res.status(400).json({
      success: false,
      message:
        "List title is required",
    });
  }

  if (!boardId) {
    return res.status(400).json({
      success: false,
      message:
        "Board ID is required",
    });
  }

  next();
};

module.exports =
  validateList;