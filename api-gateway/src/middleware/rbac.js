/*
====================================
SUPER ADMIN ONLY
====================================
*/

export const allowSuperAdmin = (
  req,
  res,
  next
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (
    req.user.role !==
    "SUPERADMIN"
  ) {
    return res.status(403).json({
      message:
        "Gateway blocked access",
    });
  }

  next();
};

/*
====================================
ROLE CHECK
====================================
*/

export const allowRoles = (
  ...roles
) => {
  return (
    req,
    res,
    next
  ) => {
    if (
      !roles.includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        message:
          "Insufficient permissions",
      });
    }

    next();
  };
};