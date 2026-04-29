const { verifyToken } = require("../utils/jwt");

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and has Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token missing or invalid" });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.slice(7);

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Token expired or invalid" });
    }

    // Attach user data to request object
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }

    return next();
  };

const requireStaffType =
  (...staffTypes) =>
  (req, res, next) => {
    if (!req.user || req.user.role !== "STAFF") {
      return res.status(403).json({ error: "Forbidden: staff role required" });
    }

    if (!staffTypes.includes(req.user.staffType)) {
      return res
        .status(403)
        .json({ error: "Forbidden: insufficient staff type" });
    }

    return next();
  };

module.exports = authMiddleware;
module.exports.requireRole = requireRole;
module.exports.requireStaffType = requireStaffType;
