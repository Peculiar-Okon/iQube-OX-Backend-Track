const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./Config/db");
const errorHandler = require("./Middleware/errorMiddleware");

const userRoutes = require("./Routes/UserRoutes");

app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.use("/api", userRoutes);
connectDB();

app.get("/", (req, res) => {
  res.send("API is running");
});

app.post("/api/users", (req, res) => {
  res.json({ message: "direct route works" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

