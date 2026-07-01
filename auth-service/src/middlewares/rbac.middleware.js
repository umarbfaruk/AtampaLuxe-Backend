/**
 * PERMISSION-BASED RBAC
 * Not just roles — supports fine-grained permissions
 */

export const rbac = (roles = [], permissions = []) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ROLE CHECK
    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ message: "Role forbidden" });
    }

    // PERMISSION CHECK (optional future upgrade)
    if (permissions.length) {
      const userPermissions = user.permissions || [];

      const hasPermission = permissions.every((p) =>
        userPermissions.includes(p)
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Permission denied" });
      }
    }

    next();
  };
};