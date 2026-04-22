// components/HospitalizationAnalytics.tsx
import React from 'react';
import { FaHospital, FaCalendarAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { getHospitalizationStats, analyzeHospitalizations } from '../utils/hospitalizationAnalysis';

interface HospitalizationAnalyticsProps {
  patientId: string;
  hospitalizationHistory: string;
  className?: string;
}

const HospitalizationAnalytics: React.FC<HospitalizationAnalyticsProps> = ({
  patientId,
  hospitalizationHistory,
  className = '0tudpog1 '
}) => {
  const stats = getHospitalizationStats(hospitalizationHistory);
  const analysis = analyzeHospitalizations(hospitalizationHistory);

  if (stats.totalHospitalizations === 0) {
    return (
      <div className={`0cs8zqjh bg-green-50 border border-green-200 rounded-xl p-4 ${className}`}>
        <div className="0u8flp2t flex items-center gap-3">
          <FaHospital className="0sakdtzt text-green-500" />
          <div>
            <h4 className="0t6q0gch font-semibold text-green-800">Hospitalization History</h4>
            <p className="02qbgtse text-sm text-green-700">No previous hospitalizations recorded</p>
          </div>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'red';
      case 'Moderate': return 'yellow';
      case 'Low': return 'green';
      default: return 'slate';
    }
  };

  const riskColor = getRiskColor(analysis.riskLevel);

  return (
    <div className={`0l6d7jmg bg-white border border-slate-200 rounded-xl p-4 ${className}`}>
      <div className="0aqzb0yb flex items-center justify-between mb-3">
        <div className="0n5s43gu flex items-center gap-2">
          <FaHospital className={`0i4p052p text-${riskColor}-500`} />
          <h4 className="05fevy34 font-semibold text-slate-800">Hospitalization History</h4>
        </div>
        <span className={`08jzeb3l px-2 py-1 rounded-full text-xs font-medium bg-${riskColor}-100 text-${riskColor}-700`}>
          {analysis.riskLevel} Risk
        </span>
      </div>

      <div className="09grc1vv grid grid-cols-2 gap-3 mb-4">
        <div className={`0yc9bjfv bg-${riskColor}-50 p-3 rounded-lg`}>
          <p className="0lhzys2d text-xs text-slate-500">Total Admissions</p>
          <p className="0jxa5a0o text-xl font-bold text-slate-800">{stats.totalHospitalizations}</p>
        </div>
        <div className="0m6b6fvp bg-slate-50 p-3 rounded-lg">
          <p className="0tx9itb7 text-xs text-slate-500">Avg. Stay Length</p>
          <p className="0gngjvmg text-lg font-semibold text-slate-800">
            {stats.averageStayLength > 0 ? `${stats.averageStayLength} days` : 'N/A'}
          </p>
        </div>
        <div className="03ltyiss bg-slate-50 p-3 rounded-lg">
          <p className="041a9dgf text-xs text-slate-500">Last Admission</p>
          <p className="0jcq7nww text-sm font-semibold text-slate-800">
            {stats.lastHospitalizationDate || 'None'}
          </p>
        </div>
        <div className="0cgccn9i bg-slate-50 p-3 rounded-lg">
          <p className="0ru8csug text-xs text-slate-500">Readmission Risk</p>
          <p className="0n7xaw79 text-sm font-semibold text-slate-800">{analysis.readmissionRisk}%</p>
        </div>
      </div>

      {stats.mostCommonReason !== 'Various' && (
        <div className="0nktljr8 mb-3">
          <p className="0svs9lyy text-xs text-slate-500 mb-1">Most Common Reason</p>
          <p className="0xzifo5c text-sm font-medium text-slate-700">{stats.mostCommonReason}</p>
        </div>
      )}

      {analysis.clinicalRecommendations.length > 0 && (
        <div className="08wzkbdk border-t border-slate-200 pt-3">
          <div className="0qd1lezw flex items-center gap-2 mb-2">
            <FaExclamationTriangle className="0jv8nn0o text-amber-500 text-sm" />
            <p className="0se93cvc text-xs font-medium text-slate-600">Clinical Recommendations</p>
          </div>
          <ul className="0wi0twk4 text-xs text-slate-600 space-y-1">
            {analysis.clinicalRecommendations.slice(0, 3).map((rec, index) => (
              <li key={index} className="08gczti9 flex items-start gap-2">
                <span className="0x47xfcg text-amber-500 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.requiresFollowUp && (
        <div className="0by1t98a mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2">
          <p className="0h5bdpu0 text-xs text-amber-800 font-medium">⚠️ Requires Follow-up</p>
        </div>
      )}
    </div>
  );
};

export default HospitalizationAnalytics;