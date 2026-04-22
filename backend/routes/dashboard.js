import express from 'express';
import fetch from 'node-fetch';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Notification from '../models/Notification.js';
import EnvironmentReading from '../models/EnvironmentReading.js';

const router = express.Router();

// Predefined locations (Rwanda)
const LOCATIONS = {
  Kigali: { lat: -1.9441, lon: 30.0619 },
  Huye: { lat: -2.5858, lon: 29.7390 },
  Rubavu: { lat: -1.6851, lon: 29.2560 },
  Musanze: { lat: -1.4998, lon: 29.6359 },
  Muhanga: { lat: -2.0845, lon: 29.7550 },
  Nyamagabe: { lat: -2.4328, lon: 29.1528 },
  Rusizi: { lat: -2.5528, lon: 28.9071 },
  Ngororero: { lat: -2.0324, lon: 29.6350 },
  Karongi: { lat: -2.1606, lon: 29.3384 },
  Rutsiro: { lat: -1.8733, lon: 29.0925 }
};

// Helper: fetch weather
async function fetchWeather(lat, lon) {
  const apiKey = process.env.OPENWEATHER_KEY;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
  const data = await res.json();
  return {
    temperature: data.main.temp,
    humidity: data.main.humidity,
    weatherDescription: data.weather[0].description
  };
}

// Helper: fetch AQI
async function fetchAQI(lat, lon) {
  const apiKey = process.env.OPENWEATHER_KEY;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
  const data = await res.json();
  return {
    aqi: data.list[0].main.aqi,
    pm25: data.list[0].components.pm2_5,
    pm10: data.list[0].components.pm10,
    no2: data.list[0].components.no2,
    so2: data.list[0].components.so2,
    co: data.list[0].components.co,
    o3: data.list[0].components.o3
  };
}

// Calculate risk level based on environment and patient data
function calculateRiskLevel(environment, patient) {
  let risk = 0;

  if (environment.aqi > 100) risk += 2;
  else if (environment.aqi > 50) risk += 1;

  if (environment.humidity > 70) risk += 1;
  if (environment.temperature < 15 || environment.temperature > 30) risk += 1;

  if (patient.medicalHistory.some(h => h.condition.toLowerCase().includes('asthma'))) risk += 2;
  if (patient.allergies.length > 0) risk += 1;

  if (risk >= 4) return 'High';
  if (risk >= 2) return 'Medium';
  return 'Low';
}

// Dashboard endpoint
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const patient = await Patient.findOne({ user: userId });
    if (!patient) return res.status(404).json({ error: 'Patient profile not found' });

    const location = LOCATIONS[patient.district] || LOCATIONS.Kigali;
    const weather = await fetchWeather(location.lat, location.lon);
    const aqiData = await fetchAQI(location.lat, location.lon);

    const environment = {
      district: patient.district,
      ...weather,
      ...aqiData,
      pollenLevel: 'Moderate', // Mock for now
      lastUpdated: new Date().toISOString()
    };

    // Calculate risk
    const riskLevel = calculateRiskLevel(environment, patient);

    // Update patient risk if changed
    if (patient.riskLevel !== riskLevel) {
      patient.riskLevel = riskLevel;
      patient.lastRiskAssessment = new Date();
      await patient.save();
    }

    // Get recent notifications
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent activity logs
    const activityLogs = patient.activityLogs.slice(-5);

    // Generate predictions (simple mock AI)
    const predictions = [
      {
        symptom: 'Wheezing',
        probability: riskLevel === 'High' ? 0.8 : riskLevel === 'Medium' ? 0.5 : 0.2,
        triggers: ['High AQI', 'Humidity']
      }
    ];

    const dashboardData = {
      user: {
        id: user._id,
        name: user.name,
        district: patient.district
      },
      environment,
      riskLevel,
      notifications,
      activityLogs,
      predictions,
      medications: patient.medications
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;