// src/utils/dashboardAPI.js
import { fetchCurrentEnvironment } from './environmentAPI-fixed.js';
import { getEnvPrediction } from './aiPrediction.js';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust if backend is on different port

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};

export const fetchDashboardData = async () => {
  try {
    const environment = await fetchCurrentEnvironment();
    const prediction = getEnvPrediction(environment);
    const dashboardData = await apiCall('/dashboard');

    return {
      environment,
      prediction,
      ...dashboardData,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Fallback to mock data if API fails
    const environment = await fetchCurrentEnvironment();
    const prediction = getEnvPrediction(environment);
    return {
      environment,
      prediction,
      healthLogs: [],
      notifications: [],
    };
  }
};

// Doctor-specific API functions
export const fetchDoctorPatients = async () => {
  try {
    return await apiCall('/patients');
  } catch (error) {
    console.error('Error fetching patients:', error);
    // Fallback to mock data if API fails (e.g., Firebase not configured)
    return [
      {
        id: 'mock-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 35,
        condition: 'Moderate Asthma',
        lastVisit: '2024-01-15',
        riskLevel: 'medium',
        phone: '+1-555-0123'
      },
      {
        id: 'mock-2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        age: 28,
        condition: 'Mild Asthma',
        lastVisit: '2024-01-10',
        riskLevel: 'low',
        phone: '+1-555-0456'
      },
      {
        id: 'mock-3',
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        age: 42,
        condition: 'Severe Asthma',
        lastVisit: '2024-01-08',
        riskLevel: 'high',
        phone: '+1-555-0789'
      }
    ];
  }
};

export const fetchPatientHealthLogs = async (patientId) => {
  return apiCall(`/health-logs?patientId=${patientId}`);
};

export const fetchPatientRiskHistory = async (patientId) => {
  return apiCall(`/risk-history?patientId=${patientId}`);
};

export const fetchPatientMedications = async (patientId) => {
  return apiCall(`/medications?patientId=${patientId}`);
};

export const fetchPatientPrescriptions = async (patientId) => {
  return apiCall(`/prescriptions?patientId=${patientId}`);
};

export const fetchPatientConsultations = async (patientId) => {
  return apiCall(`/consultations?patientId=${patientId}`);
};

export const sendIntervention = async (patientId, message) => {
  return apiCall('/messages', {
    method: 'POST',
    body: JSON.stringify({
      receiverId: patientId,
      content: message,
      type: 'intervention',
    }),
  });
};

