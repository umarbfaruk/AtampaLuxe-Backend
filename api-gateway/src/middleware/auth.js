import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Forward user info to downstream services
    req.headers["x-user-id"] = decoded.id;
    req.headers["x-user-email"] = decoded.email;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
