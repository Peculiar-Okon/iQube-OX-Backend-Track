const User = require("../Models/UserModel");

// CREATE USER
const createUser = async (data) => {
  const user = await User.create(data);
  return user;
};

// GET ALL USERS
const getUsers = async () => {
  return await User.find();
};

// GET ONE USER
const getUser = async (id) => {
  return await User.findOne({ id });
};

// UPDATE USER
const updateUser = async (id, data) => {
  return await User.findOneAndUpdate(
    { id },
    data,
    { new: true }
  );
};

// DELETE USER
const deleteUser = async (id) => {
  return await User.findOneAndDelete({ id });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};