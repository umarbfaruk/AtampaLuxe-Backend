import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import authRouter from "./routes/auth.routes.js";
import { verifyToken } from "./middlewares/auth.middleware.js";

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({ origin: true, credentials: true }));

// MUST BE FIRST for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* =========================
   ROOT
========================= */
app.get("/", (req, res) => {
  res.json({ message: "Auth Service Running" });
});

/* =========================
   VERIFY TOKEN
========================= */
app.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.setHeader("X-User-Id", decoded.id);
    res.setHeader("X-User-Email", decoded.email);

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

/* =========================
   AUTH ROUTES (IMPORTANT)
========================= */
app.use("/auth", authRouter);

/* =========================
   PROTECTED ROUTE
========================= */
app.get("/auth/protected", verifyToken, (req, res) => {
  res.json({
    message: "You accessed protected route!",
    user: req.user,
  });
});

export default app;