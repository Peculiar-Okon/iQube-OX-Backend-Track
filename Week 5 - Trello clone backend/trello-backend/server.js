const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require(
  "./routes/authRoutes"
);

dotenv.config();

const connectDB = require("./config/db");

connectDB();

const app = express();
const boardRoutes = require("./routes/boardRoutes");

const listRoutes =
  require("./routes/listRoutes");


app.use("/api/lists", listRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Trello backend running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});