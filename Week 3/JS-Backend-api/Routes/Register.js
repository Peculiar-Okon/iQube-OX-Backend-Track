// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const register = async (req, res) => {
//   const { email, password } = req.body;

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = { email, password: hashedPassword };

//   users.push(user);

//   res.status(201).json({ message: "User created" });
// };

const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user in DB
    const user = await User.create({
      email,
      password: hashedPassword
    });

    // 4. Optional: create token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      "secretKey",
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "User created",
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};