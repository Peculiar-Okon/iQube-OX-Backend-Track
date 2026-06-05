const listService = require(
  "../services/listService"
);
const sendResponse = require("../utils/response");

// const createList = async (
//   req,
//   res
// ) => {
//   try {
//     const list =
//       await listService.createList(
//         req.body
//       );

//     res.status(201).json(list);
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

// const getListsByBoard = async (
//   req,
//   res
// ) => {
//   try {
//     const lists =
//       await listService.getListsByBoard(
//         req.params.boardId
//       );

//     res.json(lists);
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

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