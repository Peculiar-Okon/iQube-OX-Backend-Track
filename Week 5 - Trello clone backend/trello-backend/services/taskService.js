const Task =
  require("../models/Task");

  const List = require("../models/List");
  const AppError =
    require("../utils/AppErrors");

const moveTask = async (
  taskId,
  newListId,
  newPosition
) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const oldListId = task.listId;

  // 1. Move task
  task.listId = newListId;
  task.position = newPosition;

  await task.save();

  // 2. Normalize OLD list ordering
  const oldTasks = await Task.find({
    listId: oldListId,
  }).sort("position");

  for (let i = 0; i < oldTasks.length; i++) {
    oldTasks[i].position = i;
    await oldTasks[i].save();
  }

  // 3. Normalize NEW list ordering
  const newTasks = await Task.find({
    listId: newListId,
  }).sort("position");

  for (let i = 0; i < newTasks.length; i++) {
    newTasks[i].position = i;
    await newTasks[i].save();
  }

  return task;
};

const mongoose =
  require("mongoose");

const createTask = async (
  data
) => {

  if (
    !mongoose.Types.ObjectId.isValid(
      data.listId
    )
  ) {
    throw new AppError(
      "Invalid list ID",
      400
    );
  }

  const list =
    await List.findById(
      data.listId
    );

  if (!list) {
    throw new AppError(
      "List not found",
      404
    );
  }

  return await Task.create(
    data
  );
};



const getTasksByList = async (
  listId,
  query
) => {

  const list = await List.findById(listId);

  if (!list) {
    throw new AppError(
      "List not found",
      404
    );
  }

  const page =
    Number(query.page) || 1;

  const limit =
    Number(query.limit) || 10;

  const skip =
    (page - 1) * limit;

  const filter = {
    listId,
  };

  if (query.status) {
    filter.status =
      query.status;
  }

  if (query.search) {
    filter.title = {
      $regex: query.search,
      $options: "i",
    };
  }

  const tasks =
    await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

  const totalTasks =
    await Task.countDocuments(filter);

  return {
    data: tasks,
    limit,
    page,
    next: page * limit < totalTasks ? page + 1 : null,
    total: totalTasks,
  };
};

const updateTask = async (
  taskId,
  data
) => {

  return await Task.findByIdAndUpdate(
    taskId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

};

const getTasks = async () => {
  return await Task.find();
};

const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

module.exports = {
  createTask,
  getTasksByList,
  moveTask,
  updateTask,
  deleteTask,
  getTasks,
};