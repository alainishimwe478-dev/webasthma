export const WEATHER_REFRESH_MS = 5 * 60 * 1000;

// Fake live fetch (replace later with real API)
export const fetchLiveEnvData = async (lat, lon, label) => {
  return {
    temperature: 24,
    humidity: 55,
    aqi: 60,
    windSpeed: 10,
    pollen: 2,
    source: "mock-api",
    sourceLabel: "Mock Weather",
    sourceUrl: "#",
    lastUpdated: new Date().toISOString(),
    location: label,
  };
};

// Rwanda fallback data
export const getRwandaFallback = () => {
  return {
    temperature: 23,
    humidity: 60,
    aqi: 70,
    windSpeed: 8,
    pollen: 1,
    source: "fallback",
    sourceLabel: "Rwanda Default Data",
    sourceUrl: "#",
    lastUpdated: new Date().toISOString(),
  };
};

// Normalize API data
export const normalizeEnvironmentData = (data) => {
  return {
    temperature: data.temperature || 0,
    humidity: data.humidity || 0,
    aqi: data.aqi || 0,
    windSpeed: data.windSpeed || 0,
    pollen: data.pollen || 0,
    realFeelShade: data.temperature - 1,
    airQualityStatus: data.aqi > 100 ? "Poor" : "Good",
    uvIndex: 5,
    windDirection: "NE",
    location: data.location || "Kigali",
    source: data.source || "unknown",
    sourceLabel: data.sourceLabel || "Weather API",
    sourceUrl: data.sourceUrl || "#",
    lastUpdated: data.lastUpdated || new Date().toISOString(),
  };
};