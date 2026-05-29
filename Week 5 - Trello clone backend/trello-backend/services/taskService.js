const Task =
  require("../models/Task");

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
};