const Board = require("../models/Board");
const List = require("../models/List");
const Task = require("../models/Task");
const AppError = require("../utils/AppErrors");
const cache = require("../utils/cache");

const createBoard = async (data) => {
  const { title, description, owner } = data;

  const board = await Board.create({
    title,
    description,
    owner,
  });

  // Invalidate boards list cache for this user
  await cache.invalidateBoardCache(owner);

  return board;
};

const getBoards = async (userId) => {
  const cacheKey = cache.getKey("boards", userId, "all");

  // Try cache first
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  // Fetch from database
  const boards = await Board.find({ owner: userId });

  // Store in cache
  await cache.set(cacheKey, boards, cache.CACHE_TTL.BOARDS);

  return boards;
};

const getBoardById = async (boardId, userId) => {
  const cacheKey = cache.getKey("board", userId, boardId);

  // Try cache first
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const board = await Board.findOne({
    _id: boardId,
    owner: userId,
  });

  if (!board) {
    throw new AppError("Board not found", 404);
  }

  // Store in cache
  await cache.set(cacheKey, board, cache.CACHE_TTL.BOARD);

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

  // Invalidate board caches for this user
  await cache.invalidateBoardCache(userId);

  return board;
};

const deleteBoard = async (boardId, userId) => {
  // 1. find all lists under board
  const lists = await List.find({ boardId });
  const listIds = lists.map((l) => l._id);

  // 2. delete tasks
  await Task.deleteMany({ listId: { $in: listIds } });

  // 3. delete lists
  await List.deleteMany({ boardId });

  // 4. delete board
  const deletedBoard = await Board.findOneAndDelete({
    _id: boardId,
    owner: userId,
  });

  if (!deletedBoard) {
    throw new AppError("Board not found", 404);
  }

  // Invalidate board caches for this user
  await cache.invalidateBoardCache(userId);

  return deletedBoard;
};

const mongoose = require("mongoose");

const getFullBoard = async (boardId, userId) => {
  const cacheKey = cache.getKey("fullBoard", userId, boardId);

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
    throw new AppError("Board not found", 404);
  }

  const lists = await List.find({ boardId: board._id });

  const listsWithTasks = [];

  for (const list of lists) {
    const tasks = await Task.find({ listId: list._id });
    listsWithTasks.push({
      ...list.toObject(),
      tasks,
    });
  }

  const result = {
    board,
    lists: listsWithTasks,
  };

  // Store in cache
  await cache.set(cacheKey, result, cache.CACHE_TTL.FULL_BOARD);

  return result;
};

module.exports = {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
  getFullBoard,
  getBoardById,
};