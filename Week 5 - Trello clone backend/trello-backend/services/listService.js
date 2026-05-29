const List = require("../models/List");

const createList = async (data) => {
  return await List.create(data);
};

const getListsByBoard = async (
  boardId
) => {
  return await List.find({
    boardId,
  });
};

module.exports = {
  createList,
  getListsByBoard,
};