const listService = require(
  "../services/listService"
);

const createList = async (
  req,
  res
) => {
  try {
    const list =
      await listService.createList(
        req.body
      );

    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getListsByBoard = async (
  req,
  res
) => {
  try {
    const lists =
      await listService.getListsByBoard(
        req.params.boardId
      );

    res.json(lists);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createList,
  getListsByBoard,
};