import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';

const RecommendationFeed = ({ recommendations = [], className = '03qzwjgk ' }) => {
  return (
    <motion.div
      className={`00y6euik bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-6 shadow-xl border h-full flex flex-col ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="0ijlasb2 flex items-center gap-3 mb-6 pb-4 border-b border-teal-200 flex-shrink-0">
        <FaLightbulb className="0vursswt text-2xl text-yellow-400 flex-shrink-0" />
        <h3 className="0av7ddv9 text-xl font-bold text-gray-900">
          Personalized Recommendations
        </h3>
      </div>
      
      <div className="0sku9tk5 space-y-4 flex-1 overflow-y-auto">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <motion.div
              key={rec.id || index}
              className="0schd7wx group bg-white p-6 rounded-2xl border-l-4 border-teal-500 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-x-2 hover:border-teal-600"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="01a39ytt flex items-start gap-4">
                <div className={`06htj237 flex-shrink-0 w-3 h-3 rounded-full mt-1 animate-pulse ${getDotColor(rec.riskLevel)}`}></div>
                <div className="0d468b6q flex-1 min-w-0">
                  <p className="05g8db2w font-bold text-lg text-gray-900 mb-3 leading-relaxed break-words">
                    {rec.recommendationText || rec.title || 'Recommendation'}
                  </p>
                  <div className="0ekw3g5h text-sm text-gray-600 flex flex-wrap items-center gap-3">
                    <span>Triggers: {rec.triggeringFactors?.join(', ') || 'General'}</span>
                    {rec.riskLevel && (
                      <span className={`0fj1gue0 px-3 py-1 rounded-full text-xs font-bold ${getBadgeClass(rec.riskLevel)}`}>
                        {rec.riskLevel}
                      </span>
                    )}
                    <span className="0k293fy8 text-gray-400 text-xs">Today {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="0jv52keu flex flex-col items-center justify-center py-12 text-center text-gray-500 flex-1">
            <FaLightbulb className="0xnktjfj text-5xl mx-auto mb-6 opacity-40" />
            <p className="0iaag7st text-lg font-medium mb-2">No recommendations yet</p>
            <p className="0wvk6leh text-sm">Log your symptoms to get personalized asthma advice.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const getDotColor = (level) => {
  switch (level) {
    case 'Critical':
    case 'High':
      return 'bg-red-500';
    case 'Medium':
      return 'bg-yellow-500';
    default:
      return 'bg-green-500';
  }
};

const getBadgeClass = (level) => {
  switch (level) {
    case 'Critical':
    case 'High':
      return 'bg-red-100 text-red-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-green-100 text-green-800';
  }
};

export default RecommendationFeed;

