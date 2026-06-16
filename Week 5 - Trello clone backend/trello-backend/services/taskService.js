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

const createTask = async (
  data
) => {
  return await Task.create(data);
};

// const getTasksByList = async (
//   listId
// ) => {
//   return await Task.find({
//     listId,
//   });
// };

const getTasksByList = async (listId, page = 1, limit = 10) => {

    const skip = (page - 1) * limit;

  return await Task.find({ listId })
    .skip(skip)
    .limit(limit);

  const list = await List.findById(listId);

  if (!list) {
    throw new AppError("List not found", 404);
  }

  const tasks = await Task.find({
    listId,
  }).skip((page - 1) * limit).limit(limit);

  return tasks;
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