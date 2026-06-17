const express = require("express");
const router = express.Router();
const  protect  = require("../middleware/authMiddleware");

const validateBoard =
  require("../middleware/validateBoard");

const {
  createBoard,
  getBoards,
  updateBoard,
  getBoardById,
  deleteBoard,
  getFullBoard,
} = require("../controllers/boardController");

router.post("/", validateBoard, createBoard);
router.get("/:id", protect, getBoardById);
router.get("/", protect, getBoards);
router.put("/:id", protect, updateBoard);
router.delete("/:id", protect, deleteBoard);
router.get("/:id/full", protect, getFullBoard);

module.exports = router;