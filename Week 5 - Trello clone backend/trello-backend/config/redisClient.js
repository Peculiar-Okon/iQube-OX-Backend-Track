const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    // Retry up to 3 times with 1 second delay
    if (times > 3) {
      console.warn("Redis: Max retries reached. Running without cache.");
      return null; // stop retrying
    }
    return 1000;
  },
  maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
  console.log("Redis connected successfully");
});

redis.on("error", (err) => {
  console.warn("Redis connection error (caching disabled):", err.message);
});

module.exports = redis;