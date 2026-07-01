const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

        isVerified: {
      type: Boolean,
      default: false,
    },

    verificationOTP: {
      type: String,
    },

    verificationOTPExpires: {
      type: Date,
    },

    passwordResetOTP: {
  type: String,
},

passwordResetOTPExpires: {
  type: Date,
},

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);