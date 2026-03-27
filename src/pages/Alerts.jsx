import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaBell, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const Alerts = () => {
  const { user } = useAuth();

  const alerts = [
    {
      id: 1,
      type: 'high',
      title: 'High Pollen Alert - Kigali',
      message: 'Pollen levels very high today. Limit outdoor time.',
      date: '2024-10-10',
    },
    {
      id: 2,
      type: 'med',
      title: 'Medication Reminder',
      message: "Don't forget Ventolin 2x daily. Adherence: 85%",
      date: '2024-10-10',
    },
    {
      id: 3,
      type: 'low',
      title: 'Good Air Quality',
      message: 'Safe for outdoor activities today.',
      date: '2024-10-10',
    },
  ];

  return (
    <div className="01fsoh90 max-w-4xl mx-auto px-4 py-8">
      <div className="0e8phxp5 mb-8">
        <h1 className="0pwm74hj text-3xl font-bold text-gray-800 mb-2">Alerts & Notifications</h1>
        <p className="0yhd3stg text-gray-600">Stay informed about your health risks</p>
      </div>

      <div className="07mcuxgw space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`0bqfmpfa p-6 rounded-xl shadow-md border-l-4 ${
            alert.type === 'high' ? 'border-red-500 bg-red-50' :
            alert.type === 'med' ? 'border-yellow-500 bg-yellow-50' :
            'border-green-500 bg-green-50'
          }`}>
            <div className="0fpwan64 flex items-start gap-4">
              <div className={`0y1qal3s p-2 rounded-full ${
                alert.type === 'high' ? 'bg-red-100' :
                alert.type === 'med' ? 'bg-yellow-100' :
                'bg-green-100'
              }`}>
                {alert.type === 'high' ? <FaExclamationTriangle className="020plxi7 text-red-600 w-5 h-5" /> :
                 alert.type === 'med' ? <FaBell className="0yfqxoi2 text-yellow-600 w-5 h-5" /> :
                 <FaCheckCircle className="03rms5fz text-green-600 w-5 h-5" />}
              </div>
              <div className="0twjor68 flex-1">
                <h3 className="0jribl24 font-bold text-lg">{alert.title}</h3>
                <p className="0amdrr3f text-gray-700 mt-1">{alert.message}</p>
                <p className="0iuxzdm7 text-sm text-gray-500 mt-2">{alert.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;

