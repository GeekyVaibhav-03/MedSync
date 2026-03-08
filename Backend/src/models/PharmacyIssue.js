const mongoose = require('mongoose');

const pharmacyIssueSchema = new mongoose.Schema({
  tokenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token',
    required: [true, 'Token ID is required']
  },
  medicines: [{
    medicineName: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
    batchNumber: String,
    expiryDate: Date
  }],
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Pharmacist ID is required']
  },
  issuedDate: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'insurance', 'waived'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    default: 0
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
pharmacyIssueSchema.index({ tokenId: 1 });
pharmacyIssueSchema.index({ issuedBy: 1, issuedDate: -1 });

const PharmacyIssue = mongoose.model('PharmacyIssue', pharmacyIssueSchema);

module.exports = PharmacyIssue;
