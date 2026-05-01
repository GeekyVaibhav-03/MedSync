import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Stethoscope, Clock, CheckCircle, AlertCircle, FileText, Pill, FlaskConical, ChevronRight, RefreshCw, Send, X, Search, History } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { doctorAPI, tokenAPI } from '@/services/api';
import DoctorConsultation from '@/components/DoctorConsultation';

interface PatientData {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  address?: string;
}

interface TokenData {
  _id: string;
  tokenNumber: string;
  patientId: PatientData;
  symptoms: string;
  priority: string;
  status: string;
  department: string;
  createdAt: string;
}

interface PreviousDiagnosis {
  _id: string;
  disease: string;
  prescription: string;
  medicines: Array<{ name: string; dosage?: string; duration?: string }>;
  testsRecommended: Array<{ testName: string }>;
  notes: string;
  createdAt: string;
  doctorId?: { name: string; department: string };
}

interface PreviousLabReport {
  _id: string;
  testName: string;
  result: string;
  status: string;
  normalRange?: string;
  reportDate: string;
}

interface PatientReport {
  _id: string;
  title: string;
  reportType: string;
  description?: string;
  reportDate: string;
  uploadedBy?: { name: string; role: string };
}

interface PatientHistory {
  totalPreviousVisits: number;
  previousDiagnoses: PreviousDiagnosis[];
  previousLabReports: PreviousLabReport[];
  patientReports?: PatientReport[];
}

const DoctorDashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [searchToken, setSearchToken] = useState('');
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  const [patientHistory, setPatientHistory] = useState<PatientHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [diagnosisForm, setDiagnosisForm] = useState({
    disease: '',
    prescription: '',
    medicines: '',
    testsRecommended: '',
    notes: '',
    sendTo: 'pharmacy' as 'pharmacy' | 'lab',
  });
  const [todayStats, setTodayStats] = useState({ waiting: 0, inConsultation: 0, completed: 0 });

  // Fetch today's stats only (not patient list)
  const fetchTodayStats = async () => {
    try {
      const response = await doctorAPI.getWaitingPatients();
      const patients = response.data.data || [];
      setTodayStats({
        waiting: patients.filter((p: any) => p.status === 'waiting').length,
        inConsultation: patients.filter((p: any) => p.status === 'doctor').length,
        completed: patients.filter((p: any) => p.status === 'completed').length,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchTodayStats();
    const interval = setInterval(fetchTodayStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchToken = async () => {
    if (!searchToken.trim()) {
      setSearchError('Please enter a token number');
      return;
    }

    setLoading(true);
    setSearchError('');
    setSelectedToken(null);
    setPatientHistory(null);

    try {
      const response = await tokenAPI.searchByTokenNumber(searchToken.trim());
      const data = response.data.data;
      setSelectedToken(data.token);
      setPatientHistory(data.patientHistory);
    } catch (err: any) {
      setSearchError(err.response?.data?.message || 'Token not found');
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = async () => {
    if (!selectedToken) return;
    try {
      await tokenAPI.updateStatus(selectedToken._id, 'doctor');
      setSelectedToken({ ...selectedToken, status: 'doctor' });
    } catch (err) {
      console.error('Error starting consultation:', err);
    }
  };

  const handleCompleteDiagnosis = async () => {
    if (!selectedToken) return;
    setSubmitting(true);

    try {
      const medicines = diagnosisForm.medicines
        ? diagnosisForm.medicines.split(',').map(m => ({
            name: m.trim(),
            dosage: 'As prescribed',
            duration: '7 days'
          }))
        : [];

      const testsRecommended = diagnosisForm.testsRecommended
        ? diagnosisForm.testsRecommended.split(',').map(t => t.trim())
        : [];

      await doctorAPI.addDiagnosis({
        tokenId: selectedToken._id,
        disease: diagnosisForm.disease,
        prescription: diagnosisForm.prescription,
        medicines,
        testsRecommended,
        notes: diagnosisForm.notes,
      });

      // Update status based on whether tests are recommended or send to choice
      const nextStatus = testsRecommended.length > 0 ? 'lab' : diagnosisForm.sendTo;
      await tokenAPI.updateStatus(selectedToken._id, nextStatus);

      // Reset form and clear selection
      setDiagnosisForm({ disease: '', prescription: '', medicines: '', testsRecommended: '', notes: '', sendTo: 'pharmacy' });
      setShowDiagnosisModal(false);
      setSelectedToken(null);
      setPatientHistory(null);
      setSearchToken('');
      fetchTodayStats();
    } catch (err) {
      console.error('Error saving diagnosis:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendToPharmacy = async () => {
    if (!selectedToken) return;
    try {
      await tokenAPI.updateStatus(selectedToken._id, 'pharmacy');
      setSelectedToken(null);
      setPatientHistory(null);
      setSearchToken('');
      fetchTodayStats();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSendToLab = async () => {
    if (!selectedToken) return;
    try {
      await tokenAPI.updateStatus(selectedToken._id, 'lab');
      setSelectedToken(null);
      setPatientHistory(null);
      setSearchToken('');
      fetchTodayStats();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Dr. {user?.name || 'Doctor'}. Search by token to start consultation.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium">Available for Consultation</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatCard icon={Users} value={todayStats.waiting.toString()} label="Patients Waiting" color="warning" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard icon={Stethoscope} value={todayStats.inConsultation.toString()} label="In Consultation" color="info" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard icon={Clock} value={(todayStats.waiting + todayStats.inConsultation).toString()} label="Total Queue" color="primary" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard icon={CheckCircle} value={todayStats.completed.toString()} label="Completed Today" color="success" />
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Token Search */}
        <div className="lg:col-span-2">
          <div className="healthcare-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Search Patient by Token</h2>
                <p className="text-sm text-muted-foreground">Enter the token number to start consultation</p>
              </div>
            </div>

            {/* Search Input */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 flex items-center gap-2 rounded-xl bg-muted px-4 py-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter token number (e.g., HMS-2026-0001)"
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchToken()}
                  className="bg-transparent text-sm outline-none placeholder:text-muted-foreground flex-1"
                />
              </div>
              <Button onClick={handleSearchToken} disabled={loading} className="gap-2">
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </Button>
            </div>

            {/* Error Message */}
            {searchError && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {searchError}
              </div>
            )}

            {/* Patient Details */}
            {selectedToken && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                        {selectedToken.patientId?.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{selectedToken.patientId?.name}</h3>
                        <p className="text-muted-foreground">{selectedToken.tokenNumber}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                          selectedToken.status === 'waiting' ? 'bg-warning/10 text-warning' :
                          selectedToken.status === 'doctor' ? 'bg-info/10 text-info' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {selectedToken.status === 'waiting' ? 'Waiting' : 
                           selectedToken.status === 'doctor' ? 'In Consultation' : selectedToken.status}
                        </span>
                      </div>
                    </div>
                    {patientHistory && patientHistory.totalPreviousVisits > 0 && (
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowHistoryModal(true)}>
                        <History className="h-4 w-4" />
                        {patientHistory.totalPreviousVisits} Previous Visits
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-background">
                      <p className="text-muted-foreground text-xs">Age</p>
                      <p className="font-medium">{selectedToken.patientId?.age} years</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background">
                      <p className="text-muted-foreground text-xs">Gender</p>
                      <p className="font-medium capitalize">{selectedToken.patientId?.gender}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background">
                      <p className="text-muted-foreground text-xs">Phone</p>
                      <p className="font-medium">{selectedToken.patientId?.phone || 'N/A'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background">
                      <p className="text-muted-foreground text-xs">Department</p>
                      <p className="font-medium">{selectedToken.department}</p>
                    </div>
                  </div>

                  {selectedToken.symptoms && (
                    <div className="mt-4 p-3 rounded-lg bg-background">
                      <p className="text-muted-foreground text-xs mb-1">Symptoms / Reason for Visit</p>
                      <p className="text-sm">{selectedToken.symptoms}</p>
                    </div>
                  )}
                </div>

                {/* Previous Diagnoses Summary */}
                {patientHistory && patientHistory.previousDiagnoses.length > 0 && (
                  <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <History className="h-4 w-4 text-warning" />
                      Previous Medical History
                    </h4>
                    <div className="space-y-2">
                      {patientHistory.previousDiagnoses.slice(0, 3).map((diagnosis, i) => (
                        <div key={i} className="p-3 rounded-lg bg-background text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">{diagnosis.disease}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(diagnosis.createdAt)}</span>
                          </div>
                          {diagnosis.medicines && diagnosis.medicines.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Medicines: {diagnosis.medicines.map(m => m.name).join(', ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {selectedToken.status === 'waiting' && (
                    <Button className="gap-2" onClick={handleStartConsultation}>
                      <Stethoscope className="h-4 w-4" /> Start Consultation
                    </Button>
                  )}
                  {(selectedToken.status === 'waiting' || selectedToken.status === 'doctor') && (
                    <>
                      <Button className="gap-2" onClick={() => setShowDiagnosisModal(true)}>
                        <FileText className="h-4 w-4" /> Add Diagnosis
                      </Button>
                      <Button variant="outline" className="gap-2" onClick={() => setShowConsultation(true)}>
                        <Stethoscope className="h-4 w-4" /> Full Consultation
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" className="gap-1" onClick={handleSendToLab}>
                    <FlaskConical className="h-3 w-3" /> Send to Lab
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1" onClick={handleSendToPharmacy}>
                    <Pill className="h-3 w-3" /> Send to Pharmacy
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!selectedToken && !searchError && !loading && (
              <div className="text-center py-12">
                <div className="h-20 w-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Search for a Patient</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Enter the patient's token number to view their details, medical history, and start consultation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Workflow */}
        <div className="space-y-6">
          <div className="healthcare-card">
            <h3 className="font-semibold text-foreground mb-4">Instructions</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">1</div>
                <p>Ask the patient for their token number</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">2</div>
                <p>Search the token to load patient details and history</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">3</div>
                <p>Review previous visits and add diagnosis</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">4</div>
                <p>Send patient to Lab or Pharmacy</p>
              </div>
            </div>
          </div>

          {/* Workflow Info */}
          <div className="healthcare-card bg-gradient-to-br from-info/5 to-primary/5">
            <h3 className="font-semibold text-foreground mb-4">Workflow</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-warning/20 flex items-center justify-center text-xs font-bold text-warning">1</div>
                <span>Patient arrives (Waiting)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-info/20 flex items-center justify-center text-xs font-bold text-info">2</div>
                <span>Doctor Consultation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-500">3</div>
                <span>Lab (if tests needed)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center text-xs font-bold text-success">4</div>
                <span>Pharmacy (medicine pickup)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis Modal */}
      {showDiagnosisModal && selectedToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Add Diagnosis</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowDiagnosisModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              Patient: <span className="font-medium text-foreground">{selectedToken.patientId?.name}</span> ({selectedToken.tokenNumber})
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Disease/Condition *</label>
                <input
                  type="text"
                  value={diagnosisForm.disease}
                  onChange={(e) => setDiagnosisForm({ ...diagnosisForm, disease: e.target.value })}
                  placeholder="e.g., Viral Fever, Hypertension"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Prescription Notes</label>
                <textarea
                  value={diagnosisForm.prescription}
                  onChange={(e) => setDiagnosisForm({ ...diagnosisForm, prescription: e.target.value })}
                  placeholder="Treatment notes and instructions..."
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Medicines (comma separated)</label>
                <input
                  type="text"
                  value={diagnosisForm.medicines}
                  onChange={(e) => setDiagnosisForm({ ...diagnosisForm, medicines: e.target.value })}
                  placeholder="Paracetamol, Amoxicillin, Vitamin C"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Lab Tests Required (comma separated)</label>
                <input
                  type="text"
                  value={diagnosisForm.testsRecommended}
                  onChange={(e) => setDiagnosisForm({ ...diagnosisForm, testsRecommended: e.target.value })}
                  placeholder="CBC, Blood Sugar, Lipid Profile (leave empty if none)"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-1">If tests are added, patient will be sent to Lab first</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Send To (if no tests)</label>
                <select
                  value={diagnosisForm.sendTo}
                  onChange={(e) => setDiagnosisForm({ ...diagnosisForm, sendTo: e.target.value as 'pharmacy' | 'lab' })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="pharmacy">Pharmacy (collect medicines)</option>
                  <option value="lab">Lab (additional tests)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Additional Notes</label>
                <textarea
                  value={diagnosisForm.notes}
                  onChange={(e) => setDiagnosisForm({ ...diagnosisForm, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={2}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <Button className="w-full gap-2" onClick={handleCompleteDiagnosis} disabled={submitting || !diagnosisForm.disease}>
                {submitting ? 'Saving...' : <><Send className="h-4 w-4" /> Save Diagnosis & Send Patient</>}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Patient History Modal */}
      {showHistoryModal && patientHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Patient Medical History</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowHistoryModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Previous Diagnoses */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Previous Diagnoses ({patientHistory.previousDiagnoses.length})
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {patientHistory.previousDiagnoses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No previous diagnoses</p>
                ) : (
                  patientHistory.previousDiagnoses.map((diagnosis, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">{diagnosis.disease}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(diagnosis.createdAt)}</span>
                      </div>
                      {diagnosis.prescription && (
                        <p className="text-sm text-muted-foreground mb-2">{diagnosis.prescription}</p>
                      )}
                      {diagnosis.medicines && diagnosis.medicines.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {diagnosis.medicines.map((m, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 rounded-lg bg-muted">
                              {m.name} {m.dosage && `- ${m.dosage}`}
                            </span>
                          ))}
                        </div>
                      )}
                      {diagnosis.doctorId && (
                        <p className="text-xs text-muted-foreground">
                          By Dr. {diagnosis.doctorId.name} ({diagnosis.doctorId.department})
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Previous Lab Reports */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                Previous Lab Reports ({patientHistory.previousLabReports.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {patientHistory.previousLabReports.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No previous lab reports</p>
                ) : (
                  patientHistory.previousLabReports.map((report, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border flex justify-between items-center">
                      <div>
                        <span className="font-medium text-sm">{report.testName}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          report.status === 'normal' ? 'bg-success/10 text-success' :
                          report.status === 'critical' ? 'bg-destructive/10 text-destructive' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{report.result}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(report.reportDate)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Patient Reports (Uploaded by Receptionist) */}
            {patientHistory.patientReports && patientHistory.patientReports.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Uploaded Reports ({patientHistory.patientReports.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {patientHistory.patientReports.map((report, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-sm">{report.title}</span>
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-muted">
                            {report.reportType.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{formatDate(report.reportDate)}</p>
                      </div>
                      {report.description && (
                        <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                      )}
                      {report.uploadedBy && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploaded by: {report.uploadedBy.name} ({report.uploadedBy.role})
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Full Consultation Mode */}
      {showConsultation && selectedToken && (
        <DoctorConsultation
          token={selectedToken}
          onComplete={() => {
            setShowConsultation(false);
            setSelectedToken(null);
            setPatientHistory(null);
            setSearchToken('');
            fetchTodayStats();
          }}
          onCancel={() => setShowConsultation(false)}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
