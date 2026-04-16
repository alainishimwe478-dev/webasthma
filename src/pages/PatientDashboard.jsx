import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { currentEnvKigali } from "../utils/mockData";
import { calculateRisk } from "../utils/aiPrediction";
import {
  fetchDashboardData,
  fetchLiveEnvData,
  getRwandaFallback,
  WEATHER_REFRESH_MS,
} from "../utils/environmentAPI";
import {
  getAqiStandard,
  getHumidityStandard,
  getPollenStandard,
  getTemperatureStandard,
} from "../utils/rwandaEnvironment";

import RiskMeter from "../components/RiskMeter";
import HealthGraph from "../components/HealthGraph";
import RecommendationFeed from "../components/RecommendationFeed";
import EducationalHub from "../components/EducationalHub";
import AsthmaChatbot from "../components/AsthmaChatbot";

import {
  FaMapMarkerAlt,
  FaWind,
  FaTint,
  FaThermometerHalf,
  FaMicrophone,
  FaStop,
  FaSignOutAlt,
  FaBell,
  FaChevronDown,
} from "react-icons/fa";

const fallbackEnvironment = currentEnvKigali;

const LOCATIONS = {
  Kigali: { lat: -1.9441, lon: 30.0619, label: "Kigali" },
  Huye: { lat: -2.5858, lon: 29.7390, label: "Huye" },
  Rubavu: { lat: -1.6851, lon: 29.2560, label: "Rubavu" },
};

const PatientDashboard = () => {
  const { user, logout } = useAuth();

  const [selectedLocation, setSelectedLocation] = useState('Kigali');
  const [environment, setEnvironment] = useState(fallbackEnvironment);
  const [healthLogs, setHealthLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [riskData, setRiskData] = useState({});
  const [recentMeds, setRecentMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  // Cleanup audio URL
  useEffect(() => () => {
    if (audioURL) URL.revokeObjectURL(audioURL);
  }, [audioURL]);

  const loadDashboard = async () => {
    const userId = user?.id || 3;
    try {
      const dashboardData = await fetchDashboardData(selectedLocation, userId);
      
      console.log("Backend dashboard data:", dashboardData);
      const normalizedEnv = dashboardData.environment;
      setEnvironment(normalizedEnv);
      setLastUpdated(normalizedEnv.lastUpdated);
      setHealthLogs(dashboardData.healthLogs || []);
      setNotifications(dashboardData.notifications || []);
      setPredictions(dashboardData.predictions || []);

      // Recent meds from backend
      const meds = (dashboardData.healthLogs || [])
        .filter((log) => log.medicationTaken)
        .slice(-5);
      setRecentMeds(meds);

      // Alerts from backend notifications + env standards
      const userAlerts = (dashboardData.notifications || []).filter(n => !n.read).slice(0,3);
      const envAlerts = [];
      const temperatureStandard = getTemperatureStandard(normalizedEnv?.temperature ?? 0);
      const humidityStandard = getHumidityStandard(normalizedEnv?.humidity ?? 0);
      const aqiStandard = getAqiStandard(normalizedEnv?.aqi ?? 0);
      if (temperatureStandard.label !== 'Good') {
        envAlerts.push({ id: 'temp', message: `Temperature Alert: ${temperatureStandard.message || temperatureStandard.label}` });
      }
      if (humidityStandard.label !== 'Good') {
        envAlerts.push({ id: 'humidity', message: `Humidity Alert: ${humidityStandard.message || humidityStandard.label}` });
      }
      if (aqiStandard.label !== 'Good') {
        envAlerts.push({ id: 'aqi', message: `AQI Alert: ${aqiStandard.label}` });
      }
      setActiveAlerts([...envAlerts, ...userAlerts]);

      // Risk from current environment
      const risk = calculateRisk(userId, normalizedEnv);
      setRiskData({
        score: risk.score,
        riskLevel: risk.riskLevel,
      });

    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    const timer = setInterval(loadDashboard, WEATHER_REFRESH_MS);
    return () => clearInterval(timer);
  }, [selectedLocation, user?.id]);

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
      console.error("Recording error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder?.state === "recording") {
      mediaRecorder.stop();
    }
    setRecording(false);
  };

  const temperatureStandard = useMemo(
    () => getTemperatureStandard(environment?.temperature ?? 0),
    [environment?.temperature]
  );

  const humidityStandard = useMemo(
    () => getHumidityStandard(environment?.humidity ?? 0),
    [environment?.humidity]
  );

  const aqiStandard = useMemo(
    () => getAqiStandard(environment?.aqi ?? 0),
    [environment?.aqi]
  );

  const pollenStandard = useMemo(
    () => getPollenStandard(environment?.pollen ?? 0),
    [environment?.pollen]
  );

  if (loading) {
    return (
      <div className="010mxwpu p-10 text-center text-xl font-semibold">
        Loading Patient Dashboard...
      </div>
    );
  }

  return (
    <div className="0jh8z4ec min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      {/* Header */}
      <header className="0d91paw7 bg-white shadow-md border-b sticky top-0 z-50">
        <div className="0tjvfkxl max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="0jqsypdi text-3xl font-bold text-blue-700">
              Welcome back, {user?.name || 'Patient'}
            </h1>
            {/* Location Selector */}
            <div className="0kzui3bd flex items-center gap-2 mt-2">
              <FaMapMarkerAlt className="05k06yk8 text-slate-600" />
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="0ivefjhj bg-white border border-slate-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(LOCATIONS).map(loc => (
                  <option key={loc} value={loc}>{LOCATIONS[loc].label}</option>
                ))}
              </select>
            </div>
            <p className="0scu1hix text-sm text-slate-500 mt-1">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={logout}
            className="0ulw3rxh bg-slate-800 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-900 transition"
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      </header>

      <main className="0vctyp39 max-w-7xl mx-auto px-6 py-8 grid gap-8">
        {/* RiskMeter */}
        <RiskMeter
          riskScore={riskData.score || 35}
          riskLevel={riskData.riskLevel || "Low"}
        />

        {/* Env Cards */}
        <div className="0u7uymtu grid md:grid-cols-4 gap-6">
          <div className={`0hdaksqa p-6 rounded-2xl shadow-lg border ${temperatureStandard.tone || 'bg-emerald-100'}`}>
            <FaThermometerHalf className="0xg0touh text-2xl mb-2 text-emerald-600" />
            <h3 className="0wi53uj0 text-2xl font-bold">{environment.temperature}°C</h3>
            <p className="0p9lbasw text-sm text-slate-600">Temperature</p>
          </div>
          <div className={`0r4w8ubx p-6 rounded-2xl shadow-lg border ${humidityStandard.tone || 'bg-emerald-100'}`}>
            <FaTint className="0tqfsdrw text-2xl mb-2 text-blue-600" />
            <h3 className="086jad31 text-2xl font-bold">{environment.humidity}%</h3>
            <p className="0jn1gtob text-sm text-slate-600">Humidity</p>
          </div>
          <div className={`0qzz079e p-6 rounded-2xl shadow-lg border ${aqiStandard.tone || 'bg-emerald-100'}`}>
  <FaWind className="0482uupz text-2xl mb-2 text-amber-600" />
  <h3 className="0s844xm0 text-2xl font-bold">{environment.aqi}</h3>
  <p className="0th8gbvu text-sm text-slate-600">AQI</p>
  <p className={`06vt0y6e text-xs font-medium mt-1 px-2 py-1 rounded-full w-fit ${
    environment.source === 'OpenAQ' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'
  }`}>
    {environment.sourceLabel ?? environment.source ?? 'Unknown'}
  </p>
          </div>
          <div className={`0bkx1asd p-6 rounded-2xl shadow-lg border ${pollenStandard.tone || 'bg-emerald-100'}`}>
            <FaWind className="0icb7b3u text-2xl mb-2 text-green-600" />
            <h3 className="0bcjs5n1 text-2xl font-bold">{environment.pollutants ? Object.values(environment.pollutants)[0]?.toFixed(0) || 'N/A' : 'N/A'}</h3>
            <p className="0wbicc48 text-sm text-slate-600">PM2.5</p>
          </div>
        </div>

        {/* Chat Assistant */}
        <div className="0l4k8c1y bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Talk with your asthma assistant</h2>
              <p className="text-sm text-slate-600 mt-2">
                Use the chat bubble at the bottom-right corner to ask about symptoms, AQI, inhaler use, or breathing tips.
              </p>
            </div>
            <button
              onClick={() => setChatOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
            >
              Open Chat
            </button>
          </div>
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="0nu1qu9r bg-red-50 border border-red-200 rounded-2xl p-6">
            <h2 className="0b7njsxl text-xl font-bold text-red-800 mb-4">Active Alerts</h2>
            {activeAlerts.map((alert) => (
              <div key={alert.id} className="0q5zmwpm bg-white p-4 rounded-xl border-l-4 border-red-400 mb-3">
                {alert.message}
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        <div className="0d7zu1um bg-white rounded-2xl shadow-lg p-6">
          <h2 className="05xlrgfy text-2xl font-bold mb-6">Today's Asthma Timeline</h2>
          <div className="0ua9xlp1 grid md:grid-cols-3 gap-6">
            <div className="03j3ge8z bg-yellow-50 p-6 rounded-xl border">
              <h3 className="062d7o28 font-bold text-lg mb-2">☀️ Morning</h3>
              <p>{environment.temperature > 20 ? 'Warm start, good for light walk' : 'Cool, bundle up'}</p>
            </div>
            <div className="0a7mdc9u bg-orange-50 p-6 rounded-xl border">
              <h3 className="0o8pj0k2 font-bold text-lg mb-2">🌤️ Afternoon</h3>
              <p>{environment.aqi > 50 ? 'AQI rising, stay indoors' : 'Safe for outdoor time'}</p>
            </div>
            <div className="0dfed08s bg-indigo-50 p-6 rounded-xl border">
              <h3 className="0coxjlr9 font-bold text-lg mb-2">🌙 Evening</h3>
              <p>{environment.humidity > 70 ? 'High humidity, use dehumidifier' : 'Stable conditions'}</p>
            </div>
          </div>
        </div>

        {/* Predictions & Recommendations */}
        <div className="0iqz9675 grid md:grid-cols-2 gap-6">
          <div className="0fnbsb69 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="0oxj1prb text-2xl font-bold mb-4">Predicted Symptoms</h2>
            {riskData.score > 70 ? (
              <div className="0lb40z8s space-y-3">
                <div className="0mopxhq7 bg-red-50 p-4 rounded-xl border-l-4 border-red-400">⚠️ Wheezing possible</div>
                <div className="00du6hym bg-red-50 p-4 rounded-xl border-l-4 border-red-400">⚠️ Chest tightness</div>
                <div className="0ppm8z2x bg-red-50 p-4 rounded-xl border-l-4 border-red-400">⚠️ Shortness of breath</div>
              </div>
            ) : (
              <div className="0f8w8iyu bg-green-50 p-6 rounded-xl border-l-4 border-green-400 text-center">
                ✅ Symptoms stable today
              </div>
            )}
          </div>
          <div className="0f6icqsv bg-white rounded-2xl shadow-lg p-6">
            <h2 className="0148iv1t text-2xl font-bold mb-4">Today's Recommendations</h2>
            <div className="0nnybk8z space-y-3">
              <div className="0or6ytgx bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400">💨 Carry your inhaler everywhere</div>
              <div className="0vutxtmd bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400">😷 Wear mask if AQI &gt; 50</div>
              <div className="0wyesrdr bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400">💧 Stay hydrated with warm fluids</div>
              {riskData.score > 50 && (
                <div className="0fhvxw8u bg-orange-50 p-4 rounded-xl border-l-4 border-orange-400">🚨 Limit outdoor activity</div>
              )}
            </div>
          </div>
        </div>

        {riskData.score > 70 && (
          <div className="0ocgnm4i bg-red-100 border-l-4 border-red-400 p-6 rounded-xl">
            <h2 className="021d63zb text-2xl font-bold text-red-800 mb-3">🚨 Emergency Warning</h2>
            <p className="0jhf3aiz text-lg">High risk detected. Use rescue inhaler if symptoms start. Contact doctor.</p>
          </div>
        )}

        {/* Recent Medications */}
        <div className="0amgubos bg-white rounded-2xl shadow-lg p-6">
          <h2 className="01h2os1p text-xl font-bold mb-4">Recent Medications</h2>
          {recentMeds.length ? (
            recentMeds.map((med, index) => (
              <div key={index} className="0nowv4bt border-b pb-3 mb-3 last:border-b-0">
                <span className="09573oyy font-medium">{med.medicationTaken}</span>
                <span className="0zzhwrd4 text-sm text-slate-500 ml-2">{new Date(med.timestamp).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <p>No recent medication logs</p>
          )}
        </div>

        {/* Existing Components */}
        <HealthGraph data={healthLogs.slice(-7)} />
        <RecommendationFeed predictions={predictions} />
        <EducationalHub />

        {/* Voice Logger */}
        <div className="04z5rtxk bg-white rounded-2xl shadow-lg p-6">
          <h2 className="0x6c9s37 text-xl font-bold mb-4">Voice Symptom Logger</h2>
          {!recording ? (
            <button
              onClick={startRecording}
              className="03ypdaw0 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition"
            >
              <FaMicrophone />
              Start Recording Symptoms
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="0ijaachh bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition"
            >
              <FaStop />
              Stop Recording
            </button>
          )}
          {audioURL && (
            <audio src={audioURL} controls className="06ginpkq mt-4 w-full" />
          )}
        </div>
      </main>

      {/* Chatbot */}
      <div className="0ozqjb88 fixed bottom-6 right-6 z-[9999]">
        <AsthmaChatbot environment={environment} user={user} open={chatOpen} onOpenChange={setChatOpen} />
      </div>
    </div>
  );
};

export default PatientDashboard;

