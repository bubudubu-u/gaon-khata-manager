const KhataEntry = require('../models/Khata');
const ActivityLog = require('../models/ActivityLog');
const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');

// @desc    Get all khata entries
// @route   GET /api/khata
exports.getKhataEntries = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      year, 
      entryType, 
      status, 
      personId,
      village,
      startDate,
      endDate,
      sort = '-date' 
    } = req.query;
    
    let query = { user: req.user.id, isDeleted: false };
    
    if (year) query.year = parseInt(year);
    if (entryType) query.entryType = entryType;
    if (status) query.status = status;
    if (personId) query.person = personId;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const total = await KhataEntry.countDocuments(query);
    
    const entries = await KhataEntry.find(query)
      .populate('person', 'name fatherName village mobile')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      count: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: entries
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'हिसाब प्रविष्टियाँ प्राप्त करने में त्रुटि'
    });
  }
};

// @desc    Get single khata entry
// @route   GET /api/khata/:id
exports.getKhataEntry = async (req, res) => {
  try {
    const entry = await KhataEntry.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('person', 'name fatherName village mobile');
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'हिसाब प्रविष्टि नहीं मिली'
      });
    }
    
    res.json({
      success: true,
      data: entry
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'प्रविष्टि प्राप्त करने में त्रुटि'
    });
  }
};

// @desc    Create khata entry
// @route   POST /api/khata
exports.createKhataEntry = async (req, res) => {
  try {
    req.body.user = req.user.id;
    
    const entry = await KhataEntry.create(req.body);
    
    const populatedEntry = await KhataEntry.findById(entry._id)
      .populate('person', 'name fatherName village');
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'CREATE_KHATA',
      entity: 'KhataEntry',
      entityId: entry._id,
      description: `Created ${entry.entryType} entry for ${populatedEntry.person.name}`,
      metadata: entry.toObject(),
      ipAddress: req.ip
    });
    
    res.status(201).json({
      success: true,
      data: populatedEntry
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'हिसाब प्रविष्टि बनाने में त्रुटि'
    });
  }
};

// @desc    Update khata entry
// @route   PUT /api/khata/:id
exports.updateKhataEntry = async (req, res) => {
  try {
    let entry = await KhataEntry.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'हिसाब प्रविष्टि नहीं मिली'
      });
    }
    
    entry = await KhataEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('person', 'name fatherName');
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'UPDATE_KHATA',
      entity: 'KhataEntry',
      entityId: entry._id,
      description: `Updated ${entry.entryType} entry`,
      ipAddress: req.ip
    });
    
    res.json({
      success: true,
      data: entry
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'प्रविष्टि अपडेट करने में त्रुटि'
    });
  }
};

// @desc    Delete khata entry
// @route   DELETE /api/khata/:id
exports.deleteKhataEntry = async (req, res) => {
  try {
    const entry = await KhataEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isDeleted: true },
      { new: true }
    );
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'हिसाब प्रविष्टि नहीं मिली'
      });
    }
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'DELETE_KHATA',
      entity: 'KhataEntry',
      entityId: entry._id,
      description: `Deleted ${entry.entryType} entry`,
      ipAddress: req.ip
    });
    
    res.json({
      success: true,
      message: 'हिसाब प्रविष्टि सफलतापूर्वक हटाई गई'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'प्रविष्टि हटाने में त्रुटि'
    });
  }
};

// @desc    Record payment
// @route   POST /api/khata/:id/payment
exports.recordPayment = async (req, res) => {
  try {
    const { amount, paymentMode, date, notes } = req.body;
    
    let entry = await KhataEntry.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'हिसाब प्रविष्टि नहीं मिली'
      });
    }
    
    // Update paid amount
    entry.financials.paidAmount += amount;
    if (paymentMode) entry.financials.paymentMode = paymentMode;
    if (notes) entry.description = entry.description 
      ? `${entry.description}\nPayment (${date}): ${notes}` 
      : `Payment (${date}): ${notes}`;
    
    await entry.save();
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'PAYMENT_RECEIVED',
      entity: 'KhataEntry',
      entityId: entry._id,
      description: `Payment of ₹${amount} received`,
      metadata: { amount, paymentMode, date },
      ipAddress: req.ip
    });
    
    res.json({
      success: true,
      data: entry
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'भुगतान दर्ज करने में त्रुटि'
    });
  }
};

// @desc    Upload attachment
// @route   POST /api/khata/:id/attachment
exports.uploadAttachment = async (req, res) => {
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
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'कृपया फाइल अपलोड करें'
      });
    }
    
    entry.attachments.push({
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
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
      error: 'फाइल अपलोड करने में त्रुटि'
    });
  }
};

// @desc    Export to PDF
// @route   GET /api/khata/export/pdf
exports.exportPDF = async (req, res) => {
  try {
    const { year, personId, entryType } = req.query;
    
    let query = { user: req.user.id, isDeleted: false };
    if (year) query.year = parseInt(year);
    if (personId) query.person = personId;
    if (entryType) query.entryType = entryType;
    
    const entries = await KhataEntry.find(query)
      .populate('person', 'name fatherName village')
      .sort('-date');
    
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=khata-report.pdf');
    
    doc.pipe(res);
    
    // Add content to PDF
    doc.fontSize(20).text('Gaon Khata Manager', { align: 'center' });
    doc.fontSize(14).text('Land Khata Report', { align: 'center' });
    doc.moveDown();
    
    // Add summary
    const totalAmount = entries.reduce((sum, e) => sum + e.financials.totalAmount, 0);
    const totalPaid = entries.reduce((sum, e) => sum + e.financials.paidAmount, 0);
    const totalPending = entries.reduce((sum, e) => sum + e.financials.remainingAmount, 0);
    
    doc.fontSize(12).text(`Total Entries: ${entries.length}`);
    doc.text(`Total Amount: ₹${totalAmount.toLocaleString('hi-IN')}`);
    doc.text(`Total Paid: ₹${totalPaid.toLocaleString('hi-IN')}`);
    doc.text(`Total Pending: ₹${totalPending.toLocaleString('hi-IN')}`);
    doc.moveDown();
    
    // Table header
    doc.fontSize(10);
    // ... Add table with entries data
    
    doc.end();
    
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'PDF निर्यात करने में त्रुटि'
    });
  }
};

// @desc    Export to Excel
// @route   GET /api/khata/export/excel
exports.exportExcel = async (req, res) => {
  try {
    const { year, personId, entryType } = req.query;
    
    let query = { user: req.user.id, isDeleted: false };
    if (year) query.year = parseInt(year);
    if (personId) query.person = personId;
    if (entryType) query.entryType = entryType;
    
    const entries = await KhataEntry.find(query)
      .populate('person', 'name fatherName village')
      .lean();
    
    // Format data for Excel
    const excelData = entries.map(e => ({
      'Date': new Date(e.date).toLocaleDateString(),
      'Receipt No': e.receiptNumber,
      'Person Name': e.person.name,
      'Father Name': e.person.fatherName,
      'Village': e.person.village,
      'Entry Type': e.entryType,
      'Year': e.year,
      'Land Size': e.landDetails.size,
      'Total Amount': e.financials.totalAmount,
      'Paid Amount': e.financials.paidAmount,
      'Remaining': e.financials.remainingAmount,
      'Status': e.status
    }));
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Add summary
    const summary = [
      ['Total Entries', entries.length],
      ['Total Amount', entries.reduce((s, e) => s + e.financials.totalAmount, 0)],
      ['Total Paid', entries.reduce((s, e) => s + e.financials.paidAmount, 0)],
      ['Total Pending', entries.reduce((s, e) => s + e.financials.remainingAmount, 0)]
    ];
    
    XLSX.utils.sheet_add_json(ws, summary, { skipHeader: true, origin: -1 });
    XLSX.utils.book_append_sheet(wb, ws, 'Khata Entries');
    
    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=khata-export.xlsx');
    
    res.send(buffer);
    
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Excel निर्यात करने में त्रुटि'
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/khata/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();
    
    const [
      totalPersons,
      totalEntries,
      pendingEntries,
      completedEntries,
      financialSummary,
      villageWise,
      typeWise,
      monthlyStats,
      recentPayments
    ] = await Promise.all([
      require('../models/Person').countDocuments({ 
        user: req.user.id, 
        isActive: true 
      }),
      
      KhataEntry.countDocuments({ 
        user: req.user.id, 
        isDeleted: false,
        ...(year && { year: parseInt(year) })
      }),
      
      KhataEntry.countDocuments({ 
        user: req.user.id, 
        status: { $in: ['pending', 'partial'] },
        isDeleted: false 
      }),
      
      KhataEntry.countDocuments({ 
        user: req.user.id, 
        status: 'completed',
        isDeleted: false 
      }),
      
      KhataEntry.aggregate([
        {
          $match: { 
            user: req.user.id, 
            isDeleted: false,
            ...(year && { year: parseInt(year) })
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$financials.totalAmount' },
            totalPaid: { $sum: '$financials.paidAmount' },
            totalPending: { $sum: '$financials.remainingAmount' },
            totalDiscount: { $sum: '$financials.discount' }
          }
        }
      ]),
      
      KhataEntry.aggregate([
        { $match: { user: req.user.id, isDeleted: false } },
        {
          $lookup: {
            from: 'people',
            localField: 'person',
            foreignField: '_id',
            as: 'person'
          }
        },
        { $unwind: '$person' },
        {
          $group: {
            _id: '$person.village',
            count: { $sum: 1 },
            totalAmount: { $sum: '$financials.totalAmount' },
            totalPending: { $sum: '$financials.remainingAmount' }
          }
        }
      ]),
      
      KhataEntry.aggregate([
        { $match: { user: req.user.id, isDeleted: false } },
        {
          $group: {
            _id: '$entryType',
            count: { $sum: 1 },
            totalAmount: { $sum: '$financials.totalAmount' }
          }
        }
      ]),
      
      KhataEntry.aggregate([
        { 
          $match: { 
            user: req.user.id, 
            isDeleted: false,
            year: currentYear
          } 
        },
        {
          $group: {
            _id: { $month: '$date' },
            totalAmount: { $sum: '$financials.totalAmount' },
            totalPaid: { $sum: '$financials.paidAmount' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      
      KhataEntry.find({ 
        user: req.user.id, 
        'financials.paidAmount': { $gt: 0 },
        isDeleted: false 
      })
        .sort('-updatedAt')
        .limit(10)
        .populate('person', 'name')
        .select('financials.paidAmount date person')
    ]);
    
    res.json({
      success: true,
      data: {
        counts: {
          totalPersons,
          totalEntries,
          pendingEntries,
          completedEntries
        },
        financials: financialSummary[0] || {
          totalAmount: 0,
          totalPaid: 0,
          totalPending: 0,
          totalDiscount: 0
        },
        villageWise,
        typeWise,
        monthlyStats,
        recentPayments
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'डैशबोर्ड डेटा प्राप्त करने में त्रुटि'
    });
  }
};
