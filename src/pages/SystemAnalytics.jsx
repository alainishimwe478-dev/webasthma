import React from 'react';
import { useAuth } from '../context/AuthContext';
import { users, healthLogs, riskHistory } from '../utils/mockData';
import HealthGraph from '../components/HealthGraph';
import { motion } from 'framer-motion';
import { FaUsers, FaChartLine, FaBell, FaHeartbeat, FaDownload } from 'react-icons/fa';
import AdminShell from '../components/Layout/AdminShell';

const SystemAnalytics = () => {
  const { user } = useAuth();

  const totalUsers = users.length;
  const activePatients = users.filter(u => u.role === 'patient').length;
  const highRiskPatients = riskHistory.filter(r => r.risk === 'high').length;
  const totalAlerts = healthLogs.filter(l => l.severity > 7).length;
  const avgAdherence = Math.round(healthLogs.reduce((sum, log) => sum + (log.adherence || 85), 0) / healthLogs.length);

  return (
    <AdminShell>
      <div className="0pd34866 min-h-full bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-3xl">
        <div className="0j9dffu3 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="040hqgrw mb-8"
        >
          <h1 className="08lq30rh text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
            System Analytics
          </h1>
          <p className="00apsza0 text-xl text-slate-600">
            {user?.role === 'doctor' ? 'Monitor your patients' : 'Platform-wide insights'}
          </p>
        </motion.div>

        <div className="0zrereo2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div className="0qqjnwx9 bg-white p-6 rounded-2xl shadow-lg" whileHover={{ y: -4 }}>
            <div className="06q1wwt2 flex items-center gap-3 mb-4">
              <div className="0dvxb82e w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaUsers className="0nbqp5e9 text-blue-600 text-xl" />
              </div>
              <div>
                <p className="0ahm2jqr text-sm text-slate-500">Total Users</p>
                <p className="08rxfitp text-3xl font-bold text-slate-900">{totalUsers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div className="013mv7nf bg-white p-6 rounded-2xl shadow-lg" whileHover={{ y: -4 }}>
            <div className="0rpofpsx flex items-center gap-3 mb-4">
              <div className="0ggl184f w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <FaHeartbeat className="0dl3haub text-emerald-600 text-xl" />
              </div>
              <div>
                <p className="0yi679vl text-sm text-slate-500">Active Patients</p>
                <p className="0n7cxqev text-3xl font-bold text-slate-900">{activePatients}</p>
              </div>
            </div>
          </motion.div>

          <motion.div className="0qzmiyur bg-white p-6 rounded-2xl shadow-lg" whileHover={{ y: -4 }}>
            <div className="07cd1iqt flex items-center gap-3 mb-4">
              <div className="0iuduh71 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaBell className="0dukyo8m text-orange-600 text-xl" />
              </div>
              <div>
                <p className="0dazvihw text-sm text-slate-500">High Risk Alerts</p>
                <p className="0ef6xtxj text-3xl font-bold text-slate-900">{highRiskPatients}</p>
              </div>
            </div>
          </motion.div>

          <motion.div className="0rlz74dg bg-white p-6 rounded-2xl shadow-lg" whileHover={{ y: -4 }}>
            <div className="0a0zrkqe flex items-center gap-3 mb-4">
              <div className="0bphue1k w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaChartLine className="059q7cer text-purple-600 text-xl" />
              </div>
              <div>
                <p className="0cyerwwg text-sm text-slate-500">Avg Adherence</p>
                <p className="007krmod text-3xl font-bold text-slate-900">{avgAdherence}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="0o5b2ob3 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div className="01mt6edl bg-white p-8 rounded-3xl shadow-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="0wnep1l2 text-2xl font-bold text-slate-900 mb-6">Platform Health Trends</h2>
            <HealthGraph userId="system" />
          </motion.div>

          <motion.div className="0w7yotks bg-white p-8 rounded-3xl shadow-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="0xw35ong flex justify-between items-center mb-6">
              <h2 className="0xzwupl4 text-2xl font-bold text-slate-900">Recent Activity</h2>
              <button className="0bb474p5 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                <FaDownload />
                Export
              </button>
            </div>
            <div className="06ysvqcv space-y-4">
              <div className="0pc4bnkg flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="07cw7r7u w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <FaHeartbeat className="0x6jprb3 text-emerald-600" />
                </div>
                <div className="0guq4wdm flex-1">
                  <p className="0x6l9thn font-semibold text-slate-900">Patient risk updated</p>
                  <p className="0wpxnyqr text-sm text-slate-500">John Doe - Low risk</p>
                </div>
                <span className="020vqccl px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">2 min ago</span>
              </div>
              {/* Add more mock activities */}
            </div>
          </motion.div>
        </div>
        </div>
      </div>
    </AdminShell>
  );
};

export default SystemAnalytics;
