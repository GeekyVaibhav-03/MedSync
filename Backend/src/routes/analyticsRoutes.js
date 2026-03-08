const express = require('express');
const router = express.Router();
const {
  getPatientTrends,
  getDepartmentLoad,
  getDiseaseStats,
  getDashboardSummary,
  getDiseaseTrends,
  getMedicineUsage,
  getAreaDiseaseDistribution
} = require('../controllers/analyticsController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(authenticateUser);
router.use(authorizeRole('admin'));

router.get('/dashboard', getDashboardSummary);
router.get('/patient-trends', getPatientTrends);
router.get('/department-load', getDepartmentLoad);
router.get('/disease-stats', getDiseaseStats);
router.get('/disease-trends', getDiseaseTrends);
router.get('/medicine-usage', getMedicineUsage);
router.get('/area-disease-distribution', getAreaDiseaseDistribution);

module.exports = router;
