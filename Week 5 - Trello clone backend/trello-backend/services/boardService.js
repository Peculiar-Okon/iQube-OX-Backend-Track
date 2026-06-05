const Board = require("../models/Board");
const List = require("../models/List");
const Task = require("../models/Task");

const createBoard = async (data) => {
  return await Board.create(data);
};

const getBoards = async () => {
  return await Board.find();
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

// const getFullBoard = async (boardId) => {
//   const mongoose = require("mongoose");

//     const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({
//       message: "Invalid board ID",
//     });
//   }

//   const board = await Board.findById(boardId);

//   if (!board) {
//     throw new Error("Board not found");
//   }

//   const lists = await List.find({
//     boardId: board._id,
//   });

//   const listsWithTasks = [];

//   for (const list of lists) {
//     const tasks = await Task.find({
//       listId: list._id,
//     });

//     listsWithTasks.push({
//       ...list.toObject(),
//       tasks,
//     });
//   }

//   return {
//     board,
//     lists: listsWithTasks,
//   };
// };

const mongoose = require("mongoose");

const getFullBoard = async (boardId) => {

  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw new Error("Invalid board ID");
  }

  const board = await Board.findById(boardId);

  if (!board) {
    throw new Error("Board not found");
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
};