const users = require("../models/userModel");

// CREATE
const createUser = (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
};

// READ ALL
const getUsers = (req, res) => {
  res.json(users);
};

// READ ONE
const getUser = (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  res.json(user);
};

// UPDATE
const updateUser = (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
};

// DELETE
const deleteUser = (req, res) => {
  users = users.filter(u => u.id !== req.params.id);
  res.json({ message: "Deleted" });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};