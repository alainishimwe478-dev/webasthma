import React from "react";
import { useTranslation } from "react-i18next";
import { envReadings } from "../utils/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaWind,
  FaTint,
  FaLeaf,
  FaMapMarkerAlt,
  FaBrain,
} from "react-icons/fa";

// Simple RwandaMap component
const RwandaMap = () => (
  <div className="relative w-full h-64 bg-slate-800 rounded-2xl overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent"></div>
    <svg viewBox="0 0 800 600" className="w-full h-full opacity-80">
      <polygon
        points="200,100 300,80 400,120 500,100 600,140 580,200 500,240 400,280 300,260 200,220 150,180 180,140"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
      />
      <circle
        cx="350"
        cy="180"
        r="8"
        fill="#3b82f6"
        stroke="white"
        strokeWidth="2"
      />
      <text x="350" y="170" fill="white" fontSize="12" textAnchor="middle">
        Kigali
      </text>
      <circle
        cx="280"
        cy="220"
        r="5"
        fill="#3b82f6"
        stroke="white"
        strokeWidth="2"
      />
      <text x="280" y="210" fill="white" fontSize="10" textAnchor="middle">
        Muhanga
      </text>
      <circle
        cx="500"
        cy="200"
        r="5"
        fill="#3b82f6"
        stroke="white"
        strokeWidth="2"
      />
      <text x="500" y="190" fill="white" fontSize="10" textAnchor="middle">
        Rubavu
      </text>
    </svg>
  </div>
);

// Dynamic chart data from mock envReadings (last 7 days, avg PM25 as AQI proxy)
const getChartData = () => {
  const recent = envReadings.slice(-7).reverse();
  return recent.map((reading, idx) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx],
    aqi: Math.round(reading.pm25 + reading.pm10 / 2), // Proxy AQI
  }));
};

const IntelligenceSection = ({
  aqiData = {},
  prediction = {},
  loadingAQI = false,
  getQualityLabel = (v) => "Good",
}) => {
  const { t } = useTranslation();
  const safeAqi = aqiData || {};
  const chartData = getChartData();

  const metrics = [
    {
      label: "AQI",
      value: loadingAQI ? "..." : (safeAqi.aqi ?? 0),
      icon: <FaWind />,
      status: getQualityLabel(safeAqi.aqi ?? 0),
    },
    {
      label: "Humidity",
      value: loadingAQI ? "..." : `${safeAqi.humidity ?? 0}%`,
      icon: <FaTint />,
      status: t("intelligence.title") || "Live",
    },
    {
      label: "Pollen",
      value: loadingAQI ? "..." : (safeAqi.pollen ?? 0),
      icon: <FaLeaf />,
      status: "Live",
    },
  ];

  return (
    <section id="intelligence" className="py-12 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <h2 className="text-4xl font-bold text-center">
          {t("intelligence.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {metrics.map((card) => (
            <div
              key={card.label}
              className="bg-slate-800 p-6 rounded-3xl text-center"
            >
              <div className="text-3xl mb-3 text-cyan-400 mx-auto">
                {card.icon}
              </div>
              <h3 className="text-4xl font-bold">{card.value}</h3>
              <p className="text-base">{card.label}</p>
              <p className="text-sm mt-1 text-slate-400">{card.status}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-3xl p-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <FaMapMarkerAlt className="text-cyan-400" /> {t("map.title")}
            </h3>
            <RwandaMap />
            <p className="text-sm text-slate-400 mt-3">{t("map.caption")}</p>
          </div>

          <div className="bg-slate-800 rounded-3xl p-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <FaBrain className="text-cyan-400" /> {t("intelligence.risk") || 'Risk Prediction'}
            </h3>
            {prediction.level ? (
              <>
                <div className="mb-3">
                  <p className="text-slate-300">{t("intelligence.title") || 'Risk Level'}</p>
                  <p
                    className={`text-2xl font-bold ${
                      prediction.level === "high"
                        ? "text-red-400"
                        : prediction.level === "medium"
                          ? "text-yellow-400"
                          : "text-green-400"
                    }`}
                  >
                    {prediction.level.toUpperCase()}
                  </p>
                </div>
                <div className="mb-3">
                  <p className="text-slate-300">{t("intelligence.model") || 'Confidence'}</p>
                  <div className="w-full bg-slate-700 rounded-full h-2.5 mt-1">
                    <div
                      className="bg-cyan-500 h-2.5 rounded-full"
                      style={{ width: `${prediction.confidence ?? 75}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1">{(prediction.confidence ?? 75)}%</p>
                </div>
                <p className="text-slate-300">{prediction.recommendation || 'Monitor environmental conditions.'}</p>
              </>
            ) : (
              <div className="text-slate-400 text-center py-8">
                {loadingAQI ? 'Loading AI prediction...' : 'Ready'}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-slate-800 rounded-3xl p-6">
          <h3 className="text-xl font-semibold mb-3">{t("trend.title")}</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                  }}
                  labelStyle={{ color: "#f3f4f6" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="aqi"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntelligenceSection;
