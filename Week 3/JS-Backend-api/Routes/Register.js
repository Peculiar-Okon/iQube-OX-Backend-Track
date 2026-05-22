const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = { email, password: hashedPassword };

  users.push(user);

  res.status(201).json({ message: "User created" });
};