// Validate required field
export const required = (value) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return 'यह फ़ील्ड आवश्यक है';
  }
  return null;
};

// Validate email
export const validateEmail = (email) => {
  if (!email) return 'ईमेल आवश्यक है';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'कृपया सही ईमेल दर्ज करें';
  }
  return null;
};

// Validate password
export const validatePassword = (password) => {
  if (!password) return 'पासवर्ड आवश्यक है';
  if (password.length < 6) {
    return 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए';
  }
  return null;
};

// Validate mobile number
export const validateMobile = (mobile) => {
  if (!mobile) return null; // Optional field
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(mobile)) {
    return 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें';
  }
  return null;
};

// Validate aadhar number
export const validateAadhar = (aadhar) => {
  if (!aadhar) return null; // Optional field
  const aadharRegex = /^\d{12}$/;
  if (!aadharRegex.test(aadhar)) {
    return 'कृपया सही 12 अंकों का आधार नंबर दर्ज करें';
  }
  return null;
};

// Validate amount
export const validateAmount = (amount) => {
  if (!amount && amount !== 0) return 'राशि आवश्यक है';
  if (isNaN(amount) || amount < 0) {
    return 'कृपया सही राशि दर्ज करें';
  }
  return null;
};

// Validate name (Hindi/English)
export const validateName = (name) => {
  if (!name || !name.trim()) return 'नाम आवश्यक है';
  if (name.length < 2) return 'नाम कम से कम 2 अक्षर का होना चाहिए';
  if (name.length > 100) return 'नाम 100 अक्षर से अधिक नहीं हो सकता';
  return null;
};

// Validate village name
export const validateVillage = (village) => {
  if (!village || !village.trim()) return 'गाँव का नाम आवश्यक है';
  return null;
};

// Validate year
export const validateYear = (year) => {
  if (!year) return 'वर्ष आवश्यक है';
  const yearNum = parseInt(year);
  if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2099) {
    return 'कृपया सही वर्ष दर्ज करें (2000-2099)';
  }
  return null;
};

// Validate land size
export const validateLandSize = (size) => {
  if (!size && size !== 0) return null;
  if (isNaN(size) || size < 0) {
    return 'कृपया सही भूमि आकार दर्ज करें';
  }
  return null;
};

// Validate rate
export const validateRate = (rate) => {
  if (!rate && rate !== 0) return null;
  if (isNaN(rate) || rate < 0) {
    return 'कृपया सही दर दर्ज करें';
  }
  return null;
};

// Validate notes
export const validateNotes = (notes) => {
  if (!notes) return null;
  if (notes.length > 500) {
    return 'नोट्स 500 अक्षर से अधिक नहीं हो सकते';
  }
  return null;
};
