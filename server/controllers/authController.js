const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { validationResult } = require('express-validator');

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, password, village, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'यह ईमेल पहले से रजिस्टर्ड है'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      village,
      phone
    });

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: 'REGISTER',
      entity: 'User',
      entityId: user._id,
      description: `New user registered: ${name}`,
      ipAddress: req.ip
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({
      success: false,
      error: 'रजिस्ट्रेशन में त्रुटि हुई'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'कृपया ईमेल और पासवर्ड दर्ज करें'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'गलत ईमेल या पासवर्ड'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'गलत ईमेल या पासवर्ड'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user._id,
      description: `${user.name} logged in`,
      ipAddress: req.ip
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: 'लॉगिन में त्रुटि हुई'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'उपयोगकर्ता जानकारी प्राप्त करने में त्रुटि'
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    await ActivityLog.create({
      user: req.user._id,
      action: 'LOGOUT',
      entity: 'User',
      entityId: req.user._id,
      description: `${req.user.name} logged out`,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'सफलतापूर्वक लॉगआउट हुआ'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'लॉगआउट में त्रुटि'
    });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      village: user.village
    }
  });
};
