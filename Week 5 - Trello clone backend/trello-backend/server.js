require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require(
  "./routes/authRoutes"
);
const boardRoutes = require("./routes/boardRoutes");



console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

const connectDB = require("./config/db");

connectDB();

const app = express();


const listRoutes =
  require("./routes/listRoutes");

const taskRoutes =
  require("./routes/taskRoutes");

const notFound = require(
  "./middleware/notFound"
);

const errorHandler = require(
  "./middleware/errorMiddleware"
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/tasks", taskRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use(notFound);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Trello backend running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});