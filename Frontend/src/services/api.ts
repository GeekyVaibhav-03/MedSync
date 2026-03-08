import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) => 
    api.post('/api/auth/login', data),
  register: (data: { name: string; email: string; password: string; role: string; department?: string }) => 
    api.post('/api/auth/register', data),
  getProfile: () => 
    api.get('/api/auth/me'),
};

// Patient API
export const patientAPI = {
  register: (data: {
    name: string;
    age: number;
    gender: string;
    phone?: string;
    address?: string;
    area?: string;
    bloodGroup?: string;
    medicalHistory?: string;
  }) => api.post('/api/patient/register', data),
  getAll: (params?: { page?: number; limit?: number; search?: string }) => 
    api.get('/api/patient', { params }),
  getById: (id: string) => 
    api.get(`/api/patient/${id}`),
  search: (query: string) => 
    api.get('/api/patient/search', { params: { q: query } }),
  update: (id: string, data: any) => 
    api.put(`/api/patient/${id}`, data),
};

// Token API
export const tokenAPI = {
  generate: (data: {
    patientId: string;
    department: string;
    symptoms?: string;
    priority?: 'normal' | 'urgent' | 'emergency';
    assignedDoctor?: string;
  }) => api.post('/api/token/generate', data),
  getQueue: (params?: { status?: string; department?: string; date?: string }) => 
    api.get('/api/token/queue', { params }),
  getById: (id: string) => 
    api.get(`/api/token/${id}`),
  updateStatus: (id: string, status: string) => 
    api.put(`/api/token/${id}/status`, { status }),
  getByPatient: (patientId: string) => 
    api.get(`/api/token/patient/${patientId}`),
};

// Doctor API
export const doctorAPI = {
  getWaitingPatients: () => 
    api.get('/api/doctor/waiting'),
  addDiagnosis: (data: {
    tokenId: string;
    disease?: string;
    symptoms?: string;
    prescription?: string;
    medicines?: Array<{ name: string; dosage: string; duration: string; instructions?: string }>;
    testsRecommended?: string[];
    notes?: string;
    followUpDate?: Date;
  }) => api.post('/api/doctor/diagnosis', data),
  getDiagnosisHistory: (tokenId: string) => 
    api.get(`/api/doctor/history/${tokenId}`),
  getMyDiagnoses: (params?: { page?: number; limit?: number; date?: string }) => 
    api.get('/api/doctor/my-diagnoses', { params }),
  updateDiagnosis: (id: string, data: any) => 
    api.put(`/api/doctor/diagnosis/${id}`, data),
  startConsultation: (tokenId: string) => 
    api.put(`/api/token/${tokenId}/status`, { status: 'doctor' }),
};

// Lab API
export const labAPI = {
  getPendingTests: () => 
    api.get('/api/lab/pending'),
  addReport: (data: {
    tokenId: string;
    testName: string;
    testCategory?: string;
    result: string;
    normalRange?: string;
    unit?: string;
    status?: 'normal' | 'abnormal' | 'critical';
    remarks?: string;
  }) => api.post('/api/lab/report', data),
  getTestsByToken: (tokenId: string) => 
    api.get(`/api/lab/tests/${tokenId}`),
  completeTests: (tokenId: string) => 
    api.post(`/api/lab/complete/${tokenId}`),
  getMyReports: (params?: { page?: number; limit?: number; date?: string }) => 
    api.get('/api/lab/my-reports', { params }),
};

// Pharmacy API
export const pharmacyAPI = {
  getPendingTokens: () => 
    api.get('/api/pharmacy/pending'),
  getPrescription: (tokenId: string) => 
    api.get(`/api/pharmacy/prescription/${tokenId}`),
  issueMedicines: (data: {
    tokenId: string;
    medicines: Array<{ name: string; quantity: number; price?: number }>;
    paymentStatus?: 'pending' | 'paid' | 'partial';
    totalAmount?: number;
    notes?: string;
  }) => api.post('/api/pharmacy/issue', data),
  getMyIssues: (params?: { page?: number; limit?: number; date?: string }) => 
    api.get('/api/pharmacy/my-issues', { params }),
  updatePayment: (id: string, data: { paymentStatus: string; totalAmount?: number }) => 
    api.put(`/api/pharmacy/payment/${id}`, data),
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () => 
    api.get('/api/analytics/dashboard'),
  getPatientTrends: (params?: { period?: string }) => 
    api.get('/api/analytics/patient-trends', { params }),
  getDepartmentStats: () => 
    api.get('/api/analytics/department-stats'),
  getRevenueStats: (params?: { period?: string }) => 
    api.get('/api/analytics/revenue', { params }),
};

export default api;
