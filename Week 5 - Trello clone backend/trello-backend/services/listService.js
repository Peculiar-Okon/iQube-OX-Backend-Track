const List = require("../models/List");
const Board = require("../models/Board");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const AppError =
  require("../utils/AppErrors");


const createList = async (
  data,
  userId
) => {

  if (
    !mongoose.Types.ObjectId.isValid(
      data.boardId
    )
  ) {
    throw new AppError(
      "Invalid board ID",
      400
    );
  }

  const board =
    await Board.findOne({
      _id: data.boardId,
      owner: userId,
    });

  if (!board) {
    throw new AppError(
      "Board not found or access denied",
      404
    );
  }

  return await List.create(data);
};

// const createList = async (
//   data,
//   userId
// ) => {

//   const board =
//     await Board.findOne({
//       _id: data.boardId,
//       owner: userId,
//     });

//   if (!board) {
//     throw new AppError(
//       "Board not found or access denied",
//       404
//     );
//   }

//   return await List.create(data);
// };


const getListsByBoard = async (
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

  const board =
    await Board.findOne({
      _id: boardId,
      owner: userId,
    });

  if (!board) {
    throw new AppError(
      "Board not found or access denied",
      404
    );
  }

  return await List.find({
    boardId,
  });

};

const getLists = async () => {
  return await List.find();
};

const deleteList = async (
  listId,
  userId
) => {

  if (
    !mongoose.Types.ObjectId.isValid(
      listId
    )
  ) {
    throw new AppError(
      "Invalid list ID",
      400
    );
  }

  const list =
    await List.findById(listId);

  if (!list) {
    throw new AppError(
      "List not found",
      404
    );
  }

  const board =
    await Board.findOne({
      _id: list.boardId,
      owner: userId,
    });

  if (!board) {
    throw new AppError(
      "Access denied",
      403
    );
  }

  await Task.deleteMany({
    listId,
  });

  return await List.findByIdAndDelete(
    listId
  );
};

module.exports = {
  createList,
  deleteList,
  getListsByBoard,
  getLists,
};