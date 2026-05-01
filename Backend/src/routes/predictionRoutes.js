const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const {
  predictDisease,
  getDataset,
  addDiseaseToDataset,
  getSymptomsList,
  searchDiseases,
  getDiseaseDetails,
  suggestMedicines,
  getMedicinesList,
  getTestsList,
  getCategories
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

/**
 * @route   GET /api/predict-disease/search
 * @desc    Auto-suggest diseases as doctor types
 * @access  Private (Doctor, Admin)
 */
router.get('/search', authenticateUser, authorizeRole('doctor', 'admin'), searchDiseases);

/**
 * @route   GET /api/predict-disease/suggest-medicines
 * @desc    Auto-suggest medicines based on disease name
 * @access  Private (Doctor, Admin)
 */
router.get('/suggest-medicines', authenticateUser, authorizeRole('doctor', 'admin'), suggestMedicines);

/**
 * @route   GET /api/predict-disease/medicines
 * @desc    Get list of all medicines for autocomplete
 * @access  Private (Doctor, Admin)
 */
router.get('/medicines', authenticateUser, authorizeRole('doctor', 'admin'), getMedicinesList);

/**
 * @route   GET /api/predict-disease/tests
 * @desc    Get list of all tests for autocomplete
 * @access  Private (Doctor, Admin)
 */
router.get('/tests', authenticateUser, authorizeRole('doctor', 'admin'), getTestsList);

/**
 * @route   GET /api/predict-disease/categories
 * @desc    Get disease categories with count
 * @access  Private (Doctor, Admin)
 */
router.get('/categories', authenticateUser, authorizeRole('doctor', 'admin'), getCategories);

/**
 * @route   GET /api/predict-disease/disease/:identifier
 * @desc    Get full disease details by name or ID
 * @access  Private (Doctor, Admin)
 */
router.get('/disease/:identifier', authenticateUser, authorizeRole('doctor', 'admin'), getDiseaseDetails);

module.exports = router;
