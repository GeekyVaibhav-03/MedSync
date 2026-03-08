const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  tokenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token',
    required: [true, 'Token ID is required']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor ID is required']
  },
  disease: {
    type: String,
    required: [true, 'Disease/Condition is required'],
    trim: true
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  prescription: {
    type: String,
    trim: true
  },
  medicines: [{
    name: {
      type: String,
      required: true
    },
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  testsRecommended: [{
    testName: {
      type: String,
      required: true
    },
    urgency: {
      type: String,
      enum: ['routine', 'urgent', 'stat'],
      default: 'routine'
    },
    instructions: String
  }],
  healthAdvice: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  followUpDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
diagnosisSchema.index({ tokenId: 1 });
diagnosisSchema.index({ doctorId: 1, createdAt: -1 });

const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);

module.exports = Diagnosis;
