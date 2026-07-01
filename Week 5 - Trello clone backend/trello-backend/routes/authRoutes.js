const express = require("express");
const  protect  = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = express.Router();

const {
  register,
  login,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} = require(
  "../controllers/authController"
);

const validateUser =
  require(
    "../middleware/validateUser"
  );


router.post(
  "/register",
  validateUser,
  register
);

router.post(
  "/login",
  login
);


router.post(
  "/verify-otp",
  verifyOTP
);

router.post(
  "/resend-otp",
  resendOTP
);

router.post(
  "/forgot-password",
forgotPassword
);


router.post(
  "/verify-reset-otp",
verifyResetOTP
);

router.post(
  "/reset-password",
resetPassword
);

router.delete(
  "/all",
  protect,
  roleMiddleware("admin"),
);

module.exports = router;