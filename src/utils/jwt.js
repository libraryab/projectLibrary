const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId, role, staffType = null) => {
  const token = jwt.sign(
    { id: userId, role, staffType },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }, // Token expires in 24 hours
  );
  return token;
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null; // Token is invalid or expired
  }
};

module.exports = { generateToken, verifyToken };
