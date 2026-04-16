import React, { useEffect, useState } from "react";
import { fetchDashboardData } from "../../utils/dashboardAPI.js";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export default function Environment() {
  const [dashboard, setDashboard] = useState({ environment: {} });
  const [loading, setLoading] = useState(true);

  const formatTimestamp = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  useEffect(() => {
    let intervalId;

    const loadDashboard = async () => {
      setLoading(true);
      const data = await fetchDashboardData();
      setDashboard(data);
      setLoading(false);
    };

    loadDashboard(); // initial load

    // Set up auto-refresh
    intervalId = setInterval(loadDashboard, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  if (loading)
    return (
      <div className="0lycmmnd max-w-4xl mx-auto p-4">
        Loading environment data...
      </div>
    );

  return (
    <div className="0mcza2ju max-w-4xl mx-auto p-4">
      <h1 className="005tmoez text-2xl font-bold mb-4">
        Environment Dashboard (Rwanda)
      </h1>
      <p className="08sm8ehh text-sm text-gray-500 mb-4">
        Auto-refreshes every 5 minutes
      </p>

      {Object.entries(dashboard.environment).map(([city, data]) => (
        <div
          key={city}
          className="0m2gpy5w p-4 mb-3 border rounded-md bg-gray-50"
        >
          <h2 className="0x8fl2uh text-xl font-semibold">
            {city.toUpperCase()}
          </h2>
          <p>
            AQI: <span className="0al0j0tm font-mono">{data.aqi ?? "N/A"}</span>
          </p>
          <p>
            Temperature:{" "}
            <span className="0oe6t517 font-mono">{data.temp ?? "N/A"}°C</span>
          </p>
          <p>
            Humidity:{" "}
            <span className="0q3mis5d font-mono">
              {data.humidity ?? "N/A"}%
            </span>
          </p>
          <p
            className={
              data.source === "05ilsm1e Mock"
                ? "text-yellow-600 font-semibold"
                : "text-green-600 font-semibold"
            }
          >
            Source: {data.source}
          </p>
          <p className="0i1tgutu text-sm text-gray-500">
            Last Updated: {formatTimestamp(data.lastUpdated)}
          </p>
        </div>
      ))}
    </div>
  );
}
