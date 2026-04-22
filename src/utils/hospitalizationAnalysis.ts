// utils/hospitalizationAnalysis.ts
export interface HospitalizationEvent {
  date: string;
  reason: string;
  duration: string;
  outcome: string;
  year: number;
  month: number;
}

export interface HospitalizationAnalysis {
  totalEvents: number;
  recentHospitalizations: boolean;
  recurringConditions: string[];
  riskLevel: 'Low' | 'Moderate' | 'High';
  requiresFollowUp: boolean;
  clinicalRecommendations: string[];
  readmissionRisk: number;
}

export const parseHospitalizationHistory = (history: string): HospitalizationEvent[] => {
  if (!history || history.trim() === '') return [];

  const lines = history.split('\n').filter(line => line.trim() !== '');
  const events: HospitalizationEvent[] = [];

  lines.forEach(line => {
    // Expected format: "YYYY-MM - Reason - Duration - Outcome"
    const parts = line.split(' - ').map(part => part.trim());
    if (parts.length >= 2) {
      const datePart = parts[0];
      const reason = parts[1];
      const duration = parts[2] || 'Unknown';
      const outcome = parts[3] || 'Unknown';

      // Parse date
      const dateMatch = datePart.match(/^(\d{4})-(\d{2})$/);
      if (dateMatch) {
        const year = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]);

        events.push({
          date: datePart,
          reason,
          duration,
          outcome,
          year,
          month
        });
      }
    }
  });

  return events.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
};

export const analyzeHospitalizations = (history: string): HospitalizationAnalysis => {
  const events = parseHospitalizationHistory(history);

  if (events.length === 0) {
    return {
      totalEvents: 0,
      recentHospitalizations: false,
      recurringConditions: [],
      riskLevel: 'Low',
      requiresFollowUp: false,
      clinicalRecommendations: [],
      readmissionRisk: 0
    };
  }

  // Check for recent hospitalizations (within last 6 months)
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  const recentEvents = events.filter(event => {
    const eventDate = new Date(event.year, event.month - 1, 1);
    return eventDate >= sixMonthsAgo;
  });

  // Find recurring conditions
  const conditionCounts: Record<string, number> = {};
  events.forEach(event => {
    const condition = event.reason.toLowerCase();
    conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
  });

  const recurringConditions = Object.entries(conditionCounts)
    .filter(([, count]) => count > 1)
    .map(([condition]) => condition);

  // Calculate risk level
  let riskLevel: 'Low' | 'Moderate' | 'High' = 'Low';
  let readmissionRisk = 0;

  if (events.length >= 3) {
    riskLevel = 'High';
    readmissionRisk = 75;
  } else if (events.length >= 2 || recentEvents.length > 0) {
    riskLevel = 'Moderate';
    readmissionRisk = 45;
  } else if (events.length === 1) {
    riskLevel = 'Low';
    readmissionRisk = 25;
  }

  // Generate clinical recommendations
  const recommendations: string[] = [];

  if (recurringConditions.includes('asthma') || recurringConditions.includes('asthma attack')) {
    recommendations.push('Review and update asthma action plan');
    recommendations.push('Consider increasing peak flow monitoring frequency');
    recommendations.push('Evaluate inhaler technique and medication adherence');
  }

  if (recurringConditions.includes('pneumonia')) {
    recommendations.push('Recommend pneumonia vaccination if not already done');
    recommendations.push('Monitor for early signs of respiratory infection');
    recommendations.push('Consider prophylactic antibiotics during high-risk periods');
  }

  if (events.some(e => e.reason.toLowerCase().includes('emergency'))) {
    recommendations.push('Develop emergency response plan');
    recommendations.push('Ensure patient has emergency contact information readily available');
  }

  if (recentEvents.length > 0) {
    recommendations.push('Schedule follow-up appointment within 2 weeks');
    recommendations.push('Increase monitoring frequency for vital signs');
  }

  return {
    totalEvents: events.length,
    recentHospitalizations: recentEvents.length > 0,
    recurringConditions,
    riskLevel,
    requiresFollowUp: recentEvents.length > 0 || events.length >= 2,
    clinicalRecommendations: recommendations,
    readmissionRisk
  };
};

export const getHospitalizationStats = (history: string) => {
  const events = parseHospitalizationHistory(history);

  if (events.length === 0) {
    return {
      totalHospitalizations: 0,
      averageStayLength: 0,
      mostCommonReason: 'None',
      readmissionRate: 0,
      lastHospitalizationDate: null,
      timeline: []
    };
  }

  // Calculate average stay length (rough estimate)
  const stayLengths = events
    .map(event => {
      const match = event.duration.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })
    .filter(length => length > 0);

  const averageStayLength = stayLengths.length > 0
    ? stayLengths.reduce((sum, len) => sum + len, 0) / stayLengths.length
    : 0;

  // Find most common reason
  const reasonCounts: Record<string, number> = {};
  events.forEach(event => {
    const reason = event.reason.toLowerCase();
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  });

  const mostCommonReason = Object.entries(reasonCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Various';

  // Calculate readmission rate (simplified)
  const readmissionRate = events.length > 1 ? ((events.length - 1) / events.length) * 100 : 0;

  return {
    totalHospitalizations: events.length,
    averageStayLength: Math.round(averageStayLength * 10) / 10,
    mostCommonReason: mostCommonReason.charAt(0).toUpperCase() + mostCommonReason.slice(1),
    readmissionRate: Math.round(readmissionRate),
    lastHospitalizationDate: events[0]?.date || null,
    timeline: events.map(event => ({
      date: event.date,
      reason: event.reason,
      duration: event.duration,
      outcome: event.outcome
    }))
  };
};

export const generateHospitalizationReport = (patientName: string, history: string) => {
  const analysis = analyzeHospitalizations(history);
  const stats = getHospitalizationStats(history);

  return {
    patientName,
    section: "Hospitalization History Analysis",
    summary: {
      totalEvents: analysis.totalEvents,
      riskLevel: analysis.riskLevel,
      recentActivity: analysis.recentHospitalizations,
      readmissionRisk: `${analysis.readmissionRisk}%`
    },
    clinicalImplications: analysis.clinicalRecommendations.length > 0
      ? analysis.clinicalRecommendations
      : ["No specific clinical implications identified"],
    recommendations: analysis.requiresFollowUp
      ? ["Intensive follow-up required", "Enhanced monitoring recommended"]
      : ["Standard monitoring appropriate"],
    detailedStats: stats
  };
};