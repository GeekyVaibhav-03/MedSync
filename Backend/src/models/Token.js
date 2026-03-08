const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  tokenNumber: {
    type: String,
    unique: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  visitDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['waiting', 'doctor', 'lab', 'pharmacy', 'completed'],
    default: 'waiting'
  },
  priority: {
    type: String,
    enum: ['normal', 'urgent', 'emergency'],
    default: 'normal'
  },
  symptoms: {
    type: String,
    trim: true
  },
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique token number before validation
// Format: HMS-YYYY-0001
tokenSchema.pre('validate', async function(next) {
  if (this.isNew && !this.tokenNumber) {
    const today = new Date();
    const year = today.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    
    const count = await mongoose.model('Token').countDocuments({
      createdAt: {
        $gte: startOfYear,
        $lt: endOfYear
      }
    });
    this.tokenNumber = `HMS-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Index for faster queries
tokenSchema.index({ status: 1, visitDate: -1 });
tokenSchema.index({ patientId: 1 });

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
