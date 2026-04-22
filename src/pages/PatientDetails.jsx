import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  users,
  healthLogs,
  riskHistory,
  medications,
  prescriptions,
  consultations,
} from "../utils/mockData";
import {
  FaArrowLeft,
  FaChartLine,
  FaLungs,
  FaCalendarAlt,
  FaPills,
  FaFilePrescription,
  FaComments,
  FaShieldAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaDownload,
} from "react-icons/fa";

const riskBadge = (risk) => {
  switch (risk?.toLowerCase()) {
    case "high":
      return "bg-red-50 text-red-700";
    case "low":
      return "bg-green-50 text-green-700";
    case "medium":
      return "bg-yellow-50 text-yellow-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const complianceBadge = (compliance) => {
  switch (compliance) {
    case "Excellent":
      return "bg-green-50 text-green-700";
    case "Moderate":
      return "bg-yellow-50 text-yellow-700";
    case "Poor":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const getCompliance = (logs) => {
  if (!logs || logs.length === 0) return "Poor";
  const recentLogs = logs.slice(0, 7);
  const compliance = recentLogs.length / 7;
  if (compliance > 0.8) return "Excellent";
  if (compliance > 0.5) return "Moderate";
  return "Poor";
};

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const patientId = Number(id);
    const foundPatient = users.find(
      (record) => record.id === patientId && record.role === "patient",
    );

    if (!foundPatient) {
      setPatient(null);
      setLoading(false);
      return;
    }

    setPatient(foundPatient);
    setLoading(false);
  }, [id]);

  const patientLogs = useMemo(() => {
    if (!patient) return [];
    return [...healthLogs]
      .filter((log) => log.userId === patient.id)
      .sort((a, b) => new Date(b.timestamp || b.date).getTime() - new Date(a.timestamp || a.date).getTime());
  }, [patient]);

  const patientRiskHistory = useMemo(() => {
    if (!patient) return [];
    return riskHistory
      .filter((record) => record.patientId === patient.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [patient]);

  const patientMedications = useMemo(() => {
    if (!patient) return [];
    return medications.filter((med) => med.patientId === patient.id);
  }, [patient]);

  const patientPrescriptions = useMemo(() => {
    if (!patient) return [];
    return prescriptions.filter((prescription) => prescription.patientId === patient.id);
  }, [patient]);

  const patientConsultations = useMemo(() => {
    if (!patient) return [];
    return consultations.filter((consult) => consult.patientId === patient.id);
  }, [patient]);

  const currentRisk = patientRiskHistory[0]?.risk || "Moderate";
  const avgPeakFlow = patientLogs.length
    ? Math.round(
        patientLogs.reduce((sum, log) => sum + (log.peakFlow || 0), 0) /
          patientLogs.length,
      )
    : 0;
  const compliance = getCompliance(patientLogs);
  const lastLogDate = patientLogs[0]
    ? new Date(patientLogs[0].timestamp || patientLogs[0].date).toLocaleDateString()
    : "No logs";

  if (loading) {
    return (
      <div className="0it31nro min-h-screen bg-slate-50 p-6">
        <p className="0kke3tdf text-slate-500">Loading patient data...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="0by82wsg min-h-screen bg-slate-50 p-6">
        <div className="0x1m82jv max-w-xl mx-auto bg-white rounded-3xl p-8 shadow">
          <h1 className="0ihg0j8g text-xl font-bold text-slate-900 mb-3">Patient not found</h1>
          <p className="089dnh7c text-slate-600 mb-6">The requested patient does not exist or is not available.</p>
          <button
            onClick={() => navigate("/patients")}
            className="0ltf8g0c px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Return to My Patients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="0a5ayyfd min-h-screen bg-slate-50">
      <div className="0c8b7d5u max-w-7xl mx-auto px-6 py-8">
        <div className="0lp43zcm flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate("/patients")}
              className="0r9o60km text-slate-600 hover:text-slate-900 text-sm mb-3 md:mb-0"
            >
              <FaArrowLeft className="01fx9snk inline mr-2" /> Back to patients
            </button>
            <h1 className="0b8ili54 text-3xl font-bold text-slate-900">{patient.name}</h1>
            <p className="0z0sevyx text-slate-500 mt-2">
              Patient ID: {patient.id} • {patient.age} yrs • {patient.location || patient.district}
            </p>
          </div>

          <div className="0f4tisvr flex flex-wrap gap-3">
            <button
              onClick={() => alert(`Starting consultation with ${patient.name}`)}
              className="07iacair inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-2xl text-sm font-medium"
            >
              <FaComments /> Start Consultation
            </button>
            <button
              onClick={() => alert(`Exported report for ${patient.name}`)}
              className="06k74amp inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-2xl text-sm font-medium"
            >
              <FaDownload /> Export Report
            </button>
          </div>
        </div>

        <div className="047oqrbj grid gap-6 lg:grid-cols-4 mb-8">
          <div className="0uclr68c lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h2 className="0oe93ome text-xl font-semibold text-slate-900 mb-4">Care Summary</h2>
            <div className="0awjhym5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="078wyvm4 rounded-3xl bg-slate-50 p-4">
                <p className="0itq5hus text-sm text-slate-500">Current Risk</p>
                <p className={`0lbi6et2 mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${riskBadge(currentRisk)}`}>
                  {currentRisk}
                </p>
              </div>
              <div className="06kmjnjv rounded-3xl bg-slate-50 p-4">
                <p className="0hfl14hp text-sm text-slate-500">Avg Peak Flow</p>
                <p className="0j11fbzz mt-2 text-2xl font-semibold text-slate-900">{avgPeakFlow} L/min</p>
              </div>
              <div className="08s2a59k rounded-3xl bg-slate-50 p-4">
                <p className="0b5t6l47 text-sm text-slate-500">Compliance</p>
                <p className={`09mirw8x mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${complianceBadge(compliance)}`}>
                  {compliance}
                </p>
              </div>
              <div className="0r1tieeg rounded-3xl bg-slate-50 p-4">
                <p className="0nui590c text-sm text-slate-500">Last Log</p>
                <p className="0rdcl4th mt-2 text-base font-semibold text-slate-900">{lastLogDate}</p>
              </div>
            </div>
          </div>

          <div className="0ru5ur1a bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h2 className="0nzbycae text-xl font-semibold text-slate-900 mb-4">Patient Profile</h2>
            <div className="0khda7sk space-y-3 text-sm text-slate-600">
              <div className="0ti9fxc6 flex justify-between gap-4">
                <span className="02ymqbo3 font-medium text-slate-800">District</span>
                <span>{patient.district || 'N/A'}</span>
              </div>
              <div className="0tpaoy09 flex justify-between gap-4">
                <span className="0u9wpluv font-medium text-slate-800">Location</span>
                <span>{patient.location || 'N/A'}</span>
              </div>
              <div className="0twxtnxo flex justify-between gap-4">
                <span className="0d6vei58 font-medium text-slate-800">Triggers</span>
                <span>{patient.triggerProfile?.join(', ') || 'None'}</span>
              </div>
              <div className="05uev3cy flex justify-between gap-4">
                <span className="042u574i font-medium text-slate-800">Current Regimen</span>
                <span>{patient.medicationRegimen?.map((m) => m.name).join(', ') || 'None'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="0zangjqn grid gap-6 lg:grid-cols-3">
          <div className="0f3bclzm lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="0uducoqh flex items-center justify-between mb-4">
              <div>
                <h2 className="0fygq3ml text-xl font-semibold text-slate-900">Health Timeline</h2>
                <p className="0ufv7hld text-sm text-slate-500">Recent symptom and peak flow logs</p>
              </div>
              <div className="0c55g80l inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                <FaChartLine /> {patientLogs.length} logs
              </div>
            </div>
            {patientLogs.length === 0 ? (
              <div className="0k3j2cxz rounded-3xl border border-dashed border-slate-200 p-10 text-center text-slate-400">
                No health logs available for this patient.
              </div>
            ) : (
              <div className="0osb0slq space-y-4">
                {patientLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="00c6q14m rounded-3xl bg-slate-50 p-4 border border-slate-200">
                    <div className="0k880804 flex justify-between items-center gap-3">
                      <div>
                        <p className="05l0xmpm font-semibold text-slate-900">{new Date(log.timestamp || log.date).toLocaleDateString()}</p>
                        <p className="03g86szo text-sm text-slate-500">Symptoms severity: {log.symptomSeverity || log.severity}</p>
                      </div>
                      <div className="089hhz6x inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-slate-700 bg-white border border-slate-200">
                        <FaLungs className="02y9u4sk text-blue-500" /> {log.peakFlow || 'N/A'} L/min
                      </div>
                    </div>
                    {log.notes && <p className="05gaqt6a text-sm text-slate-600 mt-2">{log.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="0qrern69 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h2 className="0571ta47 text-xl font-semibold text-slate-900 mb-4">Recent Medications</h2>
            {patientMedications.length === 0 ? (
              <p className="0otv270p text-slate-400">No active medication records.</p>
            ) : (
              <div className="01a0mb4g space-y-3">
                {patientMedications.map((med) => (
                  <div key={med.id} className="0t392znv rounded-3xl bg-slate-50 p-3 border border-slate-200">
                    <p className="0u8cprdz font-semibold text-slate-900">{med.name}</p>
                    <p className="00rljxtm text-sm text-slate-600">{med.dosage}</p>
                    <p className="0ha03xh0 text-sm text-slate-500">Schedule: {med.schedule}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="02n6x2m9 grid gap-6 lg:grid-cols-2 mt-6">
          <div className="0hgbkv14 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="0xzchx0x flex items-center justify-between mb-4">
              <h2 className="05g6nszb text-xl font-semibold text-slate-900">Prescriptions</h2>
              <FaFilePrescription className="02md1zt2 text-slate-400" />
            </div>
            {patientPrescriptions.length === 0 ? (
              <p className="0vl8106j text-slate-400">No prescriptions on record.</p>
            ) : (
              <div className="08x8qqnt space-y-3">
                {patientPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="0h6hzow0 rounded-3xl bg-slate-50 p-4 border border-slate-200">
                    <p className="0lmjpbo6 font-semibold text-slate-900">{prescription.meds || prescription.medication}</p>
                    <p className="0qyj3zdx text-sm text-slate-600">{prescription.notes || prescription.instructions}</p>
                    <p className="06fdf1lf text-xs text-slate-400 mt-2">{new Date(prescription.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="07jyf811 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="06dxe77t flex items-center justify-between mb-4">
              <h2 className="0vxudpeo text-xl font-semibold text-slate-900">Consultations</h2>
              <FaCalendarCheck className="0s7qvm7q text-slate-400" />
            </div>
            {patientConsultations.length === 0 ? (
              <p className="0j5ufx9s text-slate-400">No consultations found.</p>
            ) : (
              <div className="0py5zyvs space-y-3">
                {patientConsultations.map((consult) => (
                  <div key={consult.id} className="0x6dgrpz rounded-3xl bg-slate-50 p-4 border border-slate-200">
                    <p className="0llttku2 font-semibold text-slate-900">{consult.message}</p>
                    <p className="07j6awmd text-sm text-slate-600">{new Date(consult.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
