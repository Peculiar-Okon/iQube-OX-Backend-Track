const express = require("express");
const app = express();
const cors = require("cors");

const userRoutes = require("./Routes/UserRoutes");

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

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

