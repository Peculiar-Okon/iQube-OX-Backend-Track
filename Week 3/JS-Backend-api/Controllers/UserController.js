const users = require("../Models/UserModel");

// CREATE
const createUser = (req, res) => {
  try {

    const { id, name, email } = req.body;

    // Validation
    if (!id || !name || !email) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const user = { id, name, email };

    users.push(user);

    res.status(201).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// READ ALL
const getUsers = (req, res) => {
  try {

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// READ ONE
const getUser = (req, res) => {
  try {

    const user = users.find(
      u => u.id === req.params.id
    );

    // User not found
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// UPDATE
const updateUser = (req, res) => {
  try {

    const index = users.findIndex(
      u => u.id === req.params.id
    );

    // User not found
    if (index === -1) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    users[index] = {
      ...users[index],
      ...req.body
    };

    res.status(200).json(users[index]);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// DELETE
const deleteUser = (req, res) => {
  try {

    const index = users.findIndex(
      u => u.id === req.params.id
    );

    // User not found
    if (index === -1) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    users.splice(index, 1);

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};