import { currentEnvKigali } from "./mockData";
import {
  getRwandaLocation,
  normalizeEnvironmentData,
  RWANDA_DEFAULT_LOCATION,
} from "./rwandaEnvironment";

const apiKey = import.meta.env.VITE_OWM_API_KEY;

export const WEATHER_REFRESH_MS = 5 * 60 * 1000;

export const getRwandaFallback = (label = RWANDA_DEFAULT_LOCATION.label) =>
  normalizeEnvironmentData({
    temperature: 22,
    humidity: 75,
    aqi: 120,
    pollen: currentEnvKigali.pollenLevel,
    realFeelShade: 19,
    windSpeed: 11,
    windDirection: "ESE",
    uvIndex: 0.6,
    airQualityStatus: "Poor",
    location: label,
    sourceLabel: "AccuWeather Huye",
    sourceUrl: RWANDA_DEFAULT_LOCATION.accuweatherUrl,
    source: "rwanda-fallback",
    lastUpdated: currentEnvKigali.timestamp,
  });

export const getRwandaWeatherContext = (user) => {
  const location = getRwandaLocation(user);

  return {
    location,
    fallbackEnvironment: getRwandaFallback(location.label),
  };
};

export const fetchLiveEnvData = async (
  lat = RWANDA_DEFAULT_LOCATION.lat,
  lon = RWANDA_DEFAULT_LOCATION.lon,
  locationLabel = RWANDA_DEFAULT_LOCATION.label,
) => {
  if (!apiKey) {
    console.warn("VITE_OWM_API_KEY missing. Using Rwanda fallback data.");
    return getRwandaFallback(locationLabel);
  }

  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
    );
    if (!weatherRes.ok) {
      throw new Error(`Weather API failed with ${weatherRes.status}`);
    }
    const weatherData = await weatherRes.json();

    const airRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    );
    if (!airRes.ok) {
      throw new Error(`Air API failed with ${airRes.status}`);
    }
    const airData = await airRes.json();

    return normalizeEnvironmentData({
      temperature: weatherData?.main?.temp,
      humidity: weatherData?.main?.humidity,
      aqi: (airData?.list?.[0]?.main?.aqi || 0) * 50,
      pollen: currentEnvKigali.pollenLevel,
      realFeelShade: weatherData?.main?.feels_like,
      windSpeed: weatherData?.wind?.speed
        ? Math.round(weatherData.wind.speed * 3.6)
        : 11,
      windDirection: weatherData?.wind?.deg,
      uvIndex: 0.6,
      airQualityStatus:
        (airData?.list?.[0]?.main?.aqi || 0) >= 4
          ? "Poor"
          : (airData?.list?.[0]?.main?.aqi || 0) >= 3
            ? "Moderate"
            : "Good",
      location: weatherData?.name ? `${weatherData.name}, Rwanda` : locationLabel,
      sourceLabel: "AccuWeather Huye",
      sourceUrl: RWANDA_DEFAULT_LOCATION.accuweatherUrl,
      source: "openweathermap",
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.warn("Failed to fetch live Rwanda environment data:", error);
    return getRwandaFallback(locationLabel);
  }
};
