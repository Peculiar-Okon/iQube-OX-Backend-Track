const redis = require("../config/redisClient");

// Cache TTL constants (in seconds)
const CACHE_TTL = {
  BOARDS: 300,        // 5 minutes
  BOARD: 300,         // 5 minutes
  FULL_BOARD: 300,    // 5 minutes
  LISTS: 300,         // 5 minutes
  TASKS: 300,         // 5 minutes
  OTP: 600,           // 10 minutes (same as OTP expiry)
};

// Generate a consistent cache key
const getKey = (prefix, ...args) => {
  return `trello:${prefix}:${args.join(":")}`;
};

// Get data from cache
const get = async (key) => {
  try {
    const data = await redis.get(key);
    if (data) {
      console.log(`CACHE HIT: ${key}`);
      return JSON.parse(data);
    }
    console.log(`CACHE MISS: ${key}`);
    return null;
  } catch (err) {
    console.warn(`Cache get error for ${key}:`, err.message);
    return null;
  }
};

// Set data in cache with TTL
const set = async (key, data, ttl = 300) => {
  try {
    await redis.set(key, JSON.stringify(data), "EX", ttl);
    console.log(`CACHE SET: ${key} (TTL: ${ttl}s)`);
  } catch (err) {
    console.warn(`Cache set error for ${key}:`, err.message);
  }
};

// Delete specific cache keys
const del = async (key) => {
  try {
    await redis.del(key);
    console.log(`CACHE DELETED: ${key}`);
  } catch (err) {
    console.warn(`Cache del error for ${key}:`, err.message);
  }
};

// Delete all cache keys matching a pattern (e.g., "trello:boards:*")
const delByPattern = async (pattern) => {
  try {
    const stream = redis.scanStream({
      match: pattern,
      count: 100,
    });

    stream.on("data", async (keys) => {
      if (keys.length > 0) {
        await redis.del(keys);
        console.log(`CACHE BATCH DELETED: ${keys.length} keys matching "${pattern}"`);
      }
    });

    stream.on("end", () => {
      console.log(`CACHE PATTERN DELETION COMPLETE: ${pattern}`);
    });
  } catch (err) {
    console.warn(`Cache delByPattern error for ${pattern}:`, err.message);
  }
};

// Invalidate all board-related caches for a user (boards, lists, tasks)
const invalidateBoardCache = async (userId) => {
  await delByPattern(`trello:boards:${userId}:*`);
  await delByPattern(`trello:board:${userId}:*`);
  await delByPattern(`trello:fullBoard:${userId}:*`);
  await delByPattern(`trello:lists:${userId}:*`);
};

// Store OTP in Redis with TTL
const storeOTP = async (email, otp, type = "verification") => {
  const key = getKey("otp", type, email);
  await set(key, { otp, type, createdAt: Date.now() }, CACHE_TTL.OTP);
};

// Verify OTP from Redis
const verifyOTP = async (email, otp, type = "verification") => {
  const key = getKey("otp", type, email);
  const cached = await get(key);

  if (!cached) {
    return { valid: false, message: "OTP not found or expired" };
  }

  if (cached.otp !== otp) {
    return { valid: false, message: "Invalid OTP" };
  }

  // Delete OTP after successful verification (one-time use)
  await del(key);

  return { valid: true, message: "OTP verified successfully" };
};

module.exports = {
  CACHE_TTL,
  getKey,
  get,
  set,
  del,
  delByPattern,
  invalidateBoardCache,
  storeOTP,
  verifyOTP,
};