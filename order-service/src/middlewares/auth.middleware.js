import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Missing auth header");
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  console.log("🔐 TOKEN RECEIVED:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ JWT ERROR:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};