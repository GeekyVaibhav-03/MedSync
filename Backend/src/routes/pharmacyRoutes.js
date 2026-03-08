const express = require('express');
const router = express.Router();
const {
  issueMedicines,
  getPrescription,
  getPendingTokens,
  getMyIssues,
  updatePaymentStatus
} = require('../controllers/pharmacyController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// All routes are protected and require pharmacy role
router.use(authenticateUser);
router.use(authorizeRole('pharmacy', 'admin'));

router.post('/issue', issueMedicines);
router.get('/pending', getPendingTokens);
router.get('/my-issues', getMyIssues);
router.get('/prescription/:tokenId', getPrescription);
router.put('/payment/:id', updatePaymentStatus);

module.exports = router;
