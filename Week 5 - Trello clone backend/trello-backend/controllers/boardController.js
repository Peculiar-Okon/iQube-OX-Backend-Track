const boardService = require("../services/boardService");
const sendResponse = require("../utils/response");

// CREATE BOARD

const createBoard = async (
  req,
  res,
  next
) => {
  try {

    // console.log("REQ USER:", req.user);
    // console.log("USER ID:", req.user?._id);
    // console.log("BODY:", req.body);

    const { title, description } =
      req.body;

    if (!title) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Title is required",
        data: null,
      });
    }

    const board =
      await boardService.createBoard({
        title,
        description,
        owner: req.user._id,
      });

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message:
        "Board created successfully",
      data: board,
    });

  } catch (error) {
    next(error);
  }
};


// GET ALL BOARDS
const getBoards = async (req, res, next) => {

  try {
    //     console.log("USER:", req.user);
    // console.log(
    //   "USER ID:",
    //   req.user._id
    // );
    const boards = await boardService.getBoards(
       req.user._id
    );

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Boards fetched successfully",
      data: boards,
      
    });


  } catch (error) {
    next(error);
  }
};

// GET BOARD BY ID
const getBoardById = async (req, res, next) => {
  try {
    const board = await boardService.getBoardById(req.params.id, req.user._id);

    if (!board) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Board not found",
        data: null,
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Board fetched successfully",
      data: board,
    });

  } catch (error) {
    next(error);
  }
};

const getBoard = async (
  req,
  res,
  next
) => {
  try {

    const board =
      await boardService.getBoardById(
        req.params.id,
        req.user._id
      );

    res.status(200).json({
      success: true,
      data: board,
    });

  } catch (error) {
    next(error);
  }
};

const updateBoard = async (req, res, next) => {
  try {
    const board = await boardService.updateBoard(
      req.params.id,
      req.user._id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: board,
    });

  } catch (error) {
    next(error);
  }
};

const deleteBoard = async (req, res) => {
  try {
    await boardService.deleteBoard(
      req.params.id,
      req.user._id
    );

    res.json({
      message:
        "Board + nested data deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// GET FULL BOARD (boards + lists + tasks)
const getFullBoard = async (req, res, next) => {
  try {
    const result = await boardService.getFullBoard(req.params.id, req.user._id);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
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
  getBoardById,
  updateBoard,
  deleteBoard,
  getFullBoard,
};