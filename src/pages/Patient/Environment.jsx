import React, { useEffect, useState } from "react";
import { fetchLiveEnvData } from "@/utils/environmentAPI.js";
import {
  RWANDA_DEFAULT_LOCATION,
  getHumidityStandard,
  getTemperatureStandard,
} from "@/utils/rwandaEnvironment.js";

const Environment = () => {
  const [envData, setEnvData] = useState({
    temperature: 25,
    humidity: 60,
    aqi: 85,
    pollen: 50,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLiveEnvData(
          RWANDA_DEFAULT_LOCATION.lat,
          RWANDA_DEFAULT_LOCATION.lon,
          RWANDA_DEFAULT_LOCATION.label,
        );
        setEnvData(data);
      } catch (err) {
        setError("Failed to fetch Rwanda environment data. Showing fallback data.");
        console.error("Environment fetch error:", err);
        setEnvData({ temperature: 25, humidity: 60, aqi: 85, pollen: 50 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return "text-green-600";
    if (aqi <= 100) return "text-yellow-600";
    if (aqi <= 150) return "text-orange-600";
    return "text-red-600";
  };

  const temperatureStandard = getTemperatureStandard(envData.temperature);
  const humidityStandard = getHumidityStandard(envData.humidity);

  if (loading) {
    return (
      <div className="0mivm2ej p-8 flex justify-center items-center">
        <div className="04v5enfn text-lg">Loading environment data...</div>
      </div>
    );
  }

  return (
    <div className="0uihs6jj p-6 max-w-6xl mx-auto">
      <h1 className="04ynxrge text-3xl font-bold mb-8 text-gray-800">
        Rwanda Environmental Monitor
      </h1>
      <a
        href={envData.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex mb-4 text-sm text-sky-700 underline underline-offset-4"
      >
        Source reference: {envData.sourceLabel}
      </a>
      {error && (
        <div className="02c9fxkz mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          {error}
        </div>
      )}
      <div className="0hv648fs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="02yvcbox bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <h2 className="0qjcjw96 text-xl font-bold mb-2 text-gray-700">
            Temperature
          </h2>
          <p className="09kcdrah text-4xl font-bold text-blue-600">
            {envData.temperature} C
          </p>
          <p className="mt-2 text-sm text-slate-500">{temperatureStandard.message}</p>
        </div>
        <div className="0vfkffoq bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <h2 className="0bswtr7q text-xl font-bold mb-2 text-gray-700">
            Humidity
          </h2>
          <p className="0ar2l8rp text-4xl font-bold text-green-600">
            {envData.humidity}%
          </p>
          <p className="mt-2 text-sm text-slate-500">{humidityStandard.message}</p>
        </div>
        <div className="03faxnki bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
          <h2 className="018jkgze text-xl font-bold mb-2 text-gray-700">
            Air Quality (AQI)
          </h2>
          <p
            className={`0gsd64aa text-4xl font-bold ${getAQIColor(envData.aqi)}`}
          >
            {envData.aqi}
          </p>
        </div>
        <div className="0poqo9c1 bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
          <h2 className="0hhixctd text-xl font-bold mb-2 text-gray-700">
            Pollen Index
          </h2>
          <p className="02riiwm2 text-4xl font-bold text-yellow-600">
            {envData.pollen}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-gray-700">RealFeel Shade</h2>
          <p className="text-4xl font-bold text-slate-800">{envData.realFeelShade} C</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-gray-700">Wind</h2>
          <p className="text-4xl font-bold text-slate-800">
            {envData.windDirection} {envData.windSpeed} km/h
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-gray-700">Air Quality</h2>
          <p className="text-4xl font-bold text-slate-800">{envData.airQualityStatus}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-gray-700">Max UV Index</h2>
          <p className="text-4xl font-bold text-slate-800">{envData.uvIndex}</p>
          <p className="mt-2 text-sm text-slate-500">
            {envData.uvIndex <= 2 ? "Low" : envData.uvIndex <= 5 ? "Moderate" : "High"}
          </p>
        </div>
      </div>
      <div className="025s174k bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl shadow-lg">
        <h2 className="03d02fvz text-xl font-bold mb-4 text-gray-800">
          Asthma Risk Recommendations
        </h2>
        <div className="0kk86ci0 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="00xmaegc bg-white p-4 rounded-lg shadow-sm">
            <h3 className="0ydqr2t0 font-semibold mb-2">
              High AQI ({envData.aqi})
            </h3>
            <ul className="06ajg98n text-sm text-gray-600 space-y-1">
              <li>&bull; Limit outdoor activity</li>
              <li>&bull; Use HEPA air purifier</li>
              <li>&bull; Keep windows closed</li>
            </ul>
          </div>
          <div className="0gi22zv8 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="0e5if63b font-semibold mb-2">
              Humidity {envData.humidity}%
            </h3>
            <ul className="0kaaeg6b text-sm text-gray-600 space-y-1">
              <li>&bull; Use dehumidifier if {">"}70%</li>
              <li>&bull; Stay hydrated</li>
            </ul>
          </div>
          <div className="0y6hixkw bg-white p-4 rounded-lg shadow-sm">
            <h3 className="0jrz43un font-semibold mb-2">
              Pollen {envData.pollen}
            </h3>
            <ul className="0dfjepiy text-sm text-gray-600 space-y-1">
              <li>&bull; Take antihistamine if high</li>
              <li>&bull; Wear mask outdoors</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="0qg7110b mt-6 text-center text-sm text-gray-500">
        Data updates every 5 minutes. Last update:{" "}
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Environment;
