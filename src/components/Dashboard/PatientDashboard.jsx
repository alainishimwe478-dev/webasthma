import React, { useEffect, useMemo, useState } from "react";
import { currentEnvKigali, notifications } from "../../utils/mockData";
import {
  fetchLiveEnvData,
  getRwandaFallback,
  WEATHER_REFRESH_MS,
} from "../../utils/environmentAPI";
import {
  getAqiStandard,
  getHumidityStandard,
  getTemperatureStandard,
  RWANDA_DEFAULT_LOCATION,
} from "../../utils/rwandaEnvironment";
import {
  FaBell,
  FaMapMarkerAlt,
  FaPlus,
  FaThermometerHalf,
  FaTint,
  FaWind,
} from "react-icons/fa";

const fallbackEnvironment = getRwandaFallback();

const buildRiskFromEnvironment = (envData) => {
  let score = 18;

  if (envData.aqi > 100) score += 28;
  else if (envData.aqi > 50) score += 14;

  if (envData.humidity < 30 || envData.humidity > 70) score += 18;
  else if (envData.humidity < 35 || envData.humidity > 60) score += 8;

  if (envData.temperature < 15 || envData.temperature > 30) score += 12;
  else if (envData.temperature < 18 || envData.temperature > 26) score += 6;

  const riskLevel =
    score >= 60 ? "High" : score >= 35 ? "Medium" : "Low";

  return { score, riskLevel };
};

const buildEnvironmentAlerts = (envData) => {
  const alerts = [];

  if (envData.aqi > 100) {
    alerts.push("Air quality is poor today. Reduce outdoor activity.");
  }
  if (envData.humidity < 30 || envData.humidity > 70) {
    alerts.push("Humidity is outside the safe comfort range for asthma care.");
  }
  if (envData.temperature < 15 || envData.temperature > 30) {
    alerts.push("Temperature is outside the preferred asthma comfort range.");
  }

  return alerts;
};

const PatientDashboard = () => {
  const [environment, setEnvironment] = useState(fallbackEnvironment);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(fallbackEnvironment.lastUpdated);

  useEffect(() => {
    let isMounted = true;

    const loadRwandaWeather = async () => {
      const location = RWANDA_DEFAULT_LOCATION;

      try {
        const liveData = await fetchLiveEnvData(
          location.lat,
          location.lon,
          location.label,
        );

        if (!isMounted) return;
        const normalizedEnvironment = normalizeEnvironmentData(liveData);
        setEnvironment(normalizedEnvironment);
        setLastUpdated(normalizedEnvironment.lastUpdated);
        setError(
          liveData.source === "openweathermap"
            ? ""
            : "Showing Rwanda fallback readings because live weather data is unavailable.",
        );
      } catch (fetchError) {
        if (!isMounted) return;
        const nextEnvironment = {
          ...fallbackEnvironment,
          location: location.label,
        };
        setEnvironment(nextEnvironment);
        setLastUpdated(nextEnvironment.lastUpdated);
        setError("Showing Rwanda fallback readings because live weather data is unavailable.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRwandaWeather();
    const refreshTimer = setInterval(loadRwandaWeather, WEATHER_REFRESH_MS);

    return () => {
      isMounted = false;
      clearInterval(refreshTimer);
    };
  }, []);

  const riskData = useMemo(
    () => buildRiskFromEnvironment(environment),
    [environment],
  );
  const humidityStandard = getHumidityStandard(environment.humidity);
  const temperatureStandard = getTemperatureStandard(environment.temperature);
  const aqiStandard = getAqiStandard(environment.aqi);
  const activeAlerts = [
    ...buildEnvironmentAlerts(environment).map((message, index) => ({
      id: `env-${index}`,
      message,
    })),
    ...notifications
      .filter((notification) => !notification.read && notification.type === "alert")
      .slice(0, 2)
      .map((notification) => ({
        id: `mock-${notification.id}`,
        message: notification.message,
      })),
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm text-sky-100">
              <FaMapMarkerAlt />
              Rwanda weather feed: {environment.location}
            </p>
            <h2 className="text-2xl font-bold mt-2">Current Risk Level</h2>
            <p className="text-sky-100 mt-1">
              {loading ? "Checking Rwanda weather..." : "Humidity and temperature are now validated on this dashboard."}
            </p>
            <p className="text-sky-100/90 mt-2 text-sm">
              Weather refreshes every 5 minutes. Last update: {new Date(lastUpdated).toLocaleTimeString()}
            </p>
            <a
              href={environment.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex mt-2 text-sm text-white underline underline-offset-4"
            >
              Source reference: {environment.sourceLabel}
            </a>
          </div>

          <div className="text-left lg:text-right">
            <div className="text-6xl font-black mb-2">{riskData.score}%</div>
            <div className="text-xl opacity-90">{riskData.riskLevel} Risk</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <FaThermometerHalf className="text-2xl text-blue-600" />
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${temperatureStandard.tone}`}>
              {temperatureStandard.label}
            </span>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {environment.temperature} C
          </div>
          <div className="font-medium text-slate-900">Temperature</div>
          <p className="text-sm text-slate-500 mt-2">
            Ideal range: 18 C to 26 C
          </p>
          <p className="text-sm text-slate-600 mt-2">{temperatureStandard.message}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <FaTint className="text-2xl text-emerald-600" />
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${humidityStandard.tone}`}>
              {humidityStandard.label}
            </span>
          </div>
          <div className="text-3xl font-bold text-emerald-600 mb-2">
            {environment.humidity}%
          </div>
          <div className="font-medium text-slate-900">Humidity</div>
          <p className="text-sm text-slate-500 mt-2">
            Ideal range: 30% to 60%
          </p>
          <p className="text-sm text-slate-600 mt-2">{humidityStandard.message}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <FaWind className="text-2xl text-orange-600" />
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${aqiStandard.tone}`}>
              {aqiStandard.label}
            </span>
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {environment.aqi}
          </div>
          <div className="font-medium text-slate-900">AQI</div>
          <p className="text-sm text-slate-500 mt-2">
            Source: {environment.source === "openweathermap" ? "Live Rwanda weather" : "Rwanda fallback"}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="text-sm text-slate-500 uppercase tracking-wide">RealFeel Shade</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">
            {environment.realFeelShade} C
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="text-sm text-slate-500 uppercase tracking-wide">Wind</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">
            {environment.windDirection} {environment.windSpeed} km/h
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="text-sm text-slate-500 uppercase tracking-wide">Air Quality</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">
            {environment.airQualityStatus}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="text-sm text-slate-500 uppercase tracking-wide">Max UV Index</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">
            {environment.uvIndex}
          </div>
          <div className="text-sm text-slate-500 mt-2">
            {environment.uvIndex <= 2 ? "Low" : environment.uvIndex <= 5 ? "Moderate" : "High"}
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-3xl p-6">
        <h3 className="text-xl font-bold text-red-800 mb-4">
          Active Alerts ({activeAlerts.length})
        </h3>
        {activeAlerts.length ? (
          activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white p-4 rounded-2xl mb-3 shadow-sm border-l-4 border-red-400"
            >
              {alert.message}
            </div>
          ))
        ) : (
          <div className="bg-white p-4 rounded-2xl text-slate-600">
            No active weather or asthma alerts right now.
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-8 rounded-3xl shadow-2xl text-center">
          <div className="text-4xl mb-4">
            <FaPlus className="mx-auto" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Log Symptoms</h3>
          <p className="opacity-90 mb-6">
            Track symptoms alongside Rwanda weather conditions.
          </p>
          <button className="bg-white text-emerald-600 px-8 py-3 rounded-2xl font-bold hover:bg-gray-100 transition">
            Log Now
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Today's Recommendations</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl">
              <div className="w-8 h-8 bg-emerald-200 rounded-lg flex items-center justify-center mt-0.5 font-bold text-emerald-700 text-sm">
                OK
              </div>
              <span>{temperatureStandard.message}</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center mt-0.5 font-bold text-blue-700 text-sm">
                H2O
              </div>
              <span>{humidityStandard.message}</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
              <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center mt-0.5 font-bold text-orange-700 text-sm">
                AQI
              </div>
              <span>
                {environment.aqi > 100
                  ? "Keep outdoor activity short today and carry your inhaler."
                  : "Outdoor conditions are acceptable, but keep monitoring changes."}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
