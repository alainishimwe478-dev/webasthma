import { RWANDA_LOCATIONS, normalizeEnvironmentData } from './rwandaEnvironment.js';
import { currentEnvKigali } from './mockData.js';
import { calculateRisk } from './aiPrediction.js';
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

    // Pull live/mock environment (temp, humidity, AQI) per city
    const env = await fetchEnvironment(cityKey);

    // Normalize shape expected by UI
    const normalized = normalizeEnvironmentData({
      ...currentEnvKigali,
      aqi: env.aqi,
      temperature: env.temp,
      humidity: env.humidity,
      source: env.source,
      sourceLabel: env.source === 'Live' ? 'OpenAQ + OWM (live)' : env.source,
      sourceUrl: env.source === 'Live' ? 'https://openweathermap.org' : null,
      location: locationLabel,
      lastUpdated: env.lastUpdated,
    });

    // Risk expectation from current environment
    const risk = calculateRisk(userId ?? 3, normalized);

    return {
      environment: normalized,
      healthLogs: [],
      notifications: [],
      predictions: [
        {
          prediction: risk.riskLevel,
          confidence: risk.score / 100,
        },
      ],
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

export const fetchFullForecast = async (lat, lon) => {
  const timestamp = new Date().toISOString();
  if (IS_DEV) {
    return {
      afternoonTemp: currentEnvKigali.afternoonTemp,
      afternoonDesc: currentEnvKigali.afternoonDesc,
      sunset: currentEnvKigali.sunset,
      lastUpdated: timestamp
    };
  }
  try {
    // OWM One Call API 3.0 for hourly forecast & daily sunset
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${OWM_API_KEY}&units=metric`;
    const resp = await fetch(url);
    const data = await resp.json();

    // Afternoon avg (hours 14-17)
    const afternoonHours = data.hourly?.slice(14, 18) || [];
    const avgTemp = afternoonHours.reduce((sum, h) => sum + (h.temp || 0), 0) / afternoonHours.length;
    const desc = afternoonHours[0]?.weather[0]?.description || 'clear';

    return {
      afternoonTemp: Math.round(avgTemp),
      afternoonDesc: desc.charAt(0).toUpperCase() + desc.slice(1),
      sunset: data.daily?.[0]?.sunset || 0,
      lastUpdated: timestamp
    };
  } catch (err) {
    console.warn('Forecast fetch failed:', err);
    return {
      afternoonTemp: 25,
      afternoonDesc: "Clear",
      sunset: Date.now() / 1000 + 7200,
      lastUpdated: timestamp
    };
  }
};

export const fetchLiveEnvData = async (lat, lon, label) => {
  if (IS_DEV) return currentEnvKigali;

  try {
    // Current + forecast
    const [currentResp, forecast] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_API_KEY}`),
      fetchFullForecast(lat, lon)
    ]);
    const currentData = await currentResp.json();
    const env = {
      ...currentData,
      location: label,
      aqi: 50, // Stub - integrate OpenAQ separately
      afternoonTemp: forecast.afternoonTemp,
      afternoonDesc: forecast.afternoonDesc,
      sunset: forecast.sunset,
      lastUpdated: forecast.lastUpdated
    };
    return env;
  } catch (err) {
    console.warn('Live env failed:', err);
    return currentEnvKigali;
  }
};

export const getRwandaFallback = () => currentEnvKigali;

export const WEATHER_REFRESH_MS = 5 * 60 * 1000; // 5 minutes

// Enhanced chatbot with more asthma sickness/symptom responses
export const fetchChatbotResponse = async (question, environment, user) => {
  const lowerQ = question.toLowerCase();
  let reply = `Thanks for sharing, ${user.name || 'friend'}. Monitor your symptoms and use your inhaler if needed. Current env: AQI ${environment.aqi}, humidity ${environment.humidity}%.`;
  let severity = 'normal';

  if (lowerQ.includes('wheezing') || lowerQ.includes('wheeze')) {
    reply = "Wheezing is a key asthma symptom. Use your rescue inhaler immediately (1-2 puffs). Stay calm, sit upright. If no improvement in 15 min or worsening, seek emergency care.";
    severity = 'high';
  } else if (lowerQ.includes('shortness') || lowerQ.includes('breathless')) {
    reply = "Shortness of breath is serious. Take slow breaths, use rescue inhaler now. Check peak flow if possible. Contact doctor if persists.";
    severity = 'high';
  } else if (lowerQ.includes('chest') || lowerQ.includes('tight')) {
    reply = "Chest tightness – try pursed lip breathing: inhale nose 2s, exhale mouth 4s. Use controller/rescue inhaler. Rest and monitor.";
    severity = 'medium';
  } else if (lowerQ.includes('cough') || lowerQ.includes('persistent cough')) {
    reply = "Cough can indicate airway inflammation. Nighttime cough? Use controller med. Hydrate, avoid triggers. Track frequency.";
    severity = 'medium';
  } else if (lowerQ.includes('peak flow') || lowerQ.includes('low peakflow')) {
    reply = "Low peak flow (<80% personal best) means airway restriction. Use bronchodilator, recheck in 15 min. Log readings for doctor.";
    severity = 'high';
  } else if (lowerQ.includes('tired') || lowerQ.includes('fatigue') || lowerQ.includes('weak')) {
    reply = "Fatigue with breathing issues may signal poor control. Check O2 if available, rest, hydrate. Update your asthma action plan.";
    severity = 'medium';
  } else if (lowerQ.includes('aqi') || lowerQ.includes('air')) {
    const std = environment.aqi <= 50 ? 'Good' : environment.aqi <= 100 ? 'Moderate' : 'Poor';
    reply = `AQI ${environment.aqi} (${std}). ${environment.aqi > 100 ? 'Limit outdoor activity, use mask if out.' : 'Safe but monitor.'}`;
    severity = environment.aqi > 100 ? 'medium' : 'normal';
  } else if (lowerQ.includes('humidity') || lowerQ.includes('weather')) {
    const std = environment.humidity <= 60 ? 'Good' : 'High';
    reply = `Humidity ${environment.humidity}% (${std}). High humidity worsens symptoms – use dehumidifier, avoid damp areas.`;
    severity = environment.humidity > 70 ? 'medium' : 'normal';
  } else if (lowerQ.includes('attack') || lowerQ.includes('severe')) {
    reply = "Asthma attack signs: Use rescue inhaler STAT, stay calm. No improvement? Call emergency services NOW.";
    severity = 'high';
  }

  return { reply, severity };
};
