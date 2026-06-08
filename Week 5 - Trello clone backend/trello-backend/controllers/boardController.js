const boardService = require("../services/boardService");
const sendResponse = require("../utils/response");

const createBoard = async (req, res, next) => {
  try {
    const board = await boardService.createBoard(req.body);

    return sendResponse(res, {
      statusCode: 201,
      message: "Board created successfully",
      data: board,
    });

  } catch (error) {

    next(error);

  }
};

const getBoards = async (req, res, next) => {
  try {
    const boards = await boardService.getBoards();

    return sendResponse(res, {
      data: boards,
    });

  } catch (err) {
    next(err);
  }
};


const updateBoard = async (req, res, next) => {
  try {

    const board =
      await boardService.updateBoard(
        req.params.id,
        req.body
      );

    return sendResponse(res, {
      message: "Board updated successfully",
      data: board,
    });

  } catch (err) {

    next(err);

  }
};

const deleteBoard = async (req, res, next) => {
  try {

    await boardService.deleteBoard(
      req.params.id
    );

    return sendResponse(res, {
      message: "Board deleted successfully",
    });

  } catch (err) {

    next(err);

  }
};

const getFullBoard = async (req, res, next) => {
  try {

    const result =
      await boardService.getFullBoard(
        req.params.id
      );

    return sendResponse(res, {
      message: "Board fetched successfully",
      data: result,
    });

  } catch (error) {

    next(error);

  }
};

module.exports = {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
  getFullBoard
};