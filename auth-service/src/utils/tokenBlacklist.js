import { redis } from "../config/redis.js";

export const blacklistToken =
  async (token, exp) => {
    const ttl =
      exp -
      Math.floor(Date.now() / 1000);

    if (ttl > 0) {
      await redis.set(
        `bl_${token}`,
        "1",
        {
          EX: ttl,
        }
      );
    }
  };

export const isBlacklisted =
  async (token) => {
    const result =
      await redis.get(
        `bl_${token}`
      );

    return result === "1";
  };