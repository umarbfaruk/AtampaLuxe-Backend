import { createClient } from "redis";

export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});

await redis.connect();

console.log("✅ Redis Connected");

/**
 * Check whether a JWT token has been revoked
 */
export const isBlacklisted = async (token) => {
  try {
    const exists = await redis.get(`blacklist:${token}`);
    return !!exists;
  } catch (error) {
    console.error(
      "Redis blacklist check error:",
      error
    );
    return false;
  }
};

/**
 * Add token to blacklist
 */
export const blacklistToken = async (
  token,
  expiresInSeconds = 86400
) => {
  try {
    await redis.set(
      `blacklist:${token}`,
      "true",
      {
        EX: expiresInSeconds,
      }
    );
  } catch (error) {
    console.error(
      "Redis blacklist save error:",
      error
    );
  }
};