const express = require("express");
const router = express.Router();

const {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
  getFullBoard,
} = require("../controllers/boardController");

router.post("/", createBoard);
router.get("/", getBoards);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);
router.get("/:id/full", getFullBoard);

module.exports = router;