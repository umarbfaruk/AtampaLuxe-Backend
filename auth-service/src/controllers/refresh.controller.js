import jwt from "jsonwebtoken";
import {
  generateAccessToken,
} from "../utils/token.js";

export const refreshToken =
  async (req, res) => {
    try {
      const { refreshToken } =
        req.body;

      const decoded =
        jwt.verify(
          refreshToken,
          process.env.REFRESH_SECRET
        );

      const accessToken =
        generateAccessToken({
          id: decoded.id,
        });

      return res.json({
        accessToken,
      });
    } catch (err) {
      return res.status(401).json({
        message:
          "Invalid refresh token",
      });
    }
  };