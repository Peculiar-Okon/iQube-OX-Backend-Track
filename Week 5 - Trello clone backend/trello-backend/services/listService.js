const List = require("../models/List");
const Board = require("../models/Board");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const AppError = require("../utils/AppErrors");
const cache = require("../utils/cache");

const createList = async (data, userId) => {
  if (!mongoose.Types.ObjectId.isValid(data.boardId)) {
    throw new AppError("Invalid board ID", 400);
  }

  const board = await Board.findOne({
    _id: data.boardId,
    owner: userId,
  });

  if (!board) {
    throw new AppError("Board not found or access denied", 404);
  }

  const list = await List.create(data);

  // Invalidate board and fullBoard caches for this user
  await cache.invalidateBoardCache(userId);

  return list;
};

const getListsByBoard = async (boardId, userId) => {
  const cacheKey = cache.getKey("lists", userId, boardId);

  // Try cache first
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw new AppError("Invalid board ID", 400);
  }

  const board = await Board.findOne({
    _id: boardId,
    owner: userId,
  });

  if (!board) {
    throw new AppError("Board not found or access denied", 404);
  }

  const lists = await List.find({ boardId });

  // Store in cache
  await cache.set(cacheKey, lists, cache.CACHE_TTL.LISTS);

  return lists;
};

const getLists = async () => {
  return await List.find();
};

const getallLists = async () => {
  return await List.find();
};

const updateList = async (listId, updateData, userId) => {
  if (!mongoose.Types.ObjectId.isValid(listId)) {
    throw new AppError("Invalid list ID", 400);
  }

  const list = await List.findById(listId);
  if (!list) {
    throw new AppError("List not found", 404);
  }

  // Verify the user owns the board this list belongs to
  const board = await Board.findOne({
    _id: list.boardId,
    owner: userId,
  });

  if (!board) {
    throw new AppError("Access denied", 403);
  }

  const updatedList = await List.findByIdAndUpdate(listId, updateData, {
    new: true,
    runValidators: true,
  });

  // Invalidate board caches for this user
  await cache.invalidateBoardCache(userId);

  return updatedList;
};

const deleteList = async (listId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(listId)) {
    throw new AppError("Invalid list ID", 400);
  }

  const list = await List.findById(listId);

  if (!list) {
    throw new AppError("List not found", 404);
  }

  const board = await Board.findOne({
    _id: list.boardId,
    owner: userId,
  });

  if (!board) {
    throw new AppError("Access denied", 403);
  }

  await Task.deleteMany({ listId });

  await List.findByIdAndDelete(listId);

  // Invalidate board caches for this user
  await cache.invalidateBoardCache(userId);

  return list;
};

module.exports = {
  createList,
  deleteList,
  getListsByBoard,
  getLists,
  getallLists,
  updateList,
};