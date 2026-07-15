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

    const paginationResult =
      await taskService.getTasksByList(
        req.params.listId,
        req.query
      );

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: paginationResult.data,
      limit: paginationResult.limit,
      page: paginationResult.page,
      next: paginationResult.next,
      total: paginationResult.total,
    });

  } catch (error) {
    next(error);
  }
};


const updateTask = async (req, res, next) => {
  try {

    const updatedTask =
      await taskService.updateTask(
        req.params.id,
        req.body
      );

    if (!updatedTask) {
      throw new AppError("Task not found", 404);
    }

    return sendResponse(res, {
      message: "Task updated successfully",
      data: updatedTask,
    });

  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {

    await taskService.deleteTask(
      req.params.id
    );

    return sendResponse(res, {
      message: "Task deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks();
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasksByList,
  moveTask,
  getTasks,
  updateTask,
  deleteTask,
};
