/**
 * Comprehensive Medical Dataset - 120 Diseases
 * Used for AI-like disease prediction and doctor auto-suggestions
 */

const medicalDataset = [
  // ==================== RESPIRATORY DISEASES (15) ====================
  {
    disease: 'Common Cold',
    symptoms: ['runny nose', 'sneezing', 'sore throat', 'mild fever', 'cough', 'congestion', 'watery eyes'],
    recommendedTests: ['Complete Blood Count'],
    recommendedMedicines: ['Paracetamol', 'Cetirizine', 'Vitamin C', 'Nasal Decongestant'],
    healthAdvice: 'Rest well, drink plenty of fluids, avoid cold beverages. Usually resolves in 7-10 days.',
    category: 'respiratory',
    severity: 'mild'
  },
  {
    disease: 'Influenza (Flu)',
    symptoms: ['high fever', 'body ache', 'headache', 'fatigue', 'chills', 'cough', 'sore throat', 'muscle pain'],
    recommendedTests: ['Rapid Influenza Test', 'Complete Blood Count', 'Chest X-Ray'],
    recommendedMedicines: ['Oseltamivir', 'Paracetamol', 'Ibuprofen', 'Vitamin C'],
    healthAdvice: 'Complete bed rest, stay hydrated, isolate to prevent spread. Seek medical attention if symptoms worsen.',
    category: 'respiratory',
    severity: 'moderate'
  },
  {
    disease: 'Bronchitis',
    symptoms: ['persistent cough', 'mucus production', 'chest discomfort', 'fatigue', 'shortness of breath', 'mild fever', 'wheezing'],
    recommendedTests: ['Chest X-Ray', 'Sputum Culture', 'Pulmonary Function Test'],
    recommendedMedicines: ['Ambroxol', 'Azithromycin', 'Salbutamol Inhaler', 'Paracetamol', 'Guaifenesin'],
    healthAdvice: 'Stop smoking, use humidifier, drink warm fluids, rest adequately.',
    category: 'respiratory',
    severity: 'moderate'
  },
  {
    disease: 'Pneumonia',
    symptoms: ['high fever', 'cough with phlegm', 'chest pain', 'difficulty breathing', 'chills', 'fatigue', 'rapid breathing'],
    recommendedTests: ['Chest X-Ray', 'Complete Blood Count', 'Sputum Culture', 'Blood Culture', 'Pulse Oximetry'],
    recommendedMedicines: ['Amoxicillin-Clavulanic Acid', 'Azithromycin', 'Levofloxacin', 'Paracetamol'],
    healthAdvice: 'Complete bed rest, stay hydrated, complete full antibiotic course, seek immediate care if breathing worsens.',
    category: 'respiratory',
    severity: 'severe'
  },
  {
    disease: 'Asthma',
    symptoms: ['wheezing', 'shortness of breath', 'chest tightness', 'coughing', 'difficulty sleeping due to breathing', 'breathlessness'],
    recommendedTests: ['Spirometry', 'Peak Flow Test', 'Allergy Tests', 'Chest X-Ray', 'Methacholine Challenge'],
    recommendedMedicines: ['Salbutamol Inhaler', 'Budesonide Inhaler', 'Montelukast', 'Prednisolone', 'Ipratropium'],
    healthAdvice: 'Avoid triggers (dust, smoke, allergens), carry rescue inhaler always, maintain clean environment.',
    category: 'respiratory',
    severity: 'moderate'
  },
  {
    disease: 'Sinusitis',
    symptoms: ['facial pain', 'nasal congestion', 'thick nasal discharge', 'headache', 'reduced smell', 'cough', 'ear pressure'],
    recommendedTests: ['CT Scan Sinuses', 'Nasal Endoscopy', 'Allergy Tests'],
    recommendedMedicines: ['Amoxicillin', 'Fluticasone Nasal Spray', 'Pseudoephedrine', 'Saline Nasal Wash', 'Mucinex'],
    healthAdvice: 'Steam inhalation, stay hydrated, use humidifier, avoid allergens and irritants.',
    category: 'respiratory',
    severity: 'mild'
  },
  {
    disease: 'Tuberculosis',
    symptoms: ['persistent cough', 'coughing blood', 'night sweats', 'weight loss', 'fever', 'fatigue', 'chest pain'],
    recommendedTests: ['Chest X-Ray', 'Sputum AFB', 'Mantoux Test', 'GeneXpert', 'CT Chest'],
    recommendedMedicines: ['Isoniazid', 'Rifampicin', 'Pyrazinamide', 'Ethambutol', 'Vitamin B6'],
    healthAdvice: 'Complete 6-month treatment course, isolate initially, wear mask, follow DOTS protocol.',
    category: 'respiratory',
    severity: 'severe'
  },
  {
    disease: 'COPD',
    symptoms: ['chronic cough', 'shortness of breath', 'wheezing', 'chest tightness', 'frequent respiratory infections', 'fatigue'],
    recommendedTests: ['Spirometry', 'Chest X-Ray', 'CT Chest', 'Arterial Blood Gas', 'Alpha-1 Antitrypsin'],
    recommendedMedicines: ['Tiotropium', 'Salmeterol', 'Fluticasone', 'Theophylline', 'Prednisolone'],
    healthAdvice: 'Quit smoking immediately, pulmonary rehabilitation, avoid air pollution, get flu vaccine.',
    category: 'respiratory',
    severity: 'severe'
  },
  {
    disease: 'Bronchial Asthma',
    symptoms: ['recurrent wheezing', 'breathlessness', 'chest tightness', 'cough at night', 'difficulty exhaling'],
    recommendedTests: ['Spirometry', 'Peak Flow Monitoring', 'Allergy Panel', 'IgE Levels'],
    recommendedMedicines: ['Formoterol', 'Budesonide', 'Montelukast', 'Salbutamol', 'Prednisolone'],
    healthAdvice: 'Identify triggers, maintain asthma diary, regular follow-ups, emergency action plan.',
    category: 'respiratory',
    severity: 'moderate'
  },
  {
    disease: 'Allergic Rhinitis',
    symptoms: ['sneezing', 'runny nose', 'nasal congestion', 'itchy nose', 'watery eyes', 'postnasal drip'],
    recommendedTests: ['Allergy Skin Test', 'IgE Levels', 'Nasal Smear'],
    recommendedMedicines: ['Cetirizine', 'Fluticasone Nasal Spray', 'Montelukast', 'Loratadine', 'Azelastine'],
    healthAdvice: 'Avoid allergens, use air purifiers, keep windows closed during pollen season.',
    category: 'respiratory',
    severity: 'mild'
  },
  {
    disease: 'Pharyngitis',
    symptoms: ['sore throat', 'painful swallowing', 'fever', 'swollen lymph nodes', 'red throat', 'white patches on tonsils'],
    recommendedTests: ['Rapid Strep Test', 'Throat Culture', 'Complete Blood Count'],
    recommendedMedicines: ['Amoxicillin', 'Azithromycin', 'Paracetamol', 'Ibuprofen', 'Throat Lozenges'],
    healthAdvice: 'Gargle with warm salt water, drink warm fluids, rest voice, complete antibiotic course.',
    category: 'respiratory',
    severity: 'mild'
  },
  {
    disease: 'Laryngitis',
    symptoms: ['hoarse voice', 'voice loss', 'sore throat', 'dry cough', 'throat irritation', 'difficulty speaking'],
    recommendedTests: ['Laryngoscopy', 'Throat Culture'],
    recommendedMedicines: ['Paracetamol', 'Ibuprofen', 'Throat Lozenges', 'Steam Inhalation'],
    healthAdvice: 'Voice rest, stay hydrated, avoid whispering, use humidifier.',
    category: 'respiratory',
    severity: 'mild'
  },
  {
    disease: 'Pleural Effusion',
    symptoms: ['shortness of breath', 'chest pain', 'dry cough', 'fever', 'difficulty breathing when lying down'],
    recommendedTests: ['Chest X-Ray', 'CT Chest', 'Thoracentesis', 'Pleural Fluid Analysis', 'Ultrasound Chest'],
    recommendedMedicines: ['Furosemide', 'Antibiotics', 'Anti-TB drugs', 'Prednisolone'],
    healthAdvice: 'Treatment depends on cause, may need drainage, follow-up imaging essential.',
    category: 'respiratory',
    severity: 'severe'
  },
  {
    disease: 'Pulmonary Embolism',
    symptoms: ['sudden shortness of breath', 'chest pain', 'cough with blood', 'rapid heartbeat', 'leg swelling', 'anxiety'],
    recommendedTests: ['CT Pulmonary Angiography', 'D-Dimer', 'ECG', 'Echocardiography', 'Doppler Ultrasound Legs'],
    recommendedMedicines: ['Heparin', 'Warfarin', 'Rivaroxaban', 'Apixaban', 'Thrombolytics'],
    healthAdvice: 'Emergency treatment required, hospitalization needed, lifelong anticoagulation may be necessary.',
    category: 'respiratory',
    severity: 'severe'
  },
  {
    disease: 'Croup',
    symptoms: ['barking cough', 'stridor', 'hoarse voice', 'difficulty breathing', 'fever', 'runny nose'],
    recommendedTests: ['Clinical Examination', 'Neck X-Ray', 'Pulse Oximetry'],
    recommendedMedicines: ['Dexamethasone', 'Nebulized Epinephrine', 'Paracetamol', 'Humidified Air'],
    healthAdvice: 'Keep child calm, cool mist humidifier, seek emergency care if breathing difficulty worsens.',
    category: 'respiratory',
    severity: 'moderate'
  },

  // ==================== CARDIOVASCULAR DISEASES (12) ====================
  {
    disease: 'Hypertension',
    symptoms: ['headache', 'dizziness', 'chest pain', 'shortness of breath', 'nosebleed', 'fatigue', 'blurred vision'],
    recommendedTests: ['Blood Pressure Monitoring', 'ECG', 'Kidney Function Test', 'Lipid Profile', 'Echocardiography'],
    recommendedMedicines: ['Amlodipine', 'Losartan', 'Hydrochlorothiazide', 'Atenolol', 'Enalapril'],
    healthAdvice: 'Reduce salt intake, exercise regularly, maintain healthy weight, avoid stress and smoking.',
    category: 'cardiovascular',
    severity: 'moderate'
  },
  {
    disease: 'Coronary Artery Disease',
    symptoms: ['chest pain', 'angina', 'shortness of breath', 'fatigue', 'heart palpitations', 'sweating'],
    recommendedTests: ['ECG', 'Stress Test', 'Coronary Angiography', 'Echocardiography', 'Cardiac CT'],
    recommendedMedicines: ['Aspirin', 'Atorvastatin', 'Metoprolol', 'Clopidogrel', 'Nitroglycerin'],
    healthAdvice: 'Healthy diet, regular exercise, quit smoking, manage stress, take medications regularly.',
    category: 'cardiovascular',
    severity: 'severe'
  },
  {
    disease: 'Heart Failure',
    symptoms: ['shortness of breath', 'fatigue', 'swollen legs', 'rapid heartbeat', 'persistent cough', 'weight gain'],
    recommendedTests: ['Echocardiography', 'BNP/NT-proBNP', 'Chest X-Ray', 'ECG', 'Cardiac MRI'],
    recommendedMedicines: ['Furosemide', 'Carvedilol', 'Enalapril', 'Spironolactone', 'Digoxin'],
    healthAdvice: 'Restrict salt and fluid intake, daily weight monitoring, take medications as prescribed.',
    category: 'cardiovascular',
    severity: 'severe'
  },
  {
    disease: 'Atrial Fibrillation',
    symptoms: ['irregular heartbeat', 'heart palpitations', 'fatigue', 'shortness of breath', 'dizziness', 'chest discomfort'],
    recommendedTests: ['ECG', 'Holter Monitor', 'Echocardiography', 'Thyroid Function Test', 'Electrolytes'],
    recommendedMedicines: ['Warfarin', 'Rivaroxaban', 'Metoprolol', 'Amiodarone', 'Digoxin'],
    healthAdvice: 'Regular heart rhythm monitoring, avoid caffeine and alcohol, take anticoagulants as prescribed.',
    category: 'cardiovascular',
    severity: 'moderate'
  },
  {
    disease: 'Myocardial Infarction',
    symptoms: ['severe chest pain', 'pain radiating to arm', 'shortness of breath', 'sweating', 'nausea', 'anxiety'],
    recommendedTests: ['ECG', 'Troponin', 'CK-MB', 'Coronary Angiography', 'Echocardiography'],
    recommendedMedicines: ['Aspirin', 'Clopidogrel', 'Heparin', 'Morphine', 'Nitroglycerin', 'Atorvastatin'],
    healthAdvice: 'EMERGENCY - Call ambulance immediately. Chew aspirin if available. Time is critical.',
    category: 'cardiovascular',
    severity: 'severe'
  },
  {
    disease: 'Hypotension',
    symptoms: ['dizziness', 'fainting', 'blurred vision', 'nausea', 'fatigue', 'lack of concentration'],
    recommendedTests: ['Blood Pressure Monitoring', 'ECG', 'Complete Blood Count', 'Electrolytes', 'Cortisol'],
    recommendedMedicines: ['Fludrocortisone', 'Midodrine', 'Caffeine', 'Salt Tablets'],
    healthAdvice: 'Increase salt intake, stay hydrated, rise slowly from sitting, wear compression stockings.',
    category: 'cardiovascular',
    severity: 'mild'
  },
  {
    disease: 'Deep Vein Thrombosis',
    symptoms: ['leg swelling', 'leg pain', 'warmth in leg', 'red skin', 'leg cramps', 'visible veins'],
    recommendedTests: ['D-Dimer', 'Doppler Ultrasound', 'CT Venography', 'MR Venography'],
    recommendedMedicines: ['Heparin', 'Warfarin', 'Rivaroxaban', 'Apixaban', 'Compression Stockings'],
    healthAdvice: 'Avoid prolonged sitting, wear compression stockings, stay hydrated during travel.',
    category: 'cardiovascular',
    severity: 'severe'
  },
  {
    disease: 'Peripheral Artery Disease',
    symptoms: ['leg pain while walking', 'leg numbness', 'cold legs', 'weak pulse in legs', 'slow wound healing', 'leg cramps'],
    recommendedTests: ['Ankle-Brachial Index', 'Doppler Ultrasound', 'CT Angiography', 'MR Angiography'],
    recommendedMedicines: ['Cilostazol', 'Aspirin', 'Clopidogrel', 'Atorvastatin', 'Pentoxifylline'],
    healthAdvice: 'Quit smoking, exercise regularly, control diabetes and cholesterol, foot care important.',
    category: 'cardiovascular',
    severity: 'moderate'
  },
  {
    disease: 'Angina Pectoris',
    symptoms: ['chest pain', 'chest tightness', 'pain in arm', 'shortness of breath', 'fatigue', 'nausea'],
    recommendedTests: ['ECG', 'Stress Test', 'Coronary Angiography', 'Echocardiography'],
    recommendedMedicines: ['Nitroglycerin', 'Aspirin', 'Atenolol', 'Amlodipine', 'Isosorbide'],
    healthAdvice: 'Keep nitroglycerin with you, avoid triggers, rest during episodes, seek help if pain persists.',
    category: 'cardiovascular',
    severity: 'moderate'
  },
  {
    disease: 'Cardiomyopathy',
    symptoms: ['shortness of breath', 'fatigue', 'swollen legs', 'irregular heartbeat', 'dizziness', 'chest pain'],
    recommendedTests: ['Echocardiography', 'ECG', 'Cardiac MRI', 'Genetic Testing', 'Cardiac Catheterization'],
    recommendedMedicines: ['Beta Blockers', 'ACE Inhibitors', 'Diuretics', 'Anticoagulants', 'Antiarrhythmics'],
    healthAdvice: 'Avoid alcohol, limit salt intake, regular monitoring, may need implantable devices.',
    category: 'cardiovascular',
    severity: 'severe'
  },
  {
    disease: 'Rheumatic Heart Disease',
    symptoms: ['chest pain', 'shortness of breath', 'fatigue', 'heart murmur', 'swollen joints', 'fever'],
    recommendedTests: ['Echocardiography', 'ECG', 'ASO Titer', 'CRP', 'Throat Culture'],
    recommendedMedicines: ['Penicillin', 'Aspirin', 'Prednisolone', 'Diuretics', 'Warfarin'],
    healthAdvice: 'Monthly penicillin injections for prophylaxis, regular cardiac follow-ups, dental hygiene.',
    category: 'cardiovascular',
    severity: 'severe'
  },
  {
    disease: 'Varicose Veins',
    symptoms: ['bulging veins', 'leg heaviness', 'leg pain', 'itching around veins', 'skin discoloration', 'leg swelling'],
    recommendedTests: ['Doppler Ultrasound', 'Venography'],
    recommendedMedicines: ['Diosmin', 'Compression Stockings', 'Pain Relievers'],
    healthAdvice: 'Elevate legs, avoid prolonged standing, exercise regularly, wear compression stockings.',
    category: 'cardiovascular',
    severity: 'mild'
  },

  // ==================== GASTROINTESTINAL DISEASES (15) ====================
  {
    disease: 'Gastroenteritis',
    symptoms: ['diarrhea', 'vomiting', 'nausea', 'stomach cramps', 'fever', 'dehydration', 'loss of appetite'],
    recommendedTests: ['Stool Test', 'Complete Blood Count', 'Electrolytes'],
    recommendedMedicines: ['ORS', 'Ondansetron', 'Loperamide', 'Probiotics', 'Zinc'],
    healthAdvice: 'Stay hydrated with ORS, eat bland foods (BRAT diet), avoid dairy and spicy foods.',
    category: 'gastrointestinal',
    severity: 'moderate'
  },
  {
    disease: 'Gastritis',
    symptoms: ['stomach pain', 'nausea', 'vomiting', 'bloating', 'loss of appetite', 'burning sensation', 'indigestion'],
    recommendedTests: ['Upper GI Endoscopy', 'H. Pylori Test', 'Complete Blood Count'],
    recommendedMedicines: ['Omeprazole', 'Pantoprazole', 'Antacids', 'Sucralfate', 'Clarithromycin'],
    healthAdvice: 'Avoid spicy and acidic foods, eat small frequent meals, avoid NSAIDs, no alcohol.',
    category: 'gastrointestinal',
    severity: 'mild'
  },
  {
    disease: 'Peptic Ulcer Disease',
    symptoms: ['burning stomach pain', 'heartburn', 'bloating', 'nausea', 'vomiting blood', 'dark stools'],
    recommendedTests: ['Upper GI Endoscopy', 'H. Pylori Test', 'Stool Occult Blood', 'Complete Blood Count'],
    recommendedMedicines: ['Omeprazole', 'Clarithromycin', 'Amoxicillin', 'Bismuth Subsalicylate', 'Sucralfate'],
    healthAdvice: 'Complete H. pylori eradication therapy, avoid NSAIDs and alcohol, quit smoking.',
    category: 'gastrointestinal',
    severity: 'moderate'
  },
  {
    disease: 'GERD',
    symptoms: ['heartburn', 'acid reflux', 'chest pain', 'difficulty swallowing', 'regurgitation', 'chronic cough'],
    recommendedTests: ['Upper GI Endoscopy', '24-hour pH Monitoring', 'Esophageal Manometry'],
    recommendedMedicines: ['Omeprazole', 'Esomeprazole', 'Domperidone', 'Antacids', 'Sucralfate'],
    healthAdvice: 'Elevate head while sleeping, avoid late meals, lose weight, avoid trigger foods.',
    category: 'gastrointestinal',
    severity: 'mild'
  },
  {
    disease: 'Irritable Bowel Syndrome',
    symptoms: ['abdominal pain', 'bloating', 'diarrhea', 'constipation', 'mucus in stool', 'cramping'],
    recommendedTests: ['Complete Blood Count', 'Stool Test', 'Colonoscopy', 'Celiac Panel'],
    recommendedMedicines: ['Mebeverine', 'Dicyclomine', 'Loperamide', 'Fiber Supplements', 'Probiotics'],
    healthAdvice: 'Identify trigger foods, manage stress, regular exercise, high fiber diet.',
    category: 'gastrointestinal',
    severity: 'mild'
  },
  {
    disease: 'Inflammatory Bowel Disease',
    symptoms: ['chronic diarrhea', 'abdominal pain', 'bloody stool', 'weight loss', 'fatigue', 'fever'],
    recommendedTests: ['Colonoscopy', 'CT Enterography', 'CRP', 'ESR', 'Stool Calprotectin'],
    recommendedMedicines: ['Mesalamine', 'Prednisolone', 'Azathioprine', 'Infliximab', 'Metronidazole'],
    healthAdvice: 'Regular monitoring, avoid NSAIDs, nutritional support, stress management.',
    category: 'gastrointestinal',
    severity: 'severe'
  },
  {
    disease: 'Appendicitis',
    symptoms: ['right lower abdominal pain', 'nausea', 'vomiting', 'fever', 'loss of appetite', 'rebound tenderness'],
    recommendedTests: ['Complete Blood Count', 'CT Abdomen', 'Ultrasound Abdomen', 'Urinalysis'],
    recommendedMedicines: ['IV Antibiotics', 'Pain Management', 'Surgery Required'],
    healthAdvice: 'EMERGENCY - Requires immediate surgical evaluation. Do not eat or drink.',
    category: 'gastrointestinal',
    severity: 'severe'
  },
  {
    disease: 'Cholecystitis',
    symptoms: ['right upper abdominal pain', 'nausea', 'vomiting', 'fever', 'pain after fatty meals', 'shoulder pain'],
    recommendedTests: ['Ultrasound Abdomen', 'HIDA Scan', 'Complete Blood Count', 'Liver Function Test'],
    recommendedMedicines: ['Antibiotics', 'Pain Management', 'Ursodeoxycholic Acid', 'Surgery'],
    healthAdvice: 'Low fat diet, may require cholecystectomy, avoid fatty and fried foods.',
    category: 'gastrointestinal',
    severity: 'moderate'
  },
  {
    disease: 'Pancreatitis',
    symptoms: ['severe upper abdominal pain', 'pain radiating to back', 'nausea', 'vomiting', 'fever', 'rapid pulse'],
    recommendedTests: ['Serum Amylase', 'Serum Lipase', 'CT Abdomen', 'Ultrasound', 'Complete Blood Count'],
    recommendedMedicines: ['IV Fluids', 'Pain Management', 'NPO', 'Antibiotics', 'Enzyme Supplements'],
    healthAdvice: 'Avoid alcohol completely, low fat diet, small frequent meals, hospitalization required.',
    category: 'gastrointestinal',
    severity: 'severe'
  },
  {
    disease: 'Hepatitis A',
    symptoms: ['fatigue', 'nausea', 'abdominal pain', 'loss of appetite', 'jaundice', 'dark urine', 'fever'],
    recommendedTests: ['Hepatitis A IgM', 'Liver Function Test', 'Complete Blood Count'],
    recommendedMedicines: ['Supportive Care', 'Rest', 'Adequate Hydration', 'Vitamin Supplements'],
    healthAdvice: 'Rest, avoid alcohol, maintain good hygiene, vaccination available for prevention.',
    category: 'gastrointestinal',
    severity: 'moderate'
  },
  {
    disease: 'Hepatitis B',
    symptoms: ['fatigue', 'jaundice', 'abdominal pain', 'loss of appetite', 'nausea', 'joint pain', 'dark urine'],
    recommendedTests: ['HBsAg', 'HBeAg', 'Hepatitis B DNA', 'Liver Function Test', 'Fibroscan'],
    recommendedMedicines: ['Tenofovir', 'Entecavir', 'Peginterferon', 'Lamivudine'],
    healthAdvice: 'Vaccination for contacts, avoid alcohol, regular monitoring, safe sex practices.',
    category: 'gastrointestinal',
    severity: 'severe'
  },
  {
    disease: 'Cirrhosis',
    symptoms: ['fatigue', 'jaundice', 'swollen abdomen', 'leg swelling', 'easy bruising', 'confusion', 'itchy skin'],
    recommendedTests: ['Liver Function Test', 'Fibroscan', 'CT Abdomen', 'Endoscopy', 'Albumin'],
    recommendedMedicines: ['Lactulose', 'Spironolactone', 'Furosemide', 'Beta Blockers', 'Rifaximin'],
    healthAdvice: 'Avoid alcohol completely, low sodium diet, regular monitoring for complications.',
    category: 'gastrointestinal',
    severity: 'severe'
  },
  {
    disease: 'Food Poisoning',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomach cramps', 'fever', 'dehydration', 'headache'],
    recommendedTests: ['Stool Test', 'Complete Blood Count', 'Electrolytes'],
    recommendedMedicines: ['ORS', 'Ondansetron', 'Metronidazole', 'Probiotics', 'Zinc'],
    healthAdvice: 'Stay hydrated, eat bland foods, avoid dairy and fatty foods, rest well.',
    category: 'gastrointestinal',
    severity: 'mild'
  },
  {
    disease: 'Constipation',
    symptoms: ['infrequent bowel movements', 'hard stools', 'straining', 'bloating', 'abdominal discomfort', 'incomplete evacuation'],
    recommendedTests: ['Abdominal X-Ray', 'Colonoscopy', 'Thyroid Function'],
    recommendedMedicines: ['Lactulose', 'Bisacodyl', 'Polyethylene Glycol', 'Psyllium Husk', 'Senna'],
    healthAdvice: 'High fiber diet, drink plenty of water, regular exercise, don\'t ignore urge.',
    category: 'gastrointestinal',
    severity: 'mild'
  },
  {
    disease: 'Hemorrhoids',
    symptoms: ['rectal bleeding', 'anal itching', 'pain during bowel movement', 'swelling around anus', 'lump near anus'],
    recommendedTests: ['Digital Rectal Examination', 'Anoscopy', 'Colonoscopy'],
    recommendedMedicines: ['Lidocaine Cream', 'Hydrocortisone Suppository', 'Diosmin', 'Stool Softeners', 'Sitz Bath'],
    healthAdvice: 'High fiber diet, stay hydrated, avoid straining, sitz baths help relieve symptoms.',
    category: 'gastrointestinal',
    severity: 'mild'
  },

  // ==================== INFECTIOUS DISEASES (18) ====================
  {
    disease: 'Dengue Fever',
    symptoms: ['high fever', 'severe headache', 'pain behind eyes', 'joint pain', 'muscle pain', 'skin rash', 'fatigue', 'bleeding gums'],
    recommendedTests: ['Dengue NS1 Antigen', 'Dengue IgM/IgG', 'Complete Blood Count', 'Platelet Count'],
    recommendedMedicines: ['Paracetamol', 'ORS', 'IV Fluids', 'Platelet Transfusion'],
    healthAdvice: 'Complete rest, drink plenty of fluids, monitor platelet count daily, avoid NSAIDs like Aspirin/Ibuprofen.',
    category: 'infectious',
    severity: 'severe'
  },
  {
    disease: 'Typhoid Fever',
    symptoms: ['sustained fever', 'headache', 'stomach pain', 'weakness', 'loss of appetite', 'constipation', 'rose spots'],
    recommendedTests: ['Widal Test', 'Blood Culture', 'Complete Blood Count', 'Typhidot'],
    recommendedMedicines: ['Azithromycin', 'Ceftriaxone', 'Ciprofloxacin', 'Ofloxacin'],
    healthAdvice: 'Eat well-cooked food, drink boiled water, maintain strict hygiene, complete full antibiotic course.',
    category: 'infectious',
    severity: 'moderate'
  },
  {
    disease: 'Malaria',
    symptoms: ['high fever', 'chills', 'sweating', 'headache', 'nausea', 'vomiting', 'body ache', 'fatigue'],
    recommendedTests: ['Malaria Antigen Test', 'Peripheral Blood Smear', 'Complete Blood Count', 'G6PD'],
    recommendedMedicines: ['Artemether-Lumefantrine', 'Chloroquine', 'Primaquine', 'Quinine'],
    healthAdvice: 'Complete full course of antimalarials, use mosquito nets, eliminate standing water around home.',
    category: 'infectious',
    severity: 'severe'
  },
  {
    disease: 'Chickenpox',
    symptoms: ['itchy rash', 'blisters', 'fever', 'fatigue', 'loss of appetite', 'headache', 'body ache'],
    recommendedTests: ['Clinical Examination', 'VZV IgM Antibody'],
    recommendedMedicines: ['Acyclovir', 'Calamine Lotion', 'Paracetamol', 'Antihistamines'],
    healthAdvice: 'Isolate patient, keep nails short, calamine lotion for itching, avoid scratching to prevent scarring.',
    category: 'infectious',
    severity: 'mild'
  },
  {
    disease: 'Measles',
    symptoms: ['high fever', 'cough', 'runny nose', 'red eyes', 'skin rash', 'koplik spots', 'sensitivity to light'],
    recommendedTests: ['Measles IgM', 'Complete Blood Count'],
    recommendedMedicines: ['Vitamin A', 'Paracetamol', 'Supportive Care'],
    healthAdvice: 'Isolation required, rest, adequate fluids, vaccination is the best prevention.',
    category: 'infectious',
    severity: 'moderate'
  },
  {
    disease: 'Mumps',
    symptoms: ['swollen salivary glands', 'fever', 'headache', 'muscle ache', 'fatigue', 'loss of appetite', 'pain while chewing'],
    recommendedTests: ['Mumps IgM', 'Serum Amylase'],
    recommendedMedicines: ['Paracetamol', 'Ibuprofen', 'Warm/Cold Compress'],
    healthAdvice: 'Rest, soft foods, adequate fluids, isolation for prevention of spread.',
    category: 'infectious',
    severity: 'mild'
  },
  {
    disease: 'Urinary Tract Infection',
    symptoms: ['burning urination', 'frequent urination', 'cloudy urine', 'pelvic pain', 'strong urine odor', 'blood in urine'],
    recommendedTests: ['Urine Routine', 'Urine Culture', 'Ultrasound KUB'],
    recommendedMedicines: ['Nitrofurantoin', 'Ciprofloxacin', 'Trimethoprim', 'Fosfomycin'],
    healthAdvice: 'Drink plenty of water, urinate frequently, maintain hygiene, complete full antibiotic course.',
    category: 'infectious',
    severity: 'mild'
  },
  {
    disease: 'Conjunctivitis',
    symptoms: ['red eyes', 'itchy eyes', 'watery eyes', 'eye discharge', 'sensitivity to light', 'gritty feeling', 'swollen eyelids'],
    recommendedTests: ['Eye Examination', 'Conjunctival Swab'],
    recommendedMedicines: ['Moxifloxacin Eye Drops', 'Artificial Tears', 'Antihistamine Eye Drops', 'Tobramycin'],
    healthAdvice: 'Avoid touching eyes, wash hands frequently, do not share towels, use cold compress for relief.',
    category: 'infectious',
    severity: 'mild'
  },
  {
    disease: 'Cellulitis',
    symptoms: ['red skin', 'swelling', 'warmth', 'pain', 'fever', 'red streaks', 'skin tenderness'],
    recommendedTests: ['Complete Blood Count', 'Blood Culture', 'Wound Culture'],
    recommendedMedicines: ['Amoxicillin-Clavulanic Acid', 'Cephalexin', 'Clindamycin', 'Vancomycin'],
    healthAdvice: 'Elevate affected limb, complete antibiotic course, keep wound clean, watch for spreading.',
    category: 'infectious',
    severity: 'moderate'
  },
  {
    disease: 'Sepsis',
    symptoms: ['high fever', 'rapid heart rate', 'rapid breathing', 'confusion', 'low blood pressure', 'decreased urine', 'skin discoloration'],
    recommendedTests: ['Blood Culture', 'Complete Blood Count', 'Lactate', 'Procalcitonin', 'CRP'],
    recommendedMedicines: ['Broad Spectrum Antibiotics', 'IV Fluids', 'Vasopressors', 'Oxygen'],
    healthAdvice: 'EMERGENCY - Requires immediate hospitalization and ICU care.',
    category: 'infectious',
    severity: 'severe'
  },
  {
    disease: 'Tetanus',
    symptoms: ['muscle stiffness', 'jaw cramping', 'difficulty swallowing', 'muscle spasms', 'fever', 'sweating'],
    recommendedTests: ['Clinical Diagnosis', 'Wound Culture'],
    recommendedMedicines: ['Tetanus Immunoglobulin', 'Metronidazole', 'Diazepam', 'Tetanus Toxoid'],
    healthAdvice: 'ICU care required, wound debridement, vaccination is essential for prevention.',
    category: 'infectious',
    severity: 'severe'
  },
  {
    disease: 'Rabies',
    symptoms: ['fever', 'headache', 'anxiety', 'confusion', 'difficulty swallowing', 'hydrophobia', 'excessive salivation'],
    recommendedTests: ['Clinical Diagnosis', 'Direct Fluorescent Antibody Test'],
    recommendedMedicines: ['Rabies Immunoglobulin', 'Rabies Vaccine', 'Wound Cleaning'],
    healthAdvice: 'EMERGENCY - Post-exposure prophylaxis within 24 hours is critical. Clean wound immediately.',
    category: 'infectious',
    severity: 'severe'
  },
  {
    disease: 'Chikungunya',
    symptoms: ['high fever', 'severe joint pain', 'joint swelling', 'muscle pain', 'headache', 'rash', 'fatigue'],
    recommendedTests: ['Chikungunya IgM', 'Complete Blood Count', 'CRP'],
    recommendedMedicines: ['Paracetamol', 'NSAIDs', 'Rest', 'Fluids'],
    healthAdvice: 'Rest, hydration, avoid mosquito bites, joint pain may persist for months.',
    category: 'infectious',
    severity: 'moderate'
  },
  {
    disease: 'Herpes Simplex',
    symptoms: ['painful blisters', 'itching', 'tingling sensation', 'fever', 'swollen lymph nodes', 'burning sensation'],
    recommendedTests: ['HSV PCR', 'HSV IgM/IgG', 'Viral Culture'],
    recommendedMedicines: ['Acyclovir', 'Valacyclovir', 'Famciclovir', 'Topical Acyclovir'],
    healthAdvice: 'Avoid contact during outbreaks, antiviral therapy reduces recurrence.',
    category: 'infectious',
    severity: 'mild'
  },
  {
    disease: 'Shingles (Herpes Zoster)',
    symptoms: ['painful rash', 'blisters', 'burning pain', 'sensitivity to touch', 'fever', 'headache', 'fatigue'],
    recommendedTests: ['Clinical Diagnosis', 'VZV PCR', 'Tzanck Smear'],
    recommendedMedicines: ['Acyclovir', 'Valacyclovir', 'Gabapentin', 'Pregabalin', 'Pain Relievers'],
    healthAdvice: 'Start antiviral within 72 hours, pain management important, vaccine available for prevention.',
    category: 'infectious',
    severity: 'moderate'
  },
  {
    disease: 'Leptospirosis',
    symptoms: ['high fever', 'headache', 'muscle pain', 'red eyes', 'jaundice', 'abdominal pain', 'rash'],
    recommendedTests: ['Leptospira IgM', 'MAT Test', 'Blood Culture', 'Liver Function', 'Kidney Function'],
    recommendedMedicines: ['Doxycycline', 'Penicillin', 'Ceftriaxone', 'Azithromycin'],
    healthAdvice: 'Avoid wading in flood water, wear protective gear, prophylaxis in endemic areas.',
    category: 'infectious',
    severity: 'severe'
  },
  {
    disease: 'Meningitis',
    symptoms: ['severe headache', 'stiff neck', 'high fever', 'sensitivity to light', 'nausea', 'vomiting', 'confusion'],
    recommendedTests: ['Lumbar Puncture', 'CSF Analysis', 'Blood Culture', 'CT Head', 'Complete Blood Count'],
    recommendedMedicines: ['Ceftriaxone', 'Vancomycin', 'Ampicillin', 'Dexamethasone', 'Acyclovir'],
    healthAdvice: 'EMERGENCY - Immediate hospitalization required. Vaccination available for prevention.',
    category: 'infectious',
    severity: 'severe'
  },
  {
    disease: 'Scabies',
    symptoms: ['intense itching', 'rash', 'small blisters', 'burrow tracks', 'itching worse at night', 'skin sores'],
    recommendedTests: ['Skin Scraping', 'Dermoscopy'],
    recommendedMedicines: ['Permethrin Cream', 'Ivermectin', 'Antihistamines', 'Calamine Lotion'],
    healthAdvice: 'Treat all household contacts, wash bedding and clothes in hot water, repeat treatment in 1 week.',
    category: 'infectious',
    severity: 'mild'
  },

  // ==================== NEUROLOGICAL DISEASES (12) ====================
  {
    disease: 'Migraine',
    symptoms: ['severe headache', 'nausea', 'sensitivity to light', 'sensitivity to sound', 'visual disturbances', 'vomiting', 'throbbing pain'],
    recommendedTests: ['CT Scan', 'MRI Brain', 'Neurological Examination'],
    recommendedMedicines: ['Sumatriptan', 'Ibuprofen', 'Propranolol', 'Amitriptyline', 'Topiramate'],
    healthAdvice: 'Identify and avoid triggers, maintain regular sleep schedule, manage stress, stay in dark quiet room during attack.',
    category: 'neurological',
    severity: 'moderate'
  },
  {
    disease: 'Tension Headache',
    symptoms: ['dull head pain', 'pressure around forehead', 'scalp tenderness', 'neck pain', 'shoulder tightness'],
    recommendedTests: ['Clinical Examination', 'CT/MRI if chronic'],
    recommendedMedicines: ['Paracetamol', 'Ibuprofen', 'Aspirin', 'Muscle Relaxants', 'Amitriptyline'],
    healthAdvice: 'Manage stress, regular sleep, good posture, limit screen time, relaxation techniques.',
    category: 'neurological',
    severity: 'mild'
  },
  {
    disease: 'Epilepsy',
    symptoms: ['seizures', 'loss of consciousness', 'confusion', 'staring spells', 'uncontrollable jerking', 'temporary confusion'],
    recommendedTests: ['EEG', 'MRI Brain', 'CT Brain', 'Blood Tests'],
    recommendedMedicines: ['Phenytoin', 'Valproate', 'Carbamazepine', 'Levetiracetam', 'Lamotrigine'],
    healthAdvice: 'Take medications regularly, adequate sleep, avoid triggers, carry medical ID.',
    category: 'neurological',
    severity: 'moderate'
  },
  {
    disease: 'Stroke',
    symptoms: ['sudden weakness', 'facial drooping', 'arm weakness', 'speech difficulty', 'confusion', 'severe headache', 'vision problems'],
    recommendedTests: ['CT Brain', 'MRI Brain', 'CT Angiography', 'ECG', 'Echocardiography'],
    recommendedMedicines: ['tPA', 'Aspirin', 'Clopidogrel', 'Atorvastatin', 'Antihypertensives'],
    healthAdvice: 'EMERGENCY - Time is brain. Call ambulance immediately. Note symptom onset time.',
    category: 'neurological',
    severity: 'severe'
  },
  {
    disease: 'Parkinson\'s Disease',
    symptoms: ['tremor', 'slow movement', 'muscle rigidity', 'balance problems', 'shuffling walk', 'small handwriting', 'masked face'],
    recommendedTests: ['Clinical Examination', 'MRI Brain', 'DaTscan'],
    recommendedMedicines: ['Levodopa-Carbidopa', 'Pramipexole', 'Ropinirole', 'Rasagiline', 'Amantadine'],
    healthAdvice: 'Regular exercise, physical therapy, occupational therapy, medication timing is crucial.',
    category: 'neurological',
    severity: 'severe'
  },
  {
    disease: 'Alzheimer\'s Disease',
    symptoms: ['memory loss', 'confusion', 'difficulty with familiar tasks', 'language problems', 'disorientation', 'mood changes'],
    recommendedTests: ['Mini-Mental State Exam', 'MRI Brain', 'PET Scan', 'CSF Biomarkers'],
    recommendedMedicines: ['Donepezil', 'Rivastigmine', 'Memantine', 'Galantamine'],
    healthAdvice: 'Structured routine, mental stimulation, safe environment, caregiver support essential.',
    category: 'neurological',
    severity: 'severe'
  },
  {
    disease: 'Bell\'s Palsy',
    symptoms: ['facial drooping', 'difficulty closing eye', 'drooling', 'loss of taste', 'ear pain', 'sensitivity to sound'],
    recommendedTests: ['Clinical Examination', 'MRI Brain', 'EMG'],
    recommendedMedicines: ['Prednisolone', 'Acyclovir', 'Eye Lubricant', 'Eye Patch'],
    healthAdvice: 'Eye protection important, facial exercises, most cases recover within weeks to months.',
    category: 'neurological',
    severity: 'moderate'
  },
  {
    disease: 'Trigeminal Neuralgia',
    symptoms: ['severe facial pain', 'electric shock-like pain', 'pain triggered by touching face', 'pain while chewing', 'pain while speaking'],
    recommendedTests: ['MRI Brain', 'Neurological Examination'],
    recommendedMedicines: ['Carbamazepine', 'Oxcarbazepine', 'Gabapentin', 'Baclofen', 'Pregabalin'],
    healthAdvice: 'Avoid triggers, medication adjustments may be needed, surgical options available.',
    category: 'neurological',
    severity: 'moderate'
  },
  {
    disease: 'Multiple Sclerosis',
    symptoms: ['vision problems', 'numbness', 'tingling', 'muscle weakness', 'balance problems', 'fatigue', 'cognitive changes'],
    recommendedTests: ['MRI Brain and Spine', 'Lumbar Puncture', 'Evoked Potentials', 'OCT'],
    recommendedMedicines: ['Interferon Beta', 'Glatiramer', 'Fingolimod', 'Natalizumab', 'Ocrelizumab'],
    healthAdvice: 'Disease-modifying therapy important, physical therapy, manage fatigue, avoid heat.',
    category: 'neurological',
    severity: 'severe'
  },
  {
    disease: 'Vertigo',
    symptoms: ['spinning sensation', 'dizziness', 'nausea', 'vomiting', 'balance problems', 'nystagmus', 'hearing changes'],
    recommendedTests: ['Dix-Hallpike Test', 'Audiometry', 'MRI Brain', 'VNG'],
    recommendedMedicines: ['Meclizine', 'Betahistine', 'Prochlorperazine', 'Diazepam', 'Ondansetron'],
    healthAdvice: 'Avoid sudden head movements, Epley maneuver for BPPV, vestibular rehabilitation.',
    category: 'neurological',
    severity: 'mild'
  },
  {
    disease: 'Carpal Tunnel Syndrome',
    symptoms: ['hand numbness', 'tingling fingers', 'weakness', 'pain at night', 'dropping things', 'wrist pain'],
    recommendedTests: ['Nerve Conduction Study', 'EMG', 'Ultrasound Wrist'],
    recommendedMedicines: ['NSAIDs', 'Wrist Splint', 'Corticosteroid Injection', 'Gabapentin'],
    healthAdvice: 'Wrist splint at night, ergonomic adjustments, stretching exercises, surgery if severe.',
    category: 'neurological',
    severity: 'mild'
  },
  {
    disease: 'Sciatica',
    symptoms: ['lower back pain', 'leg pain', 'numbness in leg', 'tingling', 'weakness', 'pain worse when sitting'],
    recommendedTests: ['MRI Spine', 'X-Ray Spine', 'EMG', 'CT Myelography'],
    recommendedMedicines: ['Ibuprofen', 'Pregabalin', 'Muscle Relaxants', 'Epidural Steroid', 'Physical Therapy'],
    healthAdvice: 'Physical therapy, proper posture, core strengthening, avoid prolonged sitting.',
    category: 'neurological',
    severity: 'moderate'
  },

  // ==================== ENDOCRINE/METABOLIC DISEASES (12) ====================
  {
    disease: 'Type 2 Diabetes',
    symptoms: ['frequent urination', 'excessive thirst', 'fatigue', 'blurred vision', 'slow wound healing', 'weight loss', 'frequent infections'],
    recommendedTests: ['Fasting Blood Sugar', 'HbA1c', 'Oral Glucose Tolerance Test', 'Lipid Profile', 'Kidney Function'],
    recommendedMedicines: ['Metformin', 'Glimepiride', 'Sitagliptin', 'Empagliflozin', 'Insulin'],
    healthAdvice: 'Follow diabetic diet, regular exercise, monitor blood sugar daily, avoid sugary foods.',
    category: 'chronic',
    severity: 'moderate'
  },
  {
    disease: 'Type 1 Diabetes',
    symptoms: ['extreme thirst', 'frequent urination', 'unexplained weight loss', 'fatigue', 'blurred vision', 'nausea'],
    recommendedTests: ['Blood Sugar', 'HbA1c', 'C-Peptide', 'GAD Antibodies', 'Ketones'],
    recommendedMedicines: ['Rapid-Acting Insulin', 'Long-Acting Insulin', 'Insulin Pump'],
    healthAdvice: 'Insulin is essential, carbohydrate counting, blood sugar monitoring, emergency glucagon.',
    category: 'chronic',
    severity: 'severe'
  },
  {
    disease: 'Hypothyroidism',
    symptoms: ['fatigue', 'weight gain', 'cold intolerance', 'constipation', 'dry skin', 'hair loss', 'depression', 'slow heart rate'],
    recommendedTests: ['TSH', 'Free T4', 'Free T3', 'Anti-TPO Antibodies'],
    recommendedMedicines: ['Levothyroxine', 'Liothyronine'],
    healthAdvice: 'Take medication on empty stomach, regular thyroid monitoring, lifelong treatment.',
    category: 'chronic',
    severity: 'moderate'
  },
  {
    disease: 'Hyperthyroidism',
    symptoms: ['weight loss', 'rapid heartbeat', 'anxiety', 'tremors', 'sweating', 'heat intolerance', 'frequent bowel movements', 'bulging eyes'],
    recommendedTests: ['TSH', 'Free T4', 'Free T3', 'TSH Receptor Antibodies', 'Thyroid Scan'],
    recommendedMedicines: ['Methimazole', 'Propylthiouracil', 'Propranolol', 'Radioactive Iodine'],
    healthAdvice: 'Regular monitoring, avoid iodine-rich foods initially, beta blockers for symptoms.',
    category: 'chronic',
    severity: 'moderate'
  },
  {
    disease: 'Cushing\'s Syndrome',
    symptoms: ['weight gain', 'moon face', 'buffalo hump', 'purple stretch marks', 'thin skin', 'muscle weakness', 'high blood pressure'],
    recommendedTests: ['24-hour Urinary Cortisol', 'Dexamethasone Suppression Test', 'ACTH', 'MRI Pituitary', 'CT Adrenals'],
    recommendedMedicines: ['Ketoconazole', 'Metyrapone', 'Surgery', 'Radiation'],
    healthAdvice: 'Treat underlying cause, manage complications, gradual steroid tapering if drug-induced.',
    category: 'chronic',
    severity: 'severe'
  },
  {
    disease: 'Addison\'s Disease',
    symptoms: ['fatigue', 'weight loss', 'low blood pressure', 'salt craving', 'skin darkening', 'nausea', 'muscle weakness'],
    recommendedTests: ['ACTH Stimulation Test', 'Cortisol', 'ACTH', 'Electrolytes', 'Adrenal Antibodies'],
    recommendedMedicines: ['Hydrocortisone', 'Fludrocortisone', 'Prednisone'],
    healthAdvice: 'Lifelong steroid replacement, stress dose during illness, wear medical ID.',
    category: 'chronic',
    severity: 'severe'
  },
  {
    disease: 'PCOS',
    symptoms: ['irregular periods', 'excess hair growth', 'acne', 'weight gain', 'hair thinning', 'infertility', 'darkened skin'],
    recommendedTests: ['Ultrasound Pelvis', 'FSH', 'LH', 'Testosterone', 'DHEAS', 'HbA1c'],
    recommendedMedicines: ['Metformin', 'Oral Contraceptives', 'Spironolactone', 'Clomiphene', 'Letrozole'],
    healthAdvice: 'Weight management, regular exercise, healthy diet, manage insulin resistance.',
    category: 'chronic',
    severity: 'moderate'
  },
  {
    disease: 'Gout',
    symptoms: ['sudden joint pain', 'swollen joint', 'red joint', 'warmth', 'tenderness', 'limited mobility', 'tophi'],
    recommendedTests: ['Serum Uric Acid', 'Joint Fluid Analysis', 'X-Ray', 'Ultrasound Joint'],
    recommendedMedicines: ['Colchicine', 'Indomethacin', 'Allopurinol', 'Febuxostat', 'Prednisolone'],
    healthAdvice: 'Avoid purine-rich foods, limit alcohol, stay hydrated, maintain healthy weight.',
    category: 'chronic',
    severity: 'moderate'
  },
  {
    disease: 'Obesity',
    symptoms: ['excess body weight', 'breathlessness', 'increased sweating', 'snoring', 'joint pain', 'fatigue', 'low self-esteem'],
    recommendedTests: ['BMI', 'Lipid Profile', 'Fasting Glucose', 'Thyroid Function', 'Liver Function'],
    recommendedMedicines: ['Orlistat', 'Liraglutide', 'Semaglutide', 'Phentermine', 'Topiramate'],
    healthAdvice: 'Calorie reduction, regular exercise, behavioral therapy, consider bariatric surgery if severe.',
    category: 'chronic',
    severity: 'moderate'
  },
  {
    disease: 'Vitamin D Deficiency',
    symptoms: ['bone pain', 'muscle weakness', 'fatigue', 'depression', 'slow wound healing', 'hair loss', 'frequent infections'],
    recommendedTests: ['25-OH Vitamin D', 'Calcium', 'Phosphorus', 'PTH', 'Bone Density'],
    recommendedMedicines: ['Cholecalciferol', 'Ergocalciferol', 'Calcium Supplements'],
    healthAdvice: 'Sun exposure, vitamin D rich foods, regular supplementation, recheck levels.',
    category: 'chronic',
    severity: 'mild'
  },
  {
    disease: 'Iron Deficiency Anemia',
    symptoms: ['fatigue', 'weakness', 'pale skin', 'shortness of breath', 'dizziness', 'cold hands', 'brittle nails', 'headache'],
    recommendedTests: ['Complete Blood Count', 'Iron Studies', 'Ferritin', 'Peripheral Smear', 'Reticulocyte Count'],
    recommendedMedicines: ['Ferrous Sulfate', 'Ferrous Fumarate', 'Iron Sucrose IV', 'Vitamin C', 'Folic Acid'],
    healthAdvice: 'Iron-rich diet, take iron with vitamin C, avoid tea/coffee with meals, treat underlying cause.',
    category: 'chronic',
    severity: 'moderate'
  },
  {
    disease: 'Vitamin B12 Deficiency',
    symptoms: ['fatigue', 'weakness', 'numbness', 'tingling', 'balance problems', 'sore tongue', 'memory problems', 'mood changes'],
    recommendedTests: ['Serum B12', 'Complete Blood Count', 'MMA', 'Homocysteine', 'Intrinsic Factor Antibodies'],
    recommendedMedicines: ['Cyanocobalamin Injection', 'Methylcobalamin', 'Oral B12 Supplements'],
    healthAdvice: 'B12-rich foods or supplements, may need lifelong injections if pernicious anemia.',
    category: 'chronic',
    severity: 'moderate'
  },

  // ==================== MUSCULOSKELETAL DISEASES (10) ====================
  {
    disease: 'Osteoarthritis',
    symptoms: ['joint pain', 'stiffness', 'swelling', 'reduced flexibility', 'grating sensation', 'bone spurs'],
    recommendedTests: ['X-Ray Joints', 'MRI', 'Joint Fluid Analysis'],
    recommendedMedicines: ['Paracetamol', 'Ibuprofen', 'Diclofenac', 'Glucosamine', 'Hyaluronic Acid Injection'],
    healthAdvice: 'Weight management, low-impact exercise, physical therapy, joint protection.',
    category: 'musculoskeletal',
    severity: 'moderate'
  },
  {
    disease: 'Rheumatoid Arthritis',
    symptoms: ['joint pain', 'joint swelling', 'morning stiffness', 'fatigue', 'fever', 'symmetrical joint involvement'],
    recommendedTests: ['Rheumatoid Factor', 'Anti-CCP', 'ESR', 'CRP', 'X-Ray Hands', 'Ultrasound Joints'],
    recommendedMedicines: ['Methotrexate', 'Hydroxychloroquine', 'Sulfasalazine', 'Prednisolone', 'Etanercept'],
    healthAdvice: 'Early treatment essential, regular monitoring, joint protection, balanced rest and activity.',
    category: 'musculoskeletal',
    severity: 'moderate'
  },
  {
    disease: 'Osteoporosis',
    symptoms: ['back pain', 'loss of height', 'stooped posture', 'bone fractures', 'brittle bones'],
    recommendedTests: ['DEXA Scan', 'Calcium', 'Vitamin D', 'PTH', 'Bone Markers'],
    recommendedMedicines: ['Alendronate', 'Risedronate', 'Denosumab', 'Teriparatide', 'Calcium', 'Vitamin D'],
    healthAdvice: 'Weight-bearing exercise, adequate calcium and vitamin D, fall prevention, quit smoking.',
    category: 'musculoskeletal',
    severity: 'moderate'
  },
  {
    disease: 'Fibromyalgia',
    symptoms: ['widespread pain', 'fatigue', 'sleep problems', 'memory issues', 'mood disorders', 'headaches', 'tender points'],
    recommendedTests: ['Clinical Diagnosis', 'Complete Blood Count', 'Thyroid Function', 'ESR'],
    recommendedMedicines: ['Duloxetine', 'Pregabalin', 'Milnacipran', 'Amitriptyline', 'Tramadol'],
    healthAdvice: 'Regular exercise, stress management, good sleep hygiene, pacing activities.',
    category: 'musculoskeletal',
    severity: 'moderate'
  },
  {
    disease: 'Lower Back Pain',
    symptoms: ['back pain', 'muscle stiffness', 'difficulty standing', 'limited mobility', 'pain radiating to legs'],
    recommendedTests: ['X-Ray Spine', 'MRI Spine', 'CT Scan'],
    recommendedMedicines: ['Paracetamol', 'Ibuprofen', 'Muscle Relaxants', 'Pregabalin', 'Physical Therapy'],
    healthAdvice: 'Good posture, core strengthening, ergonomic workplace, avoid prolonged sitting.',
    category: 'musculoskeletal',
    severity: 'mild'
  },
  {
    disease: 'Cervical Spondylosis',
    symptoms: ['neck pain', 'stiffness', 'headache', 'arm pain', 'numbness in arms', 'grinding sound'],
    recommendedTests: ['X-Ray Cervical Spine', 'MRI Cervical Spine', 'EMG'],
    recommendedMedicines: ['NSAIDs', 'Muscle Relaxants', 'Pregabalin', 'Cervical Collar', 'Physical Therapy'],
    healthAdvice: 'Neck exercises, proper pillow height, avoid prolonged looking down, physical therapy.',
    category: 'musculoskeletal',
    severity: 'mild'
  },
  {
    disease: 'Frozen Shoulder',
    symptoms: ['shoulder pain', 'limited movement', 'stiffness', 'difficulty sleeping on affected side', 'progressive restriction'],
    recommendedTests: ['X-Ray Shoulder', 'MRI Shoulder', 'Ultrasound'],
    recommendedMedicines: ['NSAIDs', 'Corticosteroid Injection', 'Physical Therapy', 'Hydrodilatation'],
    healthAdvice: 'Stretching exercises, physical therapy essential, may take 1-3 years to resolve.',
    category: 'musculoskeletal',
    severity: 'moderate'
  },
  {
    disease: 'Tennis Elbow',
    symptoms: ['elbow pain', 'weak grip', 'pain when lifting', 'pain when gripping', 'tenderness on outer elbow'],
    recommendedTests: ['Clinical Examination', 'X-Ray', 'MRI', 'Ultrasound'],
    recommendedMedicines: ['NSAIDs', 'Elbow Strap', 'Corticosteroid Injection', 'Physical Therapy'],
    healthAdvice: 'Rest, ice, counterforce brace, stretching exercises, modify activities.',
    category: 'musculoskeletal',
    severity: 'mild'
  },
  {
    disease: 'Plantar Fasciitis',
    symptoms: ['heel pain', 'pain worse in morning', 'pain after standing', 'stabbing pain', 'tenderness'],
    recommendedTests: ['Clinical Examination', 'X-Ray Foot', 'Ultrasound'],
    recommendedMedicines: ['NSAIDs', 'Orthotics', 'Night Splint', 'Corticosteroid Injection', 'Physical Therapy'],
    healthAdvice: 'Stretching exercises, proper footwear, heel cups, weight management.',
    category: 'musculoskeletal',
    severity: 'mild'
  },
  {
    disease: 'Ankylosing Spondylitis',
    symptoms: ['lower back pain', 'morning stiffness', 'pain at night', 'fatigue', 'reduced flexibility', 'eye inflammation'],
    recommendedTests: ['HLA-B27', 'X-Ray Sacroiliac Joints', 'MRI Spine', 'ESR', 'CRP'],
    recommendedMedicines: ['NSAIDs', 'Sulfasalazine', 'Anti-TNF agents', 'Physical Therapy'],
    healthAdvice: 'Regular exercise essential, maintain posture, avoid smoking, swimming recommended.',
    category: 'musculoskeletal',
    severity: 'moderate'
  },

  // ==================== DERMATOLOGICAL DISEASES (12) ====================
  {
    disease: 'Eczema (Atopic Dermatitis)',
    symptoms: ['itchy skin', 'dry skin', 'red patches', 'scaly skin', 'skin thickening', 'oozing blisters'],
    recommendedTests: ['Clinical Examination', 'Skin Prick Test', 'IgE Levels', 'Patch Test'],
    recommendedMedicines: ['Moisturizers', 'Hydrocortisone', 'Tacrolimus', 'Antihistamines', 'Dupilumab'],
    healthAdvice: 'Regular moisturizing, avoid triggers, mild soaps, avoid scratching.',
    category: 'dermatological',
    severity: 'mild'
  },
  {
    disease: 'Psoriasis',
    symptoms: ['red patches', 'silvery scales', 'dry skin', 'itching', 'burning', 'thick nails', 'joint pain'],
    recommendedTests: ['Clinical Examination', 'Skin Biopsy', 'Rheumatoid Factor'],
    recommendedMedicines: ['Topical Steroids', 'Calcipotriol', 'Methotrexate', 'Cyclosporine', 'Biologics'],
    healthAdvice: 'Moisturize regularly, avoid triggers, moderate sun exposure, manage stress.',
    category: 'dermatological',
    severity: 'moderate'
  },
  {
    disease: 'Acne Vulgaris',
    symptoms: ['pimples', 'blackheads', 'whiteheads', 'oily skin', 'scarring', 'painful nodules'],
    recommendedTests: ['Clinical Examination', 'Hormonal Panel if severe'],
    recommendedMedicines: ['Benzoyl Peroxide', 'Adapalene', 'Clindamycin Gel', 'Isotretinoin', 'Oral Antibiotics'],
    healthAdvice: 'Gentle cleansing, avoid picking, non-comedogenic products, healthy diet.',
    category: 'dermatological',
    severity: 'mild'
  },
  {
    disease: 'Urticaria (Hives)',
    symptoms: ['raised welts', 'itching', 'redness', 'swelling', 'welts that change shape', 'angioedema'],
    recommendedTests: ['Allergy Tests', 'Complete Blood Count', 'Thyroid Function', 'IgE Levels'],
    recommendedMedicines: ['Cetirizine', 'Loratadine', 'Fexofenadine', 'Prednisolone', 'Omalizumab'],
    healthAdvice: 'Identify and avoid triggers, antihistamines as needed, carry epinephrine if severe.',
    category: 'dermatological',
    severity: 'mild'
  },
  {
    disease: 'Fungal Skin Infection',
    symptoms: ['itching', 'red patches', 'ring-shaped rash', 'scaly skin', 'cracking skin', 'blisters'],
    recommendedTests: ['KOH Preparation', 'Fungal Culture', 'Wood\'s Lamp'],
    recommendedMedicines: ['Clotrimazole', 'Terbinafine', 'Ketoconazole', 'Fluconazole', 'Itraconazole'],
    healthAdvice: 'Keep area dry, wear loose clothing, complete full course, avoid sharing personal items.',
    category: 'dermatological',
    severity: 'mild'
  },
  {
    disease: 'Vitiligo',
    symptoms: ['white patches', 'premature hair graying', 'loss of color in mouth', 'color loss around eyes'],
    recommendedTests: ['Clinical Examination', 'Wood\'s Lamp', 'Thyroid Function', 'Vitamin B12'],
    recommendedMedicines: ['Tacrolimus', 'Pimecrolimus', 'Corticosteroids', 'PUVA Therapy', 'NB-UVB'],
    healthAdvice: 'Sun protection, cosmetic camouflage, phototherapy, manage associated conditions.',
    category: 'dermatological',
    severity: 'mild'
  },
  {
    disease: 'Rosacea',
    symptoms: ['facial redness', 'visible blood vessels', 'pimples', 'burning sensation', 'eye irritation', 'thick skin'],
    recommendedTests: ['Clinical Examination', 'Skin Biopsy if needed'],
    recommendedMedicines: ['Metronidazole Gel', 'Ivermectin', 'Azelaic Acid', 'Doxycycline', 'Brimonidine'],
    healthAdvice: 'Avoid triggers (sun, heat, alcohol, spicy food), gentle skincare, sun protection.',
    category: 'dermatological',
    severity: 'mild'
  },
  {
    disease: 'Contact Dermatitis',
    symptoms: ['itchy rash', 'redness', 'blisters', 'dry skin', 'burning', 'swelling'],
    recommendedTests: ['Patch Test', 'Clinical Examination'],
    recommendedMedicines: ['Hydrocortisone', 'Calamine Lotion', 'Antihistamines', 'Barrier Creams'],
    healthAdvice: 'Identify and avoid allergen/irritant, use protective gloves, moisturize regularly.',
    category: 'dermatological',
    severity: 'mild'
  },
  {
    disease: 'Alopecia Areata',
    symptoms: ['patchy hair loss', 'smooth bald spots', 'exclamation mark hairs', 'nail changes'],
    recommendedTests: ['Clinical Examination', 'Trichoscopy', 'Thyroid Function', 'Vitamin D'],
    recommendedMedicines: ['Corticosteroid Injections', 'Minoxidil', 'Anthralin', 'JAK Inhibitors'],
    healthAdvice: 'Stress management, may regrow spontaneously, cosmetic options available.',
    category: 'dermatological',
    severity: 'mild'
  },
  {
    disease: 'Impetigo',
    symptoms: ['red sores', 'blisters', 'honey-colored crusts', 'itching', 'spreading rash'],
    recommendedTests: ['Clinical Examination', 'Wound Culture'],
    recommendedMedicines: ['Mupirocin', 'Fusidic Acid', 'Cephalexin', 'Amoxicillin-Clavulanate'],
    healthAdvice: 'Keep area clean, avoid scratching, wash hands frequently, don\'t share towels.',
    category: 'dermatological',
    severity: 'mild'
  },
  {
    disease: 'Seborrheic Dermatitis',
    symptoms: ['dandruff', 'scaly patches', 'red skin', 'itching', 'flaking on scalp', 'greasy skin'],
    recommendedTests: ['Clinical Examination', 'KOH Preparation'],
    recommendedMedicines: ['Ketoconazole Shampoo', 'Selenium Sulfide', 'Zinc Pyrithione', 'Hydrocortisone'],
    healthAdvice: 'Regular shampooing, manage stress, avoid harsh products, may need ongoing treatment.',
    category: 'dermatological',
    severity: 'mild'
  },
  {
    disease: 'Skin Allergy',
    symptoms: ['rash', 'itching', 'redness', 'hives', 'swelling', 'dry skin', 'blisters'],
    recommendedTests: ['Allergy Panel', 'IgE Levels', 'Skin Prick Test', 'Patch Test'],
    recommendedMedicines: ['Cetirizine', 'Hydrocortisone Cream', 'Calamine Lotion', 'Prednisolone'],
    healthAdvice: 'Identify and avoid allergens, use mild unscented soaps, keep skin moisturized.',
    category: 'dermatological',
    severity: 'mild'
  },

  // ==================== UROLOGICAL DISEASES (8) ====================
  {
    disease: 'Kidney Stones',
    symptoms: ['severe flank pain', 'pain radiating to groin', 'blood in urine', 'nausea', 'vomiting', 'frequent urination'],
    recommendedTests: ['CT KUB', 'Ultrasound KUB', 'Urine Routine', 'Serum Creatinine', '24-hour Urine Analysis'],
    recommendedMedicines: ['Tamsulosin', 'NSAIDs', 'Potassium Citrate', 'Thiazides', 'Allopurinol'],
    healthAdvice: 'Drink plenty of water, reduce salt intake, limit oxalate foods, follow-up imaging.',
    category: 'urological',
    severity: 'moderate'
  },
  {
    disease: 'Benign Prostatic Hyperplasia',
    symptoms: ['frequent urination', 'urgency', 'weak stream', 'incomplete emptying', 'nocturia', 'straining'],
    recommendedTests: ['PSA', 'Ultrasound Prostate', 'Uroflowmetry', 'Post-void Residual', 'Digital Rectal Exam'],
    recommendedMedicines: ['Tamsulosin', 'Finasteride', 'Dutasteride', 'Silodosin', 'Tadalafil'],
    healthAdvice: 'Limit fluids before bed, avoid caffeine and alcohol, double voiding technique.',
    category: 'urological',
    severity: 'mild'
  },
  {
    disease: 'Chronic Kidney Disease',
    symptoms: ['fatigue', 'swelling', 'decreased urine', 'nausea', 'shortness of breath', 'confusion', 'itching'],
    recommendedTests: ['Serum Creatinine', 'eGFR', 'Urine Albumin', 'Ultrasound KUB', 'Electrolytes'],
    recommendedMedicines: ['ACE Inhibitors', 'ARBs', 'Diuretics', 'EPO', 'Phosphate Binders', 'Bicarbonate'],
    healthAdvice: 'Control blood pressure and diabetes, low salt and protein diet, avoid NSAIDs.',
    category: 'urological',
    severity: 'severe'
  },
  {
    disease: 'Prostatitis',
    symptoms: ['pelvic pain', 'painful urination', 'frequent urination', 'difficulty urinating', 'fever', 'chills'],
    recommendedTests: ['Urine Culture', 'PSA', 'Prostate Massage', 'Digital Rectal Exam'],
    recommendedMedicines: ['Ciprofloxacin', 'Doxycycline', 'Tamsulosin', 'NSAIDs', 'Alpha Blockers'],
    healthAdvice: 'Long antibiotic course, sitz baths, avoid alcohol and caffeine, pelvic floor therapy.',
    category: 'urological',
    severity: 'moderate'
  },
  {
    disease: 'Urinary Incontinence',
    symptoms: ['urine leakage', 'strong urge to urinate', 'frequent urination', 'bedwetting'],
    recommendedTests: ['Urine Routine', 'Post-void Residual', 'Urodynamic Studies', 'Cystoscopy'],
    recommendedMedicines: ['Oxybutynin', 'Tolterodine', 'Mirabegron', 'Duloxetine', 'Vaginal Estrogen'],
    healthAdvice: 'Pelvic floor exercises, bladder training, scheduled voiding, weight management.',
    category: 'urological',
    severity: 'mild'
  },
  {
    disease: 'Epididymitis',
    symptoms: ['testicular pain', 'swelling', 'warmth', 'discharge', 'painful urination', 'fever'],
    recommendedTests: ['Urine Culture', 'STI Testing', 'Ultrasound Scrotum'],
    recommendedMedicines: ['Doxycycline', 'Ceftriaxone', 'Ciprofloxacin', 'NSAIDs', 'Scrotal Support'],
    healthAdvice: 'Complete antibiotic course, scrotal elevation, ice packs, rest.',
    category: 'urological',
    severity: 'moderate'
  },
  {
    disease: 'Hydrocele',
    symptoms: ['scrotal swelling', 'heaviness', 'discomfort', 'painless swelling', 'transillumination positive'],
    recommendedTests: ['Ultrasound Scrotum', 'Physical Examination'],
    recommendedMedicines: ['Surgery if symptomatic', 'Aspiration', 'Sclerotherapy'],
    healthAdvice: 'Usually benign, surgery if large or causing discomfort, rule out other causes.',
    category: 'urological',
    severity: 'mild'
  },
  {
    disease: 'Pyelonephritis',
    symptoms: ['high fever', 'flank pain', 'nausea', 'vomiting', 'frequent urination', 'burning urination'],
    recommendedTests: ['Urine Culture', 'Complete Blood Count', 'Serum Creatinine', 'CT KUB', 'Blood Culture'],
    recommendedMedicines: ['Ciprofloxacin', 'Ceftriaxone', 'Gentamicin', 'Ampicillin', 'IV Fluids'],
    healthAdvice: 'May need hospitalization, complete antibiotic course, adequate hydration.',
    category: 'urological',
    severity: 'severe'
  },

  // ==================== PSYCHIATRIC/MENTAL HEALTH (8) ====================
  {
    disease: 'Major Depression',
    symptoms: ['persistent sadness', 'loss of interest', 'fatigue', 'sleep changes', 'appetite changes', 'guilt', 'concentration problems', 'suicidal thoughts'],
    recommendedTests: ['Clinical Assessment', 'PHQ-9', 'Thyroid Function', 'Vitamin B12', 'Vitamin D'],
    recommendedMedicines: ['Escitalopram', 'Sertraline', 'Fluoxetine', 'Venlafaxine', 'Bupropion'],
    healthAdvice: 'Psychotherapy, regular exercise, social support, avoid alcohol, medication compliance.',
    category: 'psychiatric',
    severity: 'severe'
  },
  {
    disease: 'Generalized Anxiety Disorder',
    symptoms: ['excessive worry', 'restlessness', 'fatigue', 'concentration problems', 'irritability', 'muscle tension', 'sleep problems'],
    recommendedTests: ['Clinical Assessment', 'GAD-7', 'Thyroid Function'],
    recommendedMedicines: ['Escitalopram', 'Sertraline', 'Buspirone', 'Pregabalin', 'Hydroxyzine'],
    healthAdvice: 'Cognitive behavioral therapy, relaxation techniques, regular exercise, limit caffeine.',
    category: 'psychiatric',
    severity: 'moderate'
  },
  {
    disease: 'Panic Disorder',
    symptoms: ['sudden panic attacks', 'racing heart', 'sweating', 'trembling', 'shortness of breath', 'fear of dying', 'dizziness'],
    recommendedTests: ['Clinical Assessment', 'ECG', 'Thyroid Function', 'Panic Disorder Severity Scale'],
    recommendedMedicines: ['Escitalopram', 'Sertraline', 'Clonazepam', 'Alprazolam', 'Venlafaxine'],
    healthAdvice: 'CBT is highly effective, breathing exercises, avoid triggers, gradual exposure.',
    category: 'psychiatric',
    severity: 'moderate'
  },
  {
    disease: 'Insomnia',
    symptoms: ['difficulty falling asleep', 'difficulty staying asleep', 'early awakening', 'daytime fatigue', 'irritability', 'concentration problems'],
    recommendedTests: ['Sleep Diary', 'Sleep Study if needed', 'Thyroid Function'],
    recommendedMedicines: ['Zolpidem', 'Eszopiclone', 'Melatonin', 'Trazodone', 'Doxepin'],
    healthAdvice: 'Sleep hygiene, regular sleep schedule, avoid screens before bed, CBT-I is effective.',
    category: 'psychiatric',
    severity: 'mild'
  },
  {
    disease: 'Bipolar Disorder',
    symptoms: ['mood swings', 'manic episodes', 'depression', 'increased energy', 'decreased sleep need', 'impulsivity', 'racing thoughts'],
    recommendedTests: ['Clinical Assessment', 'MDQ', 'Thyroid Function', 'Drug Screen'],
    recommendedMedicines: ['Lithium', 'Valproate', 'Quetiapine', 'Lamotrigine', 'Aripiprazole'],
    healthAdvice: 'Medication compliance critical, regular sleep, avoid alcohol, mood tracking.',
    category: 'psychiatric',
    severity: 'severe'
  },
  {
    disease: 'OCD',
    symptoms: ['obsessive thoughts', 'compulsive behaviors', 'repetitive rituals', 'anxiety', 'fear of contamination', 'need for symmetry'],
    recommendedTests: ['Clinical Assessment', 'Y-BOCS'],
    recommendedMedicines: ['Fluoxetine', 'Fluvoxamine', 'Sertraline', 'Clomipramine', 'Risperidone'],
    healthAdvice: 'Exposure and Response Prevention therapy, medication often needed long-term.',
    category: 'psychiatric',
    severity: 'moderate'
  },
  {
    disease: 'PTSD',
    symptoms: ['flashbacks', 'nightmares', 'avoidance', 'hypervigilance', 'emotional numbness', 'irritability', 'sleep problems'],
    recommendedTests: ['Clinical Assessment', 'PCL-5', 'CAPS-5'],
    recommendedMedicines: ['Sertraline', 'Paroxetine', 'Prazosin', 'Venlafaxine', 'Fluoxetine'],
    healthAdvice: 'Trauma-focused therapy (EMDR, PE), social support, avoid alcohol, self-care important.',
    category: 'psychiatric',
    severity: 'severe'
  },
  {
    disease: 'ADHD',
    symptoms: ['inattention', 'hyperactivity', 'impulsivity', 'difficulty organizing', 'forgetfulness', 'restlessness', 'interrupting others'],
    recommendedTests: ['Clinical Assessment', 'Conners Rating Scale', 'TOVA Test'],
    recommendedMedicines: ['Methylphenidate', 'Amphetamine', 'Atomoxetine', 'Lisdexamfetamine', 'Guanfacine'],
    healthAdvice: 'Behavioral therapy, organizational strategies, regular exercise, structured environment.',
    category: 'psychiatric',
    severity: 'moderate'
  },

  // ==================== ENT DISEASES (6) ====================
  {
    disease: 'Otitis Media',
    symptoms: ['ear pain', 'fever', 'hearing loss', 'ear discharge', 'irritability', 'tugging at ear'],
    recommendedTests: ['Otoscopy', 'Tympanometry', 'Audiometry'],
    recommendedMedicines: ['Amoxicillin', 'Amoxicillin-Clavulanate', 'Ear Drops', 'Paracetamol', 'Ibuprofen'],
    healthAdvice: 'Complete antibiotic course, follow-up if not improving, avoid water entry.',
    category: 'ent',
    severity: 'mild'
  },
  {
    disease: 'Otitis Externa',
    symptoms: ['ear pain', 'itching', 'discharge', 'hearing loss', 'pain when pulling ear', 'redness'],
    recommendedTests: ['Otoscopy', 'Ear Swab Culture'],
    recommendedMedicines: ['Ciprofloxacin Ear Drops', 'Acetic Acid Drops', 'Hydrocortisone', 'Pain Relievers'],
    healthAdvice: 'Keep ear dry, avoid ear buds, use ear plugs when swimming.',
    category: 'ent',
    severity: 'mild'
  },
  {
    disease: 'Tonsillitis',
    symptoms: ['sore throat', 'difficulty swallowing', 'fever', 'swollen tonsils', 'white patches', 'bad breath', 'neck stiffness'],
    recommendedTests: ['Throat Culture', 'Rapid Strep Test', 'Complete Blood Count'],
    recommendedMedicines: ['Penicillin', 'Amoxicillin', 'Azithromycin', 'Paracetamol', 'Salt Water Gargle'],
    healthAdvice: 'Rest, warm fluids, salt water gargle, complete antibiotic course.',
    category: 'ent',
    severity: 'mild'
  },
  {
    disease: 'Vertigo (BPPV)',
    symptoms: ['spinning sensation', 'dizziness', 'nausea', 'balance problems', 'triggered by head movement'],
    recommendedTests: ['Dix-Hallpike Maneuver', 'VNG', 'Audiometry'],
    recommendedMedicines: ['Meclizine', 'Betahistine', 'Epley Maneuver', 'Vestibular Rehabilitation'],
    healthAdvice: 'Epley or Semont maneuver, avoid sudden head movements, vestibular exercises.',
    category: 'ent',
    severity: 'mild'
  },
  {
    disease: 'Hearing Loss',
    symptoms: ['difficulty hearing', 'asking for repetition', 'turning up volume', 'tinnitus', 'difficulty in noisy places'],
    recommendedTests: ['Audiometry', 'Tympanometry', 'ABR', 'CT/MRI if needed'],
    recommendedMedicines: ['Hearing Aids', 'Cochlear Implants', 'Treat underlying cause'],
    healthAdvice: 'Protect from loud noise, regular hearing checks, consider hearing aids early.',
    category: 'ent',
    severity: 'moderate'
  },
  {
    disease: 'Tinnitus',
    symptoms: ['ringing in ears', 'buzzing', 'hissing', 'clicking', 'hearing loss', 'concentration difficulty'],
    recommendedTests: ['Audiometry', 'MRI Brain', 'CT Temporal Bone'],
    recommendedMedicines: ['White Noise Machines', 'Hearing Aids', 'Cognitive Therapy', 'Antidepressants if needed'],
    healthAdvice: 'Avoid loud noise, manage stress, white noise for sleep, treat underlying conditions.',
    category: 'ent',
    severity: 'mild'
  },

  // ==================== OPHTHALMOLOGICAL (6) ====================
  {
    disease: 'Cataract',
    symptoms: ['cloudy vision', 'difficulty with night vision', 'light sensitivity', 'fading colors', 'double vision', 'frequent prescription changes'],
    recommendedTests: ['Slit Lamp Examination', 'Visual Acuity', 'Tonometry', 'Retinal Exam'],
    recommendedMedicines: ['Surgery (Phacoemulsification)', 'IOL Implantation'],
    healthAdvice: 'Surgery is the only effective treatment, protect eyes from UV, control diabetes.',
    category: 'ophthalmological',
    severity: 'moderate'
  },
  {
    disease: 'Glaucoma',
    symptoms: ['gradual vision loss', 'tunnel vision', 'eye pain', 'headache', 'halos around lights', 'redness'],
    recommendedTests: ['Tonometry', 'Visual Field Test', 'OCT', 'Gonioscopy', 'Fundoscopy'],
    recommendedMedicines: ['Latanoprost', 'Timolol', 'Brimonidine', 'Dorzolamide', 'Pilocarpine'],
    healthAdvice: 'Use eye drops regularly, regular eye check-ups, cannot be cured but controlled.',
    category: 'ophthalmological',
    severity: 'severe'
  },
  {
    disease: 'Diabetic Retinopathy',
    symptoms: ['blurred vision', 'floaters', 'dark spots', 'vision loss', 'difficulty seeing colors'],
    recommendedTests: ['Fundoscopy', 'Fluorescein Angiography', 'OCT', 'Visual Acuity'],
    recommendedMedicines: ['Anti-VEGF Injections', 'Laser Photocoagulation', 'Vitrectomy'],
    healthAdvice: 'Control blood sugar and blood pressure, annual eye exams, early detection crucial.',
    category: 'ophthalmological',
    severity: 'severe'
  },
  {
    disease: 'Dry Eye Syndrome',
    symptoms: ['dry eyes', 'burning', 'redness', 'blurred vision', 'eye fatigue', 'sensitivity to light', 'watery eyes'],
    recommendedTests: ['Schirmer Test', 'Tear Break-up Time', 'Slit Lamp Examination'],
    recommendedMedicines: ['Artificial Tears', 'Cyclosporine Eye Drops', 'Lifitegrast', 'Omega-3 Supplements'],
    healthAdvice: 'Blink often, use humidifier, take screen breaks, avoid dry environments.',
    category: 'ophthalmological',
    severity: 'mild'
  },
  {
    disease: 'Age-Related Macular Degeneration',
    symptoms: ['blurred central vision', 'distorted vision', 'dark spots', 'difficulty reading', 'difficulty recognizing faces'],
    recommendedTests: ['Amsler Grid', 'OCT', 'Fluorescein Angiography', 'Fundoscopy'],
    recommendedMedicines: ['Anti-VEGF Injections', 'AREDS2 Supplements', 'Photodynamic Therapy'],
    healthAdvice: 'Don\'t smoke, healthy diet rich in leafy greens, regular eye exams, use Amsler grid.',
    category: 'ophthalmological',
    severity: 'severe'
  },
  {
    disease: 'Refractive Errors',
    symptoms: ['blurred vision', 'eye strain', 'headache', 'squinting', 'difficulty driving at night'],
    recommendedTests: ['Visual Acuity Test', 'Refraction Test', 'Slit Lamp Examination'],
    recommendedMedicines: ['Glasses', 'Contact Lenses', 'LASIK Surgery'],
    healthAdvice: 'Regular eye check-ups, proper lighting when reading, take breaks from screens.',
    category: 'ophthalmological',
    severity: 'mild'
  }
];

module.exports = medicalDataset;
