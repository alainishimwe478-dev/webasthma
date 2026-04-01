const API_KEY = import.meta.env.VITE_OWM_API_KEY;

export const RWANDA_DEFAULT_LOCATION = { lat: -1.9403, lng: 29.8739 };

export const WEATHER_REFRESH_MS = 300000;

export const fetchLiveEnvData = async (lat, lon, label) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    );

    if (!response.ok) {
      if (response.status === 401) {
        const errorMsg = "Unauthorized: Invalid OpenWeatherMap API key. Please check your .env file.";
        console.error("Weather API Error:", errorMsg);
        return {
          ...getRwandaFallback(),
          location: label || "Kigali (fallback)",
          source: "fallback",
          error: errorMsg,
        };
      } else if (response.status === 404) {
        const errorMsg = "Location not found. Check latitude/longitude.";
        console.error("Weather API Error:", errorMsg);
        return {
          ...getRwandaFallback(),
          location: label || "Unknown location (fallback)",
          source: "fallback",
          error: errorMsg,
        };
      } else {
        throw new Error(`Weather fetch failed with status ${response.status}`);
      }
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      location: label,
      source: "openweathermap",
      sourceLabel: "OpenWeatherMap",
      sourceUrl: "https://openweathermap.org/",
      lastUpdated: new Date().toISOString(),

      aqi: 45,
      uvIndex: 4,
      realFeelShade: Math.round(data.main.feels_like),
      windDirection: getWindDirection(data.wind.deg),
      airQualityStatus: "Moderate",
    };
  } catch (error) {
    console.error("Weather API Error:", error.message || error);
    return {
      ...getRwandaFallback(),
      location: label || "Kigali (fallback)",
      source: "fallback",
      error: error.message || "Failed to fetch weather data",
    };
  }
};

export const normalizeEnvironmentData = (data) => {
  // Pass through error if present
  if (data.error) {
    return { ...data };
  }
  return {
    ...data,
    temperature: data.temperature ?? 24,
    humidity: data.humidity ?? 55,
    aqi: data.aqi ?? 45,
    pollen: data.pollen ?? 50,
    uvIndex: data.uvIndex ?? 4,
    realFeelShade: data.realFeelShade ?? 25,
    windSpeed: data.windSpeed ?? 10,
    windDirection: data.windDirection ?? "NE",
    airQualityStatus: data.airQualityStatus ?? "Moderate",
  };
};

export const getRwandaFallback = () => ({
  temperature: 24,
  humidity: 58,
  aqi: 42,
  uvIndex: 5,
  realFeelShade: 25,
  windSpeed: 8,
  windDirection: "NE",
  pollen: 50,
  airQualityStatus: "Moderate",
  location: "Kigali",
  source: "fallback",
  sourceLabel: "Fallback Rwanda Weather",
  sourceUrl: "https://openweathermap.org/",
  lastUpdated: new Date().toISOString(),
});

const getWindDirection = (deg = 0) => {
  if (deg >= 45 && deg < 135) return "E";
  if (deg >= 135 && deg < 225) return "S";
  if (deg >= 225 && deg < 315) return "W";
  return "N";
};
