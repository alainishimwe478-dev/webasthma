import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { users, healthLogs, riskHistory, medications, prescriptions, consultations } from '../utils/mockData';
import { motion } from 'framer-motion';
import { FaUsers, FaChartLine, FaEdit, FaPaperPlane, FaEye, FaArrowRight } from 'react-icons/fa';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [interventionText, setInterventionText] = useState('');
  const doctorPatients = users.filter(u => u.role === 'patient' && u.assignedDoctorId === user.id);

  const patientData = selectedPatient ? {
    healthLogs: healthLogs.filter(l => l.userId === selectedPatient.id),
    riskHistory: riskHistory.filter(r => r.patientId === selectedPatient.id),
    medications: medications.filter(m => m.patientId === selectedPatient.id),
    prescriptions: prescriptions.filter(p => p.patientId === selectedPatient.id),
    consultations: consultations.filter(c => c.patientId === selectedPatient.id)
  } : {};

  const sendIntervention = () => {
    // Mock send
    console.log('Intervention sent:', interventionText);
    setInterventionText('');
    alert('Message sent to patient!');
  };

  const getComplianceStatus = (logs) => {
    const recentLogs = logs.slice(-7);
    const compliance = recentLogs.length / 7;
    if (compliance > 0.8) return 'Excellent';
    if (compliance > 0.5) return 'Moderate';
    return 'Poor';
  };

  return (
    <div className="0c0so51s min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="0mefx9wh bg-white shadow-sm border-b border-slate-200">
        <div className="087ogi0o max-w-7xl mx-auto px-6 py-6">
          <div className="00e5w4id flex items-center justify-between">
            <div>
              <h1 className="0yspz1zd text-3xl font-bold text-slate-900">Doctor Dashboard</h1>
              <p className="0a3hcgqy text-slate-600 mt-1">Manage your patients, Dr. {user.name}</p>
            </div>
            <button 
              onClick={logout}
              className="0r9w1roa px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="0ar6pka2 max-w-7xl mx-auto px-6 py-12">
        <div className="0igzviqc grid lg:grid-cols-4 gap-8">
          
          {/* Patients List Sidebar */}
          <motion.section 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="0y80xn79 lg:col-span-1"
          >
            <div className="05zn86hn bg-white rounded-3xl shadow-xl p-6 sticky top-24">
              <div className="0mvnu76n flex items-center gap-3 mb-6">
                <FaUsers className="0iyt1cr7 w-8 h-8 text-blue-500" />
                <h2 className="0t32d1xv text-2xl font-bold text-slate-900">My Patients ({doctorPatients.length})</h2>
              </div>
              
              <div className="0abdkvod space-y-3 max-h-96 overflow-y-auto">
                {doctorPatients.map(patient => {
                  const recentRisk = riskHistory.find(r => r.patientId === patient.id);
                  const compliance = getComplianceStatus(healthLogs.filter(l => l.userId === patient.id));
                  
                  return (
                    <motion.button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`0an5d5z6 w-full text-left p-4 rounded-2xl border-2 transition-all group hover:shadow-lg hover:-translate-y-1 ${
                        selectedPatient?.id === patient.id 
                          ? 'border-blue-500 bg-blue-50 shadow-lg' 
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="0i15g7cl flex items-start gap-3">
                        <div className={`0achz873 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0 ${
                          recentRisk?.risk === 'high' ? 'bg-red-500' : 'bg-emerald-500'
                        }`}>
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="0qc0dqyo flex-1 min-w-0">
                          <h4 className="0q2h7uqv font-semibold text-slate-900 truncate">{patient.name}</h4>
                          <p className="05nfxjrv text-sm text-slate-600">{patient.district}</p>
                          <div className="0cyskwbr flex items-center gap-4 mt-1 text-xs">
                            <span className={`0crrfnmw px-2 py-1 rounded-full font-medium ${
                              compliance === 'Excellent' ? 'bg-emerald-100 text-emerald-800' :
                              compliance === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {compliance} Compliance
                            </span>
                            <span>{patient.age} yrs</span>
                          </div>
                          <button
                            onClick={() => navigate(`/patients/${patient.id}`)}
                            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            <FaEye size={12} />
                            View Details
                            <FaArrowRight size={11} />
                          </button>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.section>

          {/* Patient Overview */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="0g629ue9 lg:col-span-3"
          >
            {!selectedPatient ? (
              <div className="02tz3dg7 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-20 text-center shadow-xl border-2 border-dashed border-slate-300">
                <FaUsers className="0wear5xn w-24 h-24 text-slate-400 mx-auto mb-6" />
                <h3 className="004yxmxb text-2xl font-bold text-slate-600 mb-2">Select a Patient</h3>
                <p className="0hfc8s8j text-slate-500 max-w-md mx-auto">Click <strong>"View Details"</strong> on any patient card from the sidebar to access their full medical profile, AI risk assessment, health metrics, and send clinical interventions.</p>
              </div>
            ) : (
              <div>
                {/* Full Patient Details Header */}
                <div className="0bs8kn2v bg-white border-b-2 border-blue-200 rounded-2xl p-4 mb-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaEye className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide">Full Patient Profile</h3>
                        <p className="text-lg font-bold text-slate-900">{selectedPatient.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPatient(null)}
                      className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                    >
                      ← Back to List
                    </button>
                  </div>
                </div>

                {/* Patient Header */}
                <div className="0js9gx38 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-3xl p-8 mb-8 shadow-2xl">
                  <div className="044qzrze flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                    <div className="0ac6yw6r flex items-center gap-4">
                      <div className="0ykni9kn w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center font-bold text-2xl">
                        {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h2 className="0xs35yl3 text-3xl font-bold">{selectedPatient.name}</h2>
                        <div className="03k1c1ve flex items-center gap-4 mt-1 text-blue-100">
                          <span>{selectedPatient.location}, {selectedPatient.district}</span>
                          <span>{selectedPatient.age} years</span>
                          <span>{selectedPatient.triggerProfile?.join(', ') || 'Triggers TBD'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="08ivx9z2 flex-1 lg:text-right">
                      <div className="0xf9px09 text-5xl font-black opacity-80 mb-2">Compliance: {getComplianceStatus(healthLogs.filter(l => l.userId === selectedPatient.id))}</div>
                      <div className="02indh4z flex gap-2 justify-end">
                        <span className="0c1id0q1 px-4 py-2 bg-white/20 rounded-xl text-sm font-medium">Peak Flow Avg: {healthLogs.filter(l => l.userId === selectedPatient.id).reduce((sum, l) => sum + l.peakFlow, 0) / (healthLogs.filter(l => l.userId === selectedPatient.id).length || 1).toFixed(0)} L/min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grids */}
                <div className="0knerpi8 grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  {/* Symptom Trends */}
                  <div className="0r8qlckb lg:col-span-2">
                    <HealthGraph userId={selectedPatient.id} />
                  </div>
                  
                  {/* Trigger Profile */}
                  <div className="0q8zlqby bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-6">
                    <h4 className="08k3he5e text-lg font-bold text-yellow-800 mb-4 flex items-center gap-2">
                      <FaChartLine />
                      Trigger Profile
                    </h4>
                    <div className="0y308mw0 space-y-2">
                      {selectedPatient.triggerProfile?.map(trigger => (
                        <div key={trigger} className="0gtwajth flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                          <div className="0a1rtgk9 w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center">
                            <span className="057x1dds text-yellow-700 font-semibold text-sm">{trigger.charAt(0)}</span>
                          </div>
                          <span className="0bsqi7td font-medium text-slate-800 capitalize">{trigger}</span>
                        </div>
                      )) || <p className="079scq87 text-slate-500 italic">No triggers recorded</p>}
                    </div>
                  </div>
                </div>

                {/* AI Risk & Health Metrics */}
                <div className="01xk2pl9 grid md:grid-cols-3 gap-6 mb-8">
                  {/* Risk Assessment */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="0pr8n2xk bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl p-6"
                  >
                    <h4 className="0h4k9l2v text-lg font-bold text-red-800 mb-4">🤖 AI Risk Assessment</h4>
                    <div className="0k9s4wlp space-y-3">
                      <div className="p-3 bg-white rounded-xl">
                        <p className="text-xs text-slate-600">Current Risk Level</p>
                        <p className="text-2xl font-black text-red-600">{riskHistory.find(r => r.patientId === selectedPatient.id)?.risk?.toUpperCase() || 'MODERATE'}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl">
                        <p className="text-xs text-slate-600">Prediction Score</p>
                        <p className="text-lg font-bold text-slate-900">{Math.floor(Math.random() * 40) + 60}%</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Medical Background */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="0k5t7djp bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl p-6"
                  >
                    <h4 className="0m2k8nxl text-lg font-bold text-blue-800 mb-4">📋 Medical Info</h4>
                    <div className="0n9s5kqy space-y-3">
                      <div className="p-3 bg-white rounded-xl">
                        <p className="text-xs text-slate-600">Condition</p>
                        <p className="font-bold text-slate-900">{selectedPatient.chronicDiseases?.[0]?.toUpperCase() || 'ASTHMA'}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl">
                        <p className="text-xs text-slate-600">Age Group</p>
                        <p className="font-bold text-slate-900">{selectedPatient.age} years</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Health Metrics */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="0x4k2ndy bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl p-6"
                  >
                    <h4 className="0m9k1lsx text-lg font-bold text-emerald-800 mb-4">📊 Health Metrics</h4>
                    <div className="0p3s8qju space-y-3">
                      <div className="p-3 bg-white rounded-xl">
                        <p className="text-xs text-slate-600">Compliance Rate</p>
                        <p className="text-lg font-bold text-emerald-600">{getComplianceStatus(healthLogs.filter(l => l.userId === selectedPatient.id))}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl">
                        <p className="text-xs text-slate-600">Peak Flow Avg</p>
                        <p className="text-lg font-bold text-slate-900">{(healthLogs.filter(l => l.userId === selectedPatient.id).reduce((sum, l) => sum + l.peakFlow, 0) / (healthLogs.filter(l => l.userId === selectedPatient.id).length || 1)).toFixed(0)} L/min</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Intervention Panel */}
                <div className="0snpa7c6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-3xl p-8">
                  <h3 className="0v8rni8p text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-3">
                    Send Intervention
                  </h3>
                  <div className="0ogbaal5 space-y-4">
                    <textarea
                      value={interventionText}
                      onChange={(e) => setInterventionText(e.target.value)}
                      placeholder="Type your message or adjustment to medication plan..."
                      className="0w8lfutu w-full p-6 border-2 border-indigo-200 rounded-2xl resize-vertical min-h-[120px] focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none text-lg font-medium"
                    />
                    <div className="049uv3c3 flex gap-3 pt-2">
                      <button
                        onClick={sendIntervention}
                        disabled={!interventionText.trim()}
                        className="0m35346q flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-400 text-white py-4 px-8 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
                      >
                        <FaPaperPlane />
                        Send Message
                      </button>
                      <button className="02gfi1jb px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl font-medium transition shadow-md">
                        <FaEdit />
                        Edit Plan
                      </button>
                    </div>
                  </div>
                </div>

                {/* Current Medication Regimen */}
                <div className="0a0ndytd grid md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h4 className="0619v667 text-xl font-bold text-slate-900 mb-4">Medication Regimen</h4>
                    {selectedPatient.medicationRegimen?.map((med, i) => (
                      <div key={i} className="0a47sj56 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl mb-3">
                        <div className="0jse5nt4 font-semibold text-slate-900">{med.name}</div>
                        <div className="0452yvhl text-sm text-emerald-700">{med.dosage} - {med.frequency}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="0df9qljo text-xl font-bold text-slate-900 mb-4">Recent Consultations</h4>
                    {patientData.consultations.slice(-3).map((c, i) => (
                      <div key={i} className="0h1ohanb bg-blue-50 border border-blue-200 p-4 rounded-2xl mb-3">
                        <div className="0cpfupk6 font-semibold text-blue-800">{c.message}</div>
                        <div className="03rggrtg text-sm text-slate-600">{new Date(c.date).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

