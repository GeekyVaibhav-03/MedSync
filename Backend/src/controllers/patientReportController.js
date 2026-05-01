const PatientReport = require('../models/PatientReport');
const Patient = require('../models/Patient');

/**
 * Upload a patient report
 * POST /api/patient-reports/upload
 */
const uploadReport = async (req, res) => {
  try {
    const {
      patientId,
      tokenId,
      reportType,
      title,
      description,
      reportDate,
      fileData,
      fileName,
      fileType,
      notes
    } = req.body;

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Create patient report
    const report = await PatientReport.create({
      patientId,
      tokenId,
      reportType: reportType || 'other',
      title,
      description,
      reportDate: reportDate || new Date(),
      fileData,
      fileName,
      fileType,
      uploadedBy: req.user._id,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Report uploaded successfully',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading report',
      error: error.message
    });
  }
};

/**
 * Get reports for a patient
 * GET /api/patient-reports/patient/:patientId
 */
const getPatientReports = async (req, res) => {
  try {
    const reports = await PatientReport.find({ patientId: req.params.patientId })
      .populate('uploadedBy', 'name role')
      .populate('tokenId', 'tokenNumber visitDate')
      .sort({ reportDate: -1 })
      .select('-fileData'); // Exclude file data for list view

    res.status(200).json({
      success: true,
      count: reports.length,
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

/**
 * Get single report with file data
 * GET /api/patient-reports/:reportId
 */
const getReportById = async (req, res) => {
  try {
    const report = await PatientReport.findById(req.params.reportId)
      .populate('uploadedBy', 'name role')
      .populate('patientId', 'name age gender')
      .populate('tokenId', 'tokenNumber visitDate');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message
    });
  }
};

/**
 * Delete a report
 * DELETE /api/patient-reports/:reportId
 */
const deleteReport = async (req, res) => {
  try {
    const report = await PatientReport.findByIdAndDelete(req.params.reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting report',
      error: error.message
    });
  }
};

/**
 * Search patients for report upload
 * GET /api/patient-reports/search-patient
 */
const searchPatientForReport = async (req, res) => {
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
      .select('name age gender phone');

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
  uploadReport,
  getPatientReports,
  getReportById,
  deleteReport,
  searchPatientForReport
};
