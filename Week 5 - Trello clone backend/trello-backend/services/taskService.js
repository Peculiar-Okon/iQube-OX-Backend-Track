const Task =
  require("../models/Task");

const moveTask = async (
  taskId,
  newListId,
  newPosition
) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
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

const getTasksByList = async (
  listId
) => {
  return await Task.find({
    listId,
  });
};

module.exports = {
  createTask,
  getTasksByList,
  moveTask,
};