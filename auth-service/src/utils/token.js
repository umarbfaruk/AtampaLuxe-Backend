import jwt from "jsonwebtoken";

/*
====================================
ACCESS TOKEN
====================================
*/
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId || null,
    },
    process.env.JWT_SECRET, // MUST exist in env
    {
      expiresIn: "15m",
    }
  );
};

/*
====================================
REFRESH TOKEN
====================================
*/
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/*
====================================
VERIFY ACCESS TOKEN
====================================
*/
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/*
====================================
VERIFY REFRESH TOKEN
====================================
*/
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_SECRET);
};