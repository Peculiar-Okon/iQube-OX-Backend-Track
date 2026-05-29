const express = require("express");

const router =
  express.Router();

const {
  createTask,
  getTasksByList,
} = require(
  "../controllers/taskController"
);

router.post("/",
  createTask
);

router.get(
  "/:listId",
  getTasksByList
);

module.exports = router;