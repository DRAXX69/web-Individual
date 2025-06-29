const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        message: 'Please provide a valid authentication token'
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        message: 'Please provide a valid authentication token'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid token.',
        message: 'User not found'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account deactivated.',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token.',
        message: 'The provided token is invalid or expired'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired.',
        message: 'Your session has expired. Please login again'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Server error.',
      message: 'Internal server error during authentication'
    });
  }
};

// Middleware to check if user has specific role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied.',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied.',
        message: 'You do not have permission to perform this action'
      });
    }

    next();
  };
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  return authorize('admin')(req, res, next);
};

// Middleware to check if user is admin or moderator
const requireAdminOrModerator = (req, res, next) => {
  return authorize('admin', 'moderator')(req, res, next);
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Don't fail the request, just continue without user
    next();
  }
};

module.exports = {
  auth,
  authorize,
  requireAdmin,
  requireAdminOrModerator,
  optionalAuth
}; 