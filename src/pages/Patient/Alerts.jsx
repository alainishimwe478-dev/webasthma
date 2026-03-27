import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBell, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaInfoCircle,
  FaWind,
  FaSeedling,
  FaTemperatureLow,
  FaTint,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTimes,
  FaShieldAlt,
  FaPills,
  FaLungs,
  FaSmog
} from 'react-icons/fa';
import Navbar from '../../components/Layout/Navbar';

const Alerts = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const alerts = [
    {
      id: 1,
      type: 'danger',
      severity: 'high',
      title: 'High Pollen Alert',
      message: 'Pollen levels are extremely high in your area. Consider staying indoors and taking antihistamines.',
      time: '10 minutes ago',
      date: '2024-01-15',
      location: 'Kigali, Rwanda',
      icon: FaSeedling,
      action: 'Take medication',
      actionLink: '#',
      read: false,
      recommendations: [
        'Stay indoors with windows closed',
        'Take prescribed antihistamine',
        'Use air purifier if available',
        'Avoid outdoor activities until 6 PM'
      ]
    },
    {
      id: 2,
      type: 'warning',
      severity: 'medium',
      title: 'Medication Reminder',
      message: 'Time to take your evening dose of Fluticasone.',
      time: '1 hour ago',
      date: '2024-01-15',
      location: 'Home',
      icon: FaPills,
      action: 'Mark as taken',
      actionLink: '#',
      read: false,
      recommendations: [
        'Take 1 puff of Fluticasone',
        'Rinse mouth after use',
        'Log in symptom tracker'
      ]
    },
    {
      id: 3,
      type: 'info',
      severity: 'low',
      title: 'Air Quality Update',
      message: 'Air quality has improved to moderate levels. Outdoor activities are safer now.',
      time: '2 hours ago',
      date: '2024-01-15',
      location: 'Kigali, Rwanda',
      icon: FaWind,
      action: 'View details',
      actionLink: '#',
      read: true,
      recommendations: [
        'Monitor air quality index',
        'Good time for light exercise',
        'Keep windows open for ventilation'
      ]
    },
    {
      id: 4,
      type: 'danger',
      severity: 'high',
      title: 'Critical Risk Alert',
      message: 'Your recent symptoms indicate a potential asthma exacerbation. Please check your peak flow.',
      time: '3 hours ago',
      date: '2024-01-15',
      location: 'Home',
      icon: FaExclamationTriangle,
      action: 'Log symptoms',
      actionLink: '#',
      read: false,
      recommendations: [
        'Take rescue inhaler immediately',
        'Check peak flow reading',
        'Contact doctor if symptoms persist',
        'Rest in a comfortable position'
      ]
    },
    {
      id: 5,
      type: 'success',
      severity: 'low',
      title: 'Good Control Maintained',
      message: 'Your asthma has been well-controlled for 24 days! Keep up the great work.',
      time: '1 day ago',
      date: '2024-01-14',
      location: 'System',
      icon: FaCheckCircle,
      action: 'View progress',
      actionLink: '#',
      read: true,
      recommendations: [
        'Continue current medication routine',
        'Schedule follow-up appointment',
        'Share progress with doctor'
      ]
    },
    {
      id: 6,
      type: 'warning',
      severity: 'medium',
      title: 'Weather Change Alert',
      message: 'Cold front approaching tonight. Sudden temperature drops may trigger symptoms.',
      time: '2 days ago',
      date: '2024-01-13',
      location: 'Kigali, Rwanda',
      icon: FaTemperatureLow,
      action: 'Prepare',
      actionLink: '#',
      read: true,
      recommendations: [
        'Dress warmly when going out',
        'Cover mouth and nose with scarf',
        'Stay in warm indoor areas'
      ]
    }
  ];

  const getAlertStyle = (type, severity) => {
    if (type === 'danger') {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        severityBadge: 'bg-red-100 text-red-800'
      };
    } else if (type === 'warning') {
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        severityBadge: 'bg-yellow-100 text-yellow-800'
      };
    } else if (type === 'success') {
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        severityBadge: 'bg-green-100 text-green-800'
      };
    } else {
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        severityBadge: 'bg-blue-100 text-blue-800'
      };
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !alert.read;
    return alert.type === selectedFilter;
  });

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div className="02xdbvuj flex-1 flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="0c9kxj3f flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        <div className="07qvnum2 max-w-7xl mx-auto">
            {/* Header */}
            <div className="0xb26g55 mb-8">
              <div className="0wmhsly1 flex items-center justify-between">
                <div>
                  <h1 className="0qcqqzy0 text-3xl font-bold text-gray-800 mb-2">Alerts & Notifications</h1>
                  <p className="0vglm4am text-gray-600">Stay informed about your health and environment</p>
                </div>
                <div className="0hlxlxzn relative">
                  <FaBell className="0areqt3e text-3xl text-blue-600" />
                  {unreadCount > 0 && (
                    <span className="06cwm4pg absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="003qex33 mb-6 flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Alerts', count: alerts.length },
                { id: 'unread', label: 'Unread', count: unreadCount },
                { id: 'danger', label: 'Critical', count: alerts.filter(a => a.type === 'danger').length },
                { id: 'warning', label: 'Warnings', count: alerts.filter(a => a.type === 'warning').length },
                { id: 'info', label: 'Info', count: alerts.filter(a => a.type === 'info').length },
                { id: 'success', label: 'Success', count: alerts.filter(a => a.type === 'success').length }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`0fi7eztn px-4 py-2 rounded-lg transition flex items-center space-x-2 ${
                    selectedFilter === filter.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{filter.label}</span>
                  {filter.count > 0 && (
                    <span className={`07zyyvth text-xs px-2 py-0.5 rounded-full ${
                      selectedFilter === filter.id
                        ? 'bg-white text-blue-600'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {filter.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Alerts List */}
            <div className="05va28pq space-y-4">
              <AnimatePresence>
                {filteredAlerts.map((alert, index) => {
                  const style = getAlertStyle(alert.type, alert.severity);
                  const AlertIcon = alert.icon;
                  
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className={`0tfcjml8 border rounded-xl p-5 ${style.bg} ${style.border} hover:shadow-lg transition-all cursor-pointer`}
                      onClick={() => setSelectedAlert(selectedAlert?.id === alert.id ? null : alert)}
                    >
                      <div className="06xset2t flex items-start space-x-4">
                        <div className={`0xz1wb0l w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <AlertIcon className={`0wmqjtj6 text-2xl ${style.iconColor}`} />
                        </div>
                        
                        <div className="0xbi12l7 flex-1">
                          <div className="0nsec9q6 flex items-start justify-between mb-2">
                            <div>
                              <h3 className={`0ybq2ga9 text-lg font-semibold ${style.text}`}>{alert.title}</h3>
                              <p className="00ymk7d3 text-gray-600 mt-1">{alert.message}</p>
                            </div>
                            {!alert.read && (
                              <span className="0wu4o35q w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            )}
                          </div>
                          
                          <div className="0pj3rfz0 flex items-center space-x-4 text-sm text-gray-500 mt-3">
                            <span className="0gyl21wl flex items-center space-x-1">
                              <FaClock className="088z9o81 text-xs" />
                              <span>{alert.time}</span>
                            </span>
                            <span className="02njgnz3 flex items-center space-x-1">
                              <FaMapMarkerAlt className="0lya6iqn text-xs" />
                              <span>{alert.location}</span>
                            </span>
                            <span className={`0c2h0888 px-2 py-0.5 rounded-full text-xs ${style.severityBadge}`}>
                              {alert.severity.toUpperCase()} Priority
                            </span>
                          </div>
                          
                          {/* Expanded Content */}
                          <AnimatePresence>
                            {selectedAlert?.id === alert.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="0pld4osx mt-4 pt-4 border-t border-gray-200"
                              >
                                <h4 className="070pigbj font-semibold text-gray-800 mb-2">Recommendations:</h4>
                                <ul className="0xoowhfp space-y-2">
                                  {alert.recommendations.map((rec, idx) => (
                                    <li key={idx} className="0wzji4x4 flex items-start space-x-2 text-sm text-gray-700">
                                      <FaCheckCircle className="0467zkw2 text-green-500 text-xs mt-0.5" />
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                                
                                <div className="0jvo6bxu mt-4 flex space-x-3">
                                  <button className="0aibbfdd px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                                    Take Action
                                  </button>
                                  <button className="0stvjex5 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                                    Dismiss
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        <button className="091oxyhu text-gray-400 hover:text-gray-600">
                          <FaTimes />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* No Alerts Message */}
            {filteredAlerts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="08owqpf9 text-center py-12"
              >
                <div className="0umcbx9r w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBell className="06ke84m5 text-4xl text-gray-400" />
                </div>
                <h3 className="0t7dvz3h text-lg font-semibold text-gray-800 mb-2">No Alerts</h3>
                <p className="0lj6ifgr text-gray-500">You're all caught up! No new alerts at the moment.</p>
              </motion.div>
            )}
        </div>
      </main>
    </div>
  );
};

export default Alerts;

