const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateOTP = require("../utils/OTP");
const cache = require("../utils/cache");
const {
  sendVerificationOTP,
  sendPasswordResetOTP,
} = require("./emailService");

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate OTP and store in Redis instead of MongoDB
  const otp = generateOTP();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Store OTP in Redis with auto-expiry (10 minutes)
  await cache.storeOTP(email, otp, "verification");

  await sendVerificationOTP(email, otp);

  return {
    message: "Registration successful. Please verify your email.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email first.");
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const verifyOTP = async (email, otp) => {
  // Verify OTP from Redis
  const result = await cache.verifyOTP(email, otp, "verification");

  if (!result.valid) {
    throw new Error(result.message);
  }

  // Mark user as verified in MongoDB
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  user.isVerified = true;
  await user.save();

  return {
    message: "Email verified successfully.",
  };
};

const resendOTP = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("Email already verified.");
  }

  const otp = generateOTP();

  // Store new OTP in Redis (replaces old one)
  await cache.storeOTP(email, otp, "verification");

  await sendVerificationOTP(email, otp);

  return {
    message: "OTP sent successfully.",
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOTP();

  // Store password reset OTP in Redis
  await cache.storeOTP(email, otp, "passwordReset");

  await sendPasswordResetOTP(email, otp);

  return {
    message: "Password reset OTP sent successfully.",
  };
};

const verifyResetOTP = async (email, otp) => {
  // Verify password reset OTP from Redis
  const result = await cache.verifyOTP(email, otp, "passwordReset");

  if (!result.valid) {
    throw new Error(result.message);
  }

  return {
    message: "OTP verified successfully.",
  };
};

const resetPassword = async (email, newPassword) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  return {
    message: "Password reset successfully.",
  };
};

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
};