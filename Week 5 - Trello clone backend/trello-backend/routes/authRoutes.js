const express = require("express");

const router = express.Router();

const {
  register,
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

module.exports = router;