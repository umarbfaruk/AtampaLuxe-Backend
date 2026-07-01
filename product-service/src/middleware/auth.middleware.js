import jwt from "jsonwebtoken";

/*
|--------------------------------------------------------------------------
| Verify JWT Token
|--------------------------------------------------------------------------
| Used by app.js and can be reused by routes
|--------------------------------------------------------------------------
*/

export function verifyToken(req, res, next) {
  console.log("\n========================================");
  console.log("🔐 PRODUCT SERVICE AUTH MIDDLEWARE");
  console.log("========================================");

  try {
    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader || "NONE");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Missing or invalid Authorization header");

      return res.status(401).json({
        error: "Unauthorized: Missing token",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("JWT Token:");
    console.log(token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ JWT VERIFIED");
    console.log(decoded);

    req.user = decoded;

    // Keep compatibility with gateway forwarding
    req.headers["x-user-id"] = decoded.id;
    req.headers["x-user-email"] = decoded.email;
    req.headers["x-user-role"] = decoded.role;

    next();
  } catch (error) {
    console.error("❌ JWT verification failed");
    console.error(error.message);

    return res.status(401).json({
      error: "Invalid token",
    });
  }
}

/*
|--------------------------------------------------------------------------
| Alias middleware
|--------------------------------------------------------------------------
*/

export const authMiddleware = verifyToken;

/*
|--------------------------------------------------------------------------
| Role middleware
|--------------------------------------------------------------------------
*/

export function requireRole(...roles) {
  return (req, res, next) => {
    console.log("Checking role...");
    console.log("Required Roles:", roles);
    console.log("Current User:", req.user);

    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log("❌ Access denied");

      return res.status(403).json({
        error: "Forbidden",
      });
    }

    console.log("✅ Role authorized");

    next();
  };
}