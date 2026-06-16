const express = require("express");

const router = express.Router();

const {
  createList,
  getListsByBoard,
  getLists,
  deleteList
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
  "/",
  getLists
);

router.get(
  "/:boardId",
  getListsByBoard
);

router.delete(
  "/:id",
  protect,
  deleteList
);

module.exports = router;