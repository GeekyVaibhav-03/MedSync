const mongoose = require('mongoose');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Token = require('./models/Token');
const MedicalDataset = require('./models/MedicalDataset');
const Diagnosis = require('./models/Diagnosis');
const medicalDataset = require('./data/medicalDataset');
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/medsync';

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
// Now imported from ./data/medicalDataset.js - Contains 120 diseases

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
