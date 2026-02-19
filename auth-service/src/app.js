import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/auth.routes.js";
import { verifyToken } from "./middlewares/auth.middleware.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

// ROOT
app.get("/", (req, res) => {
  res.send("Auth Service is running");
});

// VERIFY TOKEN
app.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

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

// TEMP LOGIN
app.post("/login", (req, res) => {
  const { email } = req.body;

  const token = jwt.sign(
    { id: "123", email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// AUTH ROUTES
app.use("/auth", authRoutes);

// PROTECTED EXAMPLE
app.get("/auth/protected", verifyToken, (req, res) => {
  res.json({
    message: "You accessed a protected route!",
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
