const mongoose = require("mongoose");
const AppError = require("../utils/AppErrors");
const sendResponse = require("../utils/Response");

const taskService =
  require("../services/taskService");

const moveTask = async (
  req,
  res,
  next
) => {
  try {

    const {
      listId,
      position,
    } = req.body;

    const { id } =
      req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      throw new AppError(
        "Invalid task ID format",
        400
      );
    }

    const task =
      await taskService.moveTask(
        id,
        listId,
        position
      );

    return sendResponse(res, {
      message:
        "Task moved successfully",
      data: task,
    });

  } catch (err) {

    next(err);

  }
};

const createTask = async (
  req,
  res,
  next
) => {
  try {

    const task =
      await taskService.createTask(
        req.body
      );

    return sendResponse(res, {
      statusCode: 201,
      message:
        "Task created successfully",
      data: task,
    });

  } catch (err) {

    next(err);

  }
};

const getTasksByList = async (
  req,
  res,
  next
) => {
  try {

    const tasks =
      await taskService.getTasksByList(
        req.params.listId
      );

    return sendResponse(res, {
      message:
        "Tasks fetched successfully",
      data: tasks,
    });

  } catch (err) {

    next(err);

  }
};

module.exports = {
  createTask,
  getTasksByList,
  moveTask
};