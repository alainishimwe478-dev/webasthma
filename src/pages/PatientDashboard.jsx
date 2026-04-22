import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import RiskMeter from "../components/RiskMeter";
import RecommendationFeed from "../components/RecommendationFeed";
import {
  FaSearch,
  FaEye,
  FaVideo,
  FaComments,
  FaTimes,
  FaPaperPlane,
} from "react-icons/fa";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [allCityRisks, setAllCityRisks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Import utils dynamically for client-side
  const [utilsLoaded, setUtilsLoaded] = useState(false);
  useEffect(() => {
    import('../utils/dashboardAPI.js').then(({ fetchDashboardData }) => {
      import('../utils/environmentAPI-fixed.js').then(({ fetchAllEnvironments }) => {
        import('../utils/aiPrediction.js').then(({ calculateRisk, generateRecommendations, getEnvPrediction }) => {
          loadDashboardData(fetchDashboardData, fetchAllEnvironments, calculateRisk, generateRecommendations, getEnvPrediction);
          setUtilsLoaded(true);
        });
      });
    });
  }, []);

  const loadDashboardData = async (fetchDashboardData, fetchAllEnvironments, calculateRisk, generateRecommendations, getEnvPrediction) => {
    try {
      setLoading(true);
      const dashboardData = await fetchDashboardData();
      setDashboardData(dashboardData);

      const allEnvs = await fetchAllEnvironments();
      const cityRisks = Object.entries(allEnvs).map(([city, env]) => {
        const risk = calculateRisk(3, env); // Default user
        return { city: city.charAt(0).toUpperCase() + city.slice(1), ...env, ...risk };
      }).sort((a, b) => b.score - a.score);
      setAllCityRisks(cityRisks);

      // Generate recs
      if (dashboardData?.prediction) {
        const recs = generateRecommendations(dashboardData.prediction, dashboardData.environment || {});
        setRecommendations(recs);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const patients = [
    { id: 1, name: "Alice", location: "Kigali" },
    { id: 2, name: "Bob", location: "Musanze" },
  ];

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { text: message, sender: "me" }]);
    setMessage("");
  };

  if (loading || !utilsLoaded) return <div className="0jhgpyu1 min-h-screen flex items-center justify-center">Loading dashboard...</div>;

  const currentRisk = dashboardData?.prediction;

  return (
    <div className="0ab2l4s1 min-h-screen p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <h1 className="0ln17yi6 text-3xl font-bold mb-8 text-gray-900">
        Welcome {user?.name || "Patient"} - Asthma Dashboard
      </h1>

      {/* RiskMeter */}
      <div className="0wbc9oad mb-8">
        <RiskMeter riskScore={currentRisk?.score} riskLevel={currentRisk?.riskLevel} />
      </div>

      {/* Main Grid - Fixed 2-column layout */}
      <div className="0uu9hcgy grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left column: Current Risk */}
        <div className="0i1mjx4u p-6 rounded-xl shadow-lg bg-red-50 border-l-4 border-red-400">
          <h3 className="0nk0q6zn font-bold mb-2 text-red-800">Current Risk</h3>
          <p className="0eskyail text-3xl font-bold">{currentRisk?.score || 0}%</p>
          <p className="0t1an4nc text-sm text-gray-500">{currentRisk?.riskLevel}</p>
        </div>
        
        {/* Right column: Environment, Recs, Metrics */}
        <div className="0a39ojgn flex flex-col bg-blue-50 p-6 rounded-xl shadow-lg border-l-4 border-blue-400 min-h-[350px]">
          <div className="0x0sfndq mb-6 flex-shrink-0">
            <div className="08gccheg bg-indigo-50 p-6 rounded-xl shadow-lg border-l-4 border-indigo-400">
              <p className="02cut3qd text-sm text-gray-500">{dashboardData?.environment?.location || 'Kigali'}</p>
            </div>
          </div>
          <div className="0dkucdcn flex-1 mb-6">
            <RecommendationFeed recommendations={recommendations} />
          </div>
          <div className="0zztyskt flex gap-4">
            <div className="0p6hlcc8 flex-1 bg-blue-100 p-6 rounded-xl shadow-lg border-l-4 border-blue-400">
              <h3 className="0hpstl6x font-bold mb-2 text-indigo-800">Humidity</h3>
              <p className="0m6q78na text-3xl font-bold text-indigo-600">{dashboardData?.environment?.humidity || 0}%</p>
            </div>
            <div className="0wgj4tew flex-1 bg-orange-50 p-6 rounded-xl shadow-lg border-l-4 border-orange-400">
              <h3 className="01ttnaes font-bold mb-2 text-orange-800">Temperature</h3>
              <p className="0g6rwk6q text-3xl font-bold text-orange-600">{dashboardData?.environment?.temp || 0}°C</p>
            </div>
          </div>
        </div>
      </div>

      {/* High Risk Areas Table - Now full-width section */}
      <div className="00qqsj87 bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="0ig05dzf overflow-x-auto">
          <table className="0tzsb6ba w-full">
            <thead>
              <tr className="0zi5urdr bg-gray-50">
                <th className="0d814gls p-3 text-left font-bold">City</th>
                <th className="048bdcai p-3 text-right font-bold">Risk Score</th>
                <th className="0ugfu0qt p-3 text-right font-bold">AQI</th>
              </tr>
            </thead>
            <tbody>
              {allCityRisks.slice(0,5).map((city, i) => (
                <tr key={i} className="0qtswo06 border-t hover:bg-gray-50">
                  <td className="0dcg78qk p-3 font-medium">{city.city}</td>
                  <td className="0talh2q6 p-3 text-right font-bold text-lg">
                    <span className={`0yzdc3n6 px-2 py-1 rounded-full text-xs font-bold ${city.score > 70 ? 'bg-red-100 text-red-800' : city.score > 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {city.score}%
                    </span>
                  </td>
                  <td className="004yg6a3 p-3 text-right font-bold text-lg">{city.aqi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patients Section */}
      <div>
        <h2 className="0voswde6 text-2xl font-bold mb-6 mt-8">Your Patients</h2>

        {/* Search */}
        <div className="00wgtgc7 flex items-center mb-6 bg-gray-50 p-4 rounded-lg">
          <FaSearch className="0xf3tnv7 text-gray-400 w-5 h-5 mr-3" />
          <input
            type="text"
            placeholder="Search patients..."
            className="0g75z17m border-none outline-none flex-1 bg-transparent text-gray-700 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Patients Grid */}
        <div className="0nic9hh4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients
            .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
            .map((p) => (
              <motion.div
                key={p.id}
                className="0ct2nql3 bg-white p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="00ic09hh text-xl font-semibold text-gray-900 mb-1">{p.name}</h2>
                <p className="02w34ua9 text-gray-600 mb-4">{p.location}</p>

                <div className="067ll8tp flex gap-2 mt-4">
                  <button className="0xh23qnl p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center w-10 h-10 shadow-sm">
                    <FaEye />
                  </button>
                  <button className="0oxi3xvd p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center justify-center w-10 h-10 shadow-sm">
                    <FaVideo />
                  </button>
                  <button 
                    className="0at6k9md p-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex items-center justify-center w-10 h-10 shadow-sm"
                    onClick={() => setChatOpen(true)}
                  >
                    <FaComments />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="01xxsojf fixed bottom-4 right-4 w-80 bg-white shadow-2xl rounded-2xl p-6 border border-gray-200 z-50 max-h-96 flex flex-col">
          <div className="0cf4cif9 flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
            <h3 className="04w4isnd text-lg font-semibold">Chat</h3>
            <FaTimes className="0d2qssl7 cursor-pointer hover:text-gray-500" onClick={() => setChatOpen(false)} />
          </div>

          <div className="0jxo1xue flex-1 overflow-y-auto p-4 space-y-3 mb-4 bg-gray-50 rounded-xl border">
            {messages.map((msg, i) => (
              <div key={i} className={`012e96rh flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`04b87d8p px-4 py-2 rounded-2xl max-w-xs ${msg.sender === 'me' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="0gvux4pf flex items-center space-x-2 pt-2">
            <input
              type="text"
              className="0l9s8yet flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button 
              onClick={sendMessage} 
              className="01ao0ldw p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md flex items-center justify-center w-12 h-12 flex-shrink-0"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
