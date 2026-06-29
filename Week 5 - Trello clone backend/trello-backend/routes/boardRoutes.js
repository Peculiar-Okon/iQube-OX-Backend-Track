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

router.use(protect);

router.post("/", validateBoard, createBoard);
router.get("/:id", getBoardById);
router.get("/", getBoards);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);
router.get("/:id/full", getFullBoard);

module.exports = router;