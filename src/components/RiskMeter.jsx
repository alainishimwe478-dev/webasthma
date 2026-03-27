import React from "react";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

const clampScore = (value) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(parsed)));
};

const getDerivedRiskLevel = (score, explicitLevel) => {
  if (explicitLevel) {
    return explicitLevel;
  }

  if (score >= 70) return "Critical";
  if (score >= 50) return "High";
  if (score >= 30) return "Medium";
  return "Low";
};

const getColor = (level) => {
  switch (level) {
    case "Critical":
      return "#E63946";
    case "High":
      return "#F77F00";
    case "Medium":
      return "#FAC00A";
    default:
      return "#A7C957";
  }
};

const getToneClass = (level) => {
  switch (level) {
    case "Critical":
      return "text-red-400 bg-red-100";
    case "High":
      return "text-orange-500 bg-orange-100";
    case "Medium":
      return "text-yellow-500 bg-yellow-100";
    default:
      return "text-green-500 bg-green-100";
  }
};

const RiskMeter = ({
  riskScore = 35,
  risk,
  riskLevel,
  className = "",
}) => {
  const score = clampScore(riskScore ?? risk);
  const level = getDerivedRiskLevel(score, riskLevel);
  const color = getColor(level);
  const toneClass = getToneClass(level);

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-white/50 ${className}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Exacerbation Risk
        </h2>
        <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${toneClass}`}>
          <FaExclamationTriangle />
          <span className="font-bold">{level}</span>
        </div>
      </div>

      <div className="relative flex h-80 items-center justify-center">
        <svg
          viewBox="0 0 220 220"
          className="h-72 w-72 -rotate-90 transform"
          aria-hidden="true"
        >
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="22"
          />
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="22"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <motion.div
          className="absolute text-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-5xl font-black text-slate-800">{score}%</div>
          <div className="text-sm uppercase tracking-wider text-slate-500">
            Chance Today
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RiskMeter;
