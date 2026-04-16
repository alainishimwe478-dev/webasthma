// src/utils/environmentAPI.js
import { RWANDA_LOCATIONS } from './rwandaEnvironment.js';
import { currentEnvKigali } from './mockData.js';
import { normalizeEnvironmentData } from './rwandaEnvironment.js';

// Mock AQI data for Rwanda (existing)
const MOCK_AQI = {
  kigali: 75,
  butare: 60,
  ruhengeri: 50,
  gisenyi: 55,
  cyangugu: 65,
};

// NEW: Mock full env data for weather fallback (task)
const MOCK_ENV = {
  kigali: { aqi: 75, temp: 22, humidity: 55 },
  butare: { aqi: 60, temp: 23, humidity: 60 },
  ruhengeri: { aqi: 50, temp: 20, humidity: 50 },
  gisenyi: { aqi: 55, temp: 21, humidity: 65 },
  cyangugu: { aqi: 65, temp: 24, humidity: 70 },
};

// Existing
const IS_DEV = import.meta.env.MODE === 'development'; // Vite: MODE

// NEW: OWM API key from env (Vite prefix)
const OWM_API_KEY = import.meta.env.VITE_OWM_KEY || 'demo';

/**
 * Existing: Fetch AQI for a city.
 */
export const fetchAQI = async (city = 'kigali') => {
  const cityKey = city.toLowerCase();
  const location = RWANDA_LOCATIONS[cityKey];

  if (!location) {
    throw new Error(`City "${city}" not found in RWANDA_LOCATIONS`);
  }

  if (IS_DEV) {
    return {
      city,
      aqi: MOCK_AQI[cityKey] || null,
      parameter: 'pm25',
      source: 'Mock',
    };
  }

  const { lat, lon } = location;

  try {
    const response = await fetch(
      `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=10000&limit=1`
    );

    const data = await response.json();

    if (data.results && data.results.length > 0 && data.results[0].measurements.length > 0) {
      return {
        city,
        aqi: data.results[0].measurements[0].value,
        parameter: data.results[0].measurements[0].parameter,
        source: 'OpenAQ',
      };
    } else {
      return {
        city,
        aqi: MOCK_AQI[cityKey] || null,
        parameter: 'pm25',
        source: 'Mock',
      };
    }
  } catch (err) {
    console.warn(`OpenAQ fetch failed for ${city}, using mock data`, err);
    return {
      city,
      aqi: MOCK_AQI[cityKey] || null,
      parameter: 'pm25',
      source: 'Mock',
    };
  }
};

/**
 * NEW (task): Fetch environment data (AQI + weather) for a city
 */
export const fetchEnvironment = async (city = 'kigali') => {
  const cityKey = city.toLowerCase();
  const location = RWANDA_LOCATIONS[cityKey];

  if (!location) throw new Error(`City "${city}" not found`);

  const timestamp = new Date().toISOString();

  if (IS_DEV) {
    return { ...MOCK_ENV[cityKey], source: 'Mock', lastUpdated: timestamp };
  }

  const { lat, lon } = location;

  try {
    // Fetch AQI (existing logic)
    const aqiResp = await fetch(
      `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=10000&limit=1`
    );
    const aqiData = await aqiResp.json();
    const aqi =
      aqiData.results?.[0]?.measurements?.[0]?.value ??
      MOCK_ENV[cityKey].aqi;

    // NEW: Fetch weather
    const weatherResp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_API_KEY}`
    );
    const weatherData = await weatherResp.json();
    const temp = weatherData.main?.temp ?? MOCK_ENV[cityKey].temp;
    const humidity = weatherData.main?.humidity ?? MOCK_ENV[cityKey].humidity;

    return { aqi, temp, humidity, source: 'Live', lastUpdated: timestamp };
  } catch (err) {
    console.warn(`Fetch failed for ${city}, using mock`, err);
    return { ...MOCK_ENV[cityKey], source: 'Mock', lastUpdated: timestamp };
  }
};

// NEW (task): Fetch all cities
export const fetchAllEnvironments = async () => {
  const envData = {};
  for (const city in RWANDA_LOCATIONS) {
    envData[city] = await fetchEnvironment(city);
  }
  return envData;
};

// Existing BACKWARD COMPATIBILITY
export const fetchDashboardData = async (locationLabel = 'kigali', userId) => {
  try {
    const cityKey = locationLabel.toLowerCase();
    let aqiData;
    
    if (IS_DEV) {
      aqiData = {
        city: locationLabel,
        aqi: MOCK_AQI[cityKey] || 45,
        parameter: 'pm25',
        source: 'Mock',
      };
    } else {
      aqiData = await fetchAQI(cityKey);
    }
    
    const mergedData = {
      ...currentEnvKigali,
      aqi: aqiData.aqi,
      source: aqiData.source,
      sourceLabel: aqiData.source,
      sourceUrl: aqiData.source === 'OpenAQ' ? 'https://openaq.org' : null,
      location: aqiData.city || 'Kigali, Rwanda',
    };
    
    const normalized = normalizeEnvironmentData(mergedData);
    
    return {
      environment: normalized,
      healthLogs: [],
      notifications: [],
      predictions: [{ prediction: 'stable', confidence: 0.65 }],
    };
  } catch (err) {
    console.error('Dashboard fetch failed:', err);
    const normalized = normalizeEnvironmentData(currentEnvKigali);
    return {
      environment: normalized,
      healthLogs: [],
      notifications: [],
      predictions: [{ prediction: 'stable', confidence: 0.65 }],
    };
  }
};

export const getAllLocations = () => RWANDA_LOCATIONS;

export const fetchLiveEnvData = async (lat, lon) => {
  console.warn(IS_DEV ? 'DEV: fetchLiveEnvData mock' : 'PROD: fetchLiveEnvData stub');
  return currentEnvKigali;
};

export const getRwandaFallback = () => currentEnvKigali;

export const WEATHER_REFRESH_MS = 5 * 60 * 1000; // 5 minutes

// Existing chatbot stub
export const fetchChatbotResponse = async (question, environment, user) => {
  const lowerQ = question.toLowerCase();
  let reply = "Thanks for sharing. Monitor your symptoms and use your inhaler if needed.";
  let severity = 'normal';

  if (lowerQ.includes('wheezing') || lowerQ.includes('shortness')) {
    reply = "That sounds concerning. Use your rescue inhaler now and contact your doctor if it persists >15 min.";
    severity = 'high';
  } else if (lowerQ.includes('chest') || lowerQ.includes('tight')) {
    reply = "Chest tightness can be serious. Sit upright, try pursed lip breathing, and use inhaler PRN.";
    severity = 'medium';
  } else if (lowerQ.includes('aqi') || lowerQ.includes('air')) {
    const std = environment.aqi <= 50 ? 'Good' : environment.aqi <= 100 ? 'Moderate' : 'Poor';
    reply = `Current AQI is ${environment.aqi} (${std}). ${environment.aqi > 100 ? 'Stay indoors.' : 'Good conditions.'}`;
  } else if (lowerQ.includes('humidity') || lowerQ.includes('weather')) {
    const std = environment.humidity <= 60 ? 'Good' : 'Caution';
    reply = `Humidity ${environment.humidity}% (${std}). ${environment.humidity > 70 ? 'Use dehumidifier.' : 'OK'}`;
  }

  return { reply, severity };
};

