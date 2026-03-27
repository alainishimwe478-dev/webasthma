import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { currentEnvKigali, notifications, healthLogs, predictions } from "../utils/mockData";
import { calculateRisk } from "../utils/aiPrediction.js";
import {
  fetchLiveEnvData,
  getRwandaFallback,
  getRwandaWeatherContext,
  WEATHER_REFRESH_MS,
} from "../utils/environmentAPI";
import {
  getAqiStandard,
  getHumidityStandard,
  getTemperatureStandard,
  normalizeEnvironmentData,
} from "../utils/rwandaEnvironment";
import RiskMeter from "../components/RiskMeter";
import HealthGraph from "../components/HealthGraph";
import RecommendationFeed from "../components/RecommendationFeed";
import EducationalHub from "../components/EducationalHub";
import { motion } from "framer-motion";
import {
  FaBell,
  FaMapMarkerAlt,
  FaPlus,
  FaThermometerHalf,
  FaTint,
  FaWind,
} from "react-icons/fa";

const fallbackEnvironment = getRwandaFallback();

const buildRiskInput = (environment) => ({
  ...currentEnvKigali,
  temperature: environment.temperature,
  humidity: environment.humidity,
  pollenLevel: environment.pollen,
  pm25: Math.max(10, Math.round(environment.aqi * 0.6)),
});

const buildWeatherAlerts = (environment) => {
  const alerts = [];

  if (environment.aqi > 100) {
    alerts.push("Rwanda air quality is poor today. Reduce time outdoors.");
  }
  if (environment.humidity < 30 || environment.humidity > 70) {
    alerts.push("Humidity is outside the preferred asthma range of 30% to 60%.");
  }
  if (environment.temperature < 15 || environment.temperature > 30) {
    alerts.push("Temperature is outside the preferred comfort range of 18 C to 26 C.");
  }

  return alerts;
};

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const { location, fallbackEnvironment: userFallbackEnvironment } = useMemo(
    () => getRwandaWeatherContext(user),
    [user],
  );
  const [riskData, setRiskData] = useState({});
  const [environment, setEnvironment] = useState(userFallbackEnvironment);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [recentMeds, setRecentMeds] = useState([]);
  const [error, setError] = useState("");
  const [loadingEnv, setLoadingEnv] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(userFallbackEnvironment.lastUpdated);

  useEffect(() => {
    setEnvironment(userFallbackEnvironment);
    setLastUpdated(userFallbackEnvironment.lastUpdated);
  }, [userFallbackEnvironment]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const liveEnvironment = await fetchLiveEnvData(
          location.lat,
          location.lon,
          location.label,
        );
        if (!isMounted) return;

        const normalizedEnvironment = normalizeEnvironmentData(liveEnvironment);
        const risk = calculateRisk(user?.id, buildRiskInput(normalizedEnvironment));
        const envAlerts = buildWeatherAlerts(normalizedEnvironment).map((message, index) => ({
          id: `env-${index}`,
          message,
          createdAt: normalizedEnvironment.lastUpdated,
        }));
        const seededAlerts = notifications
          .filter((notification) => !notification.read && notification.type === "alert")
          .slice(0, 2);
        const matchingLogs = healthLogs.filter(
          (log) => log.userId === Number(user?.id),
        );
        const medicationLogs = (matchingLogs.length ? matchingLogs : healthLogs.filter((log) => log.userId === 3))
          .filter((log) => log.medicationTaken)
          .slice(-3);

        setEnvironment(normalizedEnvironment);
        setLastUpdated(normalizedEnvironment.lastUpdated);
        setRiskData(risk);
        setActiveAlerts([...envAlerts, ...seededAlerts]);
        setRecentMeds(medicationLogs);
        setError(
          liveEnvironment.source === "openweathermap"
            ? ""
            : "Live Rwanda weather is unavailable right now, so fallback readings are shown.",
        );
      } catch (dashboardError) {
        if (!isMounted) return;

        const risk = calculateRisk(user?.id, buildRiskInput(userFallbackEnvironment));
        setEnvironment({
          ...userFallbackEnvironment,
          location: location.label,
        });
        setLastUpdated(userFallbackEnvironment.lastUpdated);
        setRiskData(risk);
        setActiveAlerts(
          buildWeatherAlerts(userFallbackEnvironment).map((message, index) => ({
            id: `fallback-${index}`,
            message,
            createdAt: userFallbackEnvironment.lastUpdated,
          })),
        );
        setRecentMeds(
          healthLogs.filter((log) => log.userId === 3 && log.medicationTaken).slice(-3),
        );
        setError("Live Rwanda weather is unavailable right now, so fallback readings are shown.");
      } finally {
        if (isMounted) setLoadingEnv(false);
      }
    };

    loadDashboard();
    const refreshTimer = setInterval(loadDashboard, WEATHER_REFRESH_MS);

    return () => {
      isMounted = false;
      clearInterval(refreshTimer);
    };
  }, [location, user, userFallbackEnvironment]);

  const temperatureStandard = useMemo(
    () => getTemperatureStandard(environment.temperature),
    [environment.temperature],
  );
  const humidityStandard = useMemo(
    () => getHumidityStandard(environment.humidity),
    [environment.humidity],
  );
  const aqiStandard = useMemo(
    () => getAqiStandard(environment.aqi),
    [environment.aqi],
  );

  const recommendationItems = predictions.filter(
    (prediction) => prediction.userId === Number(user?.id) || prediction.userId === 3,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-1">
                Welcome back, <span className="text-slate-900">{user?.name}</span>
              </h1>
              <p className="text-slate-600 flex items-center gap-2">
                <FaMapMarkerAlt className="text-sky-600" />
                Rwanda weather feed for {environment.location}
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Updates every 5 minutes. Last update: {new Date(lastUpdated).toLocaleTimeString()}
              </p>
              <a
                href={environment.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex mt-2 text-sm text-sky-700 underline underline-offset-4"
              >
                Source reference: {environment.sourceLabel}
              </a>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-3 p-4 rounded-2xl shadow-lg ${aqiStandard.tone}`}
              >
                <FaWind className="w-5 h-5" />
                <div>
                  <div className="text-2xl font-bold">{environment.aqi}</div>
                  <div className="text-xs uppercase tracking-wide">AQI</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 pb-24 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="xl:col-span-1 2xl:col-span-2"
          >
            <RiskMeter
              riskScore={riskData.score || 35}
              riskLevel={riskData.riskLevel || "Low"}
            />
          </motion.div>

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="xl:col-span-1"
          >
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-6 shadow-xl border border-red-200">
              <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                <FaBell className="w-6 h-6" />
                Active Alerts ({activeAlerts.length})
              </h3>
              {activeAlerts.length ? (
                <div className="space-y-3">
                  {activeAlerts.map((alert) => (
                    <div key={alert.id} className="bg-white p-4 rounded-2xl border-l-4 border-red-400 shadow-sm">
                      <p className="font-medium text-red-800 mb-1">{alert.message}</p>
                      <span className="text-sm text-slate-600">
                        {new Date(alert.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <FaBell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active alerts</p>
                </div>
              )}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="xl:col-span-2 2xl:col-span-3"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <FaThermometerHalf className="text-blue-600 text-2xl" />
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${temperatureStandard.tone}`}>
                    {temperatureStandard.label}
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-600">{environment.temperature} C</div>
                <div className="text-slate-800 font-medium mt-1">Temperature</div>
                <p className="text-sm text-slate-500 mt-2">Ideal range: 18 C to 26 C</p>
                <p className="text-sm text-slate-600 mt-2">{temperatureStandard.message}</p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <FaTint className="text-emerald-600 text-2xl" />
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${humidityStandard.tone}`}>
                    {humidityStandard.label}
                  </span>
                </div>
                <div className="text-3xl font-bold text-emerald-600">{environment.humidity}%</div>
                <div className="text-slate-800 font-medium mt-1">Humidity</div>
                <p className="text-sm text-slate-500 mt-2">Ideal range: 30% to 60%</p>
                <p className="text-sm text-slate-600 mt-2">{humidityStandard.message}</p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <FaWind className="text-orange-600 text-2xl" />
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${aqiStandard.tone}`}>
                    {aqiStandard.label}
                  </span>
                </div>
                <div className="text-3xl font-bold text-orange-600">{environment.aqi}</div>
                <div className="text-slate-800 font-medium mt-1">Air Quality</div>
                <p className="text-sm text-slate-500 mt-2">
                  {loadingEnv ? "Checking live data..." : `Source: ${environment.source}`}
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="xl:col-span-2 2xl:col-span-3"
          >
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="text-sm text-slate-500 uppercase tracking-wide">RealFeel Shade</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">
                  {environment.realFeelShade} C
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="text-sm text-slate-500 uppercase tracking-wide">Wind</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">
                  {environment.windDirection} {environment.windSpeed} km/h
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="text-sm text-slate-500 uppercase tracking-wide">Air Quality</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">
                  {environment.airQualityStatus}
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="text-sm text-slate-500 uppercase tracking-wide">Max UV Index</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">
                  {environment.uvIndex}
                </div>
                <div className="text-sm text-slate-500 mt-2">
                  {environment.uvIndex <= 2 ? "Low" : environment.uvIndex <= 5 ? "Moderate" : "High"}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <RecommendationFeed recommendations={recommendationItems} />
          </motion.section>

          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <HealthGraph userId={Number(user?.id) || 3} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="xl:col-span-1"
            transition={{ delay: 0.4 }}
          >
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-emerald-800 mb-4">Recent Medications</h3>
              <div className="space-y-3">
                {recentMeds.map((log, index) => (
                  <div key={`${log.userId}-${index}`} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">Medication taken</p>
                      <p className="text-sm text-slate-600">
                        {log.timestamp ? new Date(log.timestamp).toLocaleDateString() : "Recent log"}
                      </p>
                    </div>
                  </div>
                ))}
                {recentMeds.length === 0 && (
                  <p className="text-center text-slate-500 py-8">
                    No recent medication logs. Log your symptoms to track.
                  </p>
                )}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="xl:col-span-2"
            transition={{ delay: 0.5 }}
          >
            <EducationalHub />
          </motion.section>
        </div>

        <motion.button
          className="fixed bottom-8 right-28 w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-full shadow-2xl border-4 border-white flex items-center justify-center text-2xl font-bold z-40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus />
        </motion.button>
      </main>
    </div>
  );
};

export default PatientDashboard;
