const express = require('express');
const router = express.Router();
const { generatePrescriptionPdf } = require('../controllers/prescriptionController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser);

// GET /api/prescription/pdf/:tokenId - Generate or fetch prescription PDF URL
router.get('/pdf/:tokenId', generatePrescriptionPdf);

module.exports = router;
