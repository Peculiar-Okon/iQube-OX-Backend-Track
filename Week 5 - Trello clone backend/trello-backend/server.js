require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cluster = require("cluster");
const os = require("os");
const connectDB = require("./config/db");
const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Trello backend running");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = () => {
  connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

const startInClusterMode = () => {
  if (process.env.NODE_ENV !== "production") {
    return startServer();
  }

  if (cluster.isPrimary) {
    const totalMemoryGB = os.totalmem() / (1024 * 1024 * 1024);
    const maxWorkersByRam = Math.max(1, Math.floor(totalMemoryGB / 1.5));
    const desiredWorkers = Math.min(os.cpus().length, maxWorkersByRam);

    console.log(
      `Master started with ${desiredWorkers} workers based on ${totalMemoryGB.toFixed(1)}GB RAM`
    );

    for (let i = 0; i < desiredWorkers; i += 1) {
      cluster.fork();
    }

    cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.process.pid} died, starting a new one...`);
      cluster.fork();
    });
  } else {
    startServer();
  }
};

startInClusterMode();
