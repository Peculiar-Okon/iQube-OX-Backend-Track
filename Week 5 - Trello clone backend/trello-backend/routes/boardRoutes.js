const express = require("express");
const router = express.Router();

const {
  createBoard,
  getBoards,
} = require("../controllers/boardController");

router.post("/", createBoard);
router.get("/", getBoards);

module.exports = router;