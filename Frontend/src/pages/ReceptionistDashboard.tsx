import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, Ticket, Users, Clock, Search, CheckCircle, 
  User, Phone, MapPin, Calendar, Heart, AlertCircle, 
  ChevronRight, Printer, Activity, RefreshCw
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { patientAPI, tokenAPI } from '@/services/api';

interface PatientForm {
  name: string;
  age: string;
  gender: string;
  phone: string;
  address: string;
  area: string;
  bloodGroup: string;
  emergencyContact: string;
  symptoms: string;
  department: string;
  priority: string;
}

const initialFormState: PatientForm = {
  name: '',
  age: '',
  gender: '',
  phone: '',
  address: '',
  area: '',
  bloodGroup: '',
  emergencyContact: '',
  symptoms: '',
  department: 'OPD',
  priority: 'normal',
};

const departments = ['OPD', 'Cardiology', 'Neurology', 'Dentistry', 'Orthopedics', 'Pediatrics', 'Gynecology', 'General Medicine'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface TokenData {
  _id: string;
  tokenNumber: string;
  patientId: { name: string; phone?: string };
  department: string;
  status: string;
  priority: string;
  createdAt: string;
}

const ReceptionistDashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [formData, setFormData] = useState<PatientForm>(initialFormState);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [error, setError] = useState('');

  // Fetch today's tokens
  const fetchTokens = async () => {
    try {
      setLoadingTokens(true);
      const response = await tokenAPI.getQueue();
      setTokens(response.data.data.all || []);
    } catch (err) {
      console.error('Error fetching tokens:', err);
    } finally {
      setLoadingTokens(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    // Refresh every 30 seconds
    const interval = setInterval(fetchTokens, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Step 1: Register patient
      const patientResponse = await patientAPI.register({
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender.toLowerCase(),
        phone: formData.phone,
        address: formData.address,
        area: formData.area,
        bloodGroup: formData.bloodGroup || 'unknown',
        medicalHistory: '',
      });

      const patientId = patientResponse.data.data._id;

      // Step 2: Generate token for the patient
      const tokenResponse = await tokenAPI.generate({
        patientId,
        department: formData.department,
        symptoms: formData.symptoms,
        priority: formData.priority as 'normal' | 'urgent' | 'emergency',
      });

      const tokenData = tokenResponse.data.data;
      setGeneratedToken(tokenData.tokenNumber);
      setShowTokenModal(true);
      
      // Refresh the token list
      fetchTokens();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error registering patient. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewPatient = () => {
    setFormData(initialFormState);
    setShowTokenModal(false);
    setGeneratedToken(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-warning/10 text-warning';
      case 'doctor': return 'bg-info/10 text-info';
      case 'lab': return 'bg-purple-500/10 text-purple-500';
      case 'pharmacy': return 'bg-success/10 text-success';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting': return 'Waiting';
      case 'doctor': return 'With Doctor';
      case 'lab': return 'In Lab';
      case 'pharmacy': return 'At Pharmacy';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Calculate stats
  const stats = {
    total: tokens.length,
    waiting: tokens.filter(t => t.status === 'waiting').length,
    inQueue: tokens.filter(t => ['waiting', 'doctor'].includes(t.status)).length,
    completed: tokens.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reception Desk</h1>
          <p className="text-muted-foreground mt-1">Welcome, {user?.name || 'Receptionist'}. Register patients and generate tokens.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchTokens} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loadingTokens ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 text-violet-500">
            <Activity className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">Active Reception</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatCard icon={Ticket} value={stats.total.toString()} label="Tokens Today" color="primary" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard icon={Users} value={stats.inQueue.toString()} label="In Queue" color="warning" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard icon={CheckCircle} value={stats.completed.toString()} label="Completed" color="success" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard icon={Clock} value={stats.waiting.toString()} label="Waiting" color="info" />
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient Registration Form */}
        <div className="lg:col-span-2">
          <div className="healthcare-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Patient Registration & Token Generation</h2>
                <p className="text-sm text-muted-foreground">Fill in patient details to generate a token</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Personal Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter patient name"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Age *</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="Age"
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                        required
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" /> Contact Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Emergency Contact</label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="Emergency contact number"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Area/Locality</label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="Area or locality"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" /> Medical Information
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                    >
                      <option value="">Select</option>
                      {bloodGroups.map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Department *</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                      required
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                    >
                      <option value="normal">Normal</option>
                      <option value="high">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-foreground mb-2 block">Symptoms / Reason for Visit *</label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    placeholder="Describe the symptoms or reason for visit"
                    rows={3}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2 py-6 text-base" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Ticket className="h-5 w-5" /> Generate Token
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Panel - Token Queue */}
        <div className="space-y-6">
          {/* Search Existing Patient */}
          <div className="healthcare-card">
            <h3 className="font-semibold text-foreground mb-4">Search Patient</h3>
            <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none placeholder:text-muted-foreground flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Search existing patients to quickly generate tokens</p>
          </div>

          {/* Today's Token Queue */}
          <div className="healthcare-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Today's Tokens</h3>
              <span className="text-xs text-muted-foreground">{tokens.length} total</span>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {loadingTokens ? (
                <div className="text-center py-8 text-muted-foreground">Loading tokens...</div>
              ) : tokens.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No tokens yet today</div>
              ) : (
                tokens.map((token) => (
                  <div key={token._id} className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {token.patientId?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{token.patientId?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{token.tokenNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(token.status)}`}>
                        {getStatusLabel(token.status)}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{formatTime(token.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Token Flow Info */}
          <div className="healthcare-card bg-gradient-to-br from-violet-500/5 to-primary/5">
            <h3 className="font-semibold text-foreground mb-4">Token Flow</h3>
            <div className="space-y-3">
              {[
                { step: 1, label: 'Waiting', icon: Clock, desc: 'Patient waits for turn' },
                { step: 2, label: 'Doctor', icon: User, desc: 'Consultation with doctor' },
                { step: 3, label: 'Lab Tests', icon: AlertCircle, desc: 'If tests are needed' },
                { step: 4, label: 'Pharmacy', icon: CheckCircle, desc: 'Collect medicines' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  {i < 3 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Token Generated Modal */}
      {showTokenModal && generatedToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="text-center">
              <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Token Generated!</h2>
              <p className="text-muted-foreground mb-6">Patient has been registered successfully</p>
              
              <div className="bg-muted rounded-xl p-6 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Token Number</p>
                <p className="text-3xl font-bold text-primary">{generatedToken}</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm"><span className="text-muted-foreground">Patient:</span> <span className="font-medium">{formData.name}</span></p>
                  <p className="text-sm"><span className="text-muted-foreground">Department:</span> <span className="font-medium">{formData.department}</span></p>
                  <p className="text-sm"><span className="text-muted-foreground">Priority:</span> <span className={`font-medium ${formData.priority === 'high' ? 'text-destructive' : ''}`}>{formData.priority === 'high' ? 'Urgent' : 'Normal'}</span></p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" onClick={() => window.print()}>
                  <Printer className="h-4 w-4" /> Print Token
                </Button>
                <Button className="flex-1 gap-2" onClick={handleNewPatient}>
                  <UserPlus className="h-4 w-4" /> New Patient
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistDashboard;
