const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories
const createUploadDirs = () => {
  const dirs = ['uploads/photos', 'uploads/documents', 'uploads/voice'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let folder = 'uploads/documents';
    
    if (file.fieldname === 'photo') {
      folder = 'uploads/photos';
    } else if (file.fieldname === 'voiceNote') {
      folder = 'uploads/voice';
    }
    
    cb(null, folder);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const allowedDocTypes = [...allowedImageTypes, 'application/pdf'];
  const allowedVoiceTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm'];
  
  if (file.fieldname === 'photo' && allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === 'document' && allowedDocTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === 'voiceNote' && allowedVoiceTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Export multer instances
exports.uploadPhoto = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
}).single('photo');

exports.uploadDocument = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter
}).single('document');

exports.uploadMultiple = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter
}).array('files', 5);

exports.uploadVoiceNote = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: fileFilter
}).single('voiceNote');
