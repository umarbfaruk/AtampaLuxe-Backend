import jwt from "jsonwebtoken";
import { redis } from "../config/redis.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // ✅ STRICT Bearer validation
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    const token = parts[1];

    // =========================
    // BLACKLIST CHECK (REDIS)
    // =========================
    const blacklisted = await redis.get(`blacklist:${token}`);

    if (blacklisted) {
      return res.status(401).json({
        message: "Token revoked",
      });
    }

    // =========================
    // JWT SECRET VALIDATION
    // =========================
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET missing in auth service");
      return res.status(500).json({
        message: "Server misconfiguration",
      });
    }

    // =========================
    // VERIFY TOKEN
    // =========================
    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    req.token = token;

    next();
  } catch (err) {
    console.error("Token Verification Error:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};