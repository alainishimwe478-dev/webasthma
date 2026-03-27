import React, { useState, useEffect } from "react";
import { FaBell, FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const AlertsPage = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Load alerts from localStorage
    const stored = localStorage.getItem("asthma_alerts");
    if (stored) {
      setAlerts(JSON.parse(stored));
    } else {
      // Demo alerts
      setAlerts([
        {
          id: 1,
          type: "Environmental Alert",
          message: "High humidity predicted tonight (78%). Use dehumidifier.",
          date: new Date().toISOString().split("T")[0],
        },
        {
          id: 2,
          type: "Medication Reminder",
          message: "Don't forget your evening controller inhaler.",
          date: new Date().toISOString().split("T")[0],
        },
      ]);
    }
  }, []);

  const deleteAlert = (id) => {
    const newAlerts = alerts.filter((alert) => alert.id !== id);
    setAlerts(newAlerts);
    localStorage.setItem("asthma_alerts", JSON.stringify(newAlerts));
  };

  return (
    <div className="0dc3t2ej min-h-screen bg-[#fbfefe] flex">
      <Sidebar />
      <main className="0l5o93kv flex-1 p-8">
        <div className="0bv4ob4m max-w-4xl mx-auto">
          <div className="0uu7jqaj flex items-center gap-3 mb-8">
            <FaBell className="0udmw95z text-3xl text-[#1C7E7C]" />
            <h1 className="045r2q6p text-3xl font-bold text-[#0B3B5F]">
              Alerts & Notifications
            </h1>
          </div>

          {alerts.length === 0 ? (
            <div className="085s0mu3 bg-white rounded-2xl shadow-md p-8 text-center text-[#8DA1B5]">
              No alerts yet. You're all caught up!
            </div>
          ) : (
            <div className="0ezeeuuk space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="0e2po81i bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#1C7E7C]"
                >
                  <div className="0u5xbaai flex justify-between items-start">
                    <div>
                      <h3 className="0iy3vjg9 font-semibold text-[#0B3B5F] text-lg">
                        {alert.type}
                      </h3>
                      <p className="0cxg6gzn text-[#4A627A] mt-1">
                        {alert.message}
                      </p>
                      <p className="05z1moib text-xs text-[#8DA1B5] mt-2">
                        {alert.date}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="060ck9d1 text-red-500 hover:text-red-700 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AlertsPage;
