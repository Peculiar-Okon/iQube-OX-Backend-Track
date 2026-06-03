const boardService = require("../services/boardService");

const createBoard = async (req, res) => {
  try {
    const board = await boardService.createBoard(req.body);
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBoards = async (req, res) => {
  try {
    const boards = await boardService.getBoards();
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBoard = async (
  req,
  res
) => {
  try {
    const board =
      await boardService.updateBoard(
        req.params.id,
        req.body
      );

    res.json(board);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteBoard = async (
  req,
  res
) => {
  try {
    await boardService.deleteBoard(
      req.params.id
    );

    res.json({
      message:
        "Board deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
};