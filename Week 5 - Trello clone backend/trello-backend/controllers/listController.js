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
        req.body,
        req.user.id
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

const getLists = async (
  req,
  res
) => {
  try {

    const lists =
      await listService.getLists();

    res.status(200).json(lists);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// const getListsByBoard = async (
//   req,
//   res,
//   next
// ) => {
//   try {

//     const lists =
//       await listService.getListsByBoard(
//         req.params.boardId
//       );

//     return sendResponse(res, {
//       message: "Lists fetched successfully",
//       data: lists,
//     });

//   } catch (err) {

//     next(err);

//   }
// };

const getListsByBoard = async (
  req,
  res
) => {
  try {

    const lists =
      await listService.getListsByBoard(
        req.params.boardId,
        req.user.id
      );

    res.status(200).json({
      message:
        "Lists fetched successfully",
      data: lists,
    });

  } catch (error) {

    res.status(404).json({
      message: error.message,
    });

  }
};

const getallLists = async (req, res, next) => {
  try {
    const lists = await listService.getallLists();
    return sendResponse(res, {
      message: "All lists fetched successfully",
      data: lists,
    });
  } catch (err) {
    next(err);
  }
};

const deleteList = async (
  req,
  res,
  next
) => {
  try {

    await listService.deleteList(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message:
        "List deleted successfully",
    });

  } catch (error) {

    next(error);

  }
};

module.exports = {
  createList,
  getListsByBoard,
  getLists,
  deleteList,
};
