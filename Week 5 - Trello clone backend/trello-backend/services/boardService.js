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