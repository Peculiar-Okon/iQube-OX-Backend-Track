const validateTask = (
  req,
  res,
  next
) => {
  const {
    title,
    listId,
  } = req.body;

  if (
    !title ||
    title.trim() === ""
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Task title is required",
    });
  }

  if (!listId) {
    return res.status(400).json({
      success: false,
      message:
        "List ID is required",
    });
  }

  next();
};

module.exports =
  validateTask;