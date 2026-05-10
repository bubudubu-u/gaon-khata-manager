const express = require('express');
const router = express.Router();
const {
  getKhataEntries,
  getKhataEntry,
  createKhataEntry,
  updateKhataEntry,
  deleteKhataEntry,
  recordPayment,
  uploadAttachment,
  exportPDF,
  exportExcel,
  getDashboardStats
} = require('../controllers/khataController');
const { protect } = require('../middleware/auth');
const { uploadDocument, uploadVoiceNote } = require('../middleware/upload');

router.use(protect);

router.route('/')
  .get(getKhataEntries)
  .post(createKhataEntry);

router.get('/dashboard', getDashboardStats);
router.get('/export/pdf', exportPDF);
router.get('/export/excel', exportExcel);

router.route('/:id')
  .get(getKhataEntry)
  .put(updateKhataEntry)
  .delete(deleteKhataEntry);

router.post('/:id/payment', recordPayment);
router.post('/:id/attachment', uploadDocument, uploadAttachment);
router.post('/:id/voice-note', uploadVoiceNote, async (req, res) => {
  try {
    const entry = await KhataEntry.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'हिसाब प्रविष्टि नहीं मिली'
      });
    }
    
    entry.voiceNotes.push({
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      duration: req.body.duration || 0,
      uploadDate: new Date()
    });
    
    await entry.save();
    
    res.json({
      success: true,
      data: entry
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'वॉइस नोट अपलोड करने में त्रुटि'
    });
  }
});

module.exports = router;
