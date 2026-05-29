const User = require("../models/User");

exports.register = async (
  req,
  res
) => {
  try {
    const { name, email, password } =
      req.body;

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};