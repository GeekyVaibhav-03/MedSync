import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Clock, CheckCircle, AlertTriangle, FileText, Search, RefreshCw, X } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { labAPI, prescriptionAPI } from '@/services/api';

interface PendingTest {
  _id: string;
  tokenNumber: string;
  patientId: {
    _id: string;
    name: string;
    age: number;
    gender: string;
  };
  symptoms: string;
  priority: string;
  createdAt: string;
  recommendedTests: string[];
  completedTests: string[];
}

const LabDashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [pendingTests, setPendingTests] = useState<PendingTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<PendingTest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [uploadingReport, setUploadingReport] = useState(false);

  const [resultForm, setResultForm] = useState({
    testName: '',
    result: '',
    normalRange: '',
    unit: '',
    status: 'normal',
    remarks: '',
    reportFileUrl: '',
    fileData: '',
    fileName: ''
  });

  const fetchPendingTests = async () => {
    try {
      setLoading(true);
      const response = await labAPI.getPendingTests();
      setPendingTests(response.data.data || []);
    } catch (err) {
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTests();
    const interval = setInterval(fetchPendingTests, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResultForm(prev => ({
          ...prev,
          fileData: reader.result as string,
          fileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddResult = async () => {
    if (!selectedTest || !resultForm.testName || !resultForm.fileData) return;
    setSubmitting(true);
    setSuccessMessage('');

    try {
      let finalReportUrl = resultForm.reportFileUrl;

      // Handle upload if file data exists
      if (resultForm.fileData && !finalReportUrl) {
        setUploadingReport(true);
        const uploadRes = await labAPI.uploadLabReportFile({ fileData: resultForm.fileData });
        finalReportUrl = uploadRes.data.data.reportFileUrl;
        setUploadingReport(false);
      }

      await labAPI.addReport({
        tokenId: selectedTest._id,
        testName: resultForm.testName,
        result: resultForm.result || 'Report uploaded',
        reportFileUrl: finalReportUrl
      });

      await labAPI.completeTests(selectedTest._id);

      setResultForm({ testName: '', result: '', normalRange: '', unit: '', status: 'normal', remarks: '', reportFileUrl: '', fileData: '', fileName: '' });
      setShowResultModal(false);
      setSelectedTest(null);
      setSuccessMessage('File uploaded successfully and sent to the doctor.');
      fetchPendingTests();
    } catch (err) {
      console.error('Error adding result:', err);
      setUploadingReport(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTests = pendingTests.filter(test => 
    test.patientId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-2xl font-bold text-foreground">Lab Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome, {user?.name || 'Lab Technician'}. Manage lab tests efficiently.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={fetchPendingTests}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatCard icon={FlaskConical} value={pendingTests.length.toString()} label="Pending Tests" color="warning" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard icon={CheckCircle} value="0" label="Completed Today" color="success" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard icon={Clock} value="~25 min" label="Avg. Processing" color="info" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard icon={AlertTriangle} value={pendingTests.filter(t => t.priority === 'urgent' || t.priority === 'emergency').length.toString()} label="Urgent" color="primary" />
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Tests */}
        <div className="lg:col-span-2">
          <div className="healthcare-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold text-foreground">Pending Lab Tests</h2>
              <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-40"
                />
              </div>
            </div>

            {successMessage && (
              <div className="mb-4 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-medium text-success">
                {successMessage}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading tests...</div>
            ) : filteredTests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No pending lab tests</div>
            ) : (
              <div className="space-y-3">
                {filteredTests.map((test, i) => (
                  <motion.div
                    key={test._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedTest(test)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedTest?._id === test._id 
                        ? 'border-warning bg-warning/5' 
                        : 'border-border hover:border-warning/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        test.priority === 'urgent' || test.priority === 'emergency' ? 'bg-destructive/10' : 'bg-warning/10'
                      }`}>
                        <FlaskConical className={`h-5 w-5 ${test.priority === 'urgent' || test.priority === 'emergency' ? 'text-destructive' : 'text-warning'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{test.patientId?.name}</h3>
                          <span className="text-xs text-muted-foreground">({test.tokenNumber})</span>
                          {(test.priority === 'urgent' || test.priority === 'emergency') && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-destructive/10 text-destructive">Urgent</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {test.recommendedTests?.length > 0 
                            ? `Tests: ${test.recommendedTests.join(', ')}` 
                            : 'No specific tests ordered'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{formatTime(test.createdAt)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Selected Test Details */}
          {selectedTest ? (
            <div className="healthcare-card">
              <h3 className="font-semibold text-foreground mb-4">Patient Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <FlaskConical className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{selectedTest.patientId?.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedTest.tokenNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-medium">{selectedTest.patientId?.age} years</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize">{selectedTest.patientId?.gender}</p>
                  </div>
                </div>
                
                {selectedTest.recommendedTests?.length > 0 && (
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground mb-2">Recommended Tests</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTest.recommendedTests.map((test, i) => (
                        <span key={i} className="px-2 py-1 bg-warning/10 text-warning rounded-full text-xs">
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTest.completedTests?.length > 0 && (
                  <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                    <p className="text-sm text-muted-foreground mb-2">Completed Tests</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTest.completedTests.map((test, i) => (
                        <span key={i} className="px-2 py-1 bg-success/10 text-success rounded-full text-xs">
                          {test} ✓
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Button className="w-full gap-2" onClick={() => setShowResultModal(true)}>
                    <FileText className="h-4 w-4" /> Upload Report & Send to Doctor
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-primary border-primary hover:bg-primary/5"
                    onClick={async () => {
                      const pdfWindow = window.open('', '_blank');
                      if (pdfWindow) pdfWindow.document.write('Loading Digital Prescription...');
                      try {
                        const res = await prescriptionAPI.getPdfUrl(selectedTest._id);
                      if (res?.data?.data?.pdfUrl && pdfWindow) {
                        pdfWindow.location.href = res.data.data.pdfUrl;
                      } else if (res?.data?.pdfUrl && pdfWindow) {
                        pdfWindow.location.href = res.data.pdfUrl;
                        } else if (pdfWindow) {
                          pdfWindow.document.write('Error: Could not load the prescription.');
                        }
                      } catch (err) {
                        if (pdfWindow) pdfWindow.document.write('Error loading prescription PDF.');
                        console.error(err);
                      }
                    }}
                  >
                    <FileText className="h-4 w-4" /> View Digital Prescription
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="healthcare-card">
              <h3 className="font-semibold text-foreground mb-4">Instructions</h3>
              <p className="text-sm text-muted-foreground">
                Select a patient from the pending list to view details and add test results.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-warning/20 flex items-center justify-center text-xs font-bold text-warning">1</div>
                  <span>Select patient</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-warning/20 flex items-center justify-center text-xs font-bold text-warning">2</div>
                  <span>Process required tests</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-warning/20 flex items-center justify-center text-xs font-bold text-warning">3</div>
                  <span>Add results</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-warning/20 flex items-center justify-center text-xs font-bold text-warning">4</div>
                  <span>Send to doctor</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Result Modal */}
      {showResultModal && selectedTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Add Test Result</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowResultModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-5">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground pb-2 border-b">
                  Patient: <span className="font-medium text-foreground">{selectedTest.patientId?.name}</span>
                </div>
                {selectedTest.recommendedTests?.length > 0 && (
                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-sm text-muted-foreground mb-2">Doctor Recommended Tests</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTest.recommendedTests.map((test, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setResultForm(prev => ({ ...prev, testName: test }))}
                          className={`rounded-full px-3 py-1 text-xs transition-colors ${
                            resultForm.testName === test
                              ? 'bg-warning text-warning-foreground'
                              : 'bg-warning/10 text-warning hover:bg-warning/20'
                          }`}
                        >
                          {test}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium mb-1 block">Test Name *</label>
                  <input
                    type="text"
                    value={resultForm.testName}
                    onChange={(e) => setResultForm({ ...resultForm, testName: e.target.value })}
                    placeholder="Write the test name"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Upload PDF or Document *</label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      id="labReportUpload"
                      className="w-full rounded-xl border border-input bg-background text-sm p-2 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    {resultForm.fileData && (
                      <span className="text-xs text-primary font-medium tracking-tight">✓ File ready to be uploaded.</span>
                    )}
                  </div>
                </div>
                <Button className="w-full gap-2 mt-4" onClick={handleAddResult} disabled={submitting || uploadingReport || !resultForm.testName || !resultForm.fileData}>
                  {(submitting || uploadingReport) ? 'Uploading...' : <><CheckCircle className="h-4 w-4" /> Upload File & Send to Doctor</>}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LabDashboard;
