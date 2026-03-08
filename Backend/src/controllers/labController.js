const LabReport = require('../models/LabReport');
const Token = require('../models/Token');
const Diagnosis = require('../models/Diagnosis');

/**
 * Add lab report
 * POST /api/lab/report
 */
const addLabReport = async (req, res) => {
  try {
    const {
      tokenId,
      testName,
      testCategory,
      result,
      normalRange,
      unit,
      status,
      remarks,
      sampleCollectedAt
    } = req.body;

    // Verify token exists
    const token = await Token.findById(tokenId);
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }

    // Create lab report
    const labReport = await LabReport.create({
      tokenId,
      testName,
      testCategory,
      result,
      normalRange,
      unit,
      status: status || 'normal',
      remarks,
      technicianId: req.user._id,
      sampleCollectedAt
    });

    res.status(201).json({
      success: true,
      message: 'Lab report added successfully',
      data: labReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding lab report',
      error: error.message
    });
  }
};

/**
 * Get tests for a token
 * GET /api/lab/tests/:tokenId
 */
const getTestsByToken = async (req, res) => {
  try {
    const labReports = await LabReport.find({ tokenId: req.params.tokenId })
      .populate('technicianId', 'name')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 });

    // Get recommended tests from diagnosis
    const diagnosis = await Diagnosis.findOne({ tokenId: req.params.tokenId })
      .select('testsRecommended');

    res.status(200).json({
      success: true,
      count: labReports.length,
      data: {
        reports: labReports,
        recommendedTests: diagnosis?.testsRecommended || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lab reports',
      error: error.message
    });
  }
};

/**
 * Get pending lab tests
 * GET /api/lab/pending
 */
const getPendingTests = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get tokens with lab status
    const tokens = await Token.find({
      status: 'lab',
      visitDate: { $gte: today, $lt: tomorrow }
    })
      .populate('patientId', 'name age gender phone')
      .sort({ createdAt: 1 });

    // Get recommended tests for each token
    const tokensWithTests = await Promise.all(
      tokens.map(async (token) => {
        const diagnosis = await Diagnosis.findOne({ tokenId: token._id })
          .select('testsRecommended');
        const completedReports = await LabReport.find({ tokenId: token._id })
          .select('testName');
        
        return {
          ...token.toObject(),
          recommendedTests: diagnosis?.testsRecommended || [],
          completedTests: completedReports.map(r => r.testName)
        };
      })
    );

    res.status(200).json({
      success: true,
      count: tokensWithTests.length,
      data: tokensWithTests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending tests',
      error: error.message
    });
  }
};

/**
 * Complete lab tests and move to pharmacy
 * POST /api/lab/complete/:tokenId
 */
const completeLabTests = async (req, res) => {
  try {
    const token = await Token.findByIdAndUpdate(
      req.params.tokenId,
      { status: 'pharmacy' },
      { new: true }
    );

    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lab tests completed, token moved to pharmacy',
      data: token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing lab tests',
      error: error.message
    });
  }
};

/**
 * Get my lab reports
 * GET /api/lab/my-reports
 */
const getMyReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, date } = req.query;

    const query = { technicianId: req.user._id };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.reportDate = { $gte: startDate, $lte: endDate };
    }

    const reports = await LabReport.find(query)
      .populate({
        path: 'tokenId',
        populate: { path: 'patientId', select: 'name age gender' }
      })
      .sort({ reportDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await LabReport.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message
    });
  }
};

module.exports = {
  addLabReport,
  getTestsByToken,
  getPendingTests,
  completeLabTests,
  getMyReports
};
