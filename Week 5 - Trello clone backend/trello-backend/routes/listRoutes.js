const express = require("express");
const  protect  = require("../middleware/authMiddleware");

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
  protect,
  createList
);

router.get(
  "/",
  protect,
  getLists
);

router.get(
  "/:boardId",
  protect,
  getListsByBoard
);

router.delete(
  "/:id",
  protect,
  deleteList
);

module.exports = router;