const boardService = require("../services/boardService");
const sendResponse = require("../utils/response");

// const createBoard = async (req, res) => {
//   try {
//     const board = await boardService.createBoard(req.body);
//     res.status(201).json(board);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

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

// const getBoards = async (req, res) => {
//   try {
//     const boards = await boardService.getBoards();
//     res.json(boards);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

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

// const updateBoard = async (
//   req,
//   res
// ) => {
//   try {
//     const board =
//       await boardService.updateBoard(
//         req.params.id,
//         req.body
//       );

//     return sendResponse(res, {
//       data: board,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

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

// const deleteBoard = async (
//   req,
//   res
// ) => {
//   try {


// const deleteBoard = async (
//   req,
//   res
// ) => {
//   try {
//     await boardService.deleteBoard(
//       req.params.id
//     );

//     res.json({
//       message:
//         "Board deleted",
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

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

// const getFullBoard = async (
//   req,
//   res
// ) => {
//   try {
//     const result =
//       await boardService.getFullBoard(
//         req.params.id
//       );

//     res.status(200).json(result);

//   } catch (error) {

//     res.status(500).json({
//       message: error.message,
//     });

//   }
// };

module.exports = {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
  getFullBoard
};