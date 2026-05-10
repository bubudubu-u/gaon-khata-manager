const { body, validationResult } = require('express-validator');

// Validation rules for registration
exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('नाम आवश्यक है')
    .isLength({ min: 2, max: 50 }).withMessage('नाम 2-50 अक्षर का होना चाहिए'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('ईमेल आवश्यक है')
    .isEmail().withMessage('सही ईमेल दर्ज करें')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('पासवर्ड आवश्यक है')
    .isLength({ min: 6 }).withMessage('पासवर्ड कम से कम 6 अक्षर का होना चाहिए'),
  
  body('village')
    .trim()
    .notEmpty().withMessage('गाँव का नाम आवश्यक है'),
  
  body('phone')
    .trim()
    .matches(/^[0-9]{10}$/).withMessage('सही मोबाइल नंबर दर्ज करें (10 अंक)')
];

// Validation rules for login
exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('ईमेल आवश्यक है')
    .isEmail().withMessage('सही ईमेल दर्ज करें'),
  
  body('password')
    .notEmpty().withMessage('पासवर्ड आवश्यक है')
];

// Validation rules for person
exports.personValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('व्यक्ति का नाम आवश्यक है')
    .isLength({ max: 100 }).withMessage('नाम 100 अक्षर से अधिक नहीं हो सकता'),
  
  body('fatherName')
    .trim()
    .notEmpty().withMessage('पिता का नाम आवश्यक है')
    .isLength({ max: 100 }).withMessage('पिता का नाम 100 अक्षर से अधिक नहीं हो सकता'),
  
  body('village')
    .trim()
    .notEmpty().withMessage('गाँव का नाम आवश्यक है'),
  
  body('mobile')
    .trim()
    .matches(/^[0-9]{10}$/).withMessage('सही मोबाइल नंबर दर्ज करें (10 अंक)')
];

// Validation rules for khata entry
exports.khataValidation = [
  body('person')
    .notEmpty().withMessage('व्यक्ति का चयन करें'),
  
  body('entryType')
    .notEmpty().withMessage('प्रविष्टि प्रकार चुनें')
    .isIn(['charha', 'batai', 'patta', 'bakaya', 'payment', 'other'])
    .withMessage('अमान्य प्रविष्टि प्रकार'),
  
  body('year')
    .notEmpty().withMessage('वर्ष दर्ज करें')
    .isInt({ min: 2000, max: 2099 }).withMessage('सही वर्ष दर्ज करें'),
  
  body('financials.totalAmount')
    .notEmpty().withMessage('कुल राशि दर्ज करें')
    .isNumeric().withMessage('सही राशि दर्ज करें')
    .custom(value => value >= 0).withMessage('राशि 0 से कम नहीं हो सकती')
];

// Check validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};
