import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Stethoscope, Clock, CheckCircle, AlertCircle, FileText, Pill, FlaskConical, ChevronRight, RefreshCw, Send, X } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { doctorAPI, tokenAPI } from '@/services/api';

interface WaitingPatient {
  _id: string;
  tokenNumber: string;
  patientId: {
    _id: string;
    name: string;
    age: number;
    gender: string;
    phone?: string;
  };
  symptoms: string;
  priority: string;
  status: string;
  department: string;
  createdAt: string;
}

const DoctorDashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [waitingPatients, setWaitingPatients] = useState<WaitingPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<WaitingPatient | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [diagnosisForm, setDiagnosisForm] = useState({
    disease: '',
    prescription: '',
    medicines: '',
    testsRecommended: '',
    notes: '',
  });

  const fetchWaitingPatients = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getWaitingPatients();
      setWaitingPatients(response.data.data || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitingPatients();
    const interval = setInterval(fetchWaitingPatients, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStartConsultation = async (patient: WaitingPatient) => {
    try {
      await tokenAPI.updateStatus(patient._id, 'doctor');
      setSelectedPatient(patient);
      fetchWaitingPatients();
    } catch (err) {
      console.error('Error starting consultation:', err);
    }
  };

  const handleCompleteDiagnosis = async () => {
    if (!selectedPatient) return;
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
        tokenId: selectedPatient._id,
        disease: diagnosisForm.disease,
        prescription: diagnosisForm.prescription,
        medicines,
        testsRecommended,
        notes: diagnosisForm.notes,
      });

      // Reset form and close modal
      setDiagnosisForm({ disease: '', prescription: '', medicines: '', testsRecommended: '', notes: '' });
      setShowDiagnosisModal(false);
      setSelectedPatient(null);
      fetchWaitingPatients();
    } catch (err) {
      console.error('Error saving diagnosis:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendToPharmacy = async () => {
    if (!selectedPatient) return;
    try {
      await tokenAPI.updateStatus(selectedPatient._id, 'pharmacy');
      setSelectedPatient(null);
      fetchWaitingPatients();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSendToLab = async () => {
    if (!selectedPatient) return;
    try {
      await tokenAPI.updateStatus(selectedPatient._id, 'lab');
      setSelectedPatient(null);
      fetchWaitingPatients();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const getWaitTime = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const stats = {
    waiting: waitingPatients.filter(p => p.status === 'waiting').length,
    inConsultation: waitingPatients.filter(p => p.status === 'doctor').length,
    total: waitingPatients.length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Dr. {user?.name || 'Doctor'}. You have patients waiting.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchWaitingPatients} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium">Available for Consultation</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatCard icon={Users} value={stats.waiting.toString()} label="Patients Waiting" color="warning" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard icon={Stethoscope} value={stats.inConsultation.toString()} label="In Consultation" color="info" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard icon={Clock} value={stats.total.toString()} label="Total Queue" color="primary" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard icon={CheckCircle} value="0" label="Completed Today" color="success" />
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Waiting Queue */}
        <div className="lg:col-span-2">
          <div className="healthcare-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Waiting Patients</h2>
              <span className="text-sm text-muted-foreground">{waitingPatients.length} in queue</span>
            </div>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading patients...</div>
            ) : waitingPatients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No patients waiting</div>
            ) : (
              <div className="space-y-3">
                {waitingPatients.map((patient, i) => (
                  <motion.div
                    key={patient._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedPatient(patient)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPatient?._id === patient._id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        patient.priority === 'urgent' || patient.priority === 'emergency' 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {patient.patientId?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{patient.patientId?.name}</h3>
                          <span className="text-xs text-muted-foreground">({patient.tokenNumber})</span>
                          {(patient.priority === 'urgent' || patient.priority === 'emergency') && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-destructive/10 text-destructive">Urgent</span>
                          )}
                          {patient.status === 'doctor' && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-info/10 text-info">In Consultation</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {patient.patientId?.age} yrs, {patient.patientId?.gender} • {patient.symptoms || 'No symptoms listed'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{getWaitTime(patient.createdAt)}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Patient / Quick Actions */}
        <div className="space-y-6">
          {selectedPatient ? (
            <div className="healthcare-card">
              <h3 className="font-semibold text-foreground mb-4">Patient Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                    {selectedPatient.patientId?.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{selectedPatient.patientId?.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedPatient.tokenNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-medium">{selectedPatient.patientId?.age} years</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize">{selectedPatient.patientId?.gender}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Symptoms</p>
                  <p className="font-medium text-sm">{selectedPatient.symptoms || 'Not specified'}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Department</p>
                  <p className="font-medium text-sm">{selectedPatient.department}</p>
                </div>
                <div className="space-y-2">
                  {selectedPatient.status === 'waiting' ? (
                    <Button className="w-full gap-2" onClick={() => handleStartConsultation(selectedPatient)}>
                      <Stethoscope className="h-4 w-4" /> Start Consultation
                    </Button>
                  ) : (
                    <Button className="w-full gap-2" onClick={() => setShowDiagnosisModal(true)}>
                      <FileText className="h-4 w-4" /> Add Diagnosis
                    </Button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="gap-1" onClick={handleSendToLab}>
                      <FlaskConical className="h-3 w-3" /> Send to Lab
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" onClick={handleSendToPharmacy}>
                      <Pill className="h-3 w-3" /> Send to Pharmacy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="healthcare-card">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3" disabled>
                  <FileText className="h-4 w-4 text-primary" /> Select a patient first
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">Click on a patient from the queue to start consultation</p>
            </div>
          )}

          {/* Token Flow Info */}
          <div className="healthcare-card bg-gradient-to-br from-info/5 to-primary/5">
            <h3 className="font-semibold text-foreground mb-4">Workflow</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-warning/20 flex items-center justify-center text-xs font-bold text-warning">1</div>
                <span>Patient arrives (Waiting)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-info/20 flex items-center justify-center text-xs font-bold text-info">2</div>
                <span>Start Consultation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-500">3</div>
                <span>Add Diagnosis → Lab/Pharmacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis Modal */}
      {showDiagnosisModal && selectedPatient && (
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
              Patient: <span className="font-medium text-foreground">{selectedPatient.patientId?.name}</span> ({selectedPatient.tokenNumber})
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Disease/Condition</label>
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
                <label className="text-sm font-medium mb-2 block">Lab Tests Recommended (comma separated)</label>
                <input
                  type="text"
                  value={diagnosisForm.testsRecommended}
                  onChange={(e) => setDiagnosisForm({ ...diagnosisForm, testsRecommended: e.target.value })}
                  placeholder="CBC, Blood Sugar, Lipid Profile"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
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
              <Button className="w-full gap-2" onClick={handleCompleteDiagnosis} disabled={submitting}>
                {submitting ? 'Saving...' : <><Send className="h-4 w-4" /> Save & Send to Next Step</>}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
