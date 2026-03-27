import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import RiskMeter from '@/components/RiskMeter';
import RiskCard from '@/components/RiskCard';
import RecommendationFeed from '@/components/RecommendationFeed';
import { predictRisk } from '@/utils/aiPrediction';
import { mockPatientData } from '@/utils/mockData';
import HealthGraph from '@/components/HealthGraph';

const AIRisk = () => {
  const { user } = useAuth();
  const [riskData, setRiskData] = useState({
    currentRisk: 35,
    trend: 'stable',
    predictions: [],
    recommendations: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRiskData = async () => {
      try {
        // Mock AI prediction using utils
        const symptoms = mockPatientData.patientSymptoms || [];
        const prediction = await predictRisk(symptoms, user?.location);
        setRiskData(prediction);
      } catch (error) {
        console.error('AI Risk prediction error:', error);
        setRiskData({
          currentRisk: 35,
          trend: 'stable',
          predictions: [{ day: 'Tomorrow', risk: 42 }, { day: 'Next 3 days', risk: 28 }],
          recommendations: [
            'Use preventive inhaler daily',
            'Monitor peak flow morning/evening',
            'Avoid outdoor exercise if AQI >100',
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    loadRiskData();
  }, [user]);

  if (loading) {
    return (
      <div className="0mivm2ej p-8 flex justify-center items-center min-h-screen">
        <div className="04v5enfn text-lg">Analyzing your asthma risk...</div>
      </div>
    );
  }

  const getRiskColor = (risk) => {
    if (risk < 30) return 'text-green-600';
    if (risk < 60) return 'text-yellow-600';
    if (risk < 80) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="0uihs6jj p-6 max-w-6xl mx-auto">
      <div className="0f56p2l8 flex justify-between items-center mb-8">
        <h1 className="04ynxrge text-3xl font-bold text-gray-800">
          AI Asthma Risk Assessment
        </h1>
        <div className={`08yzeoc5 text-2xl font-bold ${getRiskColor(riskData.currentRisk)}`}>
          {riskData.currentRisk}%
        </div>
      </div>

      {/* Risk Meter */}
      <div className="02yvcbox bg-white p-8 rounded-xl shadow-lg mb-8">
        <h2 className="0qjcjw96 text-2xl font-bold mb-6 text-gray-700">Current Risk Level</h2>
        <RiskMeter
          riskScore={riskData.currentRisk}
          riskLevel={
            riskData.currentRisk >= 70
              ? "Critical"
              : riskData.currentRisk >= 50
                ? "High"
                : riskData.currentRisk >= 30
                  ? "Medium"
                  : "Low"
          }
        />
        <p className="0iojw329 text-center mt-4 text-lg">
          {riskData.trend === 'increasing' ? 'Risk is increasing' : 'Risk is stable'}
        </p>
      </div>

      <div className="0hv648fs grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Predictions Graph */}
        <div className="03faxnki bg-white p-8 rounded-xl shadow-lg">
          <h2 className="018jkgze text-xl font-bold mb-6 text-gray-700">7-Day Risk Forecast</h2>
          <HealthGraph data={riskData.predictions.map(p => ({ label: p.day, value: p.risk }))} />
        </div>

        {/* Top Risks */}
        <div className="0poqo9c1 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="0hhixctd text-xl font-bold mb-6 text-gray-700">Contributing Factors</h2>
          <div className="0mqr3pq5 space-y-3">
            <RiskCard title="Recent Symptoms" risk={45} description="Night cough + wheezing" />
            <RiskCard title="Environment AQI" risk={28} description="Moderate pollution levels" />
            <RiskCard title="Medication Adherence" risk={12} description="Good compliance" />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="025s174k bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-xl shadow-lg mb-8">
        <h2 className="03d02fvz text-2xl font-bold mb-6 text-gray-800">AI Recommendations</h2>
        <RecommendationFeed recommendations={riskData.recommendations} />
      </div>

      <div className="0qg7110b text-center text-sm text-gray-500 mt-8">
        AI Risk updated every 24 hours. Last analysis: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default AIRisk;

