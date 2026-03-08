const Token = require('../models/Token');
const Patient = require('../models/Patient');

/**
 * Generate a new token for patient
 * POST /api/token/generate
 */
const generateToken = async (req, res) => {
  try {
    const { patientId, department, symptoms, priority, assignedDoctor } = req.body;

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Create token with status 'doctor' as per requirements
    // This means the patient is queued for doctor consultation
    const token = await Token.create({
      patientId,
      department,
      symptoms,
      priority: priority || 'normal',
      assignedDoctor,
      status: 'doctor'
    });

    // Populate patient info
    await token.populate('patientId', 'name age gender phone');

    res.status(201).json({
      success: true,
      message: 'Token generated successfully',
      data: token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating token',
      error: error.message
    });
  }
};

/**
 * Get token queue
 * GET /api/token/queue
 */
const getTokenQueue = async (req, res) => {
  try {
    const { status, department, date } = req.query;

    const query = {};

    if (status) query.status = status;
    if (department) query.department = department;

    // Filter by date
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.visitDate = { $gte: startDate, $lte: endDate };
    } else {
      // Default to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      query.visitDate = { $gte: today, $lt: tomorrow };
    }

    const tokens = await Token.find(query)
      .populate('patientId', 'name age gender phone')
      .populate('assignedDoctor', 'name department')
      .sort({ priority: -1, createdAt: 1 });

    // Group by status
    const grouped = {
      waiting: tokens.filter(t => t.status === 'waiting'),
      doctor: tokens.filter(t => t.status === 'doctor'),
      lab: tokens.filter(t => t.status === 'lab'),
      pharmacy: tokens.filter(t => t.status === 'pharmacy'),
      completed: tokens.filter(t => t.status === 'completed')
    };

    res.status(200).json({
      success: true,
      count: tokens.length,
      data: {
        all: tokens,
        grouped
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching token queue',
      error: error.message
    });
  }
};

/**
 * Get token by ID
 * GET /api/token/:tokenId
 */
const getTokenById = async (req, res) => {
  try {
    const token = await Token.findById(req.params.tokenId)
      .populate('patientId')
      .populate('assignedDoctor', 'name department');

    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }

    res.status(200).json({
      success: true,
      data: token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching token',
      error: error.message
    });
  }
};

/**
 * Update token status
 * PUT /api/token/:tokenId/status
 */
const updateTokenStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['waiting', 'doctor', 'lab', 'pharmacy', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const updateData = { status };
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const token = await Token.findByIdAndUpdate(
      req.params.tokenId,
      updateData,
      { new: true }
    ).populate('patientId', 'name age gender phone');

    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token status updated',
      data: token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating token status',
      error: error.message
    });
  }
};

/**
 * Get tokens by patient ID
 * GET /api/token/patient/:patientId
 */
const getTokensByPatient = async (req, res) => {
  try {
    const tokens = await Token.find({ patientId: req.params.patientId })
      .populate('assignedDoctor', 'name department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tokens.length,
      data: tokens
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patient tokens',
      error: error.message
    });
  }
};

module.exports = {
  generateToken,
  getTokenQueue,
  getTokenById,
  updateTokenStatus,
  getTokensByPatient
};
