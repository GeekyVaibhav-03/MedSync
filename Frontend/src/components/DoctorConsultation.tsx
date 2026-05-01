import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  FileText,
  Pill,
  FlaskConical,
  Search,
  X,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  User,
  Calendar,
  Phone,
  MapPin,
  Activity,
  Heart,
  ThermometerSun,
  Brain,
  Send,
  Clock,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { predictionAPI, doctorAPI, tokenAPI } from '@/services/api';
import debounce from 'lodash/debounce';

interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  address?: string;
  area?: string;
  bloodGroup?: string;
  medicalHistory?: string;
}

interface Token {
  _id: string;
  tokenNumber: string;
  patientId: Patient;
  symptoms: string;
  priority: string;
  status: string;
  department: string;
  createdAt: string;
}

interface DiseaseSuggestion {
  _id: string;
  disease: string;
  category: string;
  severity: string;
}

interface MedicineSuggestion {
  disease: string;
  recommendedMedicines: string[];
  recommendedTests: string[];
  healthAdvice: string;
  severity: string;
  symptoms: string[];
}

interface Medicine {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
}

interface DoctorConsultationProps {
  token: Token;
  onComplete: () => void;
  onCancel: () => void;
}

const DoctorConsultation = ({ token, onComplete, onCancel }: DoctorConsultationProps) => {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'prescription' | 'tests' | 'notepad'>('diagnosis');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Disease state
  const [diseaseInput, setDiseaseInput] = useState('');
  const [diseaseSuggestions, setDiseaseSuggestions] = useState<DiseaseSuggestion[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<MedicineSuggestion | null>(null);
  const [showDiseaseSuggestions, setShowDiseaseSuggestions] = useState(false);
  const [loadingDisease, setLoadingDisease] = useState(false);

  // Symptoms state for AI prediction
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [allSymptoms, setAllSymptoms] = useState<string[]>([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState<string[]>([]);
  const [showSymptomSuggestions, setShowSymptomSuggestions] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [predicting, setPredicting] = useState(false);

  // Medicines state
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [allMedicines, setAllMedicines] = useState<string[]>([]);

  // Tests state
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [allTests, setAllTests] = useState<string[]>([]);
  const [testSearchQuery, setTestSearchQuery] = useState('');

  // Notes
  const [prescription, setPrescription] = useState('');
  const [healthAdvice, setHealthAdvice] = useState('');
  const [notes, setNotes] = useState('');

  // Notepad State
  const [notepadImageUrl, setNotepadImageUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize Canvas
  useEffect(() => {
    if (activeTab === 'notepad' && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctxRef.current = ctx;
        // Fill white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // If already has drawing, redraw it (simplistic approach: we just let them save before switching)
      }
    }
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Support mouse and touch
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current) return;
    e.preventDefault(); // prevent scrolling
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!ctxRef.current) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
    
    // Save image URL
    if (canvasRef.current) {
      setNotepadImageUrl(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current && ctxRef.current) {
      const canvas = canvasRef.current;
      ctxRef.current.fillStyle = 'white';
      ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
      setNotepadImageUrl('');
    }
  };

  const diseaseInputRef = useRef<HTMLInputElement>(null);
  const symptomInputRef = useRef<HTMLInputElement>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [symptomsRes, medicinesRes, testsRes] = await Promise.all([
          predictionAPI.getSymptomsList(),
          predictionAPI.getMedicinesList(),
          predictionAPI.getTestsList(),
        ]);
        setAllSymptoms(symptomsRes.data.data || []);
        setAllMedicines(medicinesRes.data.data || []);
        setAllTests(testsRes.data.data || []);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    loadData();
  }, []);

  // Parse symptoms from token
  useEffect(() => {
    if (token.symptoms) {
      const parsed = token.symptoms.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      setSymptoms(parsed);
    }
  }, [token.symptoms]);

  // Debounced disease search
  const searchDiseases = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setDiseaseSuggestions([]);
        return;
      }
      setLoadingDisease(true);
      try {
        const response = await predictionAPI.searchDiseases(query.trim(), 8);
        setDiseaseSuggestions(response.data.data || []);
      } catch (err) {
        console.error('Error searching diseases:', err);
      } finally {
        setLoadingDisease(false);
      }
    }, 300),
    []
  );

  // Handle disease input change
  const handleDiseaseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDiseaseInput(value);
    setShowDiseaseSuggestions(true);
    searchDiseases(value);
  };

  // Handle disease selection
  const handleSelectDisease = async (disease: DiseaseSuggestion) => {
    setDiseaseInput(disease.disease);
    setShowDiseaseSuggestions(false);
    setLoading(true);

    try {
      const response = await predictionAPI.suggestMedicines(disease.disease);
      if (response.data.success && response.data.data) {
        const data = response.data.exactMatch ? response.data.data : response.data.data[0];
        setSelectedDisease(data);
        setHealthAdvice(data.healthAdvice || '');
        
        // Auto-fill medicines
        if (data.recommendedMedicines?.length) {
          setMedicines(data.recommendedMedicines.map((med: string) => ({
            name: med,
            dosage: '1 tablet',
            duration: '7 days',
            instructions: 'After meals',
          })));
        }
        
        // Auto-fill tests
        if (data.recommendedTests?.length) {
          setSelectedTests(data.recommendedTests);
        }
      }
    } catch (err) {
      console.error('Error fetching disease details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle symptom input
  const handleSymptomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSymptomInput(value);
    if (value.length > 0) {
      setFilteredSymptoms(
        allSymptoms.filter(s => s.includes(value) && !symptoms.includes(s)).slice(0, 8)
      );
      setShowSymptomSuggestions(true);
    } else {
      setFilteredSymptoms([]);
      setShowSymptomSuggestions(false);
    }
  };

  // Add symptom
  const addSymptom = (symptom: string) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
    setSymptomInput('');
    setShowSymptomSuggestions(false);
  };

  // Remove symptom
  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  // AI Predict disease
  const handlePredictDisease = async () => {
    if (symptoms.length === 0) return;
    setPredicting(true);
    setPrediction(null);

    try {
      const response = await predictionAPI.predictDisease(symptoms);
      if (response.data.success) {
        setPrediction(response.data.data);
        
        // Auto-select primary prediction
        if (response.data.data.primaryPrediction) {
          const primary = response.data.data.primaryPrediction;
          setDiseaseInput(primary.disease);
          setSelectedDisease({
            disease: primary.disease,
            recommendedMedicines: primary.recommendedMedicines,
            recommendedTests: primary.recommendedTests,
            healthAdvice: primary.healthAdvice,
            severity: primary.severity,
            symptoms: symptoms,
          });
          setHealthAdvice(primary.healthAdvice || '');
          
          if (primary.recommendedMedicines?.length) {
            setMedicines(primary.recommendedMedicines.map((med: string) => ({
              name: med,
              dosage: '1 tablet',
              duration: '7 days',
              instructions: 'After meals',
            })));
          }
          
          if (primary.recommendedTests?.length) {
            setSelectedTests(primary.recommendedTests);
          }
        }
      }
    } catch (err) {
      console.error('Error predicting disease:', err);
    } finally {
      setPredicting(false);
    }
  };

  // Add medicine
  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '', instructions: '' }]);
  };

  // Update medicine
  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  // Remove medicine
  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  // Toggle test
  const toggleTest = (test: string) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter(t => t !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  // Submit diagnosis
  const handleSubmit = async (nextStatus: 'lab' | 'pharmacy' | 'completed') => {
    setSubmitting(true);

    try {
      // Save diagnosis
      await doctorAPI.addDiagnosis({
        tokenId: token._id,
        disease: diseaseInput,
        symptoms: symptoms.join(', '),
        prescription,
        medicines: medicines.filter(m => m.name),
        testsRecommended: selectedTests,
        notes: `${healthAdvice}\n\n${notes}`,
        notepadImageUrl: notepadImageUrl || undefined
      });

      // Update status
      await tokenAPI.updateStatus(token._id, nextStatus);
      
      onComplete();
    } catch (err) {
      console.error('Error saving diagnosis:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'severe': return 'text-red-600 bg-red-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'mild': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm overflow-auto">
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Patient Consultation</h1>
                <p className="text-muted-foreground">Token: {token.tokenNumber}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" /> Close
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Patient Info */}
            <div className="space-y-6">
              {/* Patient Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
                      {token.patientId?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{token.patientId?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {token.patientId?.age} years • {token.patientId?.gender}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {token.patientId?.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {token.patientId.phone}
                      </div>
                    )}
                    {token.patientId?.bloodGroup && (
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        Blood: {token.patientId.bloodGroup}
                      </div>
                    )}
                    {token.patientId?.area && (
                      <div className="flex items-center gap-2 text-sm col-span-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {token.patientId.area}
                      </div>
                    )}
                  </div>

                  {token.patientId?.medicalHistory && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Medical History</p>
                      <p className="text-sm">{token.patientId.medicalHistory}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Badge variant={token.priority === 'urgent' || token.priority === 'emergency' ? 'destructive' : 'secondary'}>
                      {token.priority}
                    </Badge>
                    <Badge variant="outline">{token.department}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* AI Symptoms Analysis */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    AI Symptom Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Symptoms Tags */}
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map(symptom => (
                      <Badge
                        key={symptom}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/20"
                        onClick={() => removeSymptom(symptom)}
                      >
                        {symptom}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>

                  {/* Add Symptom */}
                  <div className="relative">
                    <input
                      ref={symptomInputRef}
                      type="text"
                      value={symptomInput}
                      onChange={handleSymptomInputChange}
                      placeholder="Add symptom..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <AnimatePresence>
                      {showSymptomSuggestions && filteredSymptoms.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-auto"
                        >
                          {filteredSymptoms.map(symptom => (
                            <button
                              key={symptom}
                              onClick={() => addSymptom(symptom)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                            >
                              {symptom}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button
                    onClick={handlePredictDisease}
                    disabled={symptoms.length === 0 || predicting}
                    className="w-full gap-2"
                  >
                    {predicting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" />
                        Predict Disease
                      </>
                    )}
                  </Button>

                  {/* Prediction Results */}
                  <AnimatePresence>
                    {prediction && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        {prediction.primaryPrediction && (
                          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-primary">
                                {prediction.primaryPrediction.disease}
                              </span>
                              <Badge className={getSeverityColor(prediction.primaryPrediction.severity)}>
                                {prediction.primaryPrediction.severity}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Activity className="h-4 w-4" />
                              Confidence: {prediction.primaryPrediction.confidence}%
                            </div>
                          </div>
                        )}
                        
                        {prediction.alternativePredictions?.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">Other possibilities:</p>
                            {prediction.alternativePredictions.map((alt: any, i: number) => (
                              <button
                                key={i}
                                onClick={() => handleSelectDisease({ _id: '', disease: alt.disease, category: '', severity: '' })}
                                className="w-full flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted text-sm transition-colors"
                              >
                                <span>{alt.disease}</span>
                                <span className="text-xs text-muted-foreground">{alt.confidence}%</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            {/* Middle & Right Panel - Diagnosis Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="flex gap-2 p-1 bg-muted rounded-lg">
                {[
                  { id: 'diagnosis', label: 'Diagnosis', icon: FileText },
                  { id: 'prescription', label: 'Prescription', icon: Pill },
                  { id: 'tests', label: 'Lab Tests', icon: FlaskConical },
                  { id: 'notepad', label: 'Notepad', icon: FileText },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'diagnosis' && (
                  <motion.div
                    key="diagnosis"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardContent className="pt-6 space-y-6">
                        {/* Disease Input with Autocomplete */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Disease / Condition</label>
                          <div className="relative">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <input
                                ref={diseaseInputRef}
                                type="text"
                                value={diseaseInput}
                                onChange={handleDiseaseInputChange}
                                onFocus={() => setShowDiseaseSuggestions(diseaseInput.length >= 2)}
                                placeholder="Type disease name..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                              {loadingDisease && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                              )}
                            </div>
                            
                            <AnimatePresence>
                              {showDiseaseSuggestions && diseaseSuggestions.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute z-20 w-full mt-2 bg-background border border-border rounded-xl shadow-lg max-h-64 overflow-auto"
                                >
                                  {diseaseSuggestions.map(disease => (
                                    <button
                                      key={disease._id}
                                      onClick={() => handleSelectDisease(disease)}
                                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-0"
                                    >
                                      <div>
                                        <p className="font-medium text-left">{disease.disease}</p>
                                        <p className="text-xs text-muted-foreground">{disease.category}</p>
                                      </div>
                                      <Badge className={getSeverityColor(disease.severity)}>
                                        {disease.severity}
                                      </Badge>
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Selected Disease Info */}
                        {selectedDisease && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-primary">{selectedDisease.disease}</h4>
                              <Badge className={getSeverityColor(selectedDisease.severity)}>
                                {selectedDisease.severity}
                              </Badge>
                            </div>
                            
                            {selectedDisease.recommendedMedicines?.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Recommended Medicines:</p>
                                <div className="flex flex-wrap gap-1">
                                  {selectedDisease.recommendedMedicines.slice(0, 5).map(med => (
                                    <Badge key={med} variant="secondary" className="text-xs">
                                      {med}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {selectedDisease.recommendedTests?.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Recommended Tests:</p>
                                <div className="flex flex-wrap gap-1">
                                  {selectedDisease.recommendedTests.slice(0, 5).map(test => (
                                    <Badge key={test} variant="outline" className="text-xs">
                                      {test}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Prescription Notes */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Prescription Notes</label>
                          <textarea
                            value={prescription}
                            onChange={(e) => setPrescription(e.target.value)}
                            placeholder="Enter prescription details and treatment plan..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>

                        {/* Health Advice */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Health Advice for Patient</label>
                          <textarea
                            value={healthAdvice}
                            onChange={(e) => setHealthAdvice(e.target.value)}
                            placeholder="Lifestyle recommendations, diet suggestions..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === 'prescription' && (
                  <motion.div
                    key="prescription"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Medicines</h3>
                          <Button variant="outline" size="sm" onClick={addMedicine}>
                            <Plus className="h-4 w-4 mr-1" /> Add Medicine
                          </Button>
                        </div>

                        {medicines.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Pill className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No medicines added yet</p>
                            <p className="text-sm">Click "Add Medicine" or select a disease for auto-suggestions</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {medicines.map((medicine, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl border border-border bg-muted/30 space-y-3"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Medicine {index + 1}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeMedicine(index)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="col-span-2">
                                    <input
                                      type="text"
                                      value={medicine.name}
                                      onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                                      placeholder="Medicine name"
                                      list={`medicines-${index}`}
                                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                    <datalist id={`medicines-${index}`}>
                                      {allMedicines.slice(0, 20).map(med => (
                                        <option key={med} value={med} />
                                      ))}
                                    </datalist>
                                  </div>
                                  <input
                                    type="text"
                                    value={medicine.dosage}
                                    onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                                    placeholder="Dosage (e.g., 1 tablet)"
                                    className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                  />
                                  <input
                                    type="text"
                                    value={medicine.duration}
                                    onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                                    placeholder="Duration (e.g., 7 days)"
                                    className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                  />
                                  <input
                                    type="text"
                                    value={medicine.instructions}
                                    onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                                    placeholder="Instructions (e.g., After meals)"
                                    className="col-span-2 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === 'tests' && (
                  <motion.div
                    key="tests"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <h3 className="font-semibold">Recommended Lab Tests</h3>
                        
                        {/* Selected Tests */}
                        {selectedTests.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/50">
                            {selectedTests.map(test => (
                              <Badge
                                key={test}
                                variant="default"
                                className="cursor-pointer"
                                onClick={() => toggleTest(test)}
                              >
                                {test}
                                <X className="h-3 w-3 ml-1" />
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Available Tests */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search Tests (e.g. Blood, Urine...)"
                            value={testSearchQuery}
                            onChange={(e) => setTestSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-4"
                          />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                          {allTests
                            .filter(test => test.toLowerCase().includes(testSearchQuery.toLowerCase()))
                            .map(test => (
                            <button
                              key={test}
                              onClick={() => toggleTest(test)}
                              className={`p-3 rounded-lg border text-sm text-left transition-all ${
                                selectedTests.includes(test)
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {selectedTests.includes(test) ? (
                                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                ) : (
                                  <FlaskConical className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                )}
                                <span className="line-clamp-2">{test}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === 'notepad' && (
                  <motion.div
                    key="notepad"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Canvas Notepad</CardTitle>
                        <Button variant="destructive" size="sm" onClick={clearCanvas}>
                          Clear Notepad
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Draw your prescription or notes here. It will be attached with the diagnosis.
                        </p>
                        <div className="border border-border rounded-lg overflow-hidden bg-white shadow-inner cursor-crosshair relative">
                          <canvas
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="bg-white block touch-none w-full"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Additional Notes */}
              <Card>
                <CardContent className="pt-6">
                  <label className="text-sm font-medium mb-2 block">Additional Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any other observations or notes..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => handleSubmit('lab')}
                  disabled={submitting || !diseaseInput}
                >
                  <FlaskConical className="h-4 w-4" />
                  Send to Lab
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => handleSubmit('pharmacy')}
                  disabled={submitting || !diseaseInput}
                >
                  <Pill className="h-4 w-4" />
                  Send to Pharmacy
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={() => handleSubmit('completed')}
                  disabled={submitting || !diseaseInput}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Complete & Discharge
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorConsultation;
