const jwt = require('jsonwebtoken');

const generateToken = (email, extraClaims = {}) => {
  return jwt.sign(
    { sub: email, ...extraClaims },
    process.env.JWT_SECRET,
    { expiresIn: Math.floor(parseInt(process.env.JWT_EXPIRATION) / 1000) }
  );
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { generateToken, verifyToken };
