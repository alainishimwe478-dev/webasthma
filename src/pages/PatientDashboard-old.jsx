import React
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
const formatTime = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};
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
  FaMicrophone,
  FaStop,
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";

import AsthmaChatbot from "../components/Chat/AsthmaChatBot";

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
    alerts.push("Temperature is outside the preferred comfort range of 18°C to 26°C.");
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

  const recommendationItems = [];

  if (environment.aqi > 100) {
    recommendationItems.push({
      title: "Poor Air Quality",
      message: "Avoid outdoor exercise today because air pollution is high.",
    });
  }

  if (environment.humidity > 70) {
    recommendationItems.push({
      title: "High Humidity",
      message: "High humidity may trigger asthma symptoms. Stay in ventilated rooms.",
    });
  }

  if (environment.temperature < 18) {
    recommendationItems.push({
      title: "Cold Temperature",
      message: "Cold air may trigger asthma. Wear a mask outdoors.",
    });
  }

  if (riskData.score > 70) {
    recommendationItems.push({
      title: "High Asthma Risk",
      message: "Keep rescue inhaler nearby and monitor breathing closely.",
    });
  }

  if (recommendationItems.length === 0) {
    recommendationItems.push({
      title: "Stable Condition",
      message: "Environment looks safe today. Continue medication normally.",
    });
  }

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

          {/* NEW Weather Forecast Cards */}
          <div className="0dk5j2bz grid grid-cols-1 md:grid-cols-2 gap-4 xl:col-span-1">
            {/* Afternoon forecast */}
            <div className="0r2i2bz4 p-3 rounded-xl bg-slate-50 border">
              <div className="0jbgktxr text-sm text-slate-500">Afternoon</div>
              <div className="0yvnh3al mt-2 text-xl font-bold">
                {Math.round(environment?.afternoonTemp ?? environment?.temperature ?? 0)}°C
              </div>
              <div className="00cfxg98 text-xs text-slate-500 mt-1">
                {environment?.afternoonDesc ?? environment?.description ?? "Clear"}
              </div>
            </div>

            {/* Sunset */}
            <div className="00gqtunn p-3 rounded-xl bg-slate-50 border">
              <div className="0rgtghxg text-sm text-slate-500">Sunset</div>
              <div className="04bacgp4 mt-2 text-xl font-bold text-amber-600">
                {formatTime(environment?.sunset ?? 0)}
              </div>
              <div className="0g20c7ru text-xs text-slate-500 mt-1">Sunset time for {environment?.location}</div>
            </div>
          </div>

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
            </div>
          </motion.section>


        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;

