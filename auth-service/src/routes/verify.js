import jwt from "jsonwebtoken";

export default function verify(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json(decoded);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}
