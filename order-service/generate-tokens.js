import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // 👈 REQUIRED

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env");
}

const adminToken = jwt.sign(
  { id: 1, role: "ADMIN" },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
);

const userToken = jwt.sign(
  { id: 2, role: "USER" },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
);

console.log("\n====================");
console.log("ADMIN TOKEN:");
console.log(adminToken);
console.log("====================\n");

console.log("====================");
console.log("USER TOKEN:");
console.log(userToken);
console.log("====================\n");
