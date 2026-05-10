// Format currency in Indian format
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);
};

// Format date in Hindi
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format date short
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get entry type in Hindi
export const getEntryTypeLabel = (type) => {
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

// Get status in Hindi
export const getStatusLabel = (status) => {
  const labels = {
    pending: 'लंबित',
    partial: 'आंशिक',
    completed: 'पूर्ण',
    disputed: 'विवादित',
    cancelled: 'रद्द'
  };
  return labels[status] || status;
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    pending: 'danger',
    partial: 'warning',
    completed: 'success',
    disputed: 'danger',
    cancelled: 'info'
  };
  return colors[status] || 'info';
};

// Get land unit in Hindi
export const getLandUnitLabel = (unit) => {
  const labels = {
    bigha: 'बीघा',
    acre: 'एकड़',
    hectare: 'हेक्टेयर',
    biswa: 'बिस्वा'
  };
  return labels[unit] || unit;
};

// Get payment mode in Hindi
export const getPaymentModeLabel = (mode) => {
  const labels = {
    cash: 'नकद',
    bank_transfer: 'बैंक ट्रांसफर',
    cheque: 'चेक',
    upi: 'UPI',
    kind: 'वस्तु',
    other: 'अन्य'
  };
  return labels[mode] || mode;
};

// Format mobile number
export const formatMobile = (mobile) => {
  if (!mobile) return '';
  const cleaned = mobile.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return mobile;
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
