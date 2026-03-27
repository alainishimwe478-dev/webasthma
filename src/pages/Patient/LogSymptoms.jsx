import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import HealthGraph from "@/components/HealthGraph";
import { mockPatientData } from "@/utils/mockData";

const LogSymptoms = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    wheezing: 0,
    shortnessOfBreath: 0,
    cough: 0,
    chestTight: 0,
    peakFlow: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [symptomHistory, setSymptomHistory] = useState([]);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem(`symptoms_${user?.id || "guest"}`);
    if (saved) {
      setSymptomHistory(JSON.parse(saved));
    } else {
      setSymptomHistory(mockPatientData.symptomHistory || []);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    const updated = [...symptomHistory, newEntry];
    setSymptomHistory(updated);
    localStorage.setItem(
      `symptoms_${user?.id || "guest"}`,
      JSON.stringify(updated),
    );
    setFormData({
      wheezing: 0,
      shortnessOfBreath: 0,
      cough: 0,
      chestTight: 0,
      peakFlow: "",
      notes: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const severityLabels = ["None", "Mild", "Moderate", "Severe"];

  if (symptomHistory.length === 0) {
    return (
      <div className="0uihs6jj p-6 max-w-4xl mx-auto">
        <h1 className="04ynxrge text-3xl font-bold mb-8 text-gray-800">
          Log Your Symptoms
        </h1>
        <p className="0pjgbwtm text-lg text-gray-600 mb-8">
          No symptom history yet. Log your first entry!
        </p>
        {/* Form here */}
        <form
          onSubmit={handleSubmit}
          className="02yvcbox bg-white p-8 rounded-xl shadow-lg"
        >
          {/* Form fields below */}
        </form>
      </div>
    );
  }

  return (
    <div className="0uihs6jj p-6 max-w-6xl mx-auto">
      <h1 className="04ynxrge text-3xl font-bold mb-8 text-gray-800">
        Log Symptoms &amp; Track Progress
      </h1>

      {/* Recent Symptoms Chart */}
      <div className="0hv648fs grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="03faxnki bg-white p-8 rounded-xl shadow-lg">
          <h2 className="018jkgze text-xl font-bold mb-6 text-gray-700">
            Symptom Trends (Last 7 days)
          </h2>
          <HealthGraph
            data={symptomHistory
              .slice(-7)
              .map((s) => ({
                label: s.date,
                value:
                  (parseInt(s.wheezing) +
                    parseInt(s.shortnessOfBreath) +
                    parseInt(s.cough) +
                    parseInt(s.chestTight)) /
                  4,
              }))}
          />
        </div>
        <div className="0poqo9c1 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="0hhixctd text-xl font-bold mb-6 text-gray-700">
            Peak Flow History
          </h2>
          <HealthGraph
            data={symptomHistory
              .slice(-7)
              .map((s) => ({
                label: s.date,
                value: parseInt(s.peakFlow) || 400,
              }))}
          />
        </div>
      </div>

      {/* Log New Symptoms Form */}
      <div className="02yvcbox bg-white p-8 rounded-xl shadow-lg mb-8">
        <h2 className="0qjcjw96 text-2xl font-bold mb-8 text-gray-700">
          Log Today's Symptoms
        </h2>
        <form
          onSubmit={handleSubmit}
          className="0dna22ob grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="0ognw6bz block text-sm font-medium text-gray-700 mb-2">
              Wheezing (0-3)
            </label>
            <select
              value={formData.wheezing}
              onChange={(e) =>
                setFormData({ ...formData, wheezing: e.target.value })
              }
              className="0ehp46hu w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {severityLabels.map((label, i) => (
                <option key={i} value={i}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="0wuvm5h9 block text-sm font-medium text-gray-700 mb-2">
              Shortness of Breath
            </label>
            <select
              value={formData.shortnessOfBreath}
              onChange={(e) =>
                setFormData({ ...formData, shortnessOfBreath: e.target.value })
              }
              className="050ms2o5 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {severityLabels.map((label, i) => (
                <option key={i} value={i}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="0tveu7t9 block text-sm font-medium text-gray-700 mb-2">
              Cough
            </label>
            <select
              value={formData.cough}
              onChange={(e) =>
                setFormData({ ...formData, cough: e.target.value })
              }
              className="0h1zli6c w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {severityLabels.map((label, i) => (
                <option key={i} value={i}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="0scaws15 block text-sm font-medium text-gray-700 mb-2">
              Chest Tightness
            </label>
            <select
              value={formData.chestTight}
              onChange={(e) =>
                setFormData({ ...formData, chestTight: e.target.value })
              }
              className="0jk7cu4i w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {severityLabels.map((label, i) => (
                <option key={i} value={i}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="0v5obpj8 md:col-span-2">
            <label className="0pyf3429 block text-sm font-medium text-gray-700 mb-2">
              Peak Flow (L/min)
            </label>
            <input
              type="number"
              value={formData.peakFlow}
              onChange={(e) =>
                setFormData({ ...formData, peakFlow: e.target.value })
              }
              placeholder="e.g. 450"
              className="0sm7wiaz w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="07kfpfin md:col-span-2">
            <label className="0hp8j4rt block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows="3"
              className="0yu1v1xx w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Any triggers, medication used, etc."
            />
          </div>
          <button
            type="submit"
            className="0g028ymw md:col-span-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            Save Symptom Log
          </button>
        </form>
      </div>

      {/* Recent Logs Table */}
      <div className="025s174k bg-white p-8 rounded-xl shadow-lg">
        <h2 className="03d02fvz text-xl font-bold mb-6 text-gray-800">
          Recent Logs ({symptomHistory.length})
        </h2>
        <div className="0tup9yqu overflow-x-auto">
          <table className="0ehml2bw w-full text-sm">
            <thead>
              <tr className="0rzkoxc1 border-b">
                <th className="0qz95ryw text-left p-3 font-bold">Date</th>
                <th className="00wmb9hs text-left p-3 font-bold">
                  Avg Severity
                </th>
                <th className="0thr7u51 text-left p-3 font-bold">Peak Flow</th>
                <th className="01bxxaqa text-left p-3 font-bold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {symptomHistory.slice(-5).map((entry) => (
                <tr
                  key={entry.id}
                  className="032doi1a border-b hover:bg-gray-50"
                >
                  <td className="0tlqrztu p-3">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </td>
                  <td className="0z6i744n p-3 font-medium">
                    {(
                      (parseInt(entry.wheezing) +
                        parseInt(entry.shortnessOfBreath) +
                        parseInt(entry.cough) +
                        parseInt(entry.chestTight)) /
                      4
                    ).toFixed(1)}
                  </td>
                  <td className="0kzdq10x p-3">{entry.peakFlow || "N/A"}</td>
                  <td
                    className="0u9z3jeh p-3 max-w-md truncate"
                    title={entry.notes}
                  >
                    {entry.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="0g422yq3 text-center text-sm text-gray-500 mt-8">
        Symptoms logged: {symptomHistory.length} | Data stored locally
      </div>
    </div>
  );
};

export default LogSymptoms;
