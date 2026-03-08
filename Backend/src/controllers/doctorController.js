const Diagnosis = require('../models/Diagnosis');
const Token = require('../models/Token');

/**
 * Add diagnosis/consultation for a token
 * POST /api/doctor/diagnosis
 * Also serves as POST /api/doctor/consultation
 */
const addDiagnosis = async (req, res) => {
  try {
    const {
      tokenId,
      disease,
      symptoms,
      prescription,
      medicines,
      testsRecommended,
      healthAdvice,
      notes,
      followUpDate
    } = req.body;

    // Verify token exists
    const token = await Token.findById(tokenId);
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }

    // Create diagnosis/consultation
    const diagnosis = await Diagnosis.create({
      tokenId,
      doctorId: req.user._id,
      disease,
      symptoms,
      prescription,
      medicines,
      testsRecommended,
      healthAdvice,
      notes,
      followUpDate
    });

    // Update token status based on tests recommended
    const newStatus = testsRecommended && testsRecommended.length > 0 ? 'lab' : 'pharmacy';
    await Token.findByIdAndUpdate(tokenId, { status: newStatus });

    res.status(201).json({
      success: true,
      message: 'Diagnosis added successfully',
      data: diagnosis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding diagnosis',
      error: error.message
    });
  }
};

/**
 * Get diagnosis history for a token
 * GET /api/doctor/history/:tokenId
 */
const getDiagnosisHistory = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.find({ tokenId: req.params.tokenId })
      .populate('doctorId', 'name department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: diagnosis.length,
      data: diagnosis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching diagnosis history',
      error: error.message
    });
  }
};

/**
 * Get all diagnoses by doctor
 * GET /api/doctor/my-diagnoses
 */
const getMyDiagnoses = async (req, res) => {
  try {
    const { page = 1, limit = 10, date } = req.query;

    const query = { doctorId: req.user._id };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    const diagnoses = await Diagnosis.find(query)
      .populate({
        path: 'tokenId',
        populate: { path: 'patientId', select: 'name age gender' }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Diagnosis.countDocuments(query);

    res.status(200).json({
      success: true,
      count: diagnoses.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: diagnoses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching diagnoses',
      error: error.message
    });
  }
};

/**
 * Update diagnosis
 * PUT /api/doctor/diagnosis/:id
 */
const updateDiagnosis = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findOneAndUpdate(
      { _id: req.params.id, doctorId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        message: 'Diagnosis not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Diagnosis updated successfully',
      data: diagnosis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating diagnosis',
      error: error.message
    });
  }
};

/**
 * Get waiting patients for doctor
 * GET /api/doctor/waiting
 */
const getWaitingPatients = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tokens = await Token.find({
      status: { $in: ['waiting', 'doctor'] },
      visitDate: { $gte: today, $lt: tomorrow }
    })
      .populate('patientId', 'name age gender phone')
      .sort({ priority: -1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: tokens.length,
      data: tokens
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching waiting patients',
      error: error.message
    });
  }
};

module.exports = {
  addDiagnosis,
  getDiagnosisHistory,
  getMyDiagnoses,
  updateDiagnosis,
  getWaitingPatients
};
