/**
 * Middleware for JWT authentication and role-based authorization.
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes with JWT.
 */
exports.protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer')) {
      return res
        .status(401)
        .json({ success: false, message: 'No token provided' });
    }

    token = token.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT Auth Error:', err.message);
    return res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' });
  }
};

/**
 * Restrict to admin role.
 */
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res
    .status(403)
    .json({ success: false, message: 'Admin access required' });
};
