// Format currency in Indian Rupees
exports.formatCurrency = (amount) => {
  return new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date in Hindi
exports.formatDateHindi = (date) => {
  return new Date(date).toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Generate receipt number
exports.generateReceiptNumber = async (year) => {
  const KhataEntry = require('../models/Khata');
  const count = await KhataEntry.countDocuments({ year });
  return `GKM-${year}-${String(count + 1).padStart(6, '0')}`;
};

// Calculate remaining amount
exports.calculateRemaining = (totalAmount, paidAmount, discount = 0) => {
  return Math.max(0, totalAmount - paidAmount - discount);
};

// Get entry type label in Hindi
exports.getEntryTypeHindi = (type) => {
  const labels = {
    charha: 'चरहा',
    batai: 'बटाई',
    patta: 'पट्टा',
    bakaya: 'बकाया',
    payment: 'भुगतान',
    other: 'अन्य'
  };
  return labels[type] || type;
};

// Get status label in Hindi
exports.getStatusHindi = (status) => {
  const labels = {
    pending: 'लंबित',
    partial: 'आंशिक',
    completed: 'पूर्ण',
    disputed: 'विवादित',
    cancelled: 'रद्द'
  };
  return labels[status] || status;
};

// Get season label in Hindi
exports.getSeasonHindi = (season) => {
  const labels = {
    rabi: 'रबी',
    kharif: 'खरीफ',
    zaid: 'जायद',
    full_year: 'पूर्ण वर्ष'
  };
  return labels[season] || season;
};

// Get land unit in Hindi
exports.getLandUnitHindi = (unit) => {
  const labels = {
    bigha: 'बीघा',
    acre: 'एकड़',
    hectare: 'हेक्टेयर',
    biswa: 'बिस्वा'
  };
  return labels[unit] || unit;
};

// Get payment mode in Hindi
exports.getPaymentModeHindi = (mode) => {
  const labels = {
    cash: 'नकद',
    bank_transfer: 'बैंक ट्रांसफर',
    cheque: 'चेक',
    upi: 'UPI',
    kind: 'वस्तु के रूप में',
    other: 'अन्य'
  };
  return labels[mode] || mode;
};

// Get land type in Hindi
exports.getLandTypeHindi = (type) => {
  const labels = {
    sinchit: 'सिंचित',
    asinchit: 'असिंचित',
    banjar: 'बंजर',
    charagah: 'चारागाह',
    other: 'अन्य'
  };
  return labels[type] || type;
};

// Validate Indian mobile number
exports.validateMobile = (mobile) => {
  return /^[6-9]\d{9}$/.test(mobile);
};

// Calculate age from date
exports.calculateYears = (startDate, endDate = new Date()) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end.getFullYear() - start.getFullYear();
};

// Parse pagination params
exports.parsePagination = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

// Build search query
exports.buildSearchQuery = (searchTerm, fields) => {
  if (!searchTerm) return {};
  
  return {
    $or: fields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' }
    }))
  };
};

// Group by field
exports.groupByField = (array, field) => {
  return array.reduce((acc, item) => {
    const key = item[field];
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

// Sort array by date
exports.sortByDate = (array, field = 'date', ascending = false) => {
  return array.sort((a, b) => {
    const dateA = new Date(a[field]);
    const dateB = new Date(b[field]);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};
