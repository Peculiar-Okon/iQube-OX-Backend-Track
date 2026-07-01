// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const registerUser = async (
//   name,
//   email,
//   password
// ) => {

//   const existingUser =
//     await User.findOne({ email });

//   if (existingUser) {
//     throw new Error(
//       "Email already exists"
//     );
//   }

//   const hashedPassword =
//     await bcrypt.hash(password, 10);

//   const user =
//     await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//   return user;
// };

// const loginUser = async (
//   email,
//   password
// ) => {

//   const user =
//     await User.findOne({ email });

//   if (!user) {
//     throw new Error(
//       "Invalid credentials"
//     );
//   }

  

//   const isMatch =
//     await bcrypt.compare(
//       password,
//       user.password
//     );

//   if (!isMatch) {
//     throw new Error(
//       "Invalid credentials"
//     );
//   }

//   const token = jwt.sign(
//     {
//       id: user._id,
//       role: user.role,
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: "1d",
//     }
//   );

//   return {
//     token,
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     },
//   };
// };

// module.exports = {
//   registerUser,
//   loginUser,
// };

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateOTP = require("../utils/OTP");
const {
  sendVerificationOTP,
  sendPasswordResetOTP,
} = require("./emailService");

const registerUser = async ({
  name,
  email,
  password,
}) => {
  const existingUser =
    await User.findOne({ email });

  if (existingUser) {
    throw new Error(
      "Email already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const otp = generateOTP();

  const hashedOTP = await bcrypt.hash(
    otp,
    10
);

  const user =
    await User.create({
      name,
      email,
      password: hashedPassword,
      verificationOTP: hashedOTP,
      verificationOTPExpires:
        Date.now() + 10 * 60 * 1000, // 10 mins
    });

  await sendVerificationOTP(
    email,
    otp
  );

  return {
    message:
      "Registration successful. Please verify your email.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

const loginUser = async (
  email,
  password
) => {
  const user =
    await User.findOne({ email });

  if (!user) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error(
      "Invalid credentials"
    );
  }

  if (!user.isVerified) {
    throw new Error(
      "Please verify your email first."
    );
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

const verifyOTP = async (
  email,
  otp
) => {
  const user =
    await User.findOne({ email });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  const isMatch = await bcrypt.compare(
  otp,
  user.verificationOTP
);

if (!isMatch) {
  throw new Error("Invalid OTP");
}

  // if (
  //   user.verificationOTP !== otp
  // ) {
  //   throw new Error(
  //     "Invalid OTP"
  //   );
  // }

  if (
    user.verificationOTPExpires <
    Date.now()
  ) {
    throw new Error(
      "OTP has expired"
    );
  }

  user.isVerified = true;
  user.verificationOTP = null;
  user.verificationOTPExpires =
    null;

  await user.save();

  return {
    message:
      "Email verified successfully.",
  };
};

const resendOTP = async (
  email
) => {
  const user =
    await User.findOne({ email });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  if (user.isVerified) {
    throw new Error(
      "Email already verified."
    );
  }

  const otp = generateOTP();

  const hashedOTP = await bcrypt.hash(
    otp,
    10
);

  user.verificationOTP = hashedOTP;
  user.verificationOTPExpires =
    Date.now() + 10 * 60 * 1000;

  await user.save();

  await sendVerificationOTP(
    email,
    otp
  );

  return {
    message:
      "OTP sent successfully.",
  };
};

const forgotPassword = async (
  email
) => {
  const user =
    await User.findOne({ email });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  const otp =
    generateOTP();

  const hashedOTP =
    await bcrypt.hash(
      otp,
      10
    );

  user.passwordResetOTP =
    hashedOTP;

  user.passwordResetOTPExpires =
    Date.now() +
    10 * 60 * 1000;

  await user.save();

  await sendPasswordResetOTP(
    email,
    otp
  );

  return {
    message:
      "Password reset OTP sent successfully.",
  };
};

const verifyResetOTP = async (
  email,
  otp
) => {
  const user =
    await User.findOne({ email });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  if (
    user.passwordResetOTPExpires <
    Date.now()
  ) {
    throw new Error(
      "OTP has expired."
    );
  }

  const valid =
    await bcrypt.compare(
      otp,
      user.passwordResetOTP
    );

  if (!valid) {
    throw new Error(
      "Invalid OTP."
    );
  }

  return {
    message:
      "OTP verified successfully.",
  };
};

const resetPassword = async (
  email,
  newPassword
) => {
  const user =
    await User.findOne({ email });

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      10
    );

  user.password =
    hashedPassword;

  user.passwordResetOTP =
    null;

  user.passwordResetOTPExpires =
    null;

  await user.save();

  return {
    message:
      "Password reset successfully.",
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