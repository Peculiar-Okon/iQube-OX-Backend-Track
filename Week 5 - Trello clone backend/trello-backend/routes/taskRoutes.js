const express = require("express");

const router =
  express.Router();

const {
  createTask,
  getTasksByList,
  moveTask,
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

router.get(
  "/:listId",
  getTasksByList
);

router.put("/:id/move", moveTask);

module.exports = router;