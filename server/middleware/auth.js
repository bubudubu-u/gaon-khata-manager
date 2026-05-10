const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'कृपया लॉगिन करें - Please login first'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'उपयोगकर्ता नहीं मिला - User not found'
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'आपका अकाउंट निष्क्रिय है - Account deactivated'
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'सत्र समाप्त - Session expired'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'अनुमति नहीं है - Not authorized'
      });
    }
    next();
  };
};
