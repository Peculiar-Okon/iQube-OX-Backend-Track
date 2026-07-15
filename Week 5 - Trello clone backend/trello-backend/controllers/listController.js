const listService = require(
  "../services/listService"
);
const sendResponse = require("../utils/Response");

const createList = async (
  req,
  res,
  next
) => {
  try {

    const list =
      await listService.createList(
        req.body,
        req.user._id
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
  res,
  next
) => {
  try {

    const lists =
      await listService.getLists();

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Lists fetched successfully",
      data: lists,
    });

  } catch (error) {
    next(error);
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
        req.params.boardId,
        req.user._id
      );

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Lists fetched successfully",
      data: lists,
    });

  } catch (error) {
    next(error);
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

const updateList = async (
  req,
  res,
  next
) => {
  try {
    const updatedList =
      await listService.updateList(
        req.params.id,
        req.body,
        req.user._id
      );

    return res.status(200).json({
      success: true,
      message: "List updated successfully",
      data: updatedList,
    });
  } catch (error) {
    next(error);
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
      req.user._id
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
  updateList,
  deleteList,
};
