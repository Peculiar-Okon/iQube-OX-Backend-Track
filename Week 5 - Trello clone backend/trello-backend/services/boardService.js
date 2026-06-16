const Board = require("../models/Board");
const List = require("../models/List");
const Task = require("../models/Task");
const AppError =
  require("../utils/AppErrors");


const createBoard = async (data) => {
  return await Board.create(data);
};

const getBoards = async () => {
  return await Board.find();
};

// const getBoardById = async (id) => {
//   return await Board.findById(id);
// };

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

const updateBoard = async (
  boardId,
  userId,
  data
) => {
  return await Board.findByIdAndUpdate(
  {
    _id: boardId,
    owner: userId,
  },
  updateData,
    { new: true }
  );
};

// const deleteBoard = async (
//   id
// ) => {
//   return await Board.findByIdAndDelete(
//     id
//   );
// };

const deleteBoard = async (boardId) => {

  // 1. find all lists under board
  const lists = await List.find({
    boardId,
  });

  const listIds = lists.map(
    (l) => l._id
  );

  // 2. delete all tasks in those lists
  await Task.deleteMany({
    listId: { $in: listIds },
  });

  // 3. delete lists
  await List.deleteMany({
    boardId,
  });

  // 4. delete board
  return await Board.findByIdAndDelete(
  {
  _id: boardId,
  owner: userId,
}
  );
};

const mongoose = require("mongoose");

const getFullBoard = async (boardId, userId) => {

  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw new AppError("Invalid board ID", 400);
  }

  const board = await Board.findById(boardId) ({
  _id: boardId,
  owner: userId,
});

  if (!board) {
    throw new AppError("Board not found", 404);
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