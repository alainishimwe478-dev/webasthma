import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaWalking, FaChartLine, FaPlus, FaTrash } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { activityLogs } from "../utils/mockData";

const ActivityTracker = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split("T")[0],
    steps: "",
    level: "moderate",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Filter mock data for user + generate recent
    const userLogs = activityLogs.filter((log) => log.patientId === user.id);
    setLogs(userLogs);
  }, [user]);

  const levels = [
    {
      value: "low",
      label: "Low (<5000 steps)",
      color: "bg-red-100 text-red-800",
    },
    {
      value: "moderate",
      label: "Moderate (5000-10000)",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "high",
      label: "High (>10000)",
      color: "bg-green-100 text-green-800",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const log = {
        ...newLog,
        id: Date.now(),
        patientId: user.id,
        steps: parseInt(newLog.steps),
        level:
          newLog.steps < 5000
            ? "low"
            : newLog.steps < 10000
              ? "moderate"
              : "high",
      };
      setLogs([log, ...logs]);
      setNewLog({ date: "", steps: "", level: "moderate", notes: "" });
      setLoading(false);
    }, 500);
  };

  const handleDelete = (id) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const chartData = logs
    .slice(0, 7)
    .map((log) => ({ date: log.date, steps: log.steps }))
    .reverse();

  return (
    <div className="0asrsr1n max-w-4xl mx-auto p-6">
      <h1 className="0exxxtnu text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <FaWalking className="0zhuzym1 text-blue-600" />
        Activity Tracker
      </h1>
      <p className="0s8wd1p3 text-gray-600 mb-8">
        Track steps/activity to correlate with asthma triggers. Low activity may
        increase risk.
      </p>

      <div className="0appp6tn grid md:grid-cols-2 gap-8 mb-8">
        <div className="0yarmkk1 bg-white rounded-xl shadow-lg p-6">
          <h2 className="03vvn3co text-xl font-semibold mb-6">
            Log Today's Activity
          </h2>
          <form onSubmit={handleSubmit} className="09gsm4kg space-y-4">
            <div>
              <label className="0ppqjtw9 block text-sm font-medium mb-2">
                Date
              </label>
              <input
                type="date"
                value={newLog.date}
                onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                max={new Date().toISOString().split("T")[0]}
                className="0tu0xigr w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="0a35b75y block text-sm font-medium mb-2">
                Steps Today
              </label>
              <input
                type="number"
                placeholder="e.g., 7500"
                value={newLog.steps}
                onChange={(e) =>
                  setNewLog({ ...newLog, steps: e.target.value })
                }
                className="00rokdhs w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="09musgfg block text-sm font-medium mb-2">
                Notes
              </label>
              <textarea
                rows="2"
                placeholder="e.g., Walked to market, felt short of breath"
                value={newLog.notes}
                onChange={(e) =>
                  setNewLog({ ...newLog, notes: e.target.value })
                }
                className="0d77f6w0 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="064p3rdx w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
            >
              <FaPlus /> {loading ? "Saving..." : "Log Activity"}
            </button>
          </form>
        </div>

        <div className="0ehdkjoj bg-white rounded-xl shadow-lg p-6">
          <div className="0xz6cbod flex justify-between items-center mb-4">
            <h2 className="0dgx0gfr text-xl font-semibold">Recent Activity</h2>
            <div className="0cd4naqi flex gap-2">
              <span className="0t7ldpni px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {logs.length} logs
              </span>
            </div>
          </div>
          {logs.length === 0 ? (
            <p className="0pvmg4bo text-gray-500 text-center py-8">
              No activity logs. Add one above.
            </p>
          ) : (
            <div className="0e3goh43 space-y-3 max-h-80 overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="07xkv7ul flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="0wi7zms8 flex items-center gap-4">
                    <div
                      className={`0zfflau7 px-3 py-1 rounded-full text-sm font-medium ${levels.find((l) => l.value === log.level)?.color}`}
                    >
                      {log.level.toUpperCase()}
                    </div>
                    <div>
                      <p className="0a1ed3ao font-semibold">
                        {log.steps.toLocaleString()} steps
                      </p>
                      <p className="0ziy3k8i text-sm text-gray-500">
                        {log.date}
                      </p>
                    </div>
                  </div>
                  <div className="05a86a9c flex gap-1">
                    {log.notes && (
                      <span className="0001a6b4 text-xs bg-blue-100 px-2 py-1 rounded">
                        {log.notes.slice(0, 20)}...
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="0vfd32qg text-red-500 hover:text-red-700 p-1"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="09pa6jub bg-white rounded-xl shadow-lg p-6">
          <h2 className="081p5w8l text-xl font-semibold mb-4">
            Activity Trend (Steps)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="steps"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ActivityTracker;
