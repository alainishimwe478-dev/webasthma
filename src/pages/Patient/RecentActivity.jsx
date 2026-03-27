import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockPatientData } from '@/utils/mockData';
import { format } from 'date-fns'; // Assume available or use native Date

const RecentActivity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = () => {
      // Load symptom history
      const savedSymptoms = localStorage.getItem(`symptoms_${user?.id || 'guest'}`);
      const symptoms = savedSymptoms ? JSON.parse(savedSymptoms) : mockPatientData.symptomHistory || [];
      
      // Mock activities
      const mockActivities = [
        { type: 'alert', title: 'High Risk Alert', time: '2 hours ago', risk: 75, description: 'Environmental factors increased' },
        { type: 'environment', title: 'AQI worsened', time: '4 hours ago', value: 'AQI 145', description: 'Stay indoors' },
        { type: 'medication', title: 'Dose reminder', time: 'Today 8AM', description: 'Preventer inhaler due' },
        ...symptoms.slice(-3).map(s => ({
          type: 'symptom',
          title: 'Symptom logged',
          time: format(new Date(s.timestamp), 'MMM dd, HH:mm'),
          severity: ((parseInt(s.wheezing) + parseInt(s.cough) + parseInt(s.shortnessOfBreath) + parseInt(s.chestTight)) / 4).toFixed(1),
          notes: s.notes.substring(0, 50) + '...'
        })),
        { type: 'prediction', title: 'Risk forecast updated', time: 'Yesterday', risk: 42, description: 'Tomorrow risk: 42%' },
      ];

      setActivities(mockActivities.reverse());
      setLoading(false);
    };

    loadActivities();
  }, [user]);

  const getTypeIcon = (type) => {
    const icons = {
      alert: '🚨',
      environment: '🌡️',
      symptom: '📝',
      medication: '💊',
      prediction: '🔮',
    };
    return icons[type] || '📋';
  };

  const getTypeColor = (type) => {
    const colors = {
      alert: 'border-red-400 bg-red-50 text-red-800',
      environment: 'border-blue-400 bg-blue-50 text-blue-800',
      symptom: 'border-green-400 bg-green-50 text-green-800',
      medication: 'border-yellow-400 bg-yellow-50 text-yellow-800',
      prediction: 'border-purple-400 bg-purple-50 text-purple-800',
    };
    return colors[type] || 'border-gray-400 bg-gray-50 text-gray-800';
  };

  if (loading) {
    return (
      <div className="0mivm2ej p-8 flex justify-center items-center min-h-screen">
        <div className="04v5enfn text-lg">Loading recent activity...</div>
      </div>
    );
  }

  return (
    <div className="0uihs6jj p-6 max-w-4xl mx-auto">
      <div className="0lvitsvb flex justify-between items-center mb-8">
        <h1 className="04ynxrge text-3xl font-bold text-gray-800">Recent Activity</h1>
        <div className="0fnubvl9 text-sm text-gray-500">{activities.length} events</div>
      </div>

      <div className="0yptdwxh space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className={`02yvcbox p-6 rounded-xl shadow-sm border-l-4 ${getTypeColor(activity.type)} hover:shadow-md transition-shadow`}>
            <div className="0f0jxqzu flex items-start space-x-4">
              <div className="0utf8dyr text-2xl flex-shrink-0">{getTypeIcon(activity.type)}</div>
              <div className="0c3tqz6v flex-1 min-w-0">
                <div className="05erbbg3 flex items-center justify-between mb-1">
                  <h3 className="09c7m2zl font-bold text-lg">{activity.title}</h3>
                  <span className="0rhll5p9 text-sm font-medium text-gray-500">{activity.time}</span>
                </div>
                {activity.risk && (
                  <div className="0g9v8rtn inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-2">
                    Risk: {activity.risk}%
                  </div>
                )}
                <p className="0c82xjw3 text-sm text-gray-600 mb-2">{activity.description || activity.notes}</p>
                {activity.severity && (
                  <div className="0srozfaa text-xs bg-gray-100 px-2 py-1 rounded">
                    Severity: {activity.severity}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="0ce5ou3w text-center py-16 text-gray-500">
          <div className="0fi861cr text-4xl mb-4">📭</div>
          <h3 className="0e19c3b4 text-xl font-bold mb-2">No recent activity</h3>
          <p>Log symptoms or wait for alerts to see activity here.</p>
        </div>
      )}

      <div className="0qkh081t text-center text-sm text-gray-500 mt-12">
        Activity shows last 30 days
      </div>
    </div>
  );
};

export default RecentActivity;

