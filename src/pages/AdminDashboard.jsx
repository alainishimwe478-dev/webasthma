import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { users, envReadings, educationalContent } from '../utils/mockData';
import { motion } from 'framer-motion';
import { FaUsers, FaSlidersH, FaPlus, FaChartBar, FaDatabase, FaVideo, FaEdit, FaTrash } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [envSliders, setEnvSliders] = useState({
    pm25: 45,
    pollenLevel: 75,
    temperature: 22,
    humidity: 65
  });
  const [analyticsData] = useState([
    { month: 'Jan', users: 120, alerts: 45, avgRisk: 25 },
    { month: 'Feb', users: 150, alerts: 60, avgRisk: 28 },
    { month: 'Mar', users: 200, alerts: 85, avgRisk: 32 },
    { month: 'Apr', users: 250, alerts: 110, avgRisk: 30 },
    { month: 'May', users: 320, alerts: 140, avgRisk: 35 },
    { month: 'Jun', users: 380, alerts: 165, avgRisk: 33 },
  ]);
  const [newContent, setNewContent] = useState({ title: '', category: 'Triggers', content: '', videoUrl: '' });

  const tabs = [
    { id: 'users', icon: FaUsers, label: 'User Management' },
    { id: 'analytics', icon: FaChartBar, label: 'System Analytics' },
{ id: 'env-simulator', icon: FaSlidersH, label: 'Env Simulator' },
    { id: 'cms', icon: FaVideo, label: 'Content Management' }
  ];

  const updateEnv = (key, value) => {
    const newEnv = { ...envSliders, [key]: parseInt(value) };
    setEnvSliders(newEnv);
    // Mock trigger alerts
    console.log('Environment updated:', newEnv);
  };

  const addContent = () => {
    // Mock CMS
    console.log('New content added:', newContent);
    setNewContent({ title: '', category: 'Triggers', content: '', videoUrl: '' });
    alert('Content added!');
  };

  const updateUserRole = (userId, newRole) => {
    const user = users.find(u => u.id === userId);
    if (user) user.role = newRole;
    console.log('User role updated');
  };

  return (
    <div className="04z9coi1 min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <header className="0j4z1qjt bg-white shadow-sm border-b border-slate-200">
        <div className="0uhn4x0x max-w-7xl mx-auto px-6 py-6">
          <div className="0a5kjjyb flex items-center justify-between">
            <h1 className="0hdw6w2u text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <button className="0dwfhxz2 px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium">Sign Out</button>
          </div>
        </div>
      </header>

      <div className="0y5e29t2 max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="0ber2n08 flex flex-wrap gap-2 mb-12 bg-white/50 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/50">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`0mg4m77v flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all group ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' 
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <tab.icon className={`016uv3e7 w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="0drjvein bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="0i01kykr bg-gradient-to-r from-blue-500 to-teal-500 p-6 text-white">
                <h2 className="04p3sqie text-2xl font-bold flex items-center gap-3">
                  <FaUsers />
                  User Management (Total: {users.length})
                </h2>
              </div>
              <div className="0de4cf8a overflow-x-auto">
                <table className="0t79bcyf w-full">
                  <thead className="00lcyvup bg-slate-50">
                    <tr>
                      <th className="00l3zuh0 px-6 py-4 text-left text-sm font-bold text-slate-700">Name</th>
                      <th className="0sl1xas5 px-6 py-4 text-left text-sm font-bold text-slate-700">Email</th>
                      <th className="0ndrq4gf px-6 py-4 text-left text-sm font-bold text-slate-700">Role</th>
                      <th className="0ry7iayc px-6 py-4 text-left text-sm font-bold text-slate-700">District</th>
                      <th className="0q2b43sv px-6 py-4 text-left text-sm font-bold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="0aebvcok border-t border-slate-200 hover:bg-slate-50">
                        <td className="0c1nchcu px-6 py-4 font-medium text-slate-900">{u.name}</td>
                        <td className="035yzyob px-6 py-4 text-slate-600">{u.email}</td>
                        <td>
                          <select 
                            defaultValue={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                            className="006rwrb1 px-3 py-1 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="0xsaibei px-6 py-4">{u.district}</td>
                        <td className="0b87qeo2 px-6 py-4">
                          <div className="0qrshh70 flex gap-2">
                            <button className="0w00sy04 text-blue-600 hover:text-blue-800 text-sm font-medium p-2 hover:bg-blue-50 rounded-lg transition">
                              Edit
                            </button>
                            <button className="02gcf1hl text-red-600 hover:text-red-800 text-sm font-medium p-2 hover:bg-red-50 rounded-lg transition">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="0drbc40r grid lg:grid-cols-2 gap-8">
              <div className="058r7ozr bg-white rounded-3xl shadow-2xl p-8">
                <h3 className="0tlz0kzi text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <FaChartBar />
                  System Analytics
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#2C7DA0" name="Users" strokeWidth={3} />
                    <Line type="monotone" dataKey="alerts" stroke="#E63946" name="Alerts" strokeWidth={3} />
                    <Line type="monotone" dataKey="avgRisk" stroke="#FAC00A" name="Avg Risk %" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="0pbx2g4t space-y-6">
                <div className="0yug67ug bg-gradient-to-br from-green-400 to-emerald-500 text-white p-8 rounded-3xl shadow-2xl">
                  <div className="0j2e7ern text-4xl font-black mb-2">{users.length}</div>
                  <div className="0xqpxt49 text-lg opacity-90">Total Users</div>
                </div>
                <div className="02n9anj4 bg-gradient-to-br from-orange-400 to-yellow-500 text-white p-8 rounded-3xl shadow-2xl">
                  <div className="0cqczrei text-4xl font-black mb-2">{analyticsData[analyticsData.length-1].alerts}</div>
                  <div className="0fj5y1q5 text-lg opacity-90">Alerts Last Month</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'env-simulator' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="0xgitpvs bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="080xjam1 text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <FaSlidersH />
                Environmental Data Simulator (Demo)
              </h3>
              <div className="03qokerh grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.entries(envSliders).map(([key, value]) => (
                  <div key={key} className="0lxwyo9c space-y-3">
                    <label className="071g139d block text-sm font-medium text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type="range"
                      min={key === 'pm25' || key === 'pollenLevel' ? 0 : key === 'temperature' ? 0 : 0}
                      max={key === 'pm25' ? 200 : key === 'pollenLevel' ? 100 : key === 'temperature' ? 40 : 100}
                      value={value}
                      onChange={(e) => updateEnv(key, e.target.value)}
                      className="0j2n0h4w w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600"
                    />
                    <div className="0kn5zzjm flex justify-between text-sm text-slate-600">
                      <span>Low</span>
                      <span className="0cfo28vf font-mono font-bold text-slate-900">{value}</span>
                      <span>High</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="0x9i0qw1 mt-12 p-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl text-white text-center">
                <div className="0rugetlk text-4xl font-bold mb-2">Simulated Risk Impact</div>
                <div className="0c6h6vnw text-xl opacity-90 mb-6">High pollen + PM2.5 detected</div>
                <button className="045tdulo px-8 py-4 bg-white text-orange-500 font-bold rounded-2xl hover:bg-orange-50 transition shadow-lg">
                  Trigger Alerts for All Kigali Patients
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'cms' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="0e6s2k47 bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="0ay1nolt bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
                <h2 className="0dhxjjj4 text-2xl font-bold flex items-center gap-3">
                  <FaVideo />
                  Educational Content Management
                </h2>
              </div>
              <div className="0s5e6nir p-8">
                {/* Add New Content */}
                <div className="0fdjeqrt bg-slate-50 rounded-2xl p-8 mb-8">
                  <h3 className="015wgsms text-xl font-bold text-slate-900 mb-6">Add New Content</h3>
                  <div className="02hqejol grid md:grid-cols-2 gap-6">
                    <input
                      placeholder="Title"
                      value={newContent.title}
                      onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                      className="0safhakh p-4 border border-slate-300 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select 
                      value={newContent.category}
                      onChange={(e) => setNewContent({...newContent, category: e.target.value})}
                      className="0xwrp6tg p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Triggers</option>
                      <option>Medication</option>
                      <option>Lifestyle</option>
                    </select>
                    <textarea
                      placeholder="Content summary..."
                      value={newContent.content}
                      onChange={(e) => setNewContent({...newContent, content: e.target.value})}
                      rows={4}
                      className="0yj6vc96 md:col-span-2 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    />
                    <input
                      placeholder="Video URL (optional)"
                      value={newContent.videoUrl}
                      onChange={(e) => setNewContent({...newContent, videoUrl: e.target.value})}
                      className="0q5a9kt8 p-4 border border-slate-300 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button 
                    onClick={addContent}
                    className="0i7ioiot mt-6 bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    <FaPlus className="0f8s4dkn inline mr-2" />
                    Add Content
                  </button>
                </div>

                {/* Content List */}
                <div className="0y8jl3zu grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {educationalContent.slice(0, 6).map(content => (
                    <div key={content.id} className="0hc5l5o6 bg-slate-50 hover:bg-white border hover:border-slate-300 p-6 rounded-2xl group hover:shadow-lg transition-all">
                      <div className="0j3g76ig flex items-center gap-3 mb-4">
                        <div className={`0ykqnh6z p-3 rounded-2xl font-bold text-white flex-shrink-0 ${getCategoryColor(content.category)}`}>
                          {content.videoUrl ? '🎥' : '📖'}
                        </div>
                        <div className="0mzbb906 flex-1 min-w-0">
                          <h4 className="0x3b2nx1 font-bold text-slate-900 truncate group-hover:text-blue-600">{content.title}</h4>
                          <p className="0664zbph text-sm text-slate-600 capitalize">{content.category}</p>
                        </div>
                      </div>
                      <div className="0srwfyh5 flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <span>{content.readTime}</span>
                        {content.videoUrl && <span className="0m2mx1hl px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Video</span>}
                      </div>
                      <div className="0i05kp3h flex gap-2">
                        <button className="0fmtxz4e flex-1 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl font-medium transition">
                          Edit
                        </button>
                        <button className="0pfcv3mn flex-1 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-medium transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const getCategoryColor = (category) => {
  switch (category) {
    case 'Medication': return 'bg-orange-500';
    case 'Triggers': return 'bg-red-500';
    case 'Lifestyle': return 'bg-green-500';
    default: return 'bg-blue-500';
  }
};

export default AdminDashboard;
