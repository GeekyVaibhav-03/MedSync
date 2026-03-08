const Token = require('../models/Token');
const Patient = require('../models/Patient');
const Diagnosis = require('../models/Diagnosis');
const LabReport = require('../models/LabReport');
const PharmacyIssue = require('../models/PharmacyIssue');

/**
 * Get patient trends
 * GET /api/analytics/patient-trends
 */
const getPatientTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    // Daily patient registrations
    const dailyRegistrations = await Patient.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Daily tokens generated
    const dailyTokens = await Token.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Gender distribution
    const genderDistribution = await Patient.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    // Age distribution
    const ageDistribution = await Patient.aggregate([
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 18, 30, 45, 60, 100],
          default: 'Other',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    // Area-wise distribution
    const areaDistribution = await Patient.aggregate([
      {
        $match: { area: { $exists: true, $ne: '' } }
      },
      {
        $group: {
          _id: '$area',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        dailyRegistrations,
        dailyTokens,
        genderDistribution,
        ageDistribution,
        areaDistribution
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patient trends',
      error: error.message
    });
  }
};

/**
 * Get department load
 * GET /api/analytics/department-load
 */
const getDepartmentLoad = async (req, res) => {
  try {
    const { date } = req.query;
    
    let startDate, endDate;
    if (date) {
      startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
    } else {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    }

    // Department-wise token count
    const departmentLoad = await Token.aggregate([
      {
        $match: {
          visitDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 },
          waiting: {
            $sum: { $cond: [{ $eq: ['$status', 'waiting'] }, 1, 0] }
          },
          inProgress: {
            $sum: {
              $cond: [
                { $in: ['$status', ['doctor', 'lab', 'pharmacy']] },
                1,
                0
              ]
            }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Status-wise distribution
    const statusDistribution = await Token.aggregate([
      {
        $match: {
          visitDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Average completion time
    const avgCompletionTime = await Token.aggregate([
      {
        $match: {
          visitDate: { $gte: startDate, $lte: endDate },
          status: 'completed',
          completedAt: { $exists: true }
        }
      },
      {
        $project: {
          completionTime: {
            $divide: [
              { $subtract: ['$completedAt', '$createdAt'] },
              60000 // Convert to minutes
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$completionTime' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        departmentLoad,
        statusDistribution,
        avgCompletionTime: avgCompletionTime[0]?.avgTime || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching department load',
      error: error.message
    });
  }
};

/**
 * Get disease statistics
 * GET /api/analytics/disease-stats
 */
const getDiseaseStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    // Top diseases
    const topDiseases = await Diagnosis.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: '$disease',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Most common tests
    const commonTests = await LabReport.aggregate([
      {
        $match: { reportDate: { $gte: startDate } }
      },
      {
        $group: {
          _id: '$testName',
          count: { $sum: 1 },
          abnormalCount: {
            $sum: {
              $cond: [{ $ne: ['$status', 'normal'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Most prescribed medicines
    const topMedicines = await PharmacyIssue.aggregate([
      {
        $match: { issuedDate: { $gte: startDate } }
      },
      { $unwind: '$medicines' },
      {
        $group: {
          _id: '$medicines.medicineName',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$medicines.quantity' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        topDiseases,
        commonTests,
        topMedicines
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching disease stats',
      error: error.message
    });
  }
};

/**
 * Get dashboard summary
 * GET /api/analytics/dashboard
 */
const getDashboardSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's stats
    const todayTokens = await Token.countDocuments({
      visitDate: { $gte: today, $lt: tomorrow }
    });

    const completedToday = await Token.countDocuments({
      visitDate: { $gte: today, $lt: tomorrow },
      status: 'completed'
    });

    const pendingToday = await Token.countDocuments({
      visitDate: { $gte: today, $lt: tomorrow },
      status: { $ne: 'completed' }
    });

    const newPatientsToday = await Patient.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Overall stats
    const totalPatients = await Patient.countDocuments();
    const totalTokens = await Token.countDocuments();

    // Current queue status
    const queueStatus = await Token.aggregate([
      {
        $match: {
          visitDate: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        today: {
          tokens: todayTokens,
          completed: completedToday,
          pending: pendingToday,
          newPatients: newPatientsToday
        },
        overall: {
          totalPatients,
          totalTokens
        },
        queueStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard summary',
      error: error.message
    });
  }
};

/**
 * Get disease trends
 * GET /api/analytics/disease-trends
 * Groups consultations by disease over time
 */
const getDiseaseTrends = async (req, res) => {
  try {
    const { days = 30, limit = 10 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    // Disease frequency with daily breakdown
    const diseaseTrends = await Diagnosis.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            disease: '$disease',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.disease',
          totalCases: { $sum: '$count' },
          dailyData: {
            $push: {
              date: '$_id.date',
              count: '$count'
            }
          }
        }
      },
      { $sort: { totalCases: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Overall disease distribution
    const diseaseDistribution = await Diagnosis.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: '$disease',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Weekly trends
    const weeklyTrends = await Diagnosis.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            week: { $week: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          totalCases: { $sum: 1 },
          diseases: { $addToSet: '$disease' }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        diseaseTrends,
        diseaseDistribution,
        weeklyTrends,
        period: {
          startDate,
          endDate: new Date()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching disease trends',
      error: error.message
    });
  }
};

/**
 * Get medicine usage analytics
 * GET /api/analytics/medicine-usage
 * Analyzes most prescribed medicines
 */
const getMedicineUsage = async (req, res) => {
  try {
    const { days = 30, limit = 15 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    // Most issued medicines from pharmacy
    const pharmacyMedicineUsage = await PharmacyIssue.aggregate([
      {
        $match: { issuedDate: { $gte: startDate } }
      },
      { $unwind: '$medicines' },
      {
        $group: {
          _id: '$medicines.medicineName',
          timesIssued: { $sum: 1 },
          totalQuantity: { $sum: '$medicines.quantity' },
          avgQuantityPerIssue: { $avg: '$medicines.quantity' }
        }
      },
      { $sort: { timesIssued: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Most prescribed medicines by doctors
    const prescribedMedicines = await Diagnosis.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      { $unwind: '$medicines' },
      {
        $group: {
          _id: '$medicines.name',
          timesPrescribed: { $sum: 1 },
          dosages: { $addToSet: '$medicines.dosage' },
          durations: { $addToSet: '$medicines.duration' }
        }
      },
      { $sort: { timesPrescribed: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Daily medicine dispensing trend
    const dailyDispensing = await PharmacyIssue.aggregate([
      {
        $match: { issuedDate: { $gte: startDate } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$issuedDate' } },
          totalIssues: { $sum: 1 },
          medicineCount: { $sum: { $size: '$medicines' } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Medicine category analysis (if we had categories, for now group by first letter)
    const medicineByCategory = await PharmacyIssue.aggregate([
      {
        $match: { issuedDate: { $gte: startDate } }
      },
      { $unwind: '$medicines' },
      {
        $group: {
          _id: { $toUpper: { $substr: ['$medicines.medicineName', 0, 1] } },
          count: { $sum: 1 },
          medicines: { $addToSet: '$medicines.medicineName' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        pharmacyMedicineUsage,
        prescribedMedicines,
        dailyDispensing,
        medicineByCategory,
        period: {
          startDate,
          endDate: new Date()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching medicine usage',
      error: error.message
    });
  }
};

/**
 * Get area-wise disease distribution
 * GET /api/analytics/area-disease-distribution
 * Joins patient and consultation collections to detect disease clusters by location
 */
const getAreaDiseaseDistribution = async (req, res) => {
  try {
    const { days = 30, limit = 20 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    // Join tokens with patients and diagnoses to get area-wise disease distribution
    const areaDiseaseData = await Token.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        // Join with Patient collection
        $lookup: {
          from: 'patients',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patient'
        }
      },
      { $unwind: '$patient' },
      {
        // Join with Diagnosis collection
        $lookup: {
          from: 'diagnoses',
          localField: '_id',
          foreignField: 'tokenId',
          as: 'diagnosis'
        }
      },
      { $unwind: { path: '$diagnosis', preserveNullAndEmptyArrays: false } },
      {
        // Filter out patients without area
        $match: { 'patient.area': { $exists: true, $ne: '' } }
      },
      {
        // Group by area and disease
        $group: {
          _id: {
            area: '$patient.area',
            disease: '$diagnosis.disease'
          },
          count: { $sum: 1 },
          patientIds: { $addToSet: '$patient._id' }
        }
      },
      {
        // Restructure to group by area
        $group: {
          _id: '$_id.area',
          totalCases: { $sum: '$count' },
          uniquePatients: { $sum: { $size: '$patientIds' } },
          diseases: {
            $push: {
              disease: '$_id.disease',
              count: '$count'
            }
          }
        }
      },
      { $sort: { totalCases: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Get disease hotspots (areas with high concentration of specific diseases)
    const diseaseHotspots = await Token.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $lookup: {
          from: 'patients',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patient'
        }
      },
      { $unwind: '$patient' },
      {
        $lookup: {
          from: 'diagnoses',
          localField: '_id',
          foreignField: 'tokenId',
          as: 'diagnosis'
        }
      },
      { $unwind: { path: '$diagnosis', preserveNullAndEmptyArrays: false } },
      {
        $match: { 'patient.area': { $exists: true, $ne: '' } }
      },
      {
        $group: {
          _id: '$diagnosis.disease',
          totalCases: { $sum: 1 },
          areas: {
            $push: '$patient.area'
          }
        }
      },
      {
        $addFields: {
          topAreas: {
            $slice: [
              {
                $map: {
                  input: { $setUnion: ['$areas'] },
                  as: 'area',
                  in: {
                    area: '$$area',
                    count: {
                      $size: {
                        $filter: {
                          input: '$areas',
                          cond: { $eq: ['$$this', '$$area'] }
                        }
                      }
                    }
                  }
                }
              },
              5
            ]
          }
        }
      },
      {
        $project: {
          disease: '$_id',
          totalCases: 1,
          topAreas: 1
        }
      },
      { $sort: { totalCases: -1 } },
      { $limit: 10 }
    ]);

    // Area-wise patient count
    const areaPatientCount = await Patient.aggregate([
      {
        $match: { 
          area: { $exists: true, $ne: '' },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$area',
          patientCount: { $sum: 1 }
        }
      },
      { $sort: { patientCount: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.status(200).json({
      success: true,
      data: {
        areaDiseaseDistribution: areaDiseaseData,
        diseaseHotspots,
        areaPatientCount,
        period: {
          startDate,
          endDate: new Date()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching area disease distribution',
      error: error.message
    });
  }
};

module.exports = {
  getPatientTrends,
  getDepartmentLoad,
  getDiseaseStats,
  getDashboardSummary,
  getDiseaseTrends,
  getMedicineUsage,
  getAreaDiseaseDistribution
};
