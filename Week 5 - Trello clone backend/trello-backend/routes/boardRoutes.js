const express = require("express");
const router = express.Router();

const {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard
} = require("../controllers/boardController");

router.post("/", createBoard);
router.get("/", getBoards);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

module.exports = router;