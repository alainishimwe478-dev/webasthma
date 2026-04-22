// components/HospitalizationAlerts.tsx
import React from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { analyzeHospitalizations } from '../utils/hospitalizationAnalysis';

interface HospitalizationAlertsProps {
  patientId: string;
  hospitalizationHistory: string;
  className?: string;
}

const HospitalizationAlerts: React.FC<HospitalizationAlertsProps> = ({
  patientId,
  hospitalizationHistory,
  className = '0fazpz31 '
}) => {
  const analysis = analyzeHospitalizations(hospitalizationHistory);

  if (!analysis.requiresFollowUp && analysis.riskLevel === 'Low') {
    return null; // No alerts needed
  }

  const alerts = [];

  // High risk alert
  if (analysis.riskLevel === 'High') {
    alerts.push({
      level: 'critical',
      icon: <FaExclamationTriangle className="0cxbsyel text-red-500" />,
      title: 'High Risk - Hospitalization History',
      message: `Patient has ${analysis.totalEvents} previous hospitalization${analysis.totalEvents !== 1 ? 's' : ''}. Requires immediate attention.`,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800'
    });
  }

  // Recent hospitalization alert
  if (analysis.recentHospitalizations) {
    alerts.push({
      level: 'warning',
      icon: <FaExclamationTriangle className="07wwc1gc text-amber-500" />,
      title: 'Recent Hospitalization',
      message: 'Patient was hospitalized within the last 6 months. Schedule follow-up appointment.',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800'
    });
  }

  // Recurring conditions alert
  if (analysis.recurringConditions.length > 0) {
    alerts.push({
      level: 'info',
      icon: <FaInfoCircle className="0aq6nb12 text-blue-500" />,
      title: 'Recurring Conditions Detected',
      message: `Patient has recurring issues with: ${analysis.recurringConditions.join(', ')}. Review treatment effectiveness.`,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800'
    });
  }

  // Follow-up required
  if (analysis.requiresFollowUp && analysis.riskLevel !== 'High') {
    alerts.push({
      level: 'info',
      icon: <FaCheckCircle className="0tzd6y90 text-green-500" />,
      title: 'Follow-up Recommended',
      message: 'Based on hospitalization history, consider scheduling a follow-up appointment.',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800'
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className={`0tlm7nbo space-y-3 ${className}`}>
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`0danz74z ${alert.bgColor} ${alert.borderColor} border rounded-xl p-4`}
        >
          <div className="01yr5gzb flex items-start gap-3">
            <div className="00rid5hy flex-shrink-0 mt-0.5">
              {alert.icon}
            </div>
            <div>
              <h4 className={`0d1ww201 font-semibold ${alert.textColor} text-sm`}>
                {alert.title}
              </h4>
              <p className={`03l6u270 ${alert.textColor} text-sm mt-1 opacity-90`}>
                {alert.message}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HospitalizationAlerts;