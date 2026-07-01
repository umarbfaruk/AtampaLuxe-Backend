import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authorization token missing or malformed",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // MUST MATCH AUTH SERVICE SECRET
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET missing in order-service");
      return res.status(500).json({
        error: "Server misconfiguration",
      });
    }

    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT VERIFY ERROR:", err.message);

    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};