const express = require("express");

const router = express.Router();

const {
  createList,
  getListsByBoard,
} = require(
  "../controllers/listController"
);

router.post("/", createList);

router.get(
  "/:boardId",
  getListsByBoard
);

module.exports = router;