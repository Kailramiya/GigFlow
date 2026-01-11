import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;
    console.log('🔍 Auth check for:', req.method, req.path);
    console.log('📦 Cookies received:', Object.keys(req.cookies));

    // Check if token exists
    if (!token) {
      console.log('❌ No token found in cookies for', req.path);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    console.log('✅ Token found, verifying...');

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
      
      // Get user from token and attach to request
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }
      
      console.log('✅ User authenticated:', user.email);
      req.user = user;
      next();
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired',
      });
    }
  } catch (error) {
    console.error('🔴 Auth middleware error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication',
      error: error.message,
    });
  }
};

// Optional: Middleware to check if user is authorized to access specific resources
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};