import { districtRisk, districtAlerts, currentEnvKigali, users, healthLogs } from './mockData.js';

export const calculateRisk = (userId, env) => {
  let score = 0;

  if (env.aqi > 100) score += 30;
  if (env.humidity > 70 || env.humidity < 30) score += 20;
  if (env.temperature < 18 || env.temperature > 30) score += 20;
  if (env.pm25 > 35) score += 20;
  if (env.pollenLevel > 50) score += 10;

  let riskLevel = "Low";

  if (score > 70) riskLevel = "High";
  else if (score > 40) riskLevel = "Medium";

  return {
    userId,
    score,
    riskLevel,
  };
};



// Env-only prediction
export const getEnvPrediction = (envData) => calculateRisk(3, envData); // Default user 3

// Get 7-day history for graphs
export const getRiskHistory = (userId) => {
  // Mock 7-day with variation
  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push({
      date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
      risk: Math.random() > 0.5 ? 'Medium' : 'Low',
      peakFlow: 400 + Math.random() * 100,
      symptomSeverity: 2 + Math.random() * 4
    });
  }
  return days;
};

// AI Risk prediction for AIRisk.jsx compatibility
export const predictRisk = async (symptoms, location) => {
  // Default to mock patient (userId 3); symptoms param noted but not directly used (uses healthLogs)
  const userId = 3;
  // Build envData from location (mock using current Kigali base)
  const envData = {
    ...currentEnvKigali,
    location: location || 'Kigali'
  };
  const risk = calculateRisk(userId, envData);
  
  return {
    currentRisk: risk.score,
    trend: 'stable',
    predictions: getRiskHistory(userId).map(h => ({ day: h.date.split(' ')[0], risk: h.symptomSeverity * 10 })), // Mock predictions from history
    recommendations: [risk.recommendationText]
  };
};

// NEW: Generate recommendations array for RecommendationFeed
export const generateRecommendations = (risk, env) => {
  const recs = [];

  // Base on risk level
  if (risk.riskLevel === 'High') {
    recs.push({
      recommendationText: '🚨 High risk today. Stay indoors, use preventive inhaler, avoid triggers.',
      riskLevel: 'High',
      triggeringFactors: ['Poor air quality', 'Extreme weather']
    });
  } else if (risk.riskLevel === 'Medium') {
    recs.push({
      recommendationText: '⚠️ Medium risk. Limit outdoor activities, monitor symptoms closely.',
      riskLevel: 'Medium',
      triggeringFactors: ['Moderate pollution']
    });
  } else {
    recs.push({
      recommendationText: '✅ Low risk. Good conditions, but continue your regular management plan.',
      riskLevel: 'Low',
      triggeringFactors: []
    });
  }

  // Env-specific
  if (env.aqi > 100) {
    recs.push({
      recommendationText: 'Air quality poor (AQI ' + env.aqi + '). Wear mask if outside, keep windows closed.',
      riskLevel: 'Medium',
      triggeringFactors: ['High PM2.5']
    });
  }
  if (env.humidity > 70) {
    recs.push({
      recommendationText: 'High humidity (' + env.humidity + '%). Use dehumidifier, avoid damp areas.',
      riskLevel: 'Medium',
      triggeringFactors: ['Mold risk']
    });
  }
  if (env.temperature < 18 || env.temperature > 30) {
    recs.push({
      recommendationText: 'Extreme temp (' + env.temperature + '°C). Dress appropriately, stay hydrated.',
      riskLevel: 'Medium',
      triggeringFactors: ['Cold/dry air']
    });
  }

  return recs.slice(0, 4); // Limit to 4
};

