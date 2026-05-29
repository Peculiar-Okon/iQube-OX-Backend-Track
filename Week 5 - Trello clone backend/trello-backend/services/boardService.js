const Board = require("../models/Board");

const createBoard = async (data) => {
  return await Board.create(data);
};

const getBoards = async () => {
  return await Board.find();
};

module.exports = {
  createBoard,
  getBoards,
};

const updateBoard = async (
  id,
  data
) => {
  return await Board.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
};

const deleteBoard = async (
  id
) => {
  return await Board.findByIdAndDelete(
    id
  );
};

module.exports = {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
};