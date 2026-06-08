const listService = require(
  "../services/listService"
);
const sendResponse = require("../utils/response");

const createList = async (
  req,
  res,
  next
) => {
  try {

    const list =
      await listService.createList(
        req.body
      );

    return sendResponse(res, {
      statusCode: 201,
      message: "List created successfully",
      data: list,
    });

  } catch (err) {

    next(err);

  }
};

const getListsByBoard = async (
  req,
  res,
  next
) => {
  try {

    const lists =
      await listService.getListsByBoard(
        req.params.boardId
      );

    return sendResponse(res, {
      message: "Lists fetched successfully",
      data: lists,
    });

  } catch (err) {

    next(err);

  }
};

module.exports = {
  createList,
  getListsByBoard,
};