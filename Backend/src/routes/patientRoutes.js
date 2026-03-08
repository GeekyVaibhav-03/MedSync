const express = require('express');
const router = express.Router();
const {
  registerPatient,
  getPatientById,
  getAllPatients,
  updatePatient,
  deletePatient,
  getPatientHistory,
  searchPatients
} = require('../controllers/patientController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// All routes are protected
router.use(authenticateUser);

// POST /api/patient/register - Register new patient (receptionist, admin)
router.post('/register', authorizeRole('receptionist', 'admin', 'doctor'), registerPatient);

// GET /api/patient/search - Search patients
router.get('/search', searchPatients);

// GET /api/patient/history/:patientId - Get patient visit history
router.get('/history/:patientId', getPatientHistory);

// GET /api/patient - Get all patients
router.get('/', getAllPatients);

// GET /api/patient/:id - Get patient by ID
router.get('/:id', getPatientById);

// PUT /api/patient/:id - Update patient (receptionist, admin)
router.put('/:id', authorizeRole('receptionist', 'admin'), updatePatient);

// DELETE /api/patient/:id - Delete patient (admin only)
router.delete('/:id', authorizeRole('admin'), deletePatient);

module.exports = router;
