const mongoose = require('mongoose');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Token = require('./models/Token');
const MedicalDataset = require('./models/MedicalDataset');
const Diagnosis = require('./models/Diagnosis');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medsync';

// Seed data for users - all roles
const users = [
  {
    name: 'Admin User',
    email: 'admin@medsync.com',
    password: 'admin123',
    role: 'admin',
    department: 'Administration'
  },
  {
    name: 'Reception Desk',
    email: 'receptionist@medsync.com',
    password: 'receptionist123',
    role: 'receptionist',
    department: 'Front Desk'
  },
  {
    name: 'Dr. Rajesh Kumar',
    email: 'doctor@medsync.com',
    password: 'doctor123',
    role: 'doctor',
    department: 'General Medicine'
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'doctor2@medsync.com',
    password: 'doctor123',
    role: 'doctor',
    department: 'Cardiology'
  },
  {
    name: 'Lab Technician',
    email: 'lab@medsync.com',
    password: 'lab123',
    role: 'lab',
    department: 'Laboratory'
  },
  {
    name: 'Pharmacy Staff',
    email: 'pharmacy@medsync.com',
    password: 'pharmacy123',
    role: 'pharmacy',
    department: 'Pharmacy'
  }
];

// Seed data for sample patients
const patients = [
  {
    name: 'Amit Sharma',
    age: 35,
    gender: 'male',
    phone: '9876543210',
    address: '123 Main Street, Delhi',
    area: 'Central Delhi',
    bloodGroup: 'B+',
    medicalHistory: 'No significant medical history'
  },
  {
    name: 'Priya Patel',
    age: 28,
    gender: 'female',
    phone: '9876543211',
    address: '456 Park Road, Mumbai',
    area: 'Andheri',
    bloodGroup: 'A+',
    medicalHistory: 'Mild asthma'
  },
  {
    name: 'Rahul Singh',
    age: 45,
    gender: 'male',
    phone: '9876543212',
    address: '789 Lake View, Bangalore',
    area: 'Koramangala',
    bloodGroup: 'O+',
    medicalHistory: 'Diabetes Type 2'
  },
  {
    name: 'Anita Gupta',
    age: 52,
    gender: 'female',
    phone: '9876543213',
    address: '321 Hill Top, Chennai',
    area: 'T Nagar',
    bloodGroup: 'AB+',
    medicalHistory: 'Hypertension'
  },
  {
    name: 'Vikram Reddy',
    age: 40,
    gender: 'male',
    phone: '9876543214',
    address: '654 Garden Street, Hyderabad',
    area: 'Banjara Hills',
    bloodGroup: 'B-',
    medicalHistory: 'None'
  }
];

// Medical Dataset for AI-like disease prediction
const medicalDataset = [
  {
    disease: 'Common Cold',
    symptoms: ['runny nose', 'sneezing', 'sore throat', 'mild fever', 'cough', 'congestion'],
    recommendedTests: ['Complete Blood Count'],
    recommendedMedicines: ['Paracetamol', 'Cetirizine', 'Vitamin C'],
    healthAdvice: 'Rest well, drink plenty of fluids, avoid cold beverages. Usually resolves in 7-10 days.',
    category: 'respiratory',
    severity: 'mild'
  },
  {
    disease: 'Influenza (Flu)',
    symptoms: ['high fever', 'body ache', 'headache', 'fatigue', 'chills', 'cough', 'sore throat'],
    recommendedTests: ['Rapid Influenza Test', 'Complete Blood Count'],
    recommendedMedicines: ['Oseltamivir', 'Paracetamol', 'Ibuprofen'],
    healthAdvice: 'Complete bed rest, stay hydrated, isolate to prevent spread. Seek medical attention if symptoms worsen.',
    category: 'infectious',
    severity: 'moderate'
  },
  {
    disease: 'Hypertension',
    symptoms: ['headache', 'dizziness', 'chest pain', 'shortness of breath', 'nosebleed', 'fatigue'],
    recommendedTests: ['Blood Pressure Monitoring', 'ECG', 'Kidney Function Test', 'Lipid Profile'],
    recommendedMedicines: ['Amlodipine', 'Losartan', 'Hydrochlorothiazide'],
    healthAdvice: 'Reduce salt intake, exercise regularly, maintain healthy weight, avoid stress and smoking.',
    category: 'cardiovascular',
    severity: 'moderate'
  },
  {
    disease: 'Type 2 Diabetes',
    symptoms: ['frequent urination', 'excessive thirst', 'fatigue', 'blurred vision', 'slow wound healing', 'weight loss'],
    recommendedTests: ['Fasting Blood Sugar', 'HbA1c', 'Oral Glucose Tolerance Test', 'Lipid Profile'],
    recommendedMedicines: ['Metformin', 'Glimepiride', 'Sitagliptin'],
    healthAdvice: 'Follow diabetic diet, regular exercise, monitor blood sugar daily, avoid sugary foods.',
    category: 'chronic',
    severity: 'moderate'
  },
  {
    disease: 'Gastroenteritis',
    symptoms: ['diarrhea', 'vomiting', 'nausea', 'stomach cramps', 'fever', 'dehydration'],
    recommendedTests: ['Stool Test', 'Complete Blood Count'],
    recommendedMedicines: ['ORS', 'Ondansetron', 'Loperamide', 'Probiotics'],
    healthAdvice: 'Stay hydrated with ORS, eat bland foods (BRAT diet), avoid dairy and spicy foods.',
    category: 'gastrointestinal',
    severity: 'moderate'
  },
  {
    disease: 'Migraine',
    symptoms: ['severe headache', 'nausea', 'sensitivity to light', 'sensitivity to sound', 'visual disturbances', 'vomiting'],
    recommendedTests: ['CT Scan', 'MRI Brain'],
    recommendedMedicines: ['Sumatriptan', 'Ibuprofen', 'Propranolol', 'Amitriptyline'],
    healthAdvice: 'Identify and avoid triggers, maintain regular sleep schedule, manage stress, stay in dark quiet room during attack.',
    category: 'neurological',
    severity: 'moderate'
  },
  {
    disease: 'Bronchitis',
    symptoms: ['persistent cough', 'mucus production', 'chest discomfort', 'fatigue', 'shortness of breath', 'mild fever'],
    recommendedTests: ['Chest X-Ray', 'Sputum Culture', 'Pulmonary Function Test'],
    recommendedMedicines: ['Ambroxol', 'Azithromycin', 'Salbutamol Inhaler', 'Paracetamol'],
    healthAdvice: 'Stop smoking, use humidifier, drink warm fluids, rest adequately.',
    category: 'respiratory',
    severity: 'moderate'
  },
  {
    disease: 'Urinary Tract Infection',
    symptoms: ['burning urination', 'frequent urination', 'cloudy urine', 'pelvic pain', 'strong urine odor', 'blood in urine'],
    recommendedTests: ['Urine Routine', 'Urine Culture', 'Ultrasound KUB'],
    recommendedMedicines: ['Nitrofurantoin', 'Ciprofloxacin', 'Trimethoprim'],
    healthAdvice: 'Drink plenty of water, urinate frequently, maintain hygiene, complete full antibiotic course.',
    category: 'infectious',
    severity: 'mild'
  },
  {
    disease: 'Pneumonia',
    symptoms: ['high fever', 'cough with phlegm', 'chest pain', 'difficulty breathing', 'chills', 'fatigue'],
    recommendedTests: ['Chest X-Ray', 'Complete Blood Count', 'Sputum Culture', 'Blood Culture'],
    recommendedMedicines: ['Amoxicillin-Clavulanic Acid', 'Azithromycin', 'Levofloxacin'],
    healthAdvice: 'Complete bed rest, stay hydrated, complete full antibiotic course, seek immediate care if breathing worsens.',
    category: 'respiratory',
    severity: 'severe'
  },
  {
    disease: 'Dengue Fever',
    symptoms: ['high fever', 'severe headache', 'pain behind eyes', 'joint pain', 'muscle pain', 'skin rash', 'fatigue'],
    recommendedTests: ['Dengue NS1 Antigen', 'Dengue IgM/IgG', 'Complete Blood Count', 'Platelet Count'],
    recommendedMedicines: ['Paracetamol', 'ORS', 'IV Fluids'],
    healthAdvice: 'Complete rest, drink plenty of fluids, monitor platelet count daily, avoid NSAIDs like Aspirin/Ibuprofen.',
    category: 'infectious',
    severity: 'severe'
  },
  {
    disease: 'Typhoid Fever',
    symptoms: ['sustained fever', 'headache', 'stomach pain', 'weakness', 'loss of appetite', 'constipation', 'rose spots'],
    recommendedTests: ['Widal Test', 'Blood Culture', 'Complete Blood Count', 'Typhidot'],
    recommendedMedicines: ['Azithromycin', 'Ceftriaxone', 'Ciprofloxacin'],
    healthAdvice: 'Eat well-cooked food, drink boiled water, maintain strict hygiene, complete full antibiotic course.',
    category: 'infectious',
    severity: 'moderate'
  },
  {
    disease: 'Asthma',
    symptoms: ['wheezing', 'shortness of breath', 'chest tightness', 'coughing', 'difficulty sleeping due to breathing'],
    recommendedTests: ['Spirometry', 'Peak Flow Test', 'Allergy Tests', 'Chest X-Ray'],
    recommendedMedicines: ['Salbutamol Inhaler', 'Budesonide Inhaler', 'Montelukast', 'Prednisolone'],
    healthAdvice: 'Avoid triggers (dust, smoke, allergens), carry rescue inhaler always, maintain clean environment.',
    category: 'respiratory',
    severity: 'moderate'
  },
  {
    disease: 'Anemia',
    symptoms: ['fatigue', 'weakness', 'pale skin', 'shortness of breath', 'dizziness', 'cold hands and feet', 'brittle nails'],
    recommendedTests: ['Complete Blood Count', 'Iron Studies', 'Vitamin B12', 'Peripheral Smear'],
    recommendedMedicines: ['Iron Supplements', 'Folic Acid', 'Vitamin B12 Injection'],
    healthAdvice: 'Eat iron-rich foods (leafy greens, red meat), take supplements as prescribed, avoid tea/coffee with meals.',
    category: 'chronic',
    severity: 'moderate'
  },
  {
    disease: 'Conjunctivitis',
    symptoms: ['red eyes', 'itchy eyes', 'watery eyes', 'eye discharge', 'sensitivity to light', 'gritty feeling'],
    recommendedTests: ['Eye Examination', 'Conjunctival Swab'],
    recommendedMedicines: ['Moxifloxacin Eye Drops', 'Artificial Tears', 'Antihistamine Eye Drops'],
    healthAdvice: 'Avoid touching eyes, wash hands frequently, do not share towels, use cold compress for relief.',
    category: 'infectious',
    severity: 'mild'
  },
  {
    disease: 'Arthritis',
    symptoms: ['joint pain', 'joint stiffness', 'swelling', 'reduced range of motion', 'morning stiffness', 'warmth around joint'],
    recommendedTests: ['X-Ray Joints', 'Rheumatoid Factor', 'ESR', 'CRP', 'Uric Acid'],
    recommendedMedicines: ['Ibuprofen', 'Diclofenac', 'Methotrexate', 'Colchicine'],
    healthAdvice: 'Regular gentle exercise, maintain healthy weight, apply hot/cold compress, physical therapy recommended.',
    category: 'musculoskeletal',
    severity: 'moderate'
  },
  {
    disease: 'Chickenpox',
    symptoms: ['itchy rash', 'blisters', 'fever', 'fatigue', 'loss of appetite', 'headache'],
    recommendedTests: ['Clinical Examination', 'VZV IgM Antibody'],
    recommendedMedicines: ['Acyclovir', 'Calamine Lotion', 'Paracetamol', 'Antihistamines'],
    healthAdvice: 'Isolate patient, keep nails short, calamine lotion for itching, avoid scratching to prevent scarring.',
    category: 'infectious',
    severity: 'mild'
  },
  {
    disease: 'Food Poisoning',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomach cramps', 'fever', 'dehydration'],
    recommendedTests: ['Stool Test', 'Complete Blood Count'],
    recommendedMedicines: ['ORS', 'Ondansetron', 'Metronidazole', 'Probiotics'],
    healthAdvice: 'Stay hydrated, eat bland foods, avoid dairy and fatty foods, rest well.',
    category: 'gastrointestinal',
    severity: 'mild'
  },
  {
    disease: 'Sinusitis',
    symptoms: ['facial pain', 'nasal congestion', 'thick nasal discharge', 'headache', 'reduced smell', 'cough'],
    recommendedTests: ['CT Scan Sinuses', 'Nasal Endoscopy'],
    recommendedMedicines: ['Amoxicillin', 'Fluticasone Nasal Spray', 'Pseudoephedrine', 'Saline Nasal Wash'],
    healthAdvice: 'Steam inhalation, stay hydrated, use humidifier, avoid allergens and irritants.',
    category: 'respiratory',
    severity: 'mild'
  },
  {
    disease: 'Malaria',
    symptoms: ['high fever', 'chills', 'sweating', 'headache', 'nausea', 'vomiting', 'body ache'],
    recommendedTests: ['Malaria Antigen Test', 'Peripheral Blood Smear', 'Complete Blood Count'],
    recommendedMedicines: ['Artemether-Lumefantrine', 'Chloroquine', 'Primaquine'],
    healthAdvice: 'Complete full course of antimalarials, use mosquito nets, eliminate standing water around home.',
    category: 'infectious',
    severity: 'severe'
  },
  {
    disease: 'Skin Allergy',
    symptoms: ['rash', 'itching', 'redness', 'hives', 'swelling', 'dry skin'],
    recommendedTests: ['Allergy Panel', 'IgE Levels', 'Skin Prick Test'],
    recommendedMedicines: ['Cetirizine', 'Hydrocortisone Cream', 'Calamine Lotion', 'Prednisolone'],
    healthAdvice: 'Identify and avoid allergens, use mild unscented soaps, keep skin moisturized.',
    category: 'dermatological',
    severity: 'mild'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep data)
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Token.deleteMany({});
    await MedicalDataset.deleteMany({});
    await Diagnosis.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create patients
    const createdPatients = await Patient.create(patients);
    console.log(`✅ Created ${createdPatients.length} patients`);

    // Create medical dataset for AI prediction
    const createdDataset = await MedicalDataset.create(medicalDataset);
    console.log(`✅ Created ${createdDataset.length} diseases in medical dataset`);

    // Create sample tokens for today's queue - save them one by one for pre-save hook
    const doctor = createdUsers.find(u => u.role === 'doctor');
    const sampleTokensData = [
      {
        patientId: createdPatients[0]._id,
        department: 'General Medicine',
        symptoms: 'Fever, headache',
        priority: 'normal',
        status: 'waiting',
        assignedDoctor: doctor._id
      },
      {
        patientId: createdPatients[1]._id,
        department: 'General Medicine',
        symptoms: 'Cough, cold',
        priority: 'normal',
        status: 'doctor',
        assignedDoctor: doctor._id
      },
      {
        patientId: createdPatients[2]._id,
        department: 'Cardiology',
        symptoms: 'Chest pain, fatigue',
        priority: 'urgent',
        status: 'lab',
        assignedDoctor: doctor._id
      },
      {
        patientId: createdPatients[3]._id,
        department: 'General Medicine',
        symptoms: 'High BP symptoms',
        priority: 'normal',
        status: 'pharmacy',
        assignedDoctor: doctor._id
      }
    ];

    // Create tokens one by one to trigger pre-save hook
    const createdTokens = [];
    for (const tokenData of sampleTokensData) {
      const token = new Token(tokenData);
      await token.save();
      createdTokens.push(token);
    }
    console.log(`✅ Created ${createdTokens.length} sample tokens`);

    console.log('\n========================================');
    console.log('🎉 Database seeded successfully!');
    console.log('========================================\n');
    console.log('LOGIN CREDENTIALS:');
    console.log('------------------');
    users.forEach(u => {
      console.log(`${u.role.toUpperCase().padEnd(15)} | Email: ${u.email.padEnd(25)} | Password: ${u.password}`);
    });
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
