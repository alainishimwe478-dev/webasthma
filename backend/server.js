import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:4173",
  credentials: true
}));
app.use(express.json());

// Predefined locations (Rwanda)
const LOCATIONS = {
  Kigali: { lat: -1.9441, lon: 30.0619 },
  Huye: { lat: -2.5858, lon: 29.7390 },
  Rubavu: { lat: -1.6851, lon: 29.2560 },
};

// Mock functions for health data
const getUserHealthLogs = async (userId) => [
  { userId, medicationTaken: "Salbutamol Inhaler", timestamp: new Date().toISOString() },
  { userId, medicationTaken: "Fluticasone", timestamp: new Date(Date.now() - 86400000).toISOString() }
];

const getUserNotifications = async (userId) => [
  { id: 1, userId, message: "High AQI detected, limit outdoor activity", read: false }
];

const getUserPredictions = async (userId) => [
  { userId, prediction: "Wheezing likely today", confidence: 0.72 }
];

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
    pollutants: data.list[0].components
  };
}

// Dashboard endpoint
app.get("/api/dashboard/:location/:userId", async (req, res) => {
  const { location, userId } = req.params;
  if (!LOCATIONS[location]) return res.status(400).json({ error: "Unknown location" });

  try {
    const { lat, lon } = LOCATIONS[location];
    const weather = await fetchWeather(lat, lon);
    const aqiData = await fetchAQI(lat, lon);

    const environment = {
      location,
      ...weather,
      ...aqiData,
      lastUpdated: new Date().toISOString()
    };

    const dashboardData = {
      environment,
      user: { id: Number(userId), name: "Alice", age: 29, gender: "Female" },
      healthLogs: await getUserHealthLogs(Number(userId)),
      notifications: await getUserNotifications(Number(userId)),
      predictions: await getUserPredictions(Number(userId))
    };

    res.json(dashboardData);
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

app.listen(PORT, () => {
  console.log(`Patient Dashboard backend running on port ${PORT}`);
});

