const express = require('express');
const router = express.Router();
const {
  addLabReport,
  getTestsByToken,
  getPendingTests,
  completeLabTests,
  getMyReports,
  getLabCatalog,
  uploadLabReportFile
} = require('../controllers/labController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// All routes are protected
router.use(authenticateUser);

// Routes accessible by any authenticated user (doctor, lab, etc.)
router.get('/catalog', getLabCatalog);

// Routes requiring lab role
router.use(authorizeRole('lab', 'admin'));
router.post('/upload', uploadLabReportFile);
router.post('/report', addLabReport);
router.get('/pending', getPendingTests);
router.get('/my-reports', getMyReports);
router.get('/tests/:tokenId', getTestsByToken);
router.post('/complete/:tokenId', completeLabTests);

module.exports = router;
