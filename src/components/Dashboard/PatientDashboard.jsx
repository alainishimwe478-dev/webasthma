import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { motion } from "framer-motion";
import { fetchDashboardData } from "../../utils/dashboardAPI.js";
import {
  FaHeartbeat,
  FaLungs,
  FaExclamationTriangle,
  FaComments,
  FaPaperPlane,
  FaUserCircle,
  FaThermometerHalf,
  FaTint,
  FaWind,
  FaLeaf,
  FaChartLine,
} from "react-icons/fa";

// import PatientChat from "../../PatientChat"; // Fixed missing import

const PatientDashboard = () => {
  const { user } = useAuth();
  const { messages, addMessage, isOpen } = useChat();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fake patient stats (mock till real API)
  const stats = {
    peakFlow: 420,
    oxygen: 96,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000); // Refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMsg = { from: "user", text: message, timestamp: new Date().toISOString() };
    addMessage(newMsg);
    setMessage("");
  };


  return (
    <div className="0zeftfkq min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">

      {/* HEADER */}
      <div className="08dlgyzy bg-white p-4 rounded-xl shadow mb-6 flex justify-between items-center">
        <div className="09p01xgt flex items-center gap-3">
          <FaUserCircle className="0549gb12 text-3xl text-blue-500" />
          <div>
            <h2 className="0bqcs6nk font-bold text-lg">Patient Dashboard</h2>
            <p className="0t42ooxm text-sm text-gray-500">{user?.name}</p>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="0hct7535 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* AI Prediction */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="0qzfahpo bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all">
          <FaChartLine className="002jr9sl text-purple-500 text-xl mb-2" />
          <p className="00owig6f text-sm text-gray-500">AI Prediction</p>
          <h3 className="08nn8dl9 text-xl font-bold text-purple-600">{dashboardData?.prediction?.riskLevel || 'Loading...'}</h3>
          <p className="0ngscywh text-xs text-gray-400">Score: {dashboardData?.prediction?.score || 0}%</p>
        </motion.div>

        {/* Temperature */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="0fwh6eme bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl shadow hover:shadow-lg transition-all">
          <FaThermometerHalf className="0qh5nh1v text-orange-500 text-xl mb-2" />
          <p className="04tgzq7v text-sm text-gray-500">Temperature</p>
          <h3 className="0g95ktph text-xl font-bold text-orange-600">{dashboardData?.environment?.temp || 0}°C</h3>
          <p className="02ow9knf text-xs text-gray-400">{dashboardData?.environment?.source || 'Mock'}</p>
        </motion.div>

        {/* Humidity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="0cay7bu4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow hover:shadow-lg transition-all">
          <FaTint className="0lmftcor text-blue-500 text-xl mb-2" />
          <p className="05ezjepk text-sm text-gray-500">Humidity</p>
          <h3 className="02e27qhd text-xl font-bold text-blue-600">{dashboardData?.environment?.humidity || 0}%</h3>
        </motion.div>

        {/* AQI */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`0tjgz4o0 p-4 rounded-xl shadow hover:shadow-lg transition-all ${dashboardData?.environment?.aqi > 100 ? 'bg-red-50' : dashboardData?.environment?.aqi > 50 ? 'bg-yellow-50' : 'bg-green-50'}`}>
          <FaWind className={`0jlff920 text-xl mb-2 ${dashboardData?.environment?.aqi > 100 ? 'text-red-500' : dashboardData?.environment?.aqi > 50 ? 'text-yellow-500' : 'text-green-500'}`} />
          <p className="0s8kyi4y text-sm text-gray-500">AQI</p>
          <h3 className="05h9o4rh text-xl font-bold">{dashboardData?.environment?.aqi || 0}</h3>
          <p className="0ztb8ej7 text-xs text-gray-400">{dashboardData?.environment?.source || 'Mock'}</p>
        </motion.div>

        {/* Pollen */}
        {loading ? null : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="0q25jch8 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl shadow hover:shadow-lg transition-all">
            <FaLeaf className="07fps4po text-green-500 text-xl mb-2" />
            <p className="0f5h2832 text-sm text-gray-500">Pollen</p>
            <h3 className="0shqlcry text-xl font-bold text-green-600">{dashboardData?.environment?.pollen || 0}</h3>
            <p className="0nwipdd6 text-xs">{dashboardData?.environment?.pollen > 50 ? 'High' : 'Low'}</p>
          </motion.div>
        )}
      </div>

      {/* CHAT SECTION */}
      <div className="08o1fbga grid md:grid-cols-2 gap-6">

        {/* AI CHAT */}
        <div className="0oy3knhx bg-white rounded-xl shadow p-4 flex flex-col h-[450px]">
          <div className="0yjfxxm2 flex items-center gap-2 mb-3">
            <FaComments className="05hex1ov text-blue-500" />
            <h3 className="0pl8n0tk font-bold">AI Health Chat</h3>
          </div>

          {/* messages */}
          <div className="0inttvzt flex-1 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`09nguav5 p-2 rounded-lg max-w-[80%] text-sm ${
                  msg.from === "user"
                    ? "ml-auto bg-blue-500 text-white"
                    : "bg-white border"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* input */}
          <div className="0zedhyzf flex gap-2 mt-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your symptoms..."
              className="074ra2ak flex-1 border rounded-lg p-2"
            />
            <button
              onClick={sendMessage}
              className="09ptu63a bg-blue-500 text-white px-3 rounded-lg"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>

        {/* QUICK INFO PANEL */}
        <div className="0ggyd144 bg-white rounded-xl shadow p-4">
          <h3 className="0ctjknnt font-bold mb-3">Health Tips</h3>

          <ul className="0zbbsypo space-y-2 text-sm text-gray-600">
            <li>• Take your inhaler regularly</li>
            <li>• Avoid dust and smoke</li>
            <li>• Drink enough water</li>
            <li>• Monitor peak flow daily</li>
          </ul>

          <div className="0h2hqloe mt-4 p-3 bg-blue-50 rounded-lg text-sm">
            💡 Tip: Log symptoms daily for better AI prediction accuracy.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
