const express = require('express');
const router = express.Router();
const {
  addLabReport,
  getTestsByToken,
  getPendingTests,
  completeLabTests,
  getMyReports
} = require('../controllers/labController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// All routes are protected and require lab role
router.use(authenticateUser);
router.use(authorizeRole('lab', 'admin'));

router.post('/report', addLabReport);
router.get('/pending', getPendingTests);
router.get('/my-reports', getMyReports);
router.get('/tests/:tokenId', getTestsByToken);
router.post('/complete/:tokenId', completeLabTests);

module.exports = router;
