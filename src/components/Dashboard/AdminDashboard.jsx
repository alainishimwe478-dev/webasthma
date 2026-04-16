import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUsers, FaSlidersH, FaPlus, FaChartBar, FaVideo } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [envSliders, setEnvSliders] = useState({ pm25: 45, pollenLevel: 75, temperature: 22, humidity: 65 });
  const [analyticsData, setAnalyticsData] = useState([]);
  const [users, setUsers] = useState([]);
  const [newContent, setNewContent] = useState({ title: '', category: 'Triggers', content: '', videoUrl: '' });
  const [citiesData, setCitiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'http://192.168.1.5:8000';

  const tabs = [
    { id: 'users', icon: FaUsers, label: 'User Management' },
    { id: 'analytics', icon: FaChartBar, label: 'System Analytics' },
    { id: 'env-simulator', icon: FaSlidersH, label: 'Env Simulator' },
    { id: 'cms', icon: FaVideo, label: 'Content Management' }
  ];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usersRes, citiesRes, analyticsRes] = await Promise.all([
          fetch(`${API_BASE}/registered_users`).then(r => r.json()).catch(() => []),
          fetch(`${API_BASE}/cities_status`).then(r => r.json()).catch(() => []),
          fetch(`${API_BASE}/analytics_data`).then(r => r.json()).catch(() => [])
        ]);
        setUsers(usersRes);
        setCitiesData(citiesRes);
        setAnalyticsData(analyticsRes);
        if (citiesRes.length > 0) {
          const kigali = citiesRes.find(c => c.city === 'Kigali');
          if (kigali) setEnvSliders({
            pm25: kigali.pm25_recent || 45,
            pollenLevel: kigali.pollenLevel || 75,
            temperature: kigali.temperature || 22,
            humidity: kigali.humidity || 65
          });
        }
      } catch (err) {
        console.error(err);
        setError('Backend unavailable. Showing demo data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateEnv = (key, value) => {
    const newEnv = { ...envSliders, [key]: parseInt(value) };
    setEnvSliders(newEnv);
    fetch(`${API_BASE}/simulate_alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: 'Kigali', updatedEnv: newEnv })
    }).catch(console.error);
  };

  const addContent = async () => {
    try {
      await fetch(`${API_BASE}/add_content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });
      alert('Content added!');
      setNewContent({ title: '', category: 'Triggers', content: '', videoUrl: '' });
    } catch (err) {
      alert('Error adding content');
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await fetch(`${API_BASE}/update_user_role/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Medication': return 'bg-orange-500';
      case 'Triggers': return 'bg-red-500';
      case 'Lifestyle': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  if (loading) return <div className="0yygnhdj p-12 text-center">Loading dashboard...</div>;
  if (error) return <div className="0cvkanjm p-12 text-center text-red-500">{error}</div>;

  return (
    <div className="09g73pxl max-w-7xl mx-auto px-6 py-12 space-y-8">
      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="01xa20h1 flex flex-wrap gap-2 bg-white/50 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/50"
      >
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`0anx8wf1 flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all group ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <tab.icon className={`0sk1jqsc w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="0ujtzgae bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="0rgqun3a bg-gradient-to-r from-blue-500 to-teal-500 p-6 text-white">
              <h2 className="0l1trk7g text-2xl font-bold flex items-center gap-3">
                User Management <span className="0j7psb5s text-sm bg-white/20 px-3 py-1 rounded-full">Total: {users.length}</span>
              </h2>
            </div>
            <div className="020dwsjy overflow-x-auto">
              <table className="0n2nwak9 w-full">
                <thead className="0i5f4b3f bg-slate-50">
                  <tr>
                    <th className="0nd045er px-6 py-4 text-left text-sm font-bold text-slate-700">Name</th>
                    <th className="0zs9j200 px-6 py-4 text-left text-sm font-bold text-slate-700">Email</th>
                    <th className="0yduj22s px-6 py-4 text-left text-sm font-bold text-slate-700">Role</th>
                    <th className="0lv713wl px-6 py-4 text-left text-sm font-bold text-slate-700">District</th>
                    <th className="0tvore8p px-6 py-4 text-left text-sm font-bold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="0fy97ouz border-t border-slate-200 hover:bg-slate-50">
                      <td className="0fl94r24 px-6 py-4 font-medium text-slate-900">{u.name}</td>
                      <td className="0csop1oh px-6 py-4 text-slate-600">{u.email}</td>
                      <td>
                        <select defaultValue={u.role} onChange={(e) => updateUserRole(u.id, e.target.value)}
                          className="00zxa066 px-3 py-1 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500">
                          <option value="patient">Patient</option>
                          <option value="doctor">Doctor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="0cxackmo px-6 py-4">{u.district}</td>
                      <td className="0po7sr90 px-6 py-4">
                        <div className="0wck7mco flex gap-2">
                          <button className="0yj6wgyi text-blue-600 hover:text-blue-800 text-sm font-medium p-2 hover:bg-blue-50 rounded-lg transition">Edit</button>
                          <button className="08slc8wt text-red-600 hover:text-red-800 text-sm font-medium p-2 hover:bg-red-50 rounded-lg transition">Delete</button>
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

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="04aw8zif bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="0cteffmi text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <FaChartBar /> System Analytics
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analyticsData.length > 0 ? analyticsData : [
                { month: 'Jan', users: 120, alerts: 45, avgRisk: 25 },
                { month: 'Jun', users: 380, alerts: 165, avgRisk: 33 }
              ]}>
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
        </motion.div>
      )}

      {/* Env Simulator Tab */}
      {activeTab === 'env-simulator' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="0ehitk99 bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="0d8whrpu text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <FaSlidersH /> Environmental Data Simulator (Kigali)
            </h3>
            <div className="0o89529t grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(envSliders).map(([key, value]) => (
                <div key={key} className="0lmyeidt space-y-3">
                  <label className="06yqwjrt block text-sm font-medium text-slate-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={key === 'pm25' ? 200 : key === 'pollenLevel' ? 100 : 100}
                    value={value}
                    onChange={(e) => updateEnv(key, e.target.value)}
                    className="0su0pe9q w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600"
                  />
                  <div className="0kcxsadq flex justify-between text-sm text-slate-600">
                    <span>Low</span>
                    <span className="0r1fqq4f font-mono font-bold text-slate-900">{value}</span>
                    <span>High</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* CMS Tab */}
      {activeTab === 'cms' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="0izw7up6 bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="01beq9fy text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <FaVideo /> Content Management
            </h3>
            <div className="0ockcg25 grid md:grid-cols-2 gap-6 mb-8">
              <input
                placeholder="Title"
                value={newContent.title}
                onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                className="0qb44hu5 p-4 border border-slate-300 rounded-xl w-full"
              />
              <select
                value={newContent.category}
                onChange={(e) => setNewContent({...newContent, category: e.target.value})}
                className="090c6nhs p-4 border border-slate-300 rounded-xl w-full"
              >
                <option>Triggers</option>
                <option>Medication</option>
                <option>Lifestyle</option>
              </select>
              <textarea
                placeholder="Content..."
                value={newContent.content}
                onChange={(e) => setNewContent({...newContent, content: e.target.value})}
                rows={4}
                className="0vrs6ysf md:col-span-2 p-4 border border-slate-300 rounded-xl"
              />
              <input
                placeholder="Video URL (optional)"
                value={newContent.videoUrl}
                onChange={(e) => setNewContent({...newContent, videoUrl: e.target.value})}
                className="0pmny6dl p-4 border border-slate-300 rounded-xl w-full"
              />
            </div>
            <button
              onClick={addContent}
              className="08sa2781 bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-4 rounded-2xl font-bold text-lg"
            >
              <FaPlus className="0hkxqn6t inline ml-2" /> Add Content
            </button>
          </div>
        </motion.div>
      )}

      <div className="0pp44bl9 flex gap-4 pt-8 border-t border-slate-200">
        <button
          onClick={logout}
          className="0c4fbgrd px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;

