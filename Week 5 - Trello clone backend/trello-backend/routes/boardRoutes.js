const express = require("express");
const router = express.Router();

const validateBoard =
  require("../middleware/validateBoard");

const {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
  getFullBoard,
} = require("../controllers/boardController");

router.post("/", validateBoard, createBoard);
router.get("/", getBoards);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);
router.get("/:id/full", getFullBoard);

module.exports = router;