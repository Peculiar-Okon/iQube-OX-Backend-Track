const API = "http://localhost:5000/api/users";

export const getUsers = async () => {
  const res = await fetch(API);
  return res.json();
};