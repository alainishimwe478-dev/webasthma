import React from "react";
import { FaCloudSun, FaExclamationTriangle, FaMapMarkedAlt } from "react-icons/fa";
import AdminShell from "../components/Layout/AdminShell";
import { districtAlerts, envReadings } from "../utils/mockData";

const Environment = () => {
  const latestReadings = envReadings.slice(0, 3);

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Environment Monitoring</h1>
          <p className="mt-2 text-gray-600">
            Track environmental readings and district-level asthma trigger alerts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestReadings.map((reading) => (
            <div key={reading.timestamp} className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaCloudSun className="text-blue-600 text-xl" />
                <h2 className="font-semibold text-gray-900">{reading.district}</h2>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>AQI PM2.5: <span className="font-semibold text-gray-900">{reading.pm25}</span></p>
                <p>Humidity: <span className="font-semibold text-gray-900">{reading.humidity}%</span></p>
                <p>Temperature: <span className="font-semibold text-gray-900">{reading.temperature} C</span></p>
                <p>Pollen: <span className="font-semibold text-gray-900">{reading.pollenLevel}</span></p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex items-center gap-3">
            <FaMapMarkedAlt className="text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">District Alert Feed</h2>
          </div>
          <div className="divide-y">
            {Object.entries(districtAlerts).map(([district, alert]) => (
              <div key={district} className="p-6 flex gap-4">
                <div className="mt-1">
                  <FaExclamationTriangle className="text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{district}</h3>
                  <p className="text-sm text-gray-600 mt-1">{alert}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
};

export default Environment;
