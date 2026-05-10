const mongoose = require('mongoose');

const KhataEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  person: {
    type: mongoose.Schema.ObjectId,
    ref: 'Person',
    required: [true, 'कृपया व्यक्ति का चयन करें']
  },
  entryType: {
    type: String,
    enum: ['charha', 'batai', 'patta', 'bakaya', 'payment', 'other'],
    required: [true, 'कृपया प्रविष्टि प्रकार चुनें'],
    default: 'charha'
  },
  date: {
    type: Date,
    required: [true, 'कृपया दिनांक दर्ज करें'],
    default: Date.now
  },
  year: {
    type: Number,
    required: [true, 'कृपया वर्ष दर्ज करें']
  },
  season: {
    type: String,
    enum: ['rabi', 'kharif', 'zaid', 'full_year'],
    default: 'full_year'
  },
  landDetails: {
    size: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      enum: ['bigha', 'acre', 'hectare', 'biswa'],
      default: 'bigha'
    },
    khasraNumber: String,
    landType: {
      type: String,
      enum: ['sinchit', 'asinchit', 'banjar', 'charagah', 'other'],
      default: 'sinchit'
    }
  },
  financials: {
    rate: {
      type: Number,
      default: 0
    },
    rateUnit: {
      type: String,
      enum: ['per_bigha', 'per_acre', 'total', 'per_quintal', 'percentage'],
      default: 'per_bigha'
    },
    totalAmount: {
      type: Number,
      required: [true, 'कृपया कुल राशि दर्ज करें'],
      default: 0
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    remainingAmount: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    paymentMode: {
      type: String,
      enum: ['cash', 'bank_transfer', 'cheque', 'upi', 'kind', 'other'],
      default: 'cash'
    }
  },
  description: {
    type: String,
    maxlength: [500, 'विवरण 500 अक्षर से अधिक नहीं हो सकता']
  },
  status: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'disputed', 'cancelled'],
    default: 'pending'
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadDate: Date
  }],
  voiceNotes: [{
    fileName: String,
    fileUrl: String,
    duration: Number,
    uploadDate: Date
  }],
  tags: [String],
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate receipt number before save
KhataEntrySchema.pre('save', async function(next) {
  if (!this.receiptNumber) {
    const count = await mongoose.model('KhataEntry').countDocuments();
    this.receiptNumber = `GKM-${this.year}-${String(count + 1).padStart(6, '0')}`;
  }
  
  // Calculate remaining amount
  this.financials.remainingAmount = 
    this.financials.totalAmount - this.financials.paidAmount - this.financials.discount;
  
  // Update status based on payment
  if (this.financials.paidAmount >= this.financials.totalAmount) {
    this.status = 'completed';
  } else if (this.financials.paidAmount > 0) {
    this.status = 'partial';
  } else {
    this.status = 'pending';
  }
  
  this.updatedAt = Date.now();
  next();
});

// Indexes for better performance
KhataEntrySchema.index({ user: 1, year: -1 });
KhataEntrySchema.index({ person: 1, date: -1 });
KhataEntrySchema.index({ 'financials.remainingAmount': 1 });
KhataEntrySchema.index({ entryType: 1, status: 1 });

module.exports = mongoose.model('KhataEntry', KhataEntrySchema);
