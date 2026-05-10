const Person = require('../models/Person');
const KhataEntry = require('../models/Khata');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all persons
// @route   GET /api/persons
exports.getPersons = async (req, res) => {
  try {
    const { search, village, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    
    let query = { user: req.user.id, isActive: true };
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } },
        { village: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Village filter
    if (village) {
      query.village = village;
    }
    
    const total = await Person.countDocuments(query);
    
    const persons = await Person.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    // Get pending amounts for each person
    const personsWithBalance = await Promise.all(
      persons.map(async (person) => {
        const pendingEntries = await KhataEntry.aggregate([
          {
            $match: {
              person: person._id,
              user: req.user.id,
              isDeleted: false,
              status: { $in: ['pending', 'partial'] }
            }
          },
          {
            $group: {
              _id: null,
              totalPending: { $sum: '$financials.remainingAmount' }
            }
          }
        ]);
        
        return {
          ...person.toObject(),
          totalPending: pendingEntries[0]?.totalPending || 0
        };
      })
    );
    
    res.json({
      success: true,
      count: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: personsWithBalance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'व्यक्तियों की सूची प्राप्त करने में त्रुटि'
    });
  }
};

// @desc    Get single person
// @route   GET /api/persons/:id
exports.getPerson = async (req, res) => {
  try {
    const person = await Person.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!person) {
      return res.status(404).json({
        success: false,
        error: 'व्यक्ति नहीं मिला'
      });
    }
    
    // Get person's khata entries summary
    const khataSummary = await KhataEntry.aggregate([
      {
        $match: {
          person: person._id,
          user: req.user.id,
          isDeleted: false
        }
      },
      {
        $group: {
          _id: '$entryType',
          totalEntries: { $sum: 1 },
          totalAmount: { $sum: '$financials.totalAmount' },
          totalPaid: { $sum: '$financials.paidAmount' },
          totalPending: { $sum: '$financials.remainingAmount' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        person,
        khataSummary
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'व्यक्ति विवरण प्राप्त करने में त्रुटि'
    });
  }
};

// @desc    Create person
// @route   POST /api/persons
exports.createPerson = async (req, res) => {
  try {
    req.body.user = req.user.id;
    
    const person = await Person.create(req.body);
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'CREATE_PERSON',
      entity: 'Person',
      entityId: person._id,
      description: `Created person: ${person.name}`,
      metadata: person.toObject(),
      ipAddress: req.ip
    });
    
    res.status(201).json({
      success: true,
      data: person
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'यह व्यक्ति पहले से मौजूद है'
      });
    }
    
    res.status(500).json({
      success: false,
      error: err.message || 'व्यक्ति बनाने में त्रुटि'
    });
  }
};

// @desc    Update person
// @route   PUT /api/persons/:id
exports.updatePerson = async (req, res) => {
  try {
    const person = await Person.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!person) {
      return res.status(404).json({
        success: false,
        error: 'व्यक्ति नहीं मिला'
      });
    }
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'UPDATE_PERSON',
      entity: 'Person',
      entityId: person._id,
      description: `Updated person: ${person.name}`,
      ipAddress: req.ip
    });
    
    res.json({
      success: true,
      data: person
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'व्यक्ति अपडेट करने में त्रुटि'
    });
  }
};

// @desc    Delete person
// @route   DELETE /api/persons/:id
exports.deletePerson = async (req, res) => {
  try {
    // Soft delete - check if person has active khata entries
    const hasActiveEntries = await KhataEntry.exists({
      person: req.params.id,
      status: { $in: ['pending', 'partial'] }
    });
    
    if (hasActiveEntries) {
      return res.status(400).json({
        success: false,
        error: 'इस व्यक्ति के पास लंबित हिसाब है, पहले उन्हें निपटाएं'
      });
    }
    
    const person = await Person.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isActive: false },
      { new: true }
    );
    
    if (!person) {
      return res.status(404).json({
        success: false,
        error: 'व्यक्ति नहीं मिला'
      });
    }
    
    await ActivityLog.create({
      user: req.user.id,
      action: 'DELETE_PERSON',
      entity: 'Person',
      entityId: person._id,
      description: `Deleted person: ${person.name}`,
      ipAddress: req.ip
    });
    
    res.json({
      success: true,
      message: 'व्यक्ति सफलतापूर्वक हटाया गया'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'व्यक्ति हटाने में त्रुटि'
    });
  }
};

// @desc    Upload person photo
// @route   POST /api/persons/:id/photo
exports.uploadPersonPhoto = async (req, res) => {
  try {
    const person = await Person.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!person) {
      return res.status(404).json({
        success: false,
        error: 'व्यक्ति नहीं मिला'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'कृपया फोटो अपलोड करें'
      });
    }
    
    person.photo = req.file.path;
    await person.save();
    
    res.json({
      success: true,
      data: person
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'फोटो अपलोड करने में त्रुटि'
    });
  }
};
