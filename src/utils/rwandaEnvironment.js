import { currentEnvKigali } from "./mockData";

export const RWANDA_DEFAULT_LOCATION = {
  label: "Huye, Rwanda",
  district: "Huye",
  lat: -2.5967,
  lon: 29.7394,
  accuweatherUrl:
    "https://www.accuweather.com/en/rw/huye/1606706/hourly-weather-forecast/1606706",
};

const RWANDA_LOCATIONS = {
  Kigali: {
    label: "Kigali, Rwanda",
    district: "Kigali",
    lat: -1.9441,
    lon: 30.0619,
    accuweatherUrl:
      "https://www.accuweather.com/en/rw/kigali/227440/hourly-weather-forecast/227440",
  },
  Rubavu: {
    label: "Rubavu, Rwanda",
    district: "Rubavu",
    lat: -1.679,
    lon: 29.258,
    accuweatherUrl:
      "https://www.accuweather.com/en/rw/rubavu/1606710/hourly-weather-forecast/1606710",
  },
  Huye: {
    ...RWANDA_DEFAULT_LOCATION,
  },
  Muhanga: {
    label: "Muhanga, Rwanda",
    district: "Muhanga",
    lat: -2.0845,
    lon: 29.7566,
    accuweatherUrl:
      "https://www.accuweather.com/en/rw/muhanga/1606711/hourly-weather-forecast/1606711",
  },
  Musanze: {
    label: "Musanze, Rwanda",
    district: "Musanze",
    lat: -1.4996,
    lon: 29.6344,
    accuweatherUrl:
      "https://www.accuweather.com/en/rw/musanze/1606712/hourly-weather-forecast/1606712",
  },
};

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

export const getRwandaLocation = (user) => {
  const locationKey = user?.district || user?.location || "Kigali";
  return RWANDA_LOCATIONS[locationKey] || RWANDA_DEFAULT_LOCATION;
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
    location: data.location || currentEnvKigali.location || RWANDA_DEFAULT_LOCATION.label,
    sourceLabel: data.sourceLabel || "AccuWeather reference",
    sourceUrl: data.sourceUrl || RWANDA_DEFAULT_LOCATION.accuweatherUrl,
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
