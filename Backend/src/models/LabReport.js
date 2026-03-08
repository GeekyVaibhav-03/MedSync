const mongoose = require('mongoose');

const labReportSchema = new mongoose.Schema({
  tokenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token',
    required: [true, 'Token ID is required']
  },
  testName: {
    type: String,
    required: [true, 'Test name is required'],
    trim: true
  },
  testCategory: {
    type: String,
    enum: ['blood', 'urine', 'imaging', 'pathology', 'microbiology', 'other'],
    default: 'other'
  },
  result: {
    type: String,
    required: [true, 'Test result is required'],
    trim: true
  },
  normalRange: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['normal', 'abnormal', 'critical'],
    default: 'normal'
  },
  remarks: {
    type: String,
    trim: true
  },
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Technician ID is required']
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reportDate: {
    type: Date,
    default: Date.now
  },
  sampleCollectedAt: {
    type: Date
  },
  attachments: [{
    filename: String,
    url: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
labReportSchema.index({ tokenId: 1 });
labReportSchema.index({ technicianId: 1, reportDate: -1 });

const LabReport = mongoose.model('LabReport', labReportSchema);

module.exports = LabReport;
