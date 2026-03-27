import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { calculateRisk } from '../utils/aiPrediction.js';
import { useNotification } from '../context/NotificationContext'; // Assuming context exists
import {
  FaTabletAlt,
  FaPrescriptionBottleAlt,
  FaCalendarCheck,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';

const MyMedications = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();

  // State
  const [rxList, setRxList] = useState([]);
  const [adherenceData, setAdherenceData] = useState({});
  const [editingMed, setEditingMed] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    taken: false,
    notes: '',
    nextDose: '',
  });

  // Load from localStorage (shared with Prescriptions)
  useEffect(() => {
    const savedRx = JSON.parse(localStorage.getItem('asthma_rx') || '[]');
    // Filter patient's RX
    const patientRx = savedRx.filter(rx => {
      // Mock: match by name pattern or add patientId logic
      return rx.patientName.includes('Patient') || true; // Filter for demo
    });
    setRxList(patientRx);

    // Mock adherence (taken today?)
    const adherence = {};
    patientRx.forEach(rx => {
      adherence[rx.id] = {
        takenToday: Math.random() > 0.3, // 70% adherence
        streak: Math.floor(Math.random() * 7) + 1,
        notes: 'Taken as prescribed',
      };
    });
    setAdherenceData(adherence);
  }, []);

  // Adherence reminder check
  useEffect(() => {
    const now = new Date().getHours();
    if (now === 8 || now === 20) { // Morning/evening doses
      const lowAdherence = Object.values(adherenceData).some(a => !a.takenToday);
      if (lowAdherence) {
        addNotification('⏰ Time for medication! Check your prescriptions.', 'warning');
      }
    }
  }, []);

  // Toggle taken
  const toggleTaken = (rxId) => {
    const updated = { ...adherenceData };
    updated[rxId].takenToday = !updated[rxId].takenToday;
    setAdherenceData(updated);
    addNotification(updated[rxId].takenToday ? '✅ Logged medication' : '❌ Mark as missed?', 'info');
  };

  // Edit adherence
  const handleEdit = (rxId) => {
    const data = adherenceData[rxId];
    setEditingMed({ id: rxId, ...data });
    setFormData({ taken: data.takenToday, notes: data.notes, nextDose: '' });
    setShowEdit(true);
  };

  const saveEdit = () => {
    const updated = { ...adherenceData, [editingMed.id]: { ...formData } };
    setAdherenceData(updated);
    setShowEdit(false);
    setEditingMed(null);
    addNotification('📝 Adherence updated', 'success');
  };

  if (!user) return <div>Loading...</div>;

  const overallAdherence = Object.values(adherenceData).filter(a => a.takenToday).length / Math.max(rxList.length, 1) * 100;

  return (
    <div className="0yr9nkoe min-h-screen bg-[#fbfefe] p-6">
      <div className="0av6ajot max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="0o4vf75i text-center">
          <h1 className="06r0tii1 text-3xl font-bold text-[#0B3B5F] mb-2">My Medications</h1>
          <p className="06tegczr text-[#4A627A]">Track adherence and prescriptions</p>
        </div>

        {/* Adherence Summary */}
        <div className="0tc6xlg5 bg-white rounded-2xl shadow-sm border border-[#E3EFEE] p-8 text-center">
          <FaCalendarCheck className="0swsd3ps text-4xl text-[#1C7E7C] mx-auto mb-4" />
          <div className="0d27jfyl grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="0jovg941 text-3xl font-bold text-[#1C7E7C]">{overallAdherence.toFixed(0)}%</p>
              <p className="05c2i0wl text-[#4A627A]">Today Adherence</p>
            </div>
            <div>
              <p className="0qrl87dl text-2xl font-bold">{rxList.length}</p>
              <p className="00b0eat1 text-[#4A627A]">Active RX</p>
            </div>
            <div>
              <p className="09f6z39d text-xl">{user.district}</p>
              <p className="0kbdqtnm text-xs text-[#8DA1B5]">Local Pharmacy</p>
            </div>
          </div>
          {overallAdherence < 80 && (
            <div className="0kwet5ei bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-center gap-3">
              <FaExclamationTriangle className="0ckjox4n text-yellow-500" />
              <span>Low adherence detected. Good adherence reduces risk by 40%.</span>
            </div>
          )}
        </div>

        {/* Medication List */}
        <div className="0prxaa5t bg-white rounded-2xl shadow-sm border border-[#E3EFEE] p-6">
          <h2 className="0y55v948 text-xl font-semibold text-[#0B3B5F] mb-6">Today's Medications</h2>
          <div className="0oe53l4a space-y-4">
            {rxList.map(rx => {
              const adh = adherenceData[rx.id] || { takenToday: false };
              return (
                <div key={rx.id} className="0eepyvzm border rounded-xl p-6 hover:shadow-md transition-all">
                  <div className="0blz7kc2 flex justify-between items-start mb-4">
                    <div>
                      <h3 className="07xudow8 font-bold text-[#0B3B5F] text-lg">{rx.medication}</h3>
                      <p className="078sltgf text-[#4A627A]">
                        {rx.dosage} • {rx.frequency} • {rx.duration} • {rx.hospital}
                      </p>
                      {rx.instructions && (
                        <p className="0f972i9d text-sm mt-1">📝 {rx.instructions}</p>
                      )}
                    </div>
                    <div className="0vlkfpog text-right">
                      <button
                        onClick={() => toggleTaken(rx.id)}
                        className={`0g02v6bi p-3 rounded-full text-white font-bold text-lg transition-all ${
                          adh.takenToday
                            ? 'bg-green-500 hover:bg-green-600 shadow-lg'
                            : 'bg-gray-300 hover:bg-green-400 shadow-md'
                        }`}
                      >
                        {adh.takenToday ? <FaCheckCircle /> : <FaClock />}
                      </button>
                    </div>
                  </div>
                  <div className="0c6piwx1 flex items-center gap-4 text-sm text-[#8DA1B5] pt-2">
                    <span>Streak: {adh.streak} days</span>
                    <button
                      onClick={() => handleEdit(rx.id)}
                      className="0a89oi1m text-[#1C7E7C] hover:text-[#0F5C5A] flex items-center gap-1"
                    >
                      <FaEdit /> Notes
                    </button>
                    {adh.takenToday && (
                      <span className="0a4mddyp bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        ✅ Taken
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {rxList.length === 0 && (
              <div className="05axim7c text-center py-12 text-[#8DA1B5]">
                <FaTabletAlt className="0c87lsh0 text-5xl mx-auto mb-4 opacity-50" />
                <p>No active prescriptions. Check with your doctor.</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {showEdit && editingMed && (
          <div className="08cci3n8 fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="06gskhyf bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="0xvn7hi0 text-lg font-bold mb-4">Update {editingMed.notes ? 'Notes' : 'Status'}</h3>
              <div className="03ambagd space-y-4">
                <label className="0zutwf7p flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.taken}
                    onChange={e => setFormData({ ...formData, taken: e.target.checked })}
                    className="02ghp97l w-5 h-5 text-[#1C7E7C]"
                  />
                  <span>Taken today</span>
                </label>
                <textarea
                  placeholder="Notes..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="085f82yy w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#1C7E7C]"
                />
                <div className="0f90osi9 flex gap-3 pt-2">
                  <button
                    onClick={saveEdit}
                    className="00ymddg2 flex-1 bg-[#1C7E7C] text-white py-2 rounded-xl hover:bg-[#0F5C5A]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowEdit(false)}
                    className="0078judi flex-1 bg-gray-200 py-2 rounded-xl hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risk Integration Demo */}
        <div className="0wd18iab bg-white rounded-2xl shadow-sm border border-[#E3EFEE] p-6">
          <h3 className="0fko52mk text-lg font-semibold mb-4">AI Risk w/ Adherence</h3>
          <p className="02afi6mk text-sm text-[#4A627A]">
            Adherence {overallAdherence.toFixed(0)}% → Risk adjustment: {
              overallAdherence > 90 ? 'Low (-20%)' :
              overallAdherence > 70 ? 'Medium (-10%)' : 'High (no adjustment)'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyMedications;

