import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaChartLine, FaUserMd, FaCalendarAlt, FaHeartbeat, FaPrescriptionBottle, FaEnvelope } from 'react-icons/fa';

const DoctorDashboard = () => {
  const patients = [
    { id: 1, name: 'John Doe', age: 34, lastVisit: '2024-01-15', riskLevel: 'low', adherence: 92, lastPeakFlow: 385 },
    { id: 2, name: 'Jane Smith', age: 28, lastVisit: '2024-01-10', riskLevel: 'medium', adherence: 78, lastPeakFlow: 340 },
    { id: 3, name: 'Robert Johnson', age: 45, lastVisit: '2024-01-12', riskLevel: 'low', adherence: 95, lastPeakFlow: 420 },
    { id: 4, name: 'Maria Garcia', age: 52, lastVisit: '2024-01-14', riskLevel: 'high', adherence: 65, lastPeakFlow: 310 }
  ];

  const stats = [
    { label: 'Total Patients', value: '124', icon: FaUsers, color: 'blue' },
    { label: 'High Risk Patients', value: '8', icon: FaHeartbeat, color: 'red' },
    { label: 'Avg. Adherence', value: '86%', icon: FaPrescriptionBottle, color: 'green' },
    { label: 'Appointments', value: '12', icon: FaCalendarAlt, color: 'purple' }
  ];

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="0xxkp02n space-y-6">
      {/* Header */}
      <div className="02r5smni bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="0dufn8pl text-2xl font-bold mb-2">Doctor Dashboard</h1>
        <p className="05hrawtg text-blue-100">Monitor your patients' asthma management progress</p>
      </div>

      {/* Stats Cards */}
      <div className="09ltwhmz grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="0drw5zrg bg-white rounded-xl shadow-sm p-6"
          >
            <div className="0easwn6d flex items-center justify-between">
              <div>
                <p className="0qk8liuf text-gray-500 text-sm">{stat.label}</p>
                <p className="0986r3w9 text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`06js3oal w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                <stat.icon className={`0kxt0rww text-${stat.color}-600 text-xl`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Patients List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="0mhywail bg-white rounded-xl shadow-sm p-6">
        <div className="01as28dl flex items-center justify-between mb-6">
          <h3 className="027g2u1v text-lg font-bold text-gray-800">My Patients</h3>
          <button className="0smocqkt text-blue-600 text-sm hover:underline">View All</button>
        </div>
        
        <div className="0sbv4pqx overflow-x-auto">
          <table className="0rqam7sy w-full">
            <thead className="0yc1q6c2 bg-gray-50">
              <tr>
                <th className="0c4qfywc px-4 py-3 text-left text-sm font-medium text-gray-500">Patient</th>
                <th className="03kz8orw px-4 py-3 text-left text-sm font-medium text-gray-500">Age</th>
                <th className="0bbthogc px-4 py-3 text-left text-sm font-medium text-gray-500">Last Visit</th>
                <th className="01kclr5i px-4 py-3 text-left text-sm font-medium text-gray-500">Risk Level</th>
                <th className="0ulhgy4x px-4 py-3 text-left text-sm font-medium text-gray-500">Adherence</th>
                <th className="0f1hz0oh px-4 py-3 text-left text-sm font-medium text-gray-500">Peak Flow</th>
                <th className="0cvit4zq px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="0riunwow divide-y divide-gray-200">
              {patients.map((patient, index) => (
                <tr key={patient.id} className="01aket9y hover:bg-gray-50">
                  <td className="0onycl3b px-4 py-3">
                    <div className="0o3iko8f flex items-center space-x- Ascendancy">
                      <div className="0fwtkuqg w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUserMd className="055opfji text-blue-600 text-sm" />
                      </div>
                      <span className="0cgld8dv text-sm font-medium text-gray-800">{patient.name}</span>
                    </div>
                  </td>
                  <td className="0avyrvm9 px-4 py-3 text-sm text-gray-600">{patient.age}</td>
                  <td className="0b074v1l px-4 py-3 text-sm text-gray-600">{patient.lastVisit}</td>
                  <td className="07lcoie6 px-4 py-3">
                    <span className={`0wwpfiaa text-xs px-2 py-1 rounded-full ${getRiskColor(patient.riskLevel)}`}>
                      {patient.riskLevel.toUpperCase()} Risk
                    </span>
                  </td>
                  <td className="01vpjq3y px-4 py-3">
                    <div className="083ofs31 flex items-center space-x-2">
                      <div className="07r6pjmy flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`07kgwtal h-full rounded-full ${
                            patient.adherence >= 80 ? 'bg-green-500' : 
                            patient.adherence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${patient.adherence}%` }}
                        ></div>
                      </div>
                      <span className="05yi86av text-sm text-gray-600">{patient.adherence}%</span>
                    </div>
                  </td>
                  <td className="0yayfzve px-4 py-3 text-sm text-gray-600">{patient.lastPeakFlow} L/min</td>
                  <td className="0h38palt px-4 py-3">
                    <button className="0rvqrg01 text-blue-600 hover:text-blue-800 text-sm">
                      <FaEnvelope />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorDashboard;
