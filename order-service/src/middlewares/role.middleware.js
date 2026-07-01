// order-service/src/middlewares/role.middleware.js

export const requireRole = (...roles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: "Forbidden: Access denied" });
      }

      next();
    } catch (error) {
      console.error("ROLE MIDDLEWARE ERROR:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};