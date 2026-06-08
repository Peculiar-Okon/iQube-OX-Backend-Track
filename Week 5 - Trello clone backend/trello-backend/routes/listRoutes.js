const express = require("express");

const router = express.Router();

const {
  createList,
  getListsByBoard,
} = require(
  "../controllers/listController"
);

const validateList =
  require(
    "../middleware/validateList"
  );

router.post(
  "/",
  validateList,
  createList
);

router.get(
  "/:boardId",
  getListsByBoard
);

module.exports = router;