const PharmacyIssue = require('../models/PharmacyIssue');
const Token = require('../models/Token');
const Diagnosis = require('../models/Diagnosis');

/**
 * Issue medicines
 * POST /api/pharmacy/issue
 */
const issueMedicines = async (req, res) => {
  try {
    const { tokenId, medicines, paymentStatus, totalAmount, notes } = req.body;

    // Verify token exists
    const token = await Token.findById(tokenId);
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }

    // Create pharmacy issue
    const pharmacyIssue = await PharmacyIssue.create({
      tokenId,
      medicines,
      issuedBy: req.user._id,
      paymentStatus: paymentStatus || 'pending',
      totalAmount,
      notes
    });

    // Update token status to completed
    await Token.findByIdAndUpdate(tokenId, {
      status: 'completed',
      completedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Medicines issued successfully',
      data: pharmacyIssue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error issuing medicines',
      error: error.message
    });
  }
};

/**
 * Get prescription for a token
 * GET /api/pharmacy/prescription/:tokenId
 */
const getPrescription = async (req, res) => {
  try {
    // Get diagnosis with prescription
    const diagnosis = await Diagnosis.findOne({ tokenId: req.params.tokenId })
      .populate('doctorId', 'name department')
      .select('medicines prescription disease notes');

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Get any previous issues for this token
    const previousIssues = await PharmacyIssue.find({ tokenId: req.params.tokenId })
      .populate('issuedBy', 'name')
      .sort({ issuedDate: -1 });

    res.status(200).json({
      success: true,
      data: {
        prescription: diagnosis,
        previousIssues
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching prescription',
      error: error.message
    });
  }
};

/**
 * Get pending pharmacy tokens
 * GET /api/pharmacy/pending
 */
const getPendingTokens = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get tokens with pharmacy status
    const tokens = await Token.find({
      status: 'pharmacy',
      visitDate: { $gte: today, $lt: tomorrow }
    })
      .populate('patientId', 'name age gender phone')
      .sort({ createdAt: 1 });

    // Get prescription for each token
    const tokensWithPrescription = await Promise.all(
      tokens.map(async (token) => {
        const diagnosis = await Diagnosis.findOne({ tokenId: token._id })
          .select('medicines prescription disease');
        
        return {
          ...token.toObject(),
          prescription: diagnosis
        };
      })
    );

    res.status(200).json({
      success: true,
      count: tokensWithPrescription.length,
      data: tokensWithPrescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending tokens',
      error: error.message
    });
  }
};

/**
 * Get my issued medicines
 * GET /api/pharmacy/my-issues
 */
const getMyIssues = async (req, res) => {
  try {
    const { page = 1, limit = 10, date } = req.query;

    const query = { issuedBy: req.user._id };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.issuedDate = { $gte: startDate, $lte: endDate };
    }

    const issues = await PharmacyIssue.find(query)
      .populate({
        path: 'tokenId',
        populate: { path: 'patientId', select: 'name age gender' }
      })
      .sort({ issuedDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await PharmacyIssue.countDocuments(query);

    res.status(200).json({
      success: true,
      count: issues.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: issues
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching issues',
      error: error.message
    });
  }
};

/**
 * Update pharmacy issue payment status
 * PUT /api/pharmacy/payment/:id
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, totalAmount } = req.body;

    const issue = await PharmacyIssue.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, totalAmount },
      { new: true, runValidators: true }
    );

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy issue not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated',
      data: issue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

module.exports = {
  issueMedicines,
  getPrescription,
  getPendingTokens,
  getMyIssues,
  updatePaymentStatus
};
