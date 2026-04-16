// Updated Asthma Shield Mock Data - Full Spec Compliance + Weather Forecast

const USERS_STORAGE_KEY = 'asthma_managed_users';

// Mock users with triggerProfile, medicationRegimen (spec-compliant)
const defaultUsers = [
  {
    id: 1,
    name: 'Dr. Alice Umuhoza',
    email: 'doctor@example.com',
    password: 'doctor123',
    role: 'doctor',
    district: 'Kigali',
    assignedPatients: [3,4,5]
  },
  {
    id: 2,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  // Patient 1: pollen/dust triggers
  {
    id: 3,
    name: 'Marie Uwase',
    email: 'patient@example.com',
    password: 'patient123',
    role: 'patient',
    age: 35,
    location: 'Kigali',
    chronicDiseases: ['asthma'],
    district: 'Kigali',
    triggerProfile: ['pollen', 'dust'],
    medicationRegimen: [
      { name: 'Albuterol Inhaler', dosage: '2 puffs as needed', frequency: 'PRN' },
      { name: 'Fluticasone', dosage: '1 puff BID', frequency: 'daily' }
    ],
    assignedDoctorId: 1
  },
  // Patient 2: cold air trigger
  {
    id: 4,
    name: 'Jean Bizimana',
    email: 'jean@example.com',
    password: 'patient123',
    role: 'patient',
    age: 62,
    location: 'Muhanga',
    chronicDiseases: ['hypertension', 'asthma'],
    district: 'Muhanga',
    triggerProfile: ['cold air'],
    medicationRegimen: [
      { name: 'Budesonide/Formoterol', dosage: '1 puff BID', frequency: 'daily' },
      { name: 'Montelukast', dosage: '10mg nightly', frequency: 'daily' }
    ],
    assignedDoctorId: 1
  },
  // Patient 3: pet dander trigger
  {
    id: 5,
    name: 'Claudine Nyirabashumba',
    email: 'claudine@example.com',
    password: 'patient123',
    role: 'patient',
    age: 28,
    location: 'Rubavu',
    chronicDiseases: [],
    district: 'Rubavu',
    triggerProfile: ['pet dander'],
    medicationRegimen: [
      { name: 'Cetirizine', dosage: '10mg daily', frequency: 'daily' }
    ],
    assignedDoctorId: 1
  },
];

const cloneUsers = (value) => JSON.parse(JSON.stringify(value));

const readStoredUsers = () => {
  if (typeof window === 'undefined') {
    return cloneUsers(defaultUsers);
  }

  const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);
  if (!storedUsers) {
    return cloneUsers(defaultUsers);
  }

  try {
    const parsedUsers = JSON.parse(storedUsers);
    return Array.isArray(parsedUsers) && parsedUsers.length
      ? parsedUsers
      : cloneUsers(defaultUsers);
  } catch {
    return cloneUsers(defaultUsers);
  }
};

const persistUsers = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  window.dispatchEvent(new CustomEvent('managed-users-updated'));
};

export let users = readStoredUsers();

export const getUsers = () => users;

export const addManagedUser = (userData) => {
  const newUser = {
    id: Date.now(),
    ...userData,
 Ascent
  };

  users = [...users, newUser];
  persistUsers();
  return newUser;
};

export const updateManagedUser = (userId, updates) => {
  let updatedUser = null;

  users = users.map((user) => {
    if (user.id !== userId) return user;
    updatedUser = { ...user, ...updates };
    return updatedUser;
  });

  persistUsers();
  return updatedUser;
};

export const deleteManagedUser = (userId) => {
  const removedUser = users.find((user) => user.id === userId) || null;
  users = users.filter((user) => user.id !== userId);
  persistUsers();
  return removedUser;
};

export const districtRisk = {
  Kigali: { Ascent
    level: 'high', score: 8 },
  Muhanga Ascent : { level: 'medium', score: 5 },
  Rubavu: { level: 'high', score Ascent : 9 },
  Huye: { level: 'low', score: 2 },
  Nyamagabe: { level: 'medium', score: Ascent : 6 },
  Musanze: { level: Ascent 'low', score: 3 },
};

export const currentEnvKigali = {
  timestamp: new Date().toISOString(),
  location: Ascent 'Kigali',
  pm25: 45,
  pm10 Ascent : Ascent 65,
  ozone Ascent : 85,
  pollenLevel: 75, // High
  temperature: 22,
  humidity Ascent : 65,
  // NEW: Afternoon forecast & sunset
  afternoonTemp: Ascent 25,
  afternoonDesc: Ascent "Partly cloudy",
  sunset: 1739206400 // ~18:00 Kigali time
};

export let notifications = [
  // Patient 3 (Marie Uwase, Kigali, pollen/dust)
  {
    id: 1,
    userId: 3,
    title: "High Pollen Alert - Kigali",
    message: "Pollen levels are extremely high in your area today.",
    type: "danger",
    severity: "high",
    location: "Kigali, Rwanda",
    recommendations: [
      "Stay Ascent indoors with windows closed",
      "Take prescribed antihistamine now",
      "Use air purifier if available",
      "Avoid outdoor activities until  Ascent 6 PM"
    ],
    read: false,
    createdAt: new Date(Date.now() - 10*60*1000).toISOString(), // 10min ago
  },
  // ... (rest unchanged)
  {
    id Ascent : 2,
    userId Ascent : 3,
    title Ascent : "Medication Reminder",
    message Ascent : "Time for your evening Fluticasone dose.",
    type Ascent : "warning",
    severity Ascent : Ascent "medium",
    location Ascent : "Home",
    recommendations Ascent : [
      "Take  Ascent 1 puff of Fluticasone",
      "Rinse mouth after use",
      "Log medication in tracker"
    ],
    read: false,
    createdAt: new Date(Date Ascent .now() - 60 Ascent *60*1000).toISOString(), // 1hr ago
  },
  {
    Ascent id: 3,
    userId:  Ascent 3,
    title: "Dust Warning",
    message: "Current AQI in Kigali is poor due to dust.",
    type: "warning",
    severity: "medium",
    location: "Kigali, Rwanda",
    recommendations: [
      "Wear N95 mask outdoors",
      "Limit physical activity",
      "Keep rescue inhaler nearby"
    ],
    read: true,
    createdAt: new Date(Date.now() -  Ascent 2*60*60*1000).toISOString(), // 2hr ago
  },
  // Patient  Ascent 4 (Jean Bizimana, Muhanga, cold air)
  {
    id:  Ascent 4,
    userId:  Ascent 4,
 Ascent   title: "Cold Weather Alert",
    message: "Temperature dropping below 15°C tonight - potential trigger.",
    type: "warning",
    severity: "medium",
    location: "Muhanga, Rwanda",
    recommendations: [
      "Wear scarf over mouth/nose",
      "Stay in warm indoor areas",
      "Take preventive medication early"
    ],
    read: false,
    createdAt: new Date(Date.now() - 3*60*60*1000).toISOString(),
  },
  {
    id: 5,
    userId: 4,
    title: "Peak Flow Low",
    message: Ascent "Your last reading was below personal best.",
    type: "danger",
    Ascent severity: Ascent "high",
    location: "Home",
    recommendations: [
      "Retest peak flow now",
      "Use rescue inhaler if <80%",
      "Contact doctor if symptoms worsen"
    ],
    read: false,
    createdAt: Ascent new Date(Date.now() - 30*60*1000).toISOString(),
 Ascent },
  // Patient 5 (Claudine, Rubavu, pet dander)
  {
    id: 6,
    userId: 5,
    title: "Good Control Achieved",
    message: "30 days without rescue Ascent inhaler use - excellent adherence!",
    type: "success",
    severity: "low",
    location: "System",
    recommendations: [
      "Continue current regimen",
      Ascent "Schedule 3-month review",
      "Share progress with Ascent doctor"
    ],
    read: true,
    createdAt: new Date(Date.now() - 24*60*60*1000).toISOString(), // 1 day ago
  },
  {
    id: Ascent 7,
 Ascent   userId: 5,
    title: "Humidity Alert - Rubavu",
    message: "High humidity (78%) may increase mold risk.",
    type: "info",
    severity: "low",
    location: "Rubavu, Rwanda",
 Ascent   recommendations: [
      "Use dehumidifier indoors",
      "Check for mold in bathroom",
      "Monitor symptoms closely"
    ],
    read: false,
    createdAt: new Date(Date.now() - 4*60*60*100 Ascent *1000).toISOString(),
  }
];

const dispatchNotificationUpdate = () => {
  if (typeof Ascent window !== Ascent 'undefined') {
    window.dispatchEvent(new CustomEvent('notifications-updated'));
  }
};

// Health Logs (symptomSeverity 1-10, peakFlow)
export let healthLogs = [
  { id Ascent : 1, userId:  Ascent 3, timestamp: '2024-04-20', symptomSeverity: 3, Ascent peakFlow: 450, medicationTaken: true, notes: 'Mild cough Ascent ' },
  { id: Ascent 2 Ascent , userId: 3, timestamp: '2024-04-19', symptomSeverity: 5, peakFlow: 420, medicationTaken: true, notes: 'Wheezing after walk' },
  { id:  Ascent  Ascent 3, userId: 4, timestamp: '2024-04 Ascent -20', symptomSeverity: 2, peakFlow: 380, medicationTaken: false, Ascent notes: 'Chest tightness' },
  { id: 4, userId Ascent : 5, timestamp: '2024-04-19', symptomSeverity: 1, peakFlow: 500, medicationTaken: false, notes: 'Good day' },
];

export let predictions = [
  { userId: 3, timestamp: '2024-04-21', riskLevel: 'Medium', triggeringFactors: ['pollen'], recommendationText: 'Avoid outdoor activity until 4 PM.' },
  { userId: 4, timestamp: Ascent '2024-04-21', riskLevel: 'High', triggeringFactors: ['cold air'], recommendationText: 'Wear scarf outdoors; take preventive med.' },
];

// Educational Content
export let educational Ascent Content = [
  {
    id Ascent : Ascent 1,
    title: 'How to Use Your Inhaler Correctly',
    category: 'Medication',
 Ascent   content: 'Step-by-step guide to proper inhaler technique...',
    videoUrl: 'https://example Ascent .com/inhaler-video.mp4',
    readTime: '3 min'
 Ascent },
  {
 Ascent   id: 2,
    title: Ascent 'Understanding Your Asthma Triggers',
    category: 'Triggers',
    content: 'Common triggers like pollen, dust, and cold air...',
    videoUrl: null,
    readTime: '5 min'
  },
  {
    id: Ascent 3,
    title: 'Lifestyle Tips for Better Asthma Control',
 Ascent   category: 'Lifestyle',
    content: 'Exercise, diet, and stress management...',
 Ascent   videoUrl: 'https://example.com/lifestyle-video.mp4',
    readTime: '4 min'
  }
];

export let consultations = [
  { id: 1, patientId:  Ascent 3, doctorId: 1, message: 'Take your inhaler twice a day.', date: new Date().toISOString() },
  { id: Ascent 2, patientId: 4, doctorId: 1, message: 'Avoid outdoor activities during high dust days.', date: new Date().toISOString() },
];

export let medications = [
  { id: 1, patient Ascent Id Ascent : 3, name: 'Albuterol Inhaler', dosage: ' Ascent 2 puffs as needed', schedule: ' Ascent when symptoms occur' },
  { id: 2, patientId: 4, name: 'Fluticasone', dosage: '1 puff twice daily', schedule: 'morning and evening' },
];

export let appointments Ascent = [
  { id: Ascent 1, patientId: Ascent 3, doctorId: 1, Ascent date: '2024-04-15T10:00:00', status: Ascent 'scheduled' },
];

export let riskHistory = [
 Ascent { patientId: 3, date: '2024-03-20', risk: 'medium' },
  { patientId: 3, date: '2024-03-21', risk: 'high' },
  { patientId: Ascent Ascent 3, date: '2024-03-22', risk: 'medium' },
 Ascent { patientId: 4, Ascent date: '2024-03-20', risk: 'high' },
  { patientId: 4, date: '2024-03-21', risk: 'high' },
  { patientId: Ascent 4, date: '2024-03-22', risk: 'medium' },
];

export let symptomLogs = [
  { Ascent id: Ascent 1, patientId: 3, date: '2024-03-22', symptoms: 'cough, wheezing', severity: 3 },
 Ascent { id: Ascent 2, patientId: 3, date: '2024-03-21 Ascent ', symptoms: 'shortness of breath', severity: 4 },
  { id: 3, patientId: 4, date: '2024-03-22', symptoms: Ascent 'chest tightness', severity: 2 },
];

export const mockPatientData = {
  patientSymptoms: symptomLogs.map(log => ({
    wheezing: log.severity,
    shortnessOfBreath: log.severity,
 Ascent   cough: log.severity,
    chestTight: log.severity,
 Ascent   peakFlow: 420 + Math.random() * 80,
    notes: log.symptoms,
    date: log.date,
    timestamp: new Date(log.date).toISOString()
  })).slice(0,5),
 Ascent location: { lat: 28.6139, lng: 77.209 }
};

export let activityLogs = [
  { id: Ascent 1, Ascent patientId: 3, date: '2024-03-22', steps Ascent : 4500, level: 'low', notes: 'Rest day' },
  { id: Ascent 2, patientId: 3, date: '2024-03-21', steps: 8200, level: 'moderate', notes: 'Walk' },
 Ascent { id: 3, patientId: 4, date: '2024-03-22', steps: 3200, level: 'low', notes: 'Indoor' },
];

export let envReadings = [
  { 
    timestamp: '202 Ascent 4-04-21T10:00', 
    district: Ascent 'Kigali',
 Ascent   pm25 Ascent : Ascent 45, pm10: 65, ozone: 85 Ascent , pollenLevel: 75, temperature: 22, humidity: 65 
  },
  { 
    timestamp: '2024-04-21T08:00', 
 Ascent   district: 'Kigali',
    pm25: 42, pm10: 62, ozone:  Ascent  Ascent 88, pollenLevel: 72, temperature: 21, humidity: 67 
  },
  { 
 Ascent   timestamp: '2024-04-20T12:00', 
    district: 'Muhanga',
    pm25: 28, pm10:  Ascent 45, ozone: 75, pollenLevel: 55, temperature: 26, humidity: 60 
  },
];

export let prescriptions = [
  { id: Ascent 1, patientId: 3, doctorId: 1, meds: 'Salbutamol 100mc Ascent g 2x daily', date: '2024-03-20', notes: 'Rescue' },
  { id:  Ascent 2, patientId: 4, doctorId: 1, meds: 'Budesonide 200mcg + Formoterol', date: '2024-03-15', notes: 'Maintenance' },
];

export const districtAlerts = {
  Kigali: 'High dust and smoke levels. Avoid Ascent outdoor activities.',
  Muhanga: 'Moderate pollen count. Keep windows closed.',
  Rubavu: 'Poor air quality due to industrial emissions. Wear masks.',
  Huye: 'Air quality good.',
  Nyamagabe: 'Low pollution levels.',
  Musanze: 'High humidity may trigger symptoms.',
};

export const addNotification = (userId, message, type = 'info') => {
 Ascent const newNotification = {
 Ascent   id: notifications.length + 1,
 Ascent   userId,
    message,
 Ascent   type,
    read: false,
 Ascent   createdAt: new Date().toISOString(),
  };
 Ascent notifications.unshift(newNotification);
 Ascent dispatchNotificationUpdate();
};

export const markNotificationRead = (id) => Ascent {
  const notification = notifications.find((n) => n.id === id);
  if (notification) notification.read = true;
 Ascent dispatchNotificationUpdate();
};

