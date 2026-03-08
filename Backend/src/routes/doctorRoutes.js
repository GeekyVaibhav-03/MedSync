const express = require('express');
const router = express.Router();
const {
  addDiagnosis,
  getDiagnosisHistory,
  getMyDiagnoses,
  updateDiagnosis,
  getWaitingPatients
} = require('../controllers/doctorController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// All routes are protected and require doctor role
router.use(authenticateUser);
router.use(authorizeRole('doctor', 'admin'));

// POST /api/doctor/diagnosis - Add diagnosis for a token
router.post('/diagnosis', addDiagnosis);

// POST /api/doctor/consultation - Alias for diagnosis (as per requirements)
router.post('/consultation', addDiagnosis);

// GET /api/doctor/waiting - Get waiting patients
router.get('/waiting', getWaitingPatients);

// GET /api/doctor/my-diagnoses - Get all diagnoses by doctor
router.get('/my-diagnoses', getMyDiagnoses);

// GET /api/doctor/history/:tokenId - Get diagnosis history for a token
router.get('/history/:tokenId', getDiagnosisHistory);

// PUT /api/doctor/diagnosis/:id - Update diagnosis
router.put('/diagnosis/:id', updateDiagnosis);

module.exports = router;
