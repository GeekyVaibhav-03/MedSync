const mongoose = require('mongoose');

const patientReportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  tokenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token'
  },
  reportType: {
    type: String,
    enum: ['lab_report', 'prescription', 'xray', 'mri', 'ct_scan', 'ultrasound', 'ecg', 'blood_test', 'other'],
    default: 'other'
  },
  title: {
    type: String,
    required: [true, 'Report title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  reportDate: {
    type: Date,
    default: Date.now
  },
  fileData: {
    type: String  // Base64 encoded file data
  },
  fileName: {
    type: String,
    trim: true
  },
  fileType: {
    type: String,
    trim: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader ID is required']
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
patientReportSchema.index({ patientId: 1, createdAt: -1 });
patientReportSchema.index({ tokenId: 1 });

const PatientReport = mongoose.model('PatientReport', patientReportSchema);

module.exports = PatientReport;
