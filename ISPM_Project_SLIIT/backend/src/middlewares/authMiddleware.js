const AuthService = require("../services/auth/AuthService");
const Employee = require("../models/employee/Employee");

const isEmployeeTokenRevoked = async (decoded) => {
  if (decoded.type !== "employee") {
    return false;
  }

  const employee = await Employee.findById(decoded.id);
  if (!employee) {
    return true;
  }

  if (!employee.password_generated_at) {
    return false;
  }

  const passwordChangedAt = new Date(employee.password_generated_at);
  if (decoded.passwordVersion) {
    return decoded.passwordVersion !== passwordChangedAt.toISOString();
  }

  return decoded.iat * 1000 < passwordChangedAt.getTime();
};

/**
 * Middleware to verify JWT token and attach user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

  
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required",
      });
    }

    // Verify token directly
    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (await isEmployeeTokenRevoked(decoded)) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

/**
 * Optional auth middleware - doesn't fail if no token, but attaches user if valid token provided
 */
const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = AuthService.verifyToken(token);

    if (decoded) {
      req.user = decoded;
    }

    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    req.user = null;
    next();
  }
};

const requireAdminUser = (req, res, next) => {
  if (req.user?.type != "admin") {
    return res.status(403).json({
      success: false,
      message: "Unathorized access",
    });
  }

  next();
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.type)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to perform this action",
      });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  requireAdminUser,
  authorizeRoles,
};
