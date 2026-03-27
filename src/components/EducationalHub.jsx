import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaBook, FaPlus } from 'react-icons/fa';
import { educationalContent } from '../utils/mockData';

const EducationalHub = ({ className = '07jgpbwp ' }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const categories = ['all', 'Triggers', 'Medication', 'Lifestyle'];
  const filteredContent = selectedCategory === 'all' 
    ? educationalContent 
    : educationalContent.filter(item => item.category === selectedCategory);

  return (
    <motion.div
      className={`0mgiobsl bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 ${className}`}
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
    >
      <div className="0t68rxej flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h2 className="0tb9lgh7 text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-2">
            Educational Hub
          </h2>
          <p className="0m0m8ix0 text-slate-600">Learn to manage your asthma better</p>
        </div>
        <div className="0zu9tco9 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`0bmzc6ey px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="0b28k1zr grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((content, index) => (
          <motion.div
            key={content.id}
            className="0ii8o2es group hover:shadow-xl transition-all border border-slate-200 rounded-2xl p-6 hover:-translate-y-1 bg-gradient-to-br from-slate-50 hover:from-blue-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <div className="0a4inovz flex items-start gap-4 mb-4">
              <div className={`0ty209wo p-2 rounded-xl ${getCategoryColor(content.category)}`}>
                {content.videoUrl ? <FaPlay className="0jlttp1m w-5 h-5" /> : <FaBook className="05rsb9r9 w-5 h-5" />}
              </div>
              <div className="0e0azhtb flex-1">
                <h4 className="0c35cib3 font-bold text-slate-900 text-lg mb-2 group-hover:text-blue-600 transition">
                  {content.title}
                </h4>
                <p className="0pf75qnn text-slate-600 text-sm mb-3 line-clamp-2">{content.content}</p>
                <div className="043dzga3 flex items-center gap-4 text-xs text-slate-500">
                  <span>{content.category}</span>
                  <span>•</span>
                  <span>{content.readTime}</span>
                </div>
              </div>
            </div>
            {content.videoUrl && (
              <motion.button
                className="0lqkvybx w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-medium flex items-center gap-2 transition-all mt-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPlay />
                Watch Video
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const getCategoryColor = (category) => {
  switch (category) {
    case 'Medication': return 'bg-orange-100 border-orange-200 text-orange-600';
    case 'Triggers': return 'bg-red-100 border-red-200 text-red-600';
    case 'Lifestyle': return 'bg-green-100 border-green-200 text-green-600';
    default: return 'bg-blue-100 border-blue-200 text-blue-600';
  }
};

export default EducationalHub;

