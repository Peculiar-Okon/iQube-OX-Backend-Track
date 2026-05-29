const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require("../Controllers/UserController");

const authMiddleware = require("../Middleware/authMiddleware");

// CRUD ROUTES
router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// PROTECTED ROUTE
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are allowed" });
});

module.exports = router;