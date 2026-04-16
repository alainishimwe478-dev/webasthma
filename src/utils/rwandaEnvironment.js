// src/utils/rwandaEnvironment.js

// Coordinates for major cities in Rwanda
export const RWANDA_LOCATIONS = {
  kigali: { lat: -1.949, lon: 30.0588 },
  butare: { lat: -2.596, lon: 29.739 },
  ruhengeri: { lat: -1.503, lon: 29.635 },
  gisenyi: { lat: -1.703, lon: 29.258 },
  cyangugu: { lat: -2.584, lon: 28.899 },
};

import { currentEnvKigali } from "./mockData";

const asFiniteNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const windDirections = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

const toCompassDirection = (value) => {
  if (typeof value === "string" && value.trim()) return value;
  const degrees = Number(value);
  if (!Number.isFinite(degrees)) return "ESE";
  return windDirections[Math.round(degrees / 22.5) % 16];
};

export const normalizeEnvironmentData = (data = {}) => {
  const fallbackAqi = Math.round(
    currentEnvKigali.pm25 + currentEnvKigali.pollenLevel / 2,
  );

  const temperature = clamp(
    asFiniteNumber(data.temperature, currentEnvKigali.temperature),
    -10,
    50,
  );
  const humidity = clamp(
    asFiniteNumber(data.humidity, currentEnvKigali.humidity),
    0,
    100,
  );
  const aqi = Math.max(0, Math.round(asFiniteNumber(data.aqi, fallbackAqi)));
  const pollen = Math.max(
    0,
    Math.round(asFiniteNumber(data.pollen ?? data.pollenLevel, currentEnvKigali.pollenLevel)),
  );
  const realFeelShade = Math.round(
    asFiniteNumber(data.realFeelShade ?? data.feelsLike ?? data.temperature, currentEnvKigali.temperature),
  );
  const windSpeed = Math.max(
    0,
    Math.round(asFiniteNumber(data.windSpeed, 11)),
  );
  const windDirection = toCompassDirection(data.windDirection);
  const uvIndex = Math.round(asFiniteNumber(data.uvIndex, 0.6) * 10) / 10;
  const airQualityStatus = data.airQualityStatus || (aqi <= 50 ? "Good" : aqi <= 100 ? "Moderate" : "Poor");

  return {
    temperature: Math.round(temperature * 10) / 10,
    humidity: Math.round(humidity),
    aqi,
    pollen,
    realFeelShade,
    windSpeed,
    windDirection,
    uvIndex,
    airQualityStatus,
    // NEW for forecast cards
    afternoonTemp: Math.round(asFiniteNumber(data.afternoonTemp, currentEnvKigali.afternoonTemp || 25)),
    afternoonDesc: data.afternoonDesc || currentEnvKigali.afternoonDesc || "Clear",
    sunset: data.sunset || currentEnvKigali.sunset || Date.now() / 1000 + 7200, // 2hr future
    location: data.location || currentEnvKigali.location || "Kigali, Rwanda",
    sourceLabel: data.sourceLabel || "Local Data",
    sourceUrl: data.sourceUrl || "https://www.accuweather.com",
    source: data.source || "fallback",
    lastUpdated: data.lastUpdated || currentEnvKigali.timestamp,
  };
};

export const getTemperatureStandard = (temperature) => {
  if (temperature >= 18 && temperature <= 26) {
    return {
      label: "Good",
      tone: "text-emerald-700 bg-emerald-100",
      message: "Comfortable range for most asthma patients.",
    };
  }

  if ((temperature >= 15 && temperature < 18) || (temperature > 26 && temperature <= 30)) {
    return {
      label: "Caution",
      tone: "text-amber-700 bg-amber-100",
      message: "Watch symptoms during cooler or warmer conditions.",
    };
  }

  return {
    label: "Poor",
    tone: "text-red-700 bg-red-100",
    message: "Extreme temperature may worsen breathing symptoms.",
  };
};

export const getHumidityStandard = (humidity) => {
  if (humidity >= 30 && humidity <= 60) {
    return {
      label: "Good",
      tone: "text-emerald-700 bg-emerald-100",
      message: "Ideal humidity range with lower mold and dust risk.",
    };
  }

  if ((humidity >= 25 && humidity < 30) || (humidity > 60 && humidity <= 70)) {
    return {
      label: "Caution",
      tone: "text-amber-700 bg-amber-100",
      message: "Slightly outside the ideal range for asthma comfort.",
    };
  }

  return {
    label: "Poor",
    tone: "text-red-700 bg-red-100",
    message: "Too dry or too humid and may increase trigger exposure.",
  };
};

export const getAqiStandard = (aqi) => {
  if (aqi <= 50) {
    return {
      label: "Good",
      tone: "text-emerald-700 bg-emerald-100",
    };
  }

  if (aqi <= 100) {
    return {
      label: "Moderate",
      tone: "text-amber-700 bg-amber-100",
    };
  }

  return {
    label: "Poor",
    tone: "text-red-700 bg-red-100",
  };
};

export const getPollenStandard = (pollen) => {
  if (pollen <= 30) {
    return {
      label: "Good",
      tone: "text-emerald-700 bg-emerald-100",
      message: "Low pollen levels, safe for outdoor activities.",
    };
  }

  if (pollen <= 60) {
    return {
      label: "Caution",
      tone: "text-amber-700 bg-amber-100",
      message: "Moderate pollen, consider medication before outdoors.",
    };
  }

  return {
    label: "Poor",
    tone: "text-red-700 bg-red-100",
    message: "High pollen may trigger symptoms, stay indoors.",
  };
};

