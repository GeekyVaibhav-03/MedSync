const MedicalDataset = require('../models/MedicalDataset');

/**
 * AI-like Disease Prediction based on symptoms
 * POST /api/predict-disease
 * 
 * This uses a symptom matching algorithm to find the most likely disease
 * based on the medical dataset collection.
 */
const predictDisease = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of symptoms'
      });
    }

    // Normalize symptoms (lowercase, trim)
    const normalizedSymptoms = symptoms.map(s => s.toLowerCase().trim());

    // Find diseases matching the symptoms using aggregation
    const predictions = await MedicalDataset.aggregate([
      {
        // Match diseases that have at least one matching symptom
        $match: {
          symptoms: { $in: normalizedSymptoms }
        }
      },
      {
        // Add field for match count
        $addFields: {
          matchCount: {
            $size: {
              $setIntersection: ['$symptoms', normalizedSymptoms]
            }
          },
          totalSymptoms: { $size: '$symptoms' },
          inputSymptomCount: normalizedSymptoms.length
        }
      },
      {
        // Calculate confidence score
        $addFields: {
          confidenceScore: {
            $multiply: [
              {
                $divide: [
                  '$matchCount',
                  { $max: ['$totalSymptoms', '$inputSymptomCount'] }
                ]
              },
              100
            ]
          }
        }
      },
      {
        // Sort by match count and confidence
        $sort: { matchCount: -1, confidenceScore: -1 }
      },
      {
        // Limit to top 5 predictions
        $limit: 5
      },
      {
        // Project the fields we want to return
        $project: {
          disease: 1,
          symptoms: 1,
          recommendedTests: 1,
          recommendedMedicines: 1,
          healthAdvice: 1,
          category: 1,
          severity: 1,
          matchCount: 1,
          confidenceScore: { $round: ['$confidenceScore', 2] }
        }
      }
    ]);

    if (predictions.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No matching diseases found for the given symptoms',
        data: {
          inputSymptoms: normalizedSymptoms,
          predictions: [],
          recommendation: 'Please consult a doctor for proper diagnosis'
        }
      });
    }

    // Get the primary prediction (highest confidence)
    const primaryPrediction = predictions[0];

    res.status(200).json({
      success: true,
      message: 'Disease prediction generated successfully',
      data: {
        inputSymptoms: normalizedSymptoms,
        primaryPrediction: {
          disease: primaryPrediction.disease,
          confidence: primaryPrediction.confidenceScore,
          matchedSymptoms: primaryPrediction.matchCount,
          recommendedTests: primaryPrediction.recommendedTests,
          recommendedMedicines: primaryPrediction.recommendedMedicines,
          healthAdvice: primaryPrediction.healthAdvice,
          severity: primaryPrediction.severity
        },
        alternativePredictions: predictions.slice(1).map(p => ({
          disease: p.disease,
          confidence: p.confidenceScore,
          matchedSymptoms: p.matchCount
        })),
        disclaimer: 'This is an AI-assisted prediction. Please consult a qualified doctor for proper diagnosis and treatment.'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error predicting disease',
      error: error.message
    });
  }
};

/**
 * Get all diseases in the dataset
 * GET /api/predict-disease/dataset
 */
const getDataset = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { disease: { $regex: search, $options: 'i' } },
        { symptoms: { $regex: search, $options: 'i' } }
      ];
    }

    const diseases = await MedicalDataset.find(query).sort({ disease: 1 });

    res.status(200).json({
      success: true,
      count: diseases.length,
      data: diseases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching medical dataset',
      error: error.message
    });
  }
};

/**
 * Add new disease to dataset (Admin only)
 * POST /api/predict-disease/dataset
 */
const addDiseaseToDataset = async (req, res) => {
  try {
    const { disease, symptoms, recommendedTests, recommendedMedicines, healthAdvice, category, severity } = req.body;

    if (!disease || !symptoms || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Disease name and symptoms are required'
      });
    }

    // Check if disease already exists
    const existing = await MedicalDataset.findOne({ 
      disease: { $regex: new RegExp(`^${disease}$`, 'i') }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Disease already exists in the dataset'
      });
    }

    const newDisease = await MedicalDataset.create({
      disease,
      symptoms: symptoms.map(s => s.toLowerCase().trim()),
      recommendedTests: recommendedTests || [],
      recommendedMedicines: recommendedMedicines || [],
      healthAdvice: healthAdvice || '',
      category: category || 'other',
      severity: severity || 'moderate'
    });

    res.status(201).json({
      success: true,
      message: 'Disease added to dataset successfully',
      data: newDisease
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding disease to dataset',
      error: error.message
    });
  }
};

/**
 * Get symptoms suggestions for autocomplete
 * GET /api/predict-disease/symptoms
 */
const getSymptomsList = async (req, res) => {
  try {
    // Get all unique symptoms from the dataset
    const symptoms = await MedicalDataset.distinct('symptoms');
    
    res.status(200).json({
      success: true,
      count: symptoms.length,
      data: symptoms.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching symptoms list',
      error: error.message
    });
  }
};

/**
 * Auto-suggest diseases as doctor types
 * GET /api/predict-disease/search?q=<query>
 */
const searchDiseases = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Search diseases by name with autocomplete
    const diseases = await MedicalDataset.aggregate([
      {
        $match: {
          disease: { $regex: q, $options: 'i' }
        }
      },
      {
        $project: {
          disease: 1,
          category: 1,
          severity: 1,
          _id: 1
        }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $sort: { disease: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: diseases.length,
      data: diseases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching diseases',
      error: error.message
    });
  }
};

/**
 * Get full disease details by name or ID
 * GET /api/predict-disease/disease/:identifier
 */
const getDiseaseDetails = async (req, res) => {
  try {
    const { identifier } = req.params;

    let disease;
    
    // Check if identifier is a MongoDB ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      disease = await MedicalDataset.findById(identifier);
    } else {
      // Search by disease name (case-insensitive)
      disease = await MedicalDataset.findOne({
        disease: { $regex: new RegExp(`^${identifier}$`, 'i') }
      });
    }

    if (!disease) {
      return res.status(404).json({
        success: false,
        message: 'Disease not found in dataset'
      });
    }

    res.status(200).json({
      success: true,
      data: disease
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching disease details',
      error: error.message
    });
  }
};

/**
 * Auto-suggest medicines based on disease name
 * GET /api/predict-disease/suggest-medicines?disease=<disease_name>
 */
const suggestMedicines = async (req, res) => {
  try {
    const { disease } = req.query;

    if (!disease) {
      return res.status(400).json({
        success: false,
        message: 'Disease name is required'
      });
    }

    // Find disease in the dataset
    const diseaseData = await MedicalDataset.findOne({
      disease: { $regex: new RegExp(`^${disease}$`, 'i') }
    });

    if (!diseaseData) {
      // If exact match not found, try partial match
      const partialMatches = await MedicalDataset.find({
        disease: { $regex: disease, $options: 'i' }
      }).limit(5);

      if (partialMatches.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Disease not found in dataset',
          suggestions: []
        });
      }

      return res.status(200).json({
        success: true,
        exactMatch: false,
        message: 'No exact match found. Here are similar diseases:',
        data: partialMatches.map(d => ({
          disease: d.disease,
          recommendedMedicines: d.recommendedMedicines,
          recommendedTests: d.recommendedTests,
          healthAdvice: d.healthAdvice,
          severity: d.severity
        }))
      });
    }

    res.status(200).json({
      success: true,
      exactMatch: true,
      data: {
        disease: diseaseData.disease,
        category: diseaseData.category,
        severity: diseaseData.severity,
        recommendedMedicines: diseaseData.recommendedMedicines,
        recommendedTests: diseaseData.recommendedTests,
        healthAdvice: diseaseData.healthAdvice,
        symptoms: diseaseData.symptoms
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error suggesting medicines',
      error: error.message
    });
  }
};

/**
 * Get all unique medicines in the dataset
 * GET /api/predict-disease/medicines
 */
const getMedicinesList = async (req, res) => {
  try {
    const { search } = req.query;

    // Get all unique medicines from the dataset
    const medicines = await MedicalDataset.distinct('recommendedMedicines');
    
    let filteredMedicines = medicines.sort();
    
    if (search) {
      filteredMedicines = medicines.filter(m => 
        m.toLowerCase().includes(search.toLowerCase())
      ).sort();
    }

    res.status(200).json({
      success: true,
      count: filteredMedicines.length,
      data: filteredMedicines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching medicines list',
      error: error.message
    });
  }
};

/**
 * Get all unique tests in the dataset
 * GET /api/predict-disease/tests
 */
const getTestsList = async (req, res) => {
  try {
    const { search } = req.query;

    // Get all unique tests from the dataset
    const tests = await MedicalDataset.distinct('recommendedTests');
    
    let filteredTests = tests.sort();
    
    if (search) {
      filteredTests = tests.filter(t => 
        t.toLowerCase().includes(search.toLowerCase())
      ).sort();
    }

    res.status(200).json({
      success: true,
      count: filteredTests.length,
      data: filteredTests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tests list',
      error: error.message
    });
  }
};

/**
 * Get disease categories with count
 * GET /api/predict-disease/categories
 */
const getCategories = async (req, res) => {
  try {
    const categories = await MedicalDataset.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          diseases: { $push: '$disease' }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          diseases: { $slice: ['$diseases', 5] }, // Show only first 5 diseases
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

module.exports = {
  predictDisease,
  getDataset,
  addDiseaseToDataset,
  getSymptomsList,
  searchDiseases,
  getDiseaseDetails,
  suggestMedicines,
  getMedicinesList,
  getTestsList,
  getCategories
};
