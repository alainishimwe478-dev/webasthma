import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import RiskMeter from "../RiskMeter";
import HealthGraph from "../HealthGraph";
import RecommendationFeed from "../RecommendationFeed";
import VoiceSymptomLogger from "./VoiceSymptomLogger";
import NotificationBell from "../NotificationBell";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  const { user } = useAuth();
  const { notifications } = useNotification();
  const [recentSymptoms, setRecentSymptoms] = useState([]);

  useEffect(() => {
    // Fetch recent symptoms mock data
    setRecentSymptoms([
      {
        time: "2 hours ago",
        symptoms: "Wheezing, shortness of breath",
        severity: "medium",
      },
      { time: "1 day ago", symptoms: "Coughing", severity: "low" },
    ]);
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="0ggmmhnc min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="08ckin0c max-w-7xl mx-auto">
        <div className="03t8fxxz flex justify-between items-center mb-8">
          <div>
            <h1 className="0j2yxo7n text-4xl font-bold text-gray-900">
              Welcome back, {user.name}
            </h1>
            <p className="0d64hfme text-xl text-gray-600 mt-2">
              Monitor your asthma, track symptoms, get AI insights
            </p>
          </div>
          <NotificationBell />
        </div>

        {/* Risk Overview */}
        <div className="0oh9ceje grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="01rnsz7z lg:col-span-1">
            <RiskMeter currentRisk={65} trend="up" />
          </div>
          <div className="038bk80u lg:col-span-2">
            <HealthGraph />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="0ca7swji grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/patient/log-symptoms"
            className="0akkcjaw bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="02gzbqjn font-semibold text-lg mb-2">
              Log Symptoms
            </h3>
            <VoiceSymptomLogger />
          </Link>
          <Link
            to="/patient/environment"
            className="07rhfn8j bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl"
          >
            <h3 className="0s5jqn4x font-semibold text-lg mb-2">Environment</h3>
            <p>Check air quality</p>
          </Link>
          <Link
            to="/patient/alerts"
            className="0nz1fxvy bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl"
          >
            <h3 className="00lsux3b font-semibold text-lg mb-2">Alerts</h3>
            <p>{notifications.length} new</p>
          </Link>
          <Link
            to="/patient/hospitals"
            className="00a6h1y2 bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl"
          >
            <h3 className="0pdc22lm font-semibold text-lg mb-2">
              Nearby Hospitals
            </h3>
            <p>Emergency contacts</p>
          </Link>
        </div>

        {/* Recent Activity & Recommendations */}
        <div className="0ekp7qba grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="05v9fki3 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="0zl05lnn text-2xl font-bold mb-6">
              Recent Symptoms
            </h2>
            <div className="0g5dsmro space-y-4">
              {recentSymptoms.map((symptom, index) => (
                <div
                  key={index}
                  className="040be9qp flex items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`0l2q2w3n w-3 h-3 rounded-full mr-4 ${symptom.severity === "high" ? "bg-red-500" : symptom.severity === "medium" ? "bg-yellow-500" : "bg-green-500"}`}
                  />
                  <div>
                    <p className="0g1p7gxa font-medium">{symptom.symptoms}</p>
                    <p className="07duh2fv text-sm text-gray-500">
                      {symptom.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <RecommendationFeed />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
