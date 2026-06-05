const User = require("../models/User");
const AppError = require("../utils/AppErrors");
const sendResponse = require("../utils/Response");

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

    const user =
      await User.create({
        name,
        email,
        password,
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

// exports.register = async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     const { name, email, password } =
//       req.body;
//       if (!name || !email || !password) {
//         return sendResponse(res, {
//           statusCode: 400,
//           message: "All fields are required",
//         });
//       }
//     const existingUser = await User.findOne({
//       email,
//     });
//     if (existingUser) {
//       return sendResponse(res, {
//         statusCode: 400,
//         message: "User with this email already exists",
//       });
//     }
//     const user = await User.create({
//       name,
//       email,
//       password,
//     });

//     return sendResponse(res, {
//       statusCode: 201,
//       message: "User created successfully",
//       data: user,
//     });
//   } catch (err) {
//     next(err);
//   }
// };