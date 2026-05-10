const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'CREATE_PERSON', 'UPDATE_PERSON', 'DELETE_PERSON',
      'CREATE_KHATA', 'UPDATE_KHATA', 'DELETE_KHATA',
      'LOGIN', 'LOGOUT', 'EXPORT_DATA', 'BACKUP',
      'PAYMENT_RECEIVED', 'DOCUMENT_UPLOAD'
    ]
  },
  entity: {
    type: String,
    required: true
  },
  entityId: {
    type: mongoose.Schema.ObjectId
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
ActivityLogSchema.index({ user: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
