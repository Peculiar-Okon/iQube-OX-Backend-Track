const express = require("express");

const router = express.Router();

const {
  register,
  login,
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

router.delete(
  "/all",
  protect,
  roleMiddleware("admin"),
);

module.exports = router;