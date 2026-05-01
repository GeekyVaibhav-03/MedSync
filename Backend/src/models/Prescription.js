const mongoose = require('mongoose');

const { Schema } = mongoose;

// Sub-schema for individual lab reports
const LabReportSchema = new Schema({
  testName: { type: String, trim: true },
  result: { type: String, trim: true },
  normalRange: { type: String, trim: true },
  remarks: { type: String, trim: true },
  reportFileUrl: { type: String, trim: true }, // store URL only
  technicianId: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

// Sub-schema for pharmacy medicine line items
const PharmacyMedicineSchema = new Schema({
  name: { type: String, trim: true },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 }
}, { _id: false });

// Main Prescription schema
const PrescriptionSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'patientId is required']
  },
  tokenId: {
    type: Schema.Types.ObjectId,
    ref: 'Token',
    required: [true, 'tokenId is required']
  },

  // Doctor data (embedded)
  doctorData: {
    diagnosis: { type: String, trim: true },
    symptoms: [{ type: String, trim: true }],
    medicines: [{ type: String, trim: true }],
    testsRecommended: [{ type: String, trim: true }],
    notes: { type: String, trim: true },
    notepadImageUrl: { type: String, trim: true }, // URL reference
    doctorId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  },

  // Lab reports array
  labReports: {
    type: [LabReportSchema],
    default: []
  },

  // Pharmacy data (embedded)
  pharmacyData: {
    medicinesIssued: {
      type: [PharmacyMedicineSchema],
      default: []
    },
    totalAmount: { type: Number, default: 0 },
    notes: { type: String, trim: true },
    pharmacistId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  },

  // Status of the prescription/workflow
  status: {
    type: String,
    enum: ['doctor', 'lab', 'pharmacy', 'completed'],
    default: 'doctor'
  },

  // Optional PDF export URL
  pdfUrl: { type: String, trim: true }

}, {
  timestamps: true
});

// Indexes for faster lookups by patient or token
PrescriptionSchema.index({ patientId: 1 });
PrescriptionSchema.index({ tokenId: 1 });

const Prescription = mongoose.model('Prescription', PrescriptionSchema);

module.exports = Prescription;
