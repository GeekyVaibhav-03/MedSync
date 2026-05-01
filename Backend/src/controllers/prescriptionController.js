const PDFDocument = require('pdfkit');
const Token = require('../models/Token');
const Diagnosis = require('../models/Diagnosis');
const LabReport = require('../models/LabReport');
const PharmacyIssue = require('../models/PharmacyIssue');
const Prescription = require('../models/Prescription');
const { uploadBufferToCloudinary } = require('../utils/cloudinaryUpload');

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-IN');
};

const safeText = (value) => {
  if (value === null || value === undefined) return '-';
  return String(value);
};

const listAsText = (items) => {
  if (!Array.isArray(items) || items.length === 0) return '-';
  return items.map((item) => safeText(item)).join(', ');
};

const mapMedicinesIssued = (medicines = []) => {
  if (!Array.isArray(medicines)) return [];

  return medicines.map((item) => ({
    name: item?.name || item?.medicineName || '-',
    quantity: item?.quantity ?? 0,
    price: item?.price ?? 0
  }));
};

const mapLabReports = (reports = []) => {
  if (!Array.isArray(reports)) return [];

  return reports.map((report) => ({
    testName: report?.testName || '-',
    result: report?.result || '-',
    normalRange: report?.normalRange || '-',
    remarks: report?.remarks || '-',
    reportFileUrl: report?.reportFileUrl || report?.attachments?.[0]?.url || '-',
    technicianId: report?.technicianId,
    createdAt: report?.createdAt || report?.reportDate || new Date()
  }));
};

const buildPrescriptionSeed = ({ token, diagnosis, labReports, pharmacyIssue }) => {
  const seededPrescription = {
    patientId: token.patientId,
    tokenId: token._id,
    status: pharmacyIssue ? 'completed' : labReports.length > 0 ? 'pharmacy' : diagnosis ? 'lab' : 'doctor',
    doctorData: {},
    labReports,
    pharmacyData: {
      medicinesIssued: [],
      totalAmount: 0,
      notes: '',
      pharmacistId: undefined,
      createdAt: new Date()
    }
  };

  if (diagnosis) {
    seededPrescription.doctorData = {
      diagnosis: diagnosis.disease || diagnosis.prescription || '',
      symptoms: diagnosis.symptoms || [],
      medicines: Array.isArray(diagnosis.medicines)
        ? diagnosis.medicines.map((item) => item?.name || item).filter(Boolean)
        : [],
      testsRecommended: Array.isArray(diagnosis.testsRecommended)
        ? diagnosis.testsRecommended.map((item) => item?.testName || item).filter(Boolean)
        : [],
      notes: diagnosis.notes || diagnosis.healthAdvice || '',
      notepadImageUrl: '',
      doctorId: diagnosis.doctorId,
      createdAt: diagnosis.createdAt || new Date()
    };
  }

  if (pharmacyIssue) {
    seededPrescription.pharmacyData = {
      medicinesIssued: mapMedicinesIssued(pharmacyIssue.medicines),
      totalAmount: pharmacyIssue.totalAmount || 0,
      notes: pharmacyIssue.notes || '',
      pharmacistId: pharmacyIssue.issuedBy,
      createdAt: pharmacyIssue.createdAt || new Date()
    };
  }

  return seededPrescription;
};

const generatePdfBuffer = async (prescription) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const patient = prescription.patientId || {};
    const doctorData = prescription.doctorData || {};
    const pharmacyData = prescription.pharmacyData || {};

    doc.fontSize(18).text('Prescription Summary', { align: 'center' });
    doc.moveDown();

    doc.fontSize(13).text('Patient Details', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Name: ${safeText(patient.name)}`);
    doc.text(`Age: ${safeText(patient.age)}`);
    doc.text(`Gender: ${safeText(patient.gender)}`);
    doc.text(`Phone: ${safeText(patient.phone)}`);
    doc.text(`Token ID: ${safeText(prescription.tokenId)}`);
    doc.moveDown();

    doc.fontSize(13).text('Doctor Diagnosis', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Doctor: ${safeText(doctorData.doctorId?.name)}`);
    doc.text(`Department: ${safeText(doctorData.doctorId?.department)}`);
    doc.text(`Created At: ${formatDate(doctorData.createdAt)}`);
    doc.text(`Diagnosis: ${safeText(doctorData.diagnosis)}`);
    doc.text(`Symptoms: ${listAsText(doctorData.symptoms)}`);
    doc.text(`Medicines: ${listAsText(doctorData.medicines)}`);
    doc.text(`Notes: ${safeText(doctorData.notes)}`);

    doc.addPage();

    doc.fontSize(13).text('Lab Reports', { underline: true });
    doc.moveDown(0.5);

    if (Array.isArray(prescription.labReports) && prescription.labReports.length > 0) {
      prescription.labReports.forEach((report, index) => {
        doc.fontSize(11).text(`${index + 1}. Test: ${safeText(report.testName)}`);
        doc.text(`   Result: ${safeText(report.result)}`);
        doc.text(`   Normal Range: ${safeText(report.normalRange)}`);
        doc.text(`   Remarks: ${safeText(report.remarks)}`);
        doc.text(`   Report File URL: ${safeText(report.reportFileUrl)}`);
        doc.text(`   Created At: ${formatDate(report.createdAt)}`);
        doc.moveDown(0.5);
      });
    } else {
      doc.fontSize(11).text('-');
    }

    doc.moveDown();
    doc.fontSize(13).text('Pharmacy Details', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Pharmacist: ${safeText(pharmacyData.pharmacistId?.name)}`);
    doc.text(`Created At: ${formatDate(pharmacyData.createdAt)}`);

    const medicinesIssued = Array.isArray(pharmacyData.medicinesIssued)
      ? pharmacyData.medicinesIssued
      : [];

    if (medicinesIssued.length > 0) {
      medicinesIssued.forEach((item, index) => {
        doc.text(
          `${index + 1}. ${safeText(item.name)} | Qty: ${safeText(item.quantity)} | Price: ${safeText(item.price)}`
        );
      });
    } else {
      doc.text('Medicines Issued: -');
    }

    doc.moveDown(0.5);
    doc.text(`Total Amount: ${safeText(pharmacyData.totalAmount)}`);
    doc.text(`Notes: ${safeText(pharmacyData.notes)}`);

    doc.end();
  });
};

/**
 * Generate prescription PDF and return URL
 * GET /api/prescription/pdf/:tokenId
 */
const generatePrescriptionPdf = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const token = await Token.findById(tokenId);

    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }

    let prescription = await Prescription.findOne({ tokenId })
      .populate('patientId')
      .populate('doctorData.doctorId', 'name department')
      .populate('pharmacyData.pharmacistId', 'name department');

    if (!prescription) {
      const [diagnosis, labReports, pharmacyIssue] = await Promise.all([
        Diagnosis.findOne({ tokenId }).sort({ createdAt: -1 }).populate('doctorId', 'name department'),
        LabReport.find({ tokenId }).sort({ createdAt: 1 }).populate('technicianId', 'name department'),
        PharmacyIssue.findOne({ tokenId }).sort({ createdAt: -1 }).populate('issuedBy', 'name department')
      ]);

      prescription = await Prescription.create(buildPrescriptionSeed({
        token,
        diagnosis,
        labReports: mapLabReports(labReports),
        pharmacyIssue
      }));

      prescription = await Prescription.findById(prescription._id)
        .populate('patientId')
        .populate('doctorData.doctorId', 'name department')
        .populate('pharmacyData.pharmacistId', 'name department');
    }

    if (prescription.pdfUrl) {
      return res.status(200).json({
        success: true,
        pdfUrl: prescription.pdfUrl
      });
    }

    const pdfBuffer = await generatePdfBuffer(prescription);

    const uploadResult = await uploadBufferToCloudinary(pdfBuffer, {
      folder: 'prescriptions',
      public_id: `prescription-${tokenId}`,
      resource_type: 'raw',
      format: 'pdf',
      overwrite: true
    });

    const pdfUrl = uploadResult?.secure_url || uploadResult?.url;

    if (!pdfUrl) {
      throw new Error('PDF upload succeeded but no URL was returned');
    }

    prescription.pdfUrl = pdfUrl;
    await prescription.save();

    return res.status(200).json({
      success: true,
      pdfUrl
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error generating prescription PDF',
      error: error.message
    });
  }
};

module.exports = {
  generatePrescriptionPdf
};
