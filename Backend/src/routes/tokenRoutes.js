const express = require('express');
const router = express.Router();
const {
  generateToken,
  getTokenQueue,
  getTokenById,
  updateTokenStatus,
  getTokensByPatient
} = require('../controllers/tokenController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// All routes are protected
router.use(authenticateUser);

// POST /api/token/generate - Generate new token (receptionist, admin)
router.post('/generate', authorizeRole('receptionist', 'admin'), generateToken);

// GET /api/token/queue - Get token queue
router.get('/queue', getTokenQueue);

// GET /api/token/patient/:patientId - Get tokens by patient
router.get('/patient/:patientId', getTokensByPatient);

// GET /api/token/:tokenId - Get token by ID
router.get('/:tokenId', getTokenById);

// PUT /api/token/:tokenId/status - Update token status
router.put('/:tokenId/status', updateTokenStatus);

module.exports = router;
