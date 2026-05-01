const LabReport = require('../models/LabReport');
const Token = require('../models/Token');
const Diagnosis = require('../models/Diagnosis');
const Prescription = require('../models/Prescription');
const { uploadBufferToCloudinary } = require('../utils/cloudinaryUpload');

const LAB_CATALOG = [
  { category: "Basic", tests: ["CBC", "Hemoglobin", "ESR", "Platelet Count", "Blood Group & Rh"] },
  { category: "Diabetes", tests: ["FBS", "PPBS", "HbA1c"] },
  { category: "Lipid Profile", tests: ["Total Cholesterol", "HDL", "LDL", "Triglycerides"] },
  { category: "LFT", tests: ["SGOT", "SGPT", "Bilirubin", "Alkaline Phosphatase"] },
  { category: "KFT", tests: ["Urea", "Creatinine", "Uric Acid"] },
  { category: "Thyroid", tests: ["T3", "T4", "TSH"] },
  { category: "Urine", tests: ["Urine Routine", "Urine Microscopy", "Urine Culture", "Urine Protein", "Urine Sugar"] },
  { category: "Stool", tests: ["Stool Routine", "Stool Microscopy", "Occult Blood", "Ova & Parasites"] },
  { category: "Infection", tests: ["Blood Culture", "Urine Culture", "Sputum Culture", "Widal", "Dengue", "Malaria", "COVID-19", "HIV", "HBsAg", "Hepatitis C"] },
  { category: "Imaging", tests: ["X-Ray", "CT Scan", "MRI", "Ultrasound"] },
  { category: "Heart", tests: ["ECG", "Echo", "TMT"] },
  { category: "Neuro", tests: ["EEG", "EMG"] },
  { category: "Advanced", tests: ["Vitamin B12", "Vitamin D", "CRP", "D-Dimer", "Prolactin", "Testosterone", "Insulin"] }
];

/**
 * Get Lab Catalog
 * GET /api/lab/catalog
 */
const getLabCatalog = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(200).json({
        success: true,
        data: LAB_CATALOG
      });
    }

    const searchQuery = q.toLowerCase();
    const filteredCatalog = LAB_CATALOG.map(category => ({
      category: category.category,
      tests: category.tests.filter(test => test.toLowerCase().includes(searchQuery))
    })).filter(category => category.tests.length > 0);

    res.status(200).json({
      success: true,
      data: filteredCatalog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lab catalog',
      error: error.message
    });
  }
};

/**
 * Upload Lab Report File
 * POST /api/lab/upload
 */
const uploadLabReportFile = async (req, res) => {
  try {
    const { fileData } = req.body;
    
    if (!fileData) {
      return res.status(400).json({
        success: false,
        message: 'No file data provided'
      });
    }

    // Extract base64 part
    const matches = fileData.match(/^data:([\w.+-]+\/[\w.+-]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Invalid base64 string'
      });
    }

    const buffer = Buffer.from(matches[2], 'base64');
    
    const uploadResult = await uploadBufferToCloudinary(buffer, {
      folder: 'lab_reports',
      resource_type: 'auto'
    });

    const reportFileUrl = uploadResult?.secure_url || uploadResult?.url;

    if (!reportFileUrl) {
      throw new Error('Upload succeeded but no URL was returned');
    }

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: { reportFileUrl }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
};

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
      reportFileUrl,
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
      reportFileUrl,
      technicianId: req.user._id,
      sampleCollectedAt
    });

    // Update linked prescription with lab report and move workflow to doctor
    try {
      const updatedPrescription = await Prescription.findOneAndUpdate(
        { tokenId },
        {
          $push: {
            labReports: {
              testName,
              result: result || 'Report uploaded',
              normalRange,
              remarks,
              reportFileUrl,
              technicianId: req.user._id,
              createdAt: new Date()
            }
          },
          $set: {
            status: 'doctor'
          }
        },
        { new: true }
      );

      if (!updatedPrescription) {
        console.error(`Prescription not found for tokenId: ${tokenId}`);
      }
    } catch (prescriptionError) {
      console.error('Error updating prescription lab reports:', prescriptionError.message);
    }

    res.status(201).json({
      success: true,
      message: reportFileUrl ? 'File uploaded successfully' : 'Lab report added successfully',
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
      status: 'lab'
    })
      .populate('patientId', 'name age gender phone')
      .sort({ createdAt: 1 });

    // Get recommended tests for each token
    const tokensWithTests = await Promise.all(
      tokens.map(async (token) => {
        const diagnosis = await Diagnosis.findOne({
          tokenId: token._id
        })
          .select('testsRecommended')
          .sort({ createdAt: -1 });
        const completedReports = await LabReport.find({ tokenId: token._id })
          .select('testName');
        
        // Extract test names from testsRecommended objects
        const recommendedTestNames = diagnosis ? (diagnosis.testsRecommended || []).map(t => 
          typeof t === 'object' ? t.testName : t
        ) : [];
        
        return {
          ...token.toObject(),
          recommendedTests: recommendedTestNames,
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
 * Complete lab tests and move to doctor
 * POST /api/lab/complete/:tokenId
 */
const completeLabTests = async (req, res) => {
  try {
    const token = await Token.findById(req.params.tokenId);
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }

    // Get recommended tests
    const diagnosis = await Diagnosis.findOne({ tokenId: req.params.tokenId }).select('testsRecommended');
    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        message: 'Diagnosis not found'
      });
    }

    const recommendedTests = (diagnosis.testsRecommended || []).map(t => 
      typeof t === 'object' ? t.testName : t
    );

    // Get completed tests
    const completedReports = await LabReport.find({ tokenId: req.params.tokenId }).select('testName');
    const completedTestNames = completedReports.map(r => r.testName);

    // Check if all tests are completed
    if (completedTestNames.length >= recommendedTests.length) {
      // All tests completed, move to doctor
      await Token.findByIdAndUpdate(req.params.tokenId, { status: 'doctor' });
      res.status(200).json({
        success: true,
        message: 'All lab tests completed, token moved to doctor',
        data: { ...token.toObject(), status: 'doctor' }
      });
    } else {
      // Not all tests completed, keep in lab
      res.status(200).json({
        success: true,
        message: 'Lab test report added, waiting for more reports',
        data: token
      });
    }
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
  getMyReports,
  getLabCatalog,
  uploadLabReportFile
};
