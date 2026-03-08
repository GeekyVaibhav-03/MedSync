const mongoose = require('mongoose');

const medicalDatasetSchema = new mongoose.Schema({
  disease: {
    type: String,
    required: [true, 'Disease name is required'],
    unique: true,
    trim: true
  },
  symptoms: [{
    type: String,
    required: true,
    trim: true,
    lowercase: true
  }],
  recommendedTests: [{
    type: String,
    trim: true
  }],
  recommendedMedicines: [{
    type: String,
    trim: true
  }],
  healthAdvice: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['infectious', 'chronic', 'respiratory', 'cardiovascular', 'neurological', 'gastrointestinal', 'musculoskeletal', 'dermatological', 'other'],
    default: 'other'
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe'],
    default: 'moderate'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster symptom search
medicalDatasetSchema.index({ symptoms: 1 });
medicalDatasetSchema.index({ disease: 'text' });

const MedicalDataset = mongoose.model('MedicalDataset', medicalDatasetSchema);

module.exports = MedicalDataset;
