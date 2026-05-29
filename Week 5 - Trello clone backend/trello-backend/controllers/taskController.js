const taskService =
  require("../services/taskService");

const createTask = async (
  req,
  res
) => {
  try {
    const task =
      await taskService.createTask(
        req.body
      );

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getTasksByList = async (
  req,
  res
) => {
  try {
    const tasks =
      await taskService.getTasksByList(
        req.params.listId
      );

    res.json(tasks);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createTask,
  getTasksByList,
};