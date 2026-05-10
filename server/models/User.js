const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'कृपया नाम दर्ज करें'],
    trim: true,
    maxlength: [50, 'नाम 50 अक्षर से अधिक नहीं हो सकता']
  },
  email: {
    type: String,
    required: [true, 'कृपया ईमेल दर्ज करें'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'कृपया सही ईमेल दर्ज करें']
  },
  password: {
    type: String,
    required: [true, 'कृपया पासवर्ड दर्ज करें'],
    minlength: [6, 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'sarpanch'],
    default: 'user'
  },
  village: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match user entered password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
