export const tenantIsolation = (
  req,
  res,
  next
) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  req.tenantId =
    user.tenantId || null;

  next();
};