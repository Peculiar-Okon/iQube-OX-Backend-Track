const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const boardRoutes = require("./boardRoutes");
const listRoutes = require("./listRoutes");
const taskRoutes = require("./taskRoutes");

router.use("/auth", authRoutes);
router.use("/boards", boardRoutes);
router.use("/lists", listRoutes);
router.use("/tasks", taskRoutes);

module.exports = router;
