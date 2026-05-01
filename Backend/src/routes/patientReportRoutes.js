const express = require('express');
const router = express.Router();
const {
  uploadReport,
  getPatientReports,
  getReportById,
  deleteReport,
  searchPatientForReport
} = require('../controllers/patientReportController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// All routes are protected
router.use(authenticateUser);

// POST /api/patient-reports/upload - Upload a report (receptionist, admin, doctor)
router.post('/upload', authorizeRole('receptionist', 'admin', 'doctor'), uploadReport);

// GET /api/patient-reports/search-patient - Search patients for report upload
router.get('/search-patient', searchPatientForReport);

// GET /api/patient-reports/patient/:patientId - Get all reports for a patient
router.get('/patient/:patientId', getPatientReports);

// GET /api/patient-reports/:reportId - Get single report with file data
router.get('/:reportId', getReportById);

// DELETE /api/patient-reports/:reportId - Delete a report (admin only)
router.delete('/:reportId', authorizeRole('admin'), deleteReport);

module.exports = router;
