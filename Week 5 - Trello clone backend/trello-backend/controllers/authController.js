const User = require("../models/User");
const AppError = require("../utils/AppErrors");
const sendResponse = require("../utils/Response");
const bcrypt = require("bcryptjs");
const authService = require("../services/authService");

exports.register = async (
  req,
  res,
  next
) => {
  try {

    const {
      name,
      email,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {
      throw new AppError(
        "All fields are required",
        400
      );
    }

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      throw new AppError(
        "User with this email already exists",
        400
      );
    }

    const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );
    const user =
      await User.create({
        name,
        email,
        password:
        hashedPassword,
      });

    return sendResponse(res, {
      statusCode: 201,
      message:
        "User registered successfully",
      data: user,
    });

  } catch (err) {

    next(err);

  }
};

exports.login = async (
  req,
  res
) => {
  try {

    const {
      email,
      password,
    } = req.body;


  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }


    const result =
      await authService.loginUser(
        email,
        password
      );

    res.status(200).json(
      result
    );

  } catch (err) {

    res.status(400).json({
      message: err.message,
    });

  }
};