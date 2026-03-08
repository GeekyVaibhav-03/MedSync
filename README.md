# MedSync - Hospital Token Management System

A comprehensive hospital management system with token-based patient flow, AI-like disease prediction, role-based dashboards, and healthcare analytics.

## Features

- **Token-Driven Workflow**: Patient Registration → Token Generated → Doctor Consultation → Lab Tests → Pharmacy → Completed
- **AI Disease Prediction**: Symptom-based disease prediction using medical dataset matching
- **Role-Based Access Control**: Admin, Receptionist, Doctor, Lab Technician, Pharmacist
- **Real-Time Queue Management**: Live token status updates and queue tracking
- **Priority System**: Normal and Urgent patient prioritization
- **Healthcare Analytics**: Disease trends, medicine usage, area-wise disease distribution
- **MongoDB Aggregation**: Advanced analytics queries for healthcare insights

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Redux Toolkit
- React Router
- Framer Motion
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- helmet (Security headers)
- express-rate-limit (API protection)

## Project Structure

```
MedSync/
├── Backend/
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── seed.js
│       ├── config/
│       │   └── database.js
│       ├── controllers/
│       │   ├── analyticsController.js
│       │   ├── authController.js
│       │   ├── doctorController.js
│       │   ├── labController.js
│       │   ├── patientController.js
│       │   ├── pharmacyController.js
│       │   ├── predictionController.js
│       │   └── tokenController.js
│       ├── middleware/
│       │   ├── auth.js
│       │   └── errorHandler.js
│       ├── models/
│       │   ├── Diagnosis.js
│       │   ├── LabReport.js
│       │   ├── MedicalDataset.js
│       │   ├── Patient.js
│       │   ├── PharmacyIssue.js
│       │   ├── Token.js
│       │   └── User.js
│       └── routes/
│           ├── analyticsRoutes.js
│           ├── authRoutes.js
│           ├── doctorRoutes.js
│           ├── labRoutes.js
│           ├── patientRoutes.js
│           ├── pharmacyRoutes.js
│           ├── predictionRoutes.js
│           └── tokenRoutes.js
└── Frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        │   └── api.ts
        └── store/
```

## Database Schemas

### User
- name, email, password (hashed), role, department, isActive

### Patient  
- name, age, gender, phone, address, area, bloodGroup, medicalHistory, allergies

### Token
- tokenNumber (HMS-YYYY-0001), patientId, department, visitDate, status, priority, symptoms, assignedDoctor

### Diagnosis (Consultation)
- tokenId, doctorId, disease, symptoms, medicines[], testsRecommended[], healthAdvice, notes

### LabReport
- tokenId, testName, result, normalRange, technicianId, reportDate, status

### PharmacyIssue
- tokenId, medicines[], issuedBy, issuedDate, paymentStatus

### MedicalDataset
- disease, symptoms[], recommendedTests[], recommendedMedicines[], healthAdvice, category, severity

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MedSync
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Seed the Database**
   ```bash
   cd ../Backend
   node src/seed.js
   ```

### Running the Application

1. **Start Backend Server** (Port 5000)
   ```bash
   cd Backend
   node server.js
   ```

2. **Start Frontend Dev Server** (Port 8080)
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Open in Browser**
   ```
   http://localhost:8080
   ```

## Login Credentials

| Role         | Email                        | Password        |
|--------------|------------------------------|-----------------|
| Admin        | admin@medsync.com            | admin123        |
| Receptionist | receptionist@medsync.com     | receptionist123 |
| Doctor       | doctor@medsync.com           | doctor123       |
| Doctor 2     | doctor2@medsync.com          | doctor123       |
| Lab          | lab@medsync.com              | lab123          |
| Pharmacy     | pharmacy@medsync.com         | pharmacy123     |

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get user profile | Authenticated |

### Patient
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/patient/register` | Register new patient | Receptionist, Admin |
| GET | `/api/patient` | Get all patients | Authenticated |
| GET | `/api/patient/search?q=query` | Search patients | Authenticated |
| GET | `/api/patient/:id` | Get patient by ID | Authenticated |
| GET | `/api/patient/history/:patientId` | Get patient visit history | Authenticated |
| PUT | `/api/patient/:id` | Update patient | Receptionist, Admin |
| DELETE | `/api/patient/:id` | Delete patient | Admin |

### Token
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/token/generate` | Generate new token | Receptionist, Admin |
| GET | `/api/token/queue` | Get token queue | Authenticated |
| GET | `/api/token/:tokenId` | Get token by ID | Authenticated |
| PUT | `/api/token/:tokenId/status` | Update token status | Authenticated |
| GET | `/api/token/patient/:patientId` | Get tokens by patient | Authenticated |

### Doctor
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/doctor/waiting` | Get waiting patients | Doctor, Admin |
| POST | `/api/doctor/diagnosis` | Add diagnosis | Doctor, Admin |
| POST | `/api/doctor/consultation` | Add consultation (alias) | Doctor, Admin |
| GET | `/api/doctor/history/:tokenId` | Get diagnosis history | Doctor, Admin |
| GET | `/api/doctor/my-diagnoses` | Get doctor's diagnoses | Doctor, Admin |
| PUT | `/api/doctor/diagnosis/:id` | Update diagnosis | Doctor, Admin |

### Lab
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/lab/pending` | Get pending tests | Lab, Admin |
| POST | `/api/lab/report` | Add lab report | Lab, Admin |
| GET | `/api/lab/tests/:tokenId` | Get tests by token | Lab, Admin |
| POST | `/api/lab/complete/:tokenId` | Complete lab tests | Lab, Admin |
| GET | `/api/lab/my-reports` | Get technician's reports | Lab, Admin |

### Pharmacy
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/pharmacy/pending` | Get pending prescriptions | Pharmacy, Admin |
| POST | `/api/pharmacy/issue` | Issue medicines | Pharmacy, Admin |
| GET | `/api/pharmacy/prescription/:tokenId` | Get prescription | Pharmacy, Admin |
| PUT | `/api/pharmacy/payment/:id` | Update payment status | Pharmacy, Admin |
| GET | `/api/pharmacy/my-issues` | Get pharmacist's issues | Pharmacy, Admin |

### AI Disease Prediction
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/predict-disease` | Predict disease from symptoms | Doctor, Admin |
| GET | `/api/predict-disease/dataset` | Get medical dataset | Doctor, Admin |
| POST | `/api/predict-disease/dataset` | Add disease to dataset | Admin |
| GET | `/api/predict-disease/symptoms` | Get symptoms list | Doctor, Admin |

### Analytics
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/analytics/dashboard` | Dashboard summary | Admin |
| GET | `/api/analytics/patient-trends` | Patient trends | Admin |
| GET | `/api/analytics/department-load` | Department load | Admin |
| GET | `/api/analytics/disease-stats` | Disease statistics | Admin |
| GET | `/api/analytics/disease-trends` | Disease trends over time | Admin |
| GET | `/api/analytics/medicine-usage` | Medicine usage analytics | Admin |
| GET | `/api/analytics/area-disease-distribution` | Area-wise disease distribution | Admin |

## AI Disease Prediction

The system includes an AI-like disease prediction feature that works by matching symptoms against a medical dataset.

### How it works:
1. Submit an array of symptoms
2. System searches the medical dataset
3. Returns predicted disease with confidence score
4. Includes recommended tests, medicines, and health advice

### Example Request:
```json
POST /api/predict-disease
{
  "symptoms": ["fever", "headache", "body ache"]
}
```

### Example Response:
```json
{
  "success": true,
  "data": {
    "primaryPrediction": {
      "disease": "Influenza (Flu)",
      "confidence": 42.86,
      "matchedSymptoms": 3,
      "recommendedTests": ["Rapid Influenza Test", "CBC"],
      "recommendedMedicines": ["Oseltamivir", "Paracetamol"],
      "healthAdvice": "Complete bed rest, stay hydrated...",
      "severity": "moderate"
    },
    "alternativePredictions": [...]
  }
}
```

## Token Workflow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   RECEPTIONIST  │───▶│     DOCTOR      │───▶│   LAB (if req)  │
│ Register Patient│    │   Consultation  │    │   Lab Tests     │
│  Generate Token │    │   + Diagnosis   │    │                 │
│  Status: doctor │    │                 │    │                 │
└─────────────────┘    └────────┬────────┘    └────────┬────────┘
                                │                      │
                                ▼                      ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │    PHARMACY     │◀───│                 │
                       │ Issue Medicines │    │                 │
                       └────────┬────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │    COMPLETED    │
                       │   Visit Done    │
                       └─────────────────┘
```

## Token Number Format
- Format: `HMS-YYYY-XXXX`
- Example: `HMS-2026-0001`
- Auto-increments yearly

## Token Statuses
- `doctor` - Patient queued for doctor consultation
- `lab` - Sent for lab tests
- `pharmacy` - At pharmacy for medicines
- `completed` - Visit completed

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medsync
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access**: Middleware authorization
- **Security Headers**: helmet middleware
- **Rate Limiting**: 100 requests per 15 minutes per IP

## Medical Dataset

The system includes 20 pre-seeded diseases covering:
- Respiratory: Common Cold, Flu, Bronchitis, Pneumonia, Asthma, Sinusitis
- Infectious: UTI, Dengue, Typhoid, Malaria, Chickenpox, Conjunctivitis
- Chronic: Hypertension, Diabetes, Anemia, Arthritis
- Gastrointestinal: Gastroenteritis, Food Poisoning
- Neurological: Migraine
- Dermatological: Skin Allergy

## License

MIT License

## Author

MedSync Team
