const express = require("express");

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
  createTask
);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

router.get(
  "/:listId",
  getTasksByList
);

router.get("/", getTasks);

router.put("/:id/move", moveTask);

module.exports = router;