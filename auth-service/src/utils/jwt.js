const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "supersecret";

const sign = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
};

const verify = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = { sign, verify };
