const Patient = require('../models/Patient');
const Token = require('../models/Token');
const Diagnosis = require('../models/Diagnosis');
const LabReport = require('../models/LabReport');
const PharmacyIssue = require('../models/PharmacyIssue');

/**
 * Register a new patient
 * POST /api/patient/register
 */
const registerPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      phone,
      address,
      area,
      bloodGroup,
      emergencyContact,
      medicalHistory,
      allergies
    } = req.body;

    const patient = await Patient.create({
      name,
      age,
      gender,
      phone,
      address,
      area,
      bloodGroup,
      emergencyContact,
      medicalHistory,
      allergies
    });

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering patient',
      error: error.message
    });
  }
};

/**
 * Get patient by ID
 * GET /api/patient/:id
 */
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patient',
      error: error.message
    });
  }
};

/**
 * Get all patients
 * GET /api/patient
 */
const getAllPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, gender, area } = req.query;

    const query = {};

    // Search by name or phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (gender) query.gender = gender;
    if (area) query.area = { $regex: area, $options: 'i' };

    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Patient.countDocuments(query);

    res.status(200).json({
      success: true,
      count: patients.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error.message
    });
  }
};

/**
 * Update patient
 * PUT /api/patient/:id
 */
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating patient',
      error: error.message
    });
  }
};

/**
 * Delete patient
 * DELETE /api/patient/:id
 */
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting patient',
      error: error.message
    });
  }
};

/**
 * Get patient visit history
 * GET /api/patient/history/:patientId
 */
const getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Get all tokens for this patient
    const tokens = await Token.find({ patientId })
      .populate('assignedDoctor', 'name department')
      .sort({ createdAt: -1 });

    // Get diagnoses for all tokens
    const tokenIds = tokens.map(t => t._id);
    
    const diagnoses = await Diagnosis.find({ tokenId: { $in: tokenIds } })
      .populate('doctorId', 'name department')
      .sort({ createdAt: -1 });

    // Get lab reports for all tokens
    const labReports = await LabReport.find({ tokenId: { $in: tokenIds } })
      .populate('technicianId', 'name')
      .sort({ reportDate: -1 });

    // Get pharmacy issues for all tokens
    const pharmacyIssues = await PharmacyIssue.find({ tokenId: { $in: tokenIds } })
      .populate('issuedBy', 'name')
      .sort({ issuedDate: -1 });

    // Create visit timeline
    const visits = tokens.map(token => {
      const tokenDiagnoses = diagnoses.filter(d => d.tokenId.toString() === token._id.toString());
      const tokenLabReports = labReports.filter(l => l.tokenId.toString() === token._id.toString());
      const tokenPharmacy = pharmacyIssues.filter(p => p.tokenId.toString() === token._id.toString());

      return {
        token: {
          id: token._id,
          tokenNumber: token.tokenNumber,
          department: token.department,
          visitDate: token.visitDate,
          status: token.status,
          symptoms: token.symptoms,
          assignedDoctor: token.assignedDoctor
        },
        diagnoses: tokenDiagnoses,
        labReports: tokenLabReports,
        pharmacyIssues: tokenPharmacy
      };
    });

    res.status(200).json({
      success: true,
      data: {
        patient,
        totalVisits: tokens.length,
        visits
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patient history',
      error: error.message
    });
  }
};

/**
 * Search patients
 * GET /api/patient/search
 */
const searchPatients = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const patients = await Patient.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ]
    })
      .limit(10)
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching patients',
      error: error.message
    });
  }
};

module.exports = {
  registerPatient,
  getPatientById,
  getAllPatients,
  updatePatient,
  deletePatient,
  getPatientHistory,
  searchPatients
};
