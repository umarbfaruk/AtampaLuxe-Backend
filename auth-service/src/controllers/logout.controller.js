import jwt from "jsonwebtoken";

import {
  blacklistToken,
} from "../utils/redis.js";

export const logout =
  async (req, res) => {
    try {
      const token = req.token;

      const decoded =
        jwt.decode(token);

      await blacklistToken(
        token,
        decoded.exp
      );

      res.json({
        success: true,
        message:
          "Logged out successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: "Logout failed",
      });
    }
  };