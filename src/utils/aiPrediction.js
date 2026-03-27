import { districtRisk, districtAlerts, currentEnvKigali, users, healthLogs } from './mockData';

// Enhanced calculateRisk - SPEC COMPLIANT: triggers + env + recent symptomSeverity >7 + meds
export const calculateRisk = (userId, envData = currentEnvKigali) => {
  const directUser = users.find(u => u.id === userId || u.id === Number(userId));
  const user = directUser?.role === 'patient' ? directUser : users.find(u => u.role === 'patient');
  if (!user) return { level: 'unknown', score: 0, recommendation: 'User not found' };
  const triggerProfile = Array.isArray(user.triggerProfile) ? user.triggerProfile : [];
  const medicationRegimen = Array.isArray(user.medicationRegimen) ? user.medicationRegimen : [];

  const recentLogs = healthLogs.filter(l => l.userId === userId).slice(-7); // Last 7 days
  const avgSymptomSeverity = recentLogs.reduce((sum, log) => sum + log.symptomSeverity, 0) / (recentLogs.length || 1);
  
  let score = 0;
  let factors = [];
  let triggeringFactors = [];

  // Base district
  const districtInfo = districtRisk[user.district] || { score: 5 };
  score += districtInfo.score;
  factors.push(`District: ${user.district}`);

  // Trigger Profile matching env (spec: pollenLevel >70 && trigger pollen → risk++)
  if (triggerProfile.includes('pollen') && envData.pollenLevel > 70) {
    score += 15;
    triggeringFactors.push('pollen');
    factors.push('Pollen trigger match');
  }
  if (triggerProfile.includes('dust') && envData.pm25 > 35) {
    score += 12;
    triggeringFactors.push('dust');
    factors.push('Dust trigger match (PM2.5)');
  }
  if (triggerProfile.includes('cold air') && envData.temperature < 15) {
    score += 10;
    triggeringFactors.push('cold air');
    factors.push('Cold air trigger');
  }

  // Recent symptoms (spec: >7 high risk)
  if (avgSymptomSeverity > 7) {
    score += 20;
    factors.push(`High recent symptoms (${avgSymptomSeverity.toFixed(1)})`);
  } else if (avgSymptomSeverity > 4) {
    score += 10;
    factors.push(`Elevated symptoms (${avgSymptomSeverity.toFixed(1)})`);
  }

  // Medication adherence (mock 90% if recent medTaken true)
  const adherenceRate = recentLogs.filter(l => l.medicationTaken).length / recentLogs.length || 1;
  if (adherenceRate < 0.8) {
    score += 8;
    factors.push(`Low med adherence (${Math.round(adherenceRate*100)}%)`);
  }

  // Env factors
  if (envData.pm25 > 50) score += 5, factors.push(`High PM2.5 ${envData.pm25}`);
  if (envData.humidity > 70 || envData.humidity < 30) score += 3, factors.push('Extreme humidity');

  // Levels per spec (0-100 score)
  let level;
  if (score >= 70) level = 'Critical';
  else if (score >= 50) level = 'High';
  else if (score >= 30) level = 'Medium';
  else level = 'Low';

  const recommendation = getRecommendation(level, triggeringFactors, medicationRegimen);

  return {
    riskLevel: level,
    score: Math.round(score),
    triggeringFactors,
    recommendationText: recommendation,
    factors,
    currentEnv: envData,
    avgSymptomSeverity: Math.round(avgSymptomSeverity)
  };
};

const getRecommendation = (level, triggers, meds) => {
  const medReminder = meds?.length ? `Take ${meds[0].name} as prescribed.` : '';
  switch (level) {
    case 'Critical':
      return `🚨 CRITICAL RISK. Seek emergency care immediately. ${medReminder}`;
    case 'High':
      return `⚠️ HIGH RISK of exacerbation. Stay indoors, use rescue medication, contact doctor. Triggers: ${triggers.join(', ')}. ${medReminder}`;
    case 'Medium':
      return `📈 MEDIUM RISK. Limit activity, monitor closely. Triggers: ${triggers.join(', ')}. ${medReminder}`;
    default:
      return `✅ LOW RISK. Continue routine management. ${medReminder}`;
  }
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
