import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, CheckCircle, Package, Search, Filter, CreditCard, AlertCircle, RefreshCw, X } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { pharmacyAPI } from '@/services/api';

interface PendingPrescription {
  _id: string;
  tokenNumber: string;
  patientId: {
    _id: string;
    name: string;
    age: number;
    gender: string;
  };
  priority: string;
  createdAt: string;
  prescription?: {
    disease?: string;
    medicines?: Array<{ name: string; dosage?: string; duration?: string }>;
    prescription?: string;
  };
}

const PharmacyDashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [pendingPrescriptions, setPendingPrescriptions] = useState<PendingPrescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<PendingPrescription | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dispenseForm, setDispenseForm] = useState({
    medicines: '',
    totalAmount: '',
    paymentStatus: 'paid',
    notes: '',
  });

  const fetchPendingPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await pharmacyAPI.getPendingTokens();
      setPendingPrescriptions(response.data.data || []);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPrescriptions();
    const interval = setInterval(fetchPendingPrescriptions, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDispense = async () => {
    if (!selectedPrescription) return;
    setSubmitting(true);

    try {
      const medicines = dispenseForm.medicines.split(',').map((m, i) => ({
        name: m.trim(),
        quantity: 1,
        price: 100,
      }));

      await pharmacyAPI.issueMedicines({
        tokenId: selectedPrescription._id,
        medicines,
        paymentStatus: dispenseForm.paymentStatus as 'pending' | 'paid' | 'partial',
        totalAmount: parseFloat(dispenseForm.totalAmount) || 0,
        notes: dispenseForm.notes,
      });

      setDispenseForm({ medicines: '', totalAmount: '', paymentStatus: 'paid', notes: '' });
      setShowDispenseModal(false);
      setSelectedPrescription(null);
      fetchPendingPrescriptions();
    } catch (err) {
      console.error('Error dispensing:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPrescriptions = pendingPrescriptions.filter(p => 
    p.patientId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pharmacy Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome, {user?.name || 'Pharmacist'}. Dispense medicines efficiently.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={fetchPendingPrescriptions}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatCard icon={Pill} value={pendingPrescriptions.length.toString()} label="Pending Prescriptions" color="warning" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard icon={CheckCircle} value="0" label="Dispensed Today" color="success" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard icon={CreditCard} value="₹0" label="Today's Revenue" color="primary" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard icon={Clock} value="~5 min" label="Avg. Processing" color="info" />
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Prescriptions */}
        <div className="lg:col-span-2">
          <div className="healthcare-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold text-foreground">Pending Prescriptions</h2>
              <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-32"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading prescriptions...</div>
            ) : filteredPrescriptions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No pending prescriptions</div>
            ) : (
              <div className="space-y-3">
                {filteredPrescriptions.map((prescription, i) => (
                  <motion.div
                    key={prescription._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedPrescription(prescription)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPrescription?._id === prescription._id 
                        ? 'border-success bg-success/5' 
                        : 'border-border hover:border-success/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-success/10">
                          <Pill className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{prescription.patientId?.name}</h3>
                            <span className="text-xs text-muted-foreground">({prescription.tokenNumber})</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {prescription.prescription?.disease || 'Prescription ready'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{formatTime(prescription.createdAt)}</p>
                      </div>
                    </div>
                    {prescription.prescription?.medicines && prescription.prescription.medicines.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {prescription.prescription.medicines.map((med, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded-lg bg-muted">
                            {med.name} {med.dosage && `- ${med.dosage}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Selected Prescription */}
          {selectedPrescription ? (
            <div className="healthcare-card">
              <h3 className="font-semibold text-foreground mb-4">Prescription Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                    <Pill className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{selectedPrescription.patientId?.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedPrescription.tokenNumber}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-medium">{selectedPrescription.patientId?.age} years</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize">{selectedPrescription.patientId?.gender}</p>
                  </div>
                </div>

                {selectedPrescription.prescription?.disease && (
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">Diagnosis</p>
                    <p className="text-sm font-medium">{selectedPrescription.prescription.disease}</p>
                  </div>
                )}

                {selectedPrescription.prescription?.medicines && selectedPrescription.prescription.medicines.length > 0 && (
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-2">Prescribed Medicines</p>
                    <ul className="space-y-1">
                      {selectedPrescription.prescription.medicines.map((med, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-2">
                          <Pill className="h-3 w-3 text-success" />
                          {med.name} {med.dosage && `(${med.dosage})`} {med.duration && `- ${med.duration}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <Button className="w-full gap-2" onClick={() => setShowDispenseModal(true)}>
                    <CheckCircle className="h-4 w-4" /> Dispense Medicines
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="healthcare-card">
              <h3 className="font-semibold text-foreground mb-4">Instructions</h3>
              <p className="text-sm text-muted-foreground">
                Select a prescription from the pending list to view details and dispense medicines.
              </p>
              <div className="mt-4 p-4 bg-success/5 rounded-xl border border-success/20">
                <p className="text-sm text-success font-medium">Final Step in Workflow</p>
                <p className="text-xs text-muted-foreground mt-1">
                  After dispensing, the patient's visit is marked as complete.
                </p>
              </div>
            </div>
          )}

          {/* Workflow Info */}
          <div className="healthcare-card bg-gradient-to-br from-success/5 to-primary/5">
            <h3 className="font-semibold text-foreground mb-4">Token Status</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">✓</div>
                <span className="text-muted-foreground">Registration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">✓</div>
                <span className="text-muted-foreground">Doctor Consultation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">✓</div>
                <span className="text-muted-foreground">Lab Tests (if any)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center text-xs font-bold text-success">→</div>
                <span className="font-medium">Pharmacy (Current)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dispense Modal */}
      {showDispenseModal && selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Dispense Medicines</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowDispenseModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              Patient: <span className="font-medium text-foreground">{selectedPrescription.patientId?.name}</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Medicines Issued (comma separated)</label>
                <input
                  type="text"
                  value={dispenseForm.medicines}
                  onChange={(e) => setDispenseForm({ ...dispenseForm, medicines: e.target.value })}
                  placeholder="Paracetamol 10 tabs, Amoxicillin 21 caps"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Total Amount (₹)</label>
                  <input
                    type="number"
                    value={dispenseForm.totalAmount}
                    onChange={(e) => setDispenseForm({ ...dispenseForm, totalAmount: e.target.value })}
                    placeholder="0"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Payment Status</label>
                  <select
                    value={dispenseForm.paymentStatus}
                    onChange={(e) => setDispenseForm({ ...dispenseForm, paymentStatus: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Notes</label>
                <textarea
                  value={dispenseForm.notes}
                  onChange={(e) => setDispenseForm({ ...dispenseForm, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <Button className="w-full gap-2" onClick={handleDispense} disabled={submitting}>
                {submitting ? 'Processing...' : <><CheckCircle className="h-4 w-4" /> Complete & Mark Visit Done</>}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDashboard;
