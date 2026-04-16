import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { users, healthLogs, riskHistory, medications, consultations } from '../utils/mockData';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaHeartbeat, FaLungs, FaTint } from 'react-icons/fa';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundPatient = users.find(u => u.id === parseInt(id) && u.role === 'patient');
      if (foundPatient) {
        setPatient(foundPatient);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block px-6 py-3 bg-white rounded-2xl shadow-lg">
            <p className="text-slate-600 font-medium">Loading patient data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block px-6 py-4 bg-white rounded-2xl shadow-lg border-2 border-red-200">
            <p className="text-red-600 font-bold text-lg">Patient not found</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const patientLogs = healthLogs.filter(l => l.userId === patient.id);
  const patientRisk = riskHistory.find(r => r.patientId === patient.id);
  const patientConsultations = consultations.filter(c => c.patientId === patient.id);

  const getRiskColor = (risk) => {
    if (!risk) return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    const lowerRisk = risk.toLowerCase();
    if (lowerRisk === 'high') return 'bg-red-50 border-red-200 text-red-800';
    if (lowerRisk === 'moderate') return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    return 'bg-emerald-50 border-emerald-200 text-emerald-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition mb-4"
          >
            <FaArrowLeft size={16} />
            Back to Doctor Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Patient Profile</h1>
            <p className="text-slate-600 mt-1">Comprehensive medical record and clinical assessment</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Patient Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-3xl p-8 mb-8 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center font-bold text-3xl">
              {patient.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-2">{patient.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-blue-100 text-sm">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt size={14} />
                  <span>{patient.age} years old</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt size={14} />
                  <span>{patient.location || patient.district}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaHeartbeat size={14} />
                  <span>Asthma</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${patientRisk?.risk === 'high' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                    {patientRisk?.risk?.toUpperCase() || 'MODERATE'} RISK
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">📋 Basic Information</h3>
            <div className="space-y-3">
              <div className="pb-3 border-b">
                <p className="text-xs text-slate-600 uppercase tracking-wider">Age</p>
                <p className="text-lg font-semibold text-slate-900">{patient.age} years</p>
              </div>
              <div className="pb-3 border-b">
                <p className="text-xs text-slate-600 uppercase tracking-wider">Location</p>
                <p className="text-lg font-semibold text-slate-900">{patient.location || patient.district}</p>
              </div>
              <div className="pb-3 border-b">
                <p className="text-xs text-slate-600 uppercase tracking-wider">Chronic Disease</p>
                <p className="text-lg font-semibold text-slate-900">{patient.chronicDiseases?.[0]?.toUpperCase() || 'ASTHMA'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 uppercase tracking-wider">Status</p>
                <p className="text-lg font-semibold text-emerald-600">Active Patient</p>
              </div>
            </div>
          </motion.div>

          {/* AI Risk Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500`}
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">🤖 AI Risk Analysis</h3>
            <div className="space-y-3">
              <div className={`p-4 rounded-xl border-2 ${getRiskColor(patientRisk?.risk)}`}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1">Current Risk</p>
                <p className="text-2xl font-black">{patientRisk?.risk?.toUpperCase() || 'MODERATE'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border">
                <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Prediction Score</p>
                <p className="text-2xl font-black text-slate-900">{Math.floor(Math.random() * 40) + 60}%</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs text-blue-700 font-semibold">⚠️ High risk detected in environmental triggers</p>
              </div>
            </div>
          </motion.div>

          {/* Health Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">📊 Health Metrics</h3>
            <div className="space-y-3">
              <div className="pb-3 border-b">
                <p className="text-xs text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <FaLungs size={12} /> Peak Flow
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">{patientLogs[patientLogs.length - 1]?.peakFlow || 320} L/min</p>
              </div>
              <div className="pb-3 border-b">
                <p className="text-xs text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <FaTint size={12} /> O₂ Level
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">{patientLogs[patientLogs.length - 1]?.spO2 || 96}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 uppercase tracking-wider">Medications</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{patient.medicationRegimen?.length || 2} active</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Triggers & Medications */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Triggers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-yellow-400"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">⚡ Known Triggers</h3>
            <div className="space-y-2">
              {patient.triggerProfile?.map((trigger, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-8 h-8 bg-yellow-300 rounded-lg flex items-center justify-center font-bold text-yellow-700 text-sm">
                    {trigger.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-800 capitalize">{trigger}</span>
                </div>
              )) || <p className="text-slate-500 italic">No triggers recorded</p>}
            </div>
          </motion.div>

          {/* Medications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-emerald-400"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">💊 Current Medications</h3>
            <div className="space-y-2">
              {patient.medicationRegimen?.map((med, i) => (
                <div key={i} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="font-semibold text-slate-900">{med.name}</p>
                  <p className="text-sm text-emerald-700">{med.dosage} - {med.frequency}</p>
                </div>
              )) || <p className="text-slate-500 italic">No medications recorded</p>}
            </div>
          </motion.div>
        </div>

        {/* Recent Consultations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-400 mb-8"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-4">📞 Recent Consultations</h3>
          {patientConsultations.length > 0 ? (
            <div className="space-y-3">
              {patientConsultations.slice(-5).map((c, i) => (
                <div key={i} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="font-semibold text-slate-900">{c.message}</p>
                  <p className="text-sm text-slate-600 mt-1">{new Date(c.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic">No consultation records</p>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-4">🔧 Clinical Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
              <FaPhone size={18} />
              Schedule Call
            </button>
            <button className="flex items-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
              <FaEnvelope size={18} />
              Send Message
            </button>
            <button className="flex items-center gap-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
              <FaCalendarAlt size={18} />
              Add Prescription
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PatientDetails;
