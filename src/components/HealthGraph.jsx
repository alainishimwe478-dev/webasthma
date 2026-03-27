import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { getRiskHistory } from '../utils/aiPrediction';

const HealthGraph = ({ userId = 3, days = 7 }) => {
  const data = getRiskHistory(userId); // [{date, risk, peakFlow, symptomSeverity}]

  return (
    <motion.div
      className="0caco1dq bg-white rounded-3xl p-6 shadow-xl border border-slate-100"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="0hvy7sht flex items-center justify-between mb-6">
        <h3 className="0jlaevuq text-xl font-bold text-slate-800">7-Day Health Trends</h3>
        <span className="0ig54th1 text-sm text-slate-500">Peak Flow & Symptoms</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={10} />
          <YAxis 
            yAxisId="left" 
            stroke="#94a3b8" 
            axisLine={false} 
            tickLine={false} 
            tickMargin={10}
            type="number"
          />
          <YAxis 
            yAxisId="right" 
            stroke="#e2e8f0" 
            orientation="right" 
            axisLine={false} 
            tickLine={false} 
            tickMargin={10}
          />
          <Tooltip />
          <Legend />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="peakFlow" 
            stroke="#2C7DA0" 
            strokeWidth={3}
            name="Peak Flow (L/min)"
            dot={{ fill: '#2C7DA0', strokeWidth: 2 }}
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="symptomSeverity" 
            stroke="#E63946" 
            strokeWidth={3}
            name="Symptom Severity (1-10)"
            dot={{ fill: '#E63946', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default HealthGraph;

