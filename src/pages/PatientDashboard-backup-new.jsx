import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PatientDashboard = () => {
  // ========================
  //  State
  // ========================
  // Symptom scores (0–10)
  const [sob, setSob] = useState(3);
  const [cough, setCough] = useState(2);
  const [chestTightness, setChestTightness] = useState(1);

  // Medication adherence
  const [controllerTaken, setControllerTaken] = useState(false);
  const [rescueUsed, setRescueUsed] = useState(false);

  // Environmental data (mock)
  const [environment, setEnvironment] = useState({
    temperature: 22,
    humidity: 58,
    aqi: 42,
    pollen: 35
  });

  // Risk score (0–100)
  const [riskScore, setRiskScore] = useState(25);
  const [alertMessage, setAlertMessage] = useState('');

  // Peak flow trend (last 7 days)
  const [peakFlow, setPeakFlow] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [390, 385, 370, 365, 380, 375, 380]
  });

  // Medication adherence history
  const [adherenceHistory, setAdherenceHistory] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    controller: [1, 1, 0, 1, 1, 0, 1],
    rescue: [0, 1, 1, 0, 0, 1, 0]
  });

  // ========================
  //  Effects
  // ========================
  useEffect(() => {
    // Calculate risk score (0–100)
    let risk = 0;
    // Symptom contribution (max 40)
    const symptomAvg = (sob + cough + chestTightness) / 3;
    risk += (symptomAvg / 10) * 40;
    // Environmental contribution (max 40)
    let envRisk = 0;
    if (environment.aqi > 100) envRisk += 20;
    else if (environment.aqi > 50) envRisk += 10;
    if (environment.pollen > 80) envRisk += 15;
    else if (environment.pollen > 50) envRisk += 8;
    if (environment.temperature < 5 || environment.temperature > 30) envRisk += 5;
    risk += envRisk;
    // Adherence penalty (max 20)
    if (!controllerTaken) risk += 15;
    if (!rescueUsed && risk > 50) risk += 5;
    risk = Math.min(100, Math.max(0, risk));
    setRiskScore(Math.round(risk));

    // Generate alert message
    if (risk >= 70) {
      setAlertMessage('⚠️ High risk of asthma attack! Follow your action plan and keep rescue inhaler nearby.');
    } else if (risk >= 40) {
      setAlertMessage('⚠️ Moderate risk. Ensure controller medication taken and avoid outdoor activities if pollen/AQI is high.');
    } else {
      setAlertMessage('✅ Low risk. Continue self‑management and enjoy your day!');
    }
    if (environment.aqi > 100) {
      setAlertMessage(prev => prev + ' 🏭 Poor air quality detected – stay indoors with windows closed.');
    } else if (environment.pollen > 70) {
      setAlertMessage(prev => prev + ' 🌾 High pollen levels – consider taking antihistamine before going out.');
    }
  }, [sob, cough, chestTightness, environment, controllerTaken, rescueUsed]);

  // Simulate environment updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setEnvironment({
        temperature: Math.floor(18 + Math.random() * 12),
        humidity: Math.floor(40 + Math.random() * 40),
        aqi: Math.floor(30 + Math.random() * 80),
        pollen: Math.floor(20 + Math.random() * 70)
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ========================
  //  Handlers
  // ========================
  const handleLogSymptoms = () => {
    // Simulate API call
    console.log('Symptoms logged:', { sob, cough, chestTightness });
    alert('Symptoms saved! Your healthcare provider can see this data.');
  };

  const handleSetReminder = (type) => {
    alert(`Reminder set for ${type} medication. You'll receive a notification at 8 PM.`);
  };

  // ========================
  //  Chart Configurations
  // ========================
  const peakFlowChartData = {
    labels: peakFlow.labels,
    datasets: [
      {
        label: 'Peak Expiratory Flow (L/min)',
        data: peakFlow.values,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const adherenceChartData = {
    labels: adherenceHistory.labels,
    datasets: [
      {
        label: 'Controller taken (1 = yes)',
        data: adherenceHistory.controller,
        backgroundColor: '#22c55e',
        borderRadius: 6,
        barPercentage: 0.6
      },
      {
        label: 'Rescue puffs used',
        data: adherenceHistory.rescue,
        backgroundColor: '#f97316',
        borderRadius: 6,
        barPercentage: 0.6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#e2e8f0' } },
      x: { grid: { display: false } }
    }
  };

  // ========================
  //  Render
  // ========================
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome back, <span className="text-blue-600">Emily</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              <i className="far fa-calendar-alt mr-1"></i>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' · Last peak flow: 380 L/min'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl px-4 py-2 shadow-sm flex items-center gap-2">
              <i className="fas fa-chart-line text-gray-400"></i>
              <span className="text-sm font-medium text-gray-600">Risk score</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                riskScore >= 70 ? 'bg-red-100 text-red-700' :
                riskScore >= 40 ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>
                {riskScore}%
              </span>
            </div>
            <button className="bg-white rounded-xl px-4 py-2 shadow-sm flex items-center gap-2 hover:bg-gray-50">
              <i className="fas fa-bell text-blue-500"></i>
              <span className="text-sm font-medium">Reminders</span>
            </button>
          </div>
        </div>

        {/* Alert Banner */}
        <div className={`mb-6 p-4 rounded-xl border-l-4 ${
          riskScore >= 70 ? 'bg-red-50 border-red-500 text-red-800' :
          riskScore >= 40 ? 'bg-amber-50 border-amber-500 text-amber-800' :
          'bg-green-50 border-green-500 text-green-800'
        }`}>
          <div className="flex items-start">
            <i className={`fas ${
              riskScore >= 70 ? 'fa-exclamation-triangle' :
              riskScore >= 40 ? 'fa-exclamation-circle' :
              'fa-check-circle'
            } mr-3 mt-0.5`}></i>
            <p className="text-sm font-medium">{alertMessage}</p>
          </div>
        </div>

        {/* Four‑Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Symptom Quick Log */}
          <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="fas fa-lungs text-blue-500"></i> Today's Symptoms
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 flex justify-between">
                  <span>Shortness of breath</span>
                  <span className="font-medium">{sob}/10</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={sob}
                  onChange={(e) => setSob(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 flex justify-between">
                  <span>Cough severity</span>
                  <span className="font-medium">{cough}/10</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={cough}
                  onChange={(e) => setCough(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 flex justify-between">
                  <span>Chest tightness</span>
                  <span className="font-medium">{chestTightness}/10</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={chestTightness}
                  onChange={(e) => setChestTightness(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <button
                onClick={handleLogSymptoms}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition"
              >
                Log Symptoms
              </button>
            </div>
          </div>

          {/* Medication Adherence */}
          <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="fas fa-pills text-green-600"></i> Medications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Controller (daily)</p>
                  <p className="text-xs text-gray-500">Fluticasone</p>
                </div>
                <button
                  onClick={() => setControllerTaken(!controllerTaken)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    controllerTaken ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {controllerTaken ? 'Taken ✓' : 'Not taken'}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Rescue (as needed)</p>
                  <p className="text-xs text-gray-500">Albuterol</p>
                </div>
                <button
                  onClick={() => setRescueUsed(!rescueUsed)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    rescueUsed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {rescueUsed ? 'Used ✓' : 'Log use'}
                </button>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => handleSetReminder('controller')}
                  className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                >
                  <i className="fas fa-bell"></i> Set reminder
                </button>
              </div>
            </div>
          </div>

          {/* Environment Monitor */}
          <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="fas fa-cloud-sun text-amber-500"></i> Environment
            </h2>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <div><span className="text-gray-500">🌡️ Temp:</span> {environment.temperature}°C</div>
              <div><span className="text-gray-500">💧 Humidity:</span> {environment.humidity}%</div>
              <div><span className="text-gray-500">🌫️ AQI:</span> {environment.aqi} {environment.aqi > 100 ? '⚠️' : ''}</div>
              <div><span className="text-gray-500">🌸 Pollen:</span> {environment.pollen} {environment.pollen > 70 ? '⚠️' : ''}</div>
            </div>
            <div className="mt-3 pt-2 border-t text-xs text-gray-500">
              <i className="fas fa-sync-alt mr-1"></i> Updates every 30 sec
            </div>
          </div>

          {/* Risk Prediction */}
          <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="fas fa-chart-line text-purple-600"></i> Attack Risk
            </h2>
            <div className="text-center">
              <div className={`text-4xl font-bold ${
                riskScore >= 70 ? 'text-red-600' : riskScore >= 40 ? 'text-amber-600' : 'text-green-600'
              }`}>
                {riskScore}%
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    riskScore >= 70 ? 'bg-red-500' : riskScore >= 40 ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${riskScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Based on symptoms, environment, and adherence
              </p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="fas fa-chart-line text-blue-500"></i> Peak Flow Trend
            </h2>
            <div className="h-64">
              <Line data={peakFlowChartData} options={chartOptions} />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Last 7 days</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="fas fa-chart-bar text-green-600"></i> Medication Adherence
            </h2>
            <div className="h-64">
              <Bar data={adherenceChartData} options={chartOptions} />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Last 7 days</p>
          </div>
        </div>

        {/* Educational Tip */}
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-start gap-3">
            <i className="fas fa-lightbulb text-blue-500 text-xl mt-0.5"></i>
            <div>
              <h3 className="font-semibold text-blue-800">Proactive tip for today</h3>
              <p className="text-sm text-blue-700">
                {riskScore >= 40
                  ? "Your risk is elevated. Make sure to take your controller medication tonight and keep your rescue inhaler within reach. Avoid strenuous outdoor activity if pollen or AQI is high."
                  : "Great job managing your asthma! Continue monitoring symptoms and take medications as prescribed. Staying hydrated can help reduce airway sensitivity."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;