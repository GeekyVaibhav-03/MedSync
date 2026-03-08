// Export all models from a single file
const User = require('./User');
const Patient = require('./Patient');
const Token = require('./Token');
const Diagnosis = require('./Diagnosis');
const LabReport = require('./LabReport');
const PharmacyIssue = require('./PharmacyIssue');
const MedicalDataset = require('./MedicalDataset');

module.exports = {
  User,
  Patient,
  Token,
  Diagnosis,
  LabReport,
  PharmacyIssue,
  MedicalDataset
};
