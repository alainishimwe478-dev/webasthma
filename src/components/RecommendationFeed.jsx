import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';

const RecommendationFeed = ({ recommendations, className = '0ykfq1hg ' }) => {
  return (
    <motion.div
      className={`0t3b6oob bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl p-6 shadow-lg ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ staggerChildren: 0.1 }}
    >
      <div className="0rehgg2s flex items-center gap-3 mb-6">
        <FaLightbulb className="0c0mp54z text-2xl text-yellow-400" />
        <h3 className="0if9bin9 text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent">
          Personalized Recommendations
        </h3>
      </div>
      
      <div className="0yr1os3z space-y-4">
        {recommendations?.map((rec, index) => (
          <motion.div
            key={rec.id || index}
            className="0ck4pdlg group bg-white p-5 rounded-2xl border-l-4 border-teal-500 shadow-sm hover:shadow-md transition-all hover:-translate-x-2 hover:border-teal-600"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="0gsbpww5 flex items-start gap-4">
              <div className={`026b4dnp flex-shrink-0 w-2 h-2 rounded-full mt-2 ${getDotColor(rec.riskLevel)} animate-pulse`}></div>
              <div className="0xnf4i9s flex-1">
                <p className="0gyg87bq font-semibold text-slate-800 mb-2">{rec.recommendationText || rec.title}</p>
                <div className="0d8rt134 text-sm text-slate-600 flex items-center gap-4">
                  <span>Triggers: {rec.triggeringFactors?.join(', ') || 'General'}</span>
                  {rec.riskLevel && (
                    <span className={`07ssl6l4 px-3 py-1 rounded-full text-xs font-bold ${getBadgeClass(rec.riskLevel)}`}>
                      {rec.riskLevel}
                    </span>
                  )}
                  <span className="0k82m9px text-slate-400">Today {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )) || (
          <div className="047w0cpo text-center py-12 text-slate-500">
            <FaLightbulb className="0zrdgjh0 text-4xl mx-auto mb-4 opacity-50" />
            <p>No recommendations at this time. Log symptoms to get personalized advice.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const getDotColor = (level) => {
  switch (level) {
    case 'Critical': case 'High': return 'bg-red-500';
    case 'Medium': return 'bg-yellow-500';
    default: return 'bg-green-500';
  }
};

const getBadgeClass = (level) => {
  switch (level) {
    case 'Critical': case 'High': return 'bg-red-100 text-red-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-green-100 text-green-800';
  }
};

export default RecommendationFeed;

