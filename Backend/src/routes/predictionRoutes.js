const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const {
  predictDisease,
  getDataset,
  addDiseaseToDataset,
  getSymptomsList
} = require('../controllers/predictionController');

/**
 * @route   POST /api/predict-disease
 * @desc    AI-like disease prediction based on symptoms
 * @access  Private (Doctor, Admin)
 */
router.post('/', authenticateUser, authorizeRole('doctor', 'admin'), predictDisease);

/**
 * @route   GET /api/predict-disease/dataset
 * @desc    Get all diseases in dataset
 * @access  Private (Doctor, Admin)
 */
router.get('/dataset', authenticateUser, authorizeRole('doctor', 'admin'), getDataset);

/**
 * @route   POST /api/predict-disease/dataset
 * @desc    Add new disease to dataset
 * @access  Private (Admin only)
 */
router.post('/dataset', authenticateUser, authorizeRole('admin'), addDiseaseToDataset);

/**
 * @route   GET /api/predict-disease/symptoms
 * @desc    Get list of all symptoms for autocomplete
 * @access  Private (Doctor, Admin)
 */
router.get('/symptoms', authenticateUser, authorizeRole('doctor', 'admin'), getSymptomsList);

module.exports = router;
