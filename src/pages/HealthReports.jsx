import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaDownload, FaChartLine, FaCalendarAlt, FaHeartbeat } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const HealthReports = () => {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);
  const [reportPeriod, setReportPeriod] = useState('week');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user) return;
    const storedSymptoms = localStorage.getItem(`symptoms_${user.id}`);
    if (storedSymptoms) setSymptoms(JSON.parse(storedSymptoms));
    const storedMeds = localStorage.getItem(`medications_${user.id}`);
    if (storedMeds) setMedications(JSON.parse(storedMeds));
  }, [user]);

  const getFilteredSymptoms = () => {
    if (!user) return [];
    const now = new Date();
    const days = reportPeriod === 'week' ? 7 : 30;
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - days);
    return symptoms.filter((s) => new Date(s.date) >= cutoff);
  };

  const filteredSymptoms = getFilteredSymptoms();
  const chartData = [...filteredSymptoms]
    .map((s) => ({ date: s.date, severity: s.severity }))
    .reverse();

  const totalEntries = filteredSymptoms.length;
  const averageSeverity =
    totalEntries === 0
      ? 0
      : filteredSymptoms.reduce((sum, entry) => sum + entry.severity, 0) / totalEntries;

  const symptomCounts = { cough: 0, wheezing: 0, chestTightness: 0, shortnessBreath: 0 };
  filteredSymptoms.forEach((s) => {
    if (s.cough) symptomCounts.cough += 1;
    if (s.wheezing) symptomCounts.wheezing += 1;
    if (s.chestTightness) symptomCounts.chestTightness += 1;
    if (s.shortnessBreath) symptomCounts.shortnessBreath += 1;
  });

  const [mostCommonKey] = Object.entries(symptomCounts).reduce(
    (max, current) => (current[1] > max[1] ? current : max),
    ['', 0]
  );

  const symptomLabelMap = {
    cough: 'Cough',
    wheezing: 'Wheezing',
    chestTightness: 'Chest Tightness',
    shortnessBreath: 'Shortness of Breath',
  };

  const mostCommonSymptom =
    mostCommonKey && symptomCounts[mostCommonKey] > 0
      ? symptomLabelMap[mostCommonKey]
      : 'N/A';

  const handleGenerateReport = () => {
    if (!user) return;
    setGenerating(true);
    setTimeout(() => {
      const report = {
        user: user.name,
        period: reportPeriod,
        symptoms: filteredSymptoms,
        medications,
        generatedAt: new Date().toISOString(),
      };
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(report, null, 2)
      )}`;
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', `health_report_${user.name}_${reportPeriod}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      setGenerating(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Health Reports</h1>
        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          <FaDownload className="mr-2" />
          {generating ? 'Generating...' : 'Download Report'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Symptom Trend</h2>
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="border rounded p-1"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
          </select>
        </div>
        {filteredSymptoms.length === 0 ? (
          <p className="text-gray-500 text-center">No symptom data for the selected period.</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="severity" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaHeartbeat className="mr-2 text-red-500" /> Symptom Summary
          </h2>
          {filteredSymptoms.length === 0 ? (
            <p className="text-gray-500">No entries.</p>
          ) : (
            <div className="space-y-2">
              <p>
                <strong>Total entries:</strong> {filteredSymptoms.length}
              </p>
              <p>
                <strong>Average severity:</strong> {averageSeverity.toFixed(1)}/5
              </p>
              <p>
                <strong>Most common symptom:</strong> {mostCommonSymptom}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" /> Medication Adherence
          </h2>
          <p className="text-gray-500">
            Coming soon: Track medication adherence and generate compliance reports.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthReports;
