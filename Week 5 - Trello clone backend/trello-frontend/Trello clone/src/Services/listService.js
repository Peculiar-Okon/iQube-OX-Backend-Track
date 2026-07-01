import api from "./api";

export const getLists = async (boardId) => {
  const res = await api.get(`/lists/${boardId}`);
  return res.data;
};

export const createList = async (title, boardId) => {
  const res = await api.post("/lists", {
    title,
    boardId,
  });

  return res.data;
};