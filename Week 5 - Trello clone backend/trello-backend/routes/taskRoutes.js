const express = require("express");
const protect  = require("../middleware/authMiddleware");

const router =
  express.Router();

const {
  createTask,
  getTasksByList,
  moveTask,
  updateTask,
  deleteTask,
  getTasks,
} = require(
  "../controllers/taskController"
);

const validateTask =
  require(
    "../middleware/validateTask"
  );

router.post(
  "/",
  validateTask,
  protect,
  createTask
);

router.put("/:id", protect, updateTask);

router.delete("/:id", protect, deleteTask);

router.get(
  "/:listId",
  protect,
  getTasksByList
);

router.get("/", protect, getTasks);

router.put("/:id/move", protect, moveTask);

module.exports = router;