// const User = require("../Models/UserModel");

// // CREATE
// const createUser = async (req, res) => {
//   try {
//     const { id, name, email } = req.body;

//     // Validation
//     if (!id || !name || !email) {
//       return res.status(400).json({
//         message: "All fields are required"
//       });
//     }

//     const user = await User.create({ id, name, email });

//     return res.status(201).json(user);

//   } catch (error) {
//     return res.status(500).json({
//       message: error.message
//     });
//   }
// };

// // READ ALL
// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find();

//     return res.status(200).json(users);

//   } catch (error) {
//     return res.status(500).json({
//       message: error.message
//     });
//   }
// };

// // READ ONE
// const getUser = async (req, res) => {
//   try {
//     const user = await User.findOne({ id: req.params.id });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found"
//       });
//     }

//     return res.status(200).json(user);

//   } catch (error) {
//     return res.status(500).json({
//       message: error.message
//     });
//   }
// };

// // UPDATE
// const updateUser = async (req, res) => {
//   try {
//     const user = await User.findOneAndUpdate(
//       { id: req.params.id },
//       req.body,
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found"
//       });
//     }

//     return res.status(200).json(user);

//   } catch (error) {
//     return res.status(500).json({
//       message: error.message
//     });
//   }
// };

// // DELETE
// const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findOneAndDelete({ id: req.params.id });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found"
//       });
//     }

//     return res.status(200).json({
//       message: "User deleted successfully"
//     });

//   } catch (error) {
//     return res.status(500).json({
//       message: error.message
//     });
//   }
// };

// module.exports = {
//   createUser,
//   getUsers,
//   getUser,
//   updateUser,
//   deleteUser
// };

const userService = require("../Services/UserService");

// CREATE
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// READ ALL
const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// READ ONE
const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUser(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// UPDATE
const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// DELETE
const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};