const Board = require("../models/Board");
const List = require("../models/List");
const Task = require("../models/Task");
const AppError =
  require("../utils/AppErrors");


const createBoard = async (
  data
) => {
  const {
    title,
    description,
    owner,
  } = data;

  return await Board.create({
    title,
    description,
    owner,
  });
};

const getBoards = async (userId) => {
  return await Board.find({
    owner: userId,
  });
};

const getBoardById = async (
  boardId,
  userId
) => {

  const board =
    await Board.findOne({
      _id: boardId,
      owner: userId,
    });

  if (!board) {
    throw new AppError(
      "Board not found",
      404
    );
  }

  return board;
};

const updateBoard = async (boardId, userId, updateData) => {

  const board = await Board.findOneAndUpdate(
    {
      _id: boardId,
      owner: userId,
    },
    { $set: updateData }, 
    { new: true }
  );

  if (!board) {
    throw new AppError("Board not found", 404);
  }

  return board;
};

const deleteBoard = async (
  boardId,
  userId
) => {

  // 1. find all lists under board
  const lists = await List.find({
    boardId,
  });

  const listIds = lists.map(
    (l) => l._id
  );

  // 2. delete tasks
  await Task.deleteMany({
    listId: { $in: listIds },
  });

  // 3. delete lists
  await List.deleteMany({
    boardId,
  });

  // 4. delete board
  const deletedBoard =
    await Board.findOneAndDelete({
      _id: boardId,
      owner: userId,
    });

  if (!deletedBoard) {
    throw new AppError(
      "Board not found",
      404
    );
  }

  return deletedBoard;
};

const mongoose = require("mongoose");

const getFullBoard = async (
  boardId,
  userId
) => {

  if (
    !mongoose.Types.ObjectId.isValid(
      boardId
    )
  ) {
    throw new AppError(
      "Invalid board ID",
      400
    );
  }

  const board = await Board.findOne({
    _id: boardId,
    owner: userId,
  });

  if (!board) {
    throw new AppError(
      "Board not found",
      404
    );
  }

  const lists = await List.find({
    boardId: board._id,
  });

  const listsWithTasks = [];

  for (const list of lists) {

    const tasks = await Task.find({
      listId: list._id,
    });

    listsWithTasks.push({
      ...list.toObject(),
      tasks,
    });

  }

  return {
    board,
    lists: listsWithTasks,
  };

};

module.exports = {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
  getFullBoard,
  getBoardById,
};