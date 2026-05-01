const express = require('express');
const router = express.Router();
const {
  getPatientTrends,
  getDepartmentLoad,
  getDiseaseStats,
  getDashboardSummary,
  getDiseaseTrends,
  getMedicineUsage,
  getAreaDiseaseDistribution,
  getDoctorPerformance,
  getPeakHours,
  getPatientFlow,
  getLabAnalytics
} = require('../controllers/analyticsController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(authenticateUser);
router.use(authorizeRole('admin'));

// Dashboard and summary
router.get('/dashboard', getDashboardSummary);

// Patient analytics
router.get('/patient-trends', getPatientTrends);
router.get('/patient-flow', getPatientFlow);

// Department and load analytics
router.get('/department-load', getDepartmentLoad);
router.get('/peak-hours', getPeakHours);

// Disease analytics
router.get('/disease-stats', getDiseaseStats);
router.get('/disease-trends', getDiseaseTrends);
router.get('/area-disease-distribution', getAreaDiseaseDistribution);

// Medicine analytics
router.get('/medicine-usage', getMedicineUsage);

// Doctor performance
router.get('/doctor-performance', getDoctorPerformance);

// Lab analytics
router.get('/lab-analytics', getLabAnalytics);

module.exports = router;
