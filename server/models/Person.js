const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'कृपया व्यक्ति का नाम दर्ज करें'],
    trim: true,
    maxlength: [100, 'नाम 100 अक्षर से अधिक नहीं हो सकता']
  },
  fatherName: {
    type: String,
    required: [true, 'कृपया पिता का नाम दर्ज करें'],
    trim: true,
    maxlength: [100, 'पिता का नाम 100 अक्षर से अधिक नहीं हो सकता']
  },
  village: {
    type: String,
    required: [true, 'कृपया गाँव का नाम दर्ज करें'],
    trim: true
  },
  mobile: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'कृपया सही मोबाइल नंबर दर्ज करें']
  },
  aadharNumber: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: [500, 'नोट्स 500 अक्षर से अधिक नहीं हो सकते']
  },
  photo: {
    type: String
  },
  totalLand: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  documents: [{
    title: String,
    fileUrl: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for better search
PersonSchema.index({ name: 'text', fatherName: 'text', village: 'text' });
PersonSchema.index({ user: 1, village: 1 });

// Update timestamp before save
PersonSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Person', PersonSchema);
