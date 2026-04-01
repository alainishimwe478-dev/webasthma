import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { currentEnvKigali, notifications, healthLogs, predictions } from "../utils/mockData";
import { calculateRisk } from "../utils/aiPrediction.js";
import {
  fetchLiveEnvData,
  getRwandaFallback,
  WEATHER_REFRESH_MS,
  normalizeEnvironmentData,
} from "../utils/environmentAPI";
import {
  getAqiStandard,
  getHumidityStandard,
  getTemperatureStandard,
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
  FaCloudSun,
  FaMicrophone,
  FaStop,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const fallbackEnvironment = getRwandaFallback();
const KIGALI_LOCATION = {
  lat: -1.9441,
  lon: 30.0619,
  label: "Kigali",
};

const buildRiskInput = (environment) => ({
  ...currentEnvKigali,
  temperature: environment.temperature,
  humidity: environment.humidity,
  pollenLevel: environment.pollen ?? 0,
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
  const location = KIGALI_LOCATION;
  const userFallbackEnvironment = fallbackEnvironment;
  const [riskData, setRiskData] = useState({});
  const [environment, setEnvironment] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [recentMeds, setRecentMeds] = useState([]);
  const [error, setError] = useState("");
  const [loadingEnv, setLoadingEnv] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(userFallbackEnvironment.lastUpdated);

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState("");

  useEffect(() => () => {
    if (audioURL) URL.revokeObjectURL(audioURL);
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);
      alert("Microphone permission denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

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
    () =>
      getTemperatureStandard(environment?.temperature ?? fallbackEnvironment.temperature),
    [environment?.temperature],
  );
  const humidityStandard = useMemo(
    () =>
      getHumidityStandard(environment?.humidity ?? fallbackEnvironment.humidity),
    [environment?.humidity],
  );
  const aqiStandard = useMemo(
    () => getAqiStandard(environment?.aqi ?? fallbackEnvironment.aqi),
    [environment?.aqi],
  );

  if (!environment) {
    return (
      <div className="0cdlptdf p-10 text-center text-lg font-semibold">
        Loading live Kigali weather...
      </div>
    );
  }

  const recommendationItems = predictions.filter(
    (prediction) => prediction.userId === Number(user?.id) || prediction.userId === 3,
  );

  return (
    <div className="0je5sz2q min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="0nm5nn4l bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="02zpmoab max-w-7xl mx-auto px-6 py-4">
          <div className="0fk7fftq flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="0tg0wuxb text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-1">
                Welcome back, <span className="0ldl05uh text-slate-900">{user?.name}</span>
              </h1>
              <p className="042da5hz text-slate-600 flex items-center gap-2">
                <FaMapMarkerAlt className="0nen8g1m text-sky-600" />
                Rwanda weather feed for {environment.location}
              </p>
              <p className="0z8gzhoa text-slate-500 text-sm mt-2">
                Updates every 5 minutes. Last update: {new Date(lastUpdated).toLocaleTimeString()}
              </p>
              <a
                href={environment.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="0f5z2q3e inline-flex mt-2 text-sm text-sky-700 underline underline-offset-4"
              >
                Source reference: {environment.sourceLabel}
              </a>
            </div>
            <div className="0jkbirb2 flex items-center gap-4">
              <div
                className={`0b08ug8o flex items-center gap-3 p-4 rounded-2xl shadow-lg ${aqiStandard.tone}`}
              >
                <FaWind className="08obpmv1 w-5 h-5" />
                <div>
                  <div className="0dewl3fa text-2xl font-bold">{environment.aqi}</div>
                  <div className="0qfon4zm text-xs uppercase tracking-wide">AQI</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="0f2z2mfs px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="0zca0co5 max-w-7xl mx-auto px-6 py-12 pb-24 lg:px-8">
        {error && (
          <div className="0c57jid3 mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        <div className="0q7xh0hu grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="0p399dcm xl:col-span-1 2xl:col-span-2"
          >
            <RiskMeter
              riskScore={riskData.score || 35}
              riskLevel={riskData.riskLevel || "Low"}
            />
          </motion.div>

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="03g133u5 xl:col-span-1"
          >
            <div className="0q8iqwoj bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-6 shadow-xl border border-red-200">
              <h3 className="00a3123u text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                <FaBell className="0uoco4qb w-6 h-6" />
                Active Alerts ({activeAlerts.length})
              </h3>
              {activeAlerts.length ? (
                <div className="015sy4f3 space-y-3">
                  {activeAlerts.map((alert) => (
                    <div key={alert.id} className="01mqbkj0 bg-white p-4 rounded-2xl border-l-4 border-red-400 shadow-sm">
                      <p className="0tm6f9da font-medium text-red-800 mb-1">{alert.message}</p>
                      <span className="0l6hzvu3 text-sm text-slate-600">
                        {new Date(alert.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="0y8hfkzy text-center py-8 text-slate-500">
                  <FaBell className="0b6t8kde w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active alerts</p>
                </div>
              )}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="0c8kurop xl:col-span-2 2xl:col-span-3"
          >
            <div className="0bf9no7b grid md:grid-cols-3 gap-6">
              <div className="0qdu6bi8 bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="0j6021w2 flex items-center justify-between mb-3">
                  <FaThermometerHalf className="0a1r95r2 text-blue-600 text-2xl" />
                  <span className={`0ysdpr2q px-3 py-1 rounded-full text-xs font-semibold ${temperatureStandard.tone}`}>
                    {temperatureStandard.label}
                  </span>
                </div>
                <div className="0dbqot8q text-3xl font-bold text-blue-600">{environment.temperature}°C</div>
                <div className="0nrz57gl text-slate-800 font-medium mt-1">Temperature</div>
                <p className="0dmen2u2 text-sm text-slate-500 mt-2">Ideal range: 18°C to 26°C</p>
                <p className="0qz4kru3 text-sm text-slate-600 mt-2">{temperatureStandard.message}</p>
              </div>

              <div className="0igutbmm bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="0vaqb37p flex items-center justify-between mb-3">
                  <FaTint className="0avnjfta text-emerald-600 text-2xl" />
                  <span className={`00qyx3p8 px-3 py-1 rounded-full text-xs font-semibold ${humidityStandard.tone}`}>
                    {humidityStandard.label}
                  </span>
                </div>
                <div className="0c5l3uug text-3xl font-bold text-emerald-600">{environment.humidity}%</div>
                <div className="05fm5lig text-slate-800 font-medium mt-1">Humidity</div>
                <p className="09d35uwz text-sm text-slate-500 mt-2">Ideal range: 30% to 60%</p>
                <p className="0ywfaup9 text-sm text-slate-600 mt-2">{humidityStandard.message}</p>
              </div>

              <div className="0jdcvyke bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="0rxctgte flex items-center justify-between mb-3">
                  <FaWind className="0j68zwbg text-orange-600 text-2xl" />
                  <span className={`06sppm5p px-3 py-1 rounded-full text-xs font-semibold ${aqiStandard.tone}`}>
                    {aqiStandard.label}
                  </span>
                </div>
                <div className="08s3oqh1 text-3xl font-bold text-orange-600">{environment.aqi}</div>
                <div className="06huco4v text-slate-800 font-medium mt-1">Air Quality</div>
                <p className="0le9r0no text-sm text-slate-500 mt-2">
                  {loadingEnv ? "Checking live data..." : `Source: ${environment.source}`}
                </p>
              </div>
            </div>
            <div className="0tqgczzq mt-8 flex justify-center col-span-full">
              <Link

                className="0r1wot8n bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-8 py-4 rounded-2xl shadow-2xl border-4 border-white flex items-center gap-3 text-xl font-bold transition-all hover:shadow-3xl hover:-translate-y-1 group"
              >
                <FaCloudSun className="0yq8se7z w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                View Full Environment Details
              </Link>
            </div>
          </motion.section>
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="0rt0m4sj xl:col-span-2 2xl:col-span-3"
          >
              <div className="09xuoqdk bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="09d4n3mv text-sm text-slate-500 uppercase tracking-wide">RealFeel Shade</div>
                <div className="0p6703m6 text-3xl font-bold text-slate-900 mt-2">
                  {environment.realFeelShade}°C
                </div>
              </div>
              <div className="0jp9a4kg bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="0slgaq3g text-sm text-slate-500 uppercase tracking-wide">Wind</div>
                <div className="0ss4u5i2 text-3xl font-bold text-slate-900 mt-2">
                  {environment.windDirection} {environment.windSpeed} km/h
                </div>
              </div>
              <div className="0f3x3p5r bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="0t89vj2b text-sm text-slate-500 uppercase tracking-wide">Air Quality</div>
                <div className="0md5f4p5 text-3xl font-bold text-slate-900 mt-2">
                  {environment.airQualityStatus}
                </div>
              </div>
              <div className="0zq62n7o bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="025x1fja text-sm text-slate-500 uppercase tracking-wide">Max UV Index</div>
                <div className="0m5rdn6r text-3xl font-bold text-slate-900 mt-2">
                  {environment.uvIndex}
                </div>
                <div className="0su8oncs text-sm text-slate-500 mt-2">
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
            className="01zzv1jm xl:col-span-1"
            transition={{ delay: 0.4 }}
          >
            <div className="0wvv1fdm bg-emerald-50 border border-emerald-200 rounded-3xl p-6 shadow-lg">
              <h3 className="0clozjrw text-xl font-bold text-emerald-800 mb-4">Recent Medications</h3>
              <div className="0lbwg8to space-y-3">
                {recentMeds.map((log, index) => (
                  <div key={`${log.userId}-${index}`} className="02njng4v bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
                    <div className="0d82ucft w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <div className="0dn5iqly w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="0i2o5c4b flex-1">
                      <p className="0067qp8c font-medium text-slate-800">Medication taken</p>
                      <p className="0bu7p6j9 text-sm text-slate-600">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "Recent log"}
                      </p>
                    </div>
                  </div>
                ))}
                {recentMeds.length === 0 && (
                  <p className="0sz9ir22 text-center text-slate-500 py-8">
                    No recent medication logs. Log your symptoms to track.
                  </p>
                )}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="0h02e4t8 xl:col-span-2"
            transition={{ delay: 0.5 }}
          >
            <EducationalHub />
          </motion.section>
        </div>

        <motion.button
          className="0uzfpt28 fixed bottom-8 right-28 w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-full shadow-2xl border-4 border-white flex items-center justify-center text-2xl font-bold z-40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus />
        </motion.button>

        <motion.button
          onClick={recording ? stopRecording : startRecording}
          className="076mnoyz fixed bottom-8 right-8 w-16 h-16 bg-red-500 text-white rounded-full shadow-2xl border-4 border-white flex items-center justify-center text-2xl z-40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {recording ? <FaStop /> : <FaMicrophone />}
        </motion.button>

        {audioURL && (
          <audio controls className="0fvp6fz9 fixed bottom-36 right-8 w-80 z-40">
            <source src={audioURL} type="audio/webm" />
          </audio>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
