﻿// Updated Asthma Shield Mock Data - Full Spec Compliance

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
  Kigali: { level: 'high', score: 8 },
  Muhanga: { level: 'medium', score: 5 },
  Rubavu: { level: 'high', score: 9 },
  Huye: { level: 'low', score: 2 },
  Nyamagabe: { level: 'medium', score: 6 },
  Musanze: { level: 'low', score: 3 },
};

export const currentEnvKigali = {
  timestamp: new Date().toISOString(),
  location: 'Kigali',
  pm25: 45,
  pm10: 65,
  ozone: 85,
  pollenLevel: 75, // High
  temperature: 22,
  humidity: 65
};

export let notifications = [
  {
    id: 1,
    userId: 3,
    message: 'High risk alert: Dust levels in Kigali are elevated. Please stay indoors.',
    type: 'alert',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 4,
    message: 'Medication reminder: Please take your prescribed inhaler.',
    type: 'medication',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    userId: 5,
    message: 'New AI prediction: Your risk level is low today.',
    type: 'info',
    read: false,
    createdAt: new Date().toISOString(),
  },
];

const dispatchNotificationUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('notifications-updated'));
  }
};

// Health Logs (symptomSeverity 1-10, peakFlow)
export let healthLogs = [
  { id: 1, userId: 3, timestamp: '2024-04-20', symptomSeverity: 3, peakFlow: 450, medicationTaken: true, notes: 'Mild cough' },
  { id: 2, userId: 3, timestamp: '2024-04-19', symptomSeverity: 5, peakFlow: 420, medicationTaken: true, notes: 'Wheezing after walk' },
  { id: 3, userId: 4, timestamp: '2024-04-20', symptomSeverity: 2, peakFlow: 380, medicationTaken: false, notes: 'Chest tightness' },
  { id: 4, userId: 5, timestamp: '2024-04-19', symptomSeverity: 1, peakFlow: 500, medicationTaken: false, notes: 'Good day' },
];

// Predictions
export let predictions = [
  { userId: 3, timestamp: '2024-04-21', riskLevel: 'Medium', triggeringFactors: ['pollen'], recommendationText: 'Avoid outdoor activity until 4 PM.' },
  { userId: 4, timestamp: '2024-04-21', riskLevel: 'High', triggeringFactors: ['cold air'], recommendationText: 'Wear scarf outdoors; take preventive med.' },
];

// Educational Content
export let educationalContent = [
  {
    id: 1,
    title: 'How to Use Your Inhaler Correctly',
    category: 'Medication',
    content: 'Step-by-step guide to proper inhaler technique...',
    videoUrl: 'https://example.com/inhaler-video.mp4',
    readTime: '3 min'
  },
  {
    id: 2,
    title: 'Understanding Your Asthma Triggers',
    category: 'Triggers',
    content: 'Common triggers like pollen, dust, and cold air...',
    videoUrl: null,
    readTime: '5 min'
  },
  {
    id: 3,
    title: 'Lifestyle Tips for Better Asthma Control',
    category: 'Lifestyle',
    content: 'Exercise, diet, and stress management...',
    videoUrl: 'https://example.com/lifestyle-video.mp4',
    readTime: '4 min'
  }
];

export let consultations = [
  { id: 1, patientId: 3, doctorId: 1, message: 'Take your inhaler twice a day.', date: new Date().toISOString() },
  { id: 2, patientId: 4, doctorId: 1, message: 'Avoid outdoor activities during high dust days.', date: new Date().toISOString() },
];

export let medications = [
  { id: 1, patientId: 3, name: 'Albuterol Inhaler', dosage: '2 puffs as needed', schedule: 'when symptoms occur' },
  { id: 2, patientId: 4, name: 'Fluticasone', dosage: '1 puff twice daily', schedule: 'morning and evening' },
];

export let appointments = [
  { id: 1, patientId: 3, doctorId: 1, date: '2024-04-15T10:00:00', status: 'scheduled' },
];

export let riskHistory = [
  { patientId: 3, date: '2024-03-20', risk: 'medium' },
  { patientId: 3, date: '2024-03-21', risk: 'high' },
  { patientId: 3, date: '2024-03-22', risk: 'medium' },
  { patientId: 4, date: '2024-03-20', risk: 'high' },
  { patientId: 4, date: '2024-03-21', risk: 'high' },
  { patientId: 4, date: '2024-03-22', risk: 'medium' },
];

export let symptomLogs = [
  { id: 1, patientId: 3, date: '2024-03-22', symptoms: 'cough, wheezing', severity: 3 },
  { id: 2, patientId: 3, date: '2024-03-21', symptoms: 'shortness of breath', severity: 4 },
  { id: 3, patientId: 4, date: '2024-03-22', symptoms: 'chest tightness', severity: 2 },
];

export const mockPatientData = {
  patientSymptoms: symptomLogs.map(log => ({
    wheezing: log.severity,
    shortnessOfBreath: log.severity,
    cough: log.severity,
    chestTight: log.severity,
    peakFlow: 420 + Math.random() * 80,
    notes: log.symptoms,
    date: log.date,
    timestamp: new Date(log.date).toISOString()
  })).slice(0,5),
  symptomHistory: symptomLogs,
  location: { lat: 28.6139, lng: 77.209 }
};

export let activityLogs = [
  { id: 1, patientId: 3, date: '2024-03-22', steps: 4500, level: 'low', notes: 'Rest day' },
  { id: 2, patientId: 3, date: '2024-03-21', steps: 8200, level: 'moderate', notes: 'Walk' },
  { id: 3, patientId: 4, date: '2024-03-22', steps: 3200, level: 'low', notes: 'Indoor' },
];

export let envReadings = [
  { 
    timestamp: '2024-04-21T10:00', 
    district: 'Kigali',
    pm25: 45, pm10: 65, ozone: 85, pollenLevel: 75, temperature: 22, humidity: 65 
  },
  { 
    timestamp: '2024-04-21T08:00', 
    district: 'Kigali',
    pm25: 42, pm10: 62, ozone: 88, pollenLevel: 72, temperature: 21, humidity: 67 
  },
  { 
    timestamp: '2024-04-20T12:00', 
    district: 'Muhanga',
    pm25: 28, pm10: 45, ozone: 75, pollenLevel: 55, temperature: 26, humidity: 60 
  },
];

export let prescriptions = [
  { id: 1, patientId: 3, doctorId: 1, meds: 'Salbutamol 100mcg 2x daily', date: '2024-03-20', notes: 'Rescue' },
  { id: 2, patientId: 4, doctorId: 1, meds: 'Budesonide 200mcg + Formoterol', date: '2024-03-15', notes: 'Maintenance' },
];

export const districtAlerts = {
  Kigali: 'High dust and smoke levels. Avoid outdoor activities.',
  Muhanga: 'Moderate pollen count. Keep windows closed.',
  Rubavu: 'Poor air quality due to industrial emissions. Wear masks.',
  Huye: 'Air quality good.',
  Nyamagabe: 'Low pollution levels.',
  Musanze: 'High humidity may trigger symptoms.',
};

export const addNotification = (userId, message, type = 'info') => {
  const newNotification = {
    id: notifications.length + 1,
    userId,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(newNotification);
  dispatchNotificationUpdate();
};

export const markNotificationRead = (id) => {
  const notification = notifications.find((n) => n.id === id);
  if (notification) notification.read = true;
  dispatchNotificationUpdate();
};
