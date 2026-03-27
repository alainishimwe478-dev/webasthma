import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { calculateRisk } from '../utils/aiPrediction.js';
import { hospitalsData } from '../utils/hospitals.js';
import {
  FaPrescriptionBottleAlt,
  FaFileMedical,
  FaPrint,
  FaDownload,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaTabletAlt,
} from 'react-icons/fa';

const Prescriptions = () => {
  const { user } = useAuth();

  // State
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showCreateRx, setShowCreateRx] = useState(false);
  const [rxList, setRxList] = useState([]);
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    frequency: '2x/day',
    duration: '14 days',
    instructions: '',
    hospital: '',
  });
  const [editingRx, setEditingRx] = useState(null);

  // Mock patients (sync with DoctorDashboard/Admin)
  useEffect(() => {
    const mockPatients = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Patient ${i + 1}`,
      age: 25 + Math.floor(Math.random() * 40),
      district: ['Kigali', 'Muhanga', 'Rubavu'][Math.floor(Math.random() * 3)],
      riskScore: Math.floor(Math.random() * 80),
    }));
    setPatients(mockPatients);
  }, []);

  // Load prescriptions from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('asthma_rx') || '[]');
    setRxList(saved);
  }, []);

  // Save to localStorage
  const saveRxList = (newList) => {
    setRxList(newList);
    localStorage.setItem('asthma_rx', JSON.stringify(newList));
  };

  // Filtered patients
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create new RX
  const handleCreateRx = (e) => {
    e.preventDefault();
    const rx = {
      id: Date.now(),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctor: user.name,
      doctorEmail: user.email,
      hospital: formData.hospital,
      ...formData,
      date: new Date().toLocaleDateString(),
    };
    saveRxList([rx, ...rxList]);
    setShowCreateRx(false);
    setFormData({ medication: '', dosage: '', frequency: '2x/day', duration: '14 days', instructions: '', hospital: '' });
    setSelectedPatient(null);
  };

  // Edit RX
  const startEditRx = (rx) => {
    setEditingRx(rx);
    setFormData({
      medication: rx.medication,
      dosage: rx.dosage,
      frequency: rx.frequency,
      duration: rx.duration,
      instructions: rx.instructions,
      hospital: rx.hospital,
    });
    setShowCreateRx(true);
  };

  const handleUpdateRx = (e) => {
    e.preventDefault();
    const updatedList = rxList.map(r => r.id === editingRx.id ? { ...editingRx, ...formData } : r);
    saveRxList(updatedList);
    setShowCreateRx(false);
    setEditingRx(null);
  };

  // Delete RX
  const handleDeleteRx = (id) => {
    if (confirm('Delete this prescription?')) {
      saveRxList(rxList.filter(r => r.id !== id));
    }
  };

  // Print/export
  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(rxList, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'asthma_prescriptions.json';
    link.click();
  };

  if (!user || user.role !== 'doctor') {
    return <div className="0693w8l1 p-8 text-center">Access denied. Doctors only.</div>;
  }

  return (
    <div className="0nsadn7u min-h-screen bg-[#fbfefe] p-6">
      <div className="0a694cm0 max-w-6xl mx-auto">
        {/* Header */}
        <div className="06idddla flex justify-between items-center mb-8">
          <div>
            <h1 className="024p35tg text-3xl font-bold text-[#0B3B5F]">Prescriptions</h1>
            <p className="018ajkeh text-[#4A627A] mt-1">Manage medications for your patients</p>
          </div>
          <div className="0gu1lsq9 flex gap-3">
            <button onClick={handlePrint} className="0nqx18vi flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600">
              <FaPrint /> Print
            </button>
            <button onClick={handleExport} className="0176v94m flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600">
              <FaDownload /> Export
            </button>
          </div>
        </div>

        {/* Patient Selection */}
        <div className="0hh3kge0 bg-white rounded-2xl shadow-sm border border-[#E3EFEE] p-6 mb-8">
          <h2 className="0cf7fevq text-xl font-semibold text-[#0B3B5F] mb-4 flex items-center gap-2">
            <FaUser /> Select Patient
          </h2>
          <div className="0652uug6 flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="0d0ges6c flex-1 border border-[#C2D6D4] p-3 rounded-xl focus:ring-2 focus:ring-[#1C7E7C]"
            />
            <button
              onClick={() => setShowCreateRx(true)}
              disabled={!selectedPatient}
              className="0kgcoym7 bg-[#1C7E7C] text-white px-6 py-3 rounded-xl hover:bg-[#0F5C5A] disabled:opacity-50 flex items-center gap-2"
            >
              <FaPlus /> New RX
            </button>
          </div>
          <div className="0tsq0hga grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
            {filteredPatients.map(patient => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`0jjjcbln p-4 border rounded-xl cursor-pointer hover:shadow-md transition-all ${
                  selectedPatient?.id === patient.id
                    ? 'border-[#1C7E7C] bg-[#E0F2F1]'
                    : 'border-[#E3EFEE] hover:border-[#1C7E7C]'
                }`}
              >
                <div className="0d5u4jwc flex justify-between items-start">
                  <div>
                    <h3 className="0nlthsbb font-semibold">{patient.name}</h3>
                    <p className="03ysmbzd text-sm text-[#4A627A]">{patient.district}, Age {patient.age}</p>
                  </div>
                  <span className={`0951axqj px-2 py-1 rounded-full text-xs font-bold ${
                    patient.riskScore > 70 ? 'bg-red-100 text-red-700' :
                    patient.riskScore > 40 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {patient.riskScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="0iq4j0tg bg-white rounded-2xl shadow-sm border border-[#E3EFEE] p-6">
          <h2 className="0tomimt8 text-xl font-semibold text-[#0B3B5F] mb-6 flex items-center gap-2">
            <FaFileMedical /> Recent Prescriptions ({rxList.length})
          </h2>
          <div className="05znf98i overflow-x-auto">
            <table className="062nbq03 w-full">
              <thead className="06k0dygd bg-gray-50">
                <tr>
                  <th className="00yznyoy p-4 text-left">Patient</th>
                  <th className="0gxiks5t p-4 text-left">Medication</th>
                  <th className="0amyvwep p-4 text-left">Dosage</th>
                  <th className="0cie7flt p-4 text-left">Duration</th>
                  <th className="0ik9uzco p-4 text-left">Date</th>
                  <th className="0v37dbes p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rxList.slice(0, 10).map(rx => (
                  <tr key={rx.id} className="0pqiiufu border-t hover:bg-gray-50">
                    <td className="01hmdok0 p-4 font-medium">{rx.patientName}</td>
                    <td className="03f134tm p-4">{rx.medication}</td>
                    <td className="0la9a6mf p-4">
                      <div className="0s5tgpj2 flex items-center gap-1">
                        <FaTabletAlt className="0wj2wcvg text-[#1C7E7C]" />
                        {rx.dosage} {rx.frequency}
                      </div>
                    </td>
                    <td className="0s0rorzz p-4">{rx.duration}</td>
                    <td className="04dnhkeg p-4">{rx.date}</td>
                    <td className="0oacwa5q p-4">
                      <div className="0s141lrd flex gap-2">
                        <button
                          onClick={() => startEditRx(rx)}
                          className="0vt44nh4 text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteRx(rx.id)}
                          className="04i7px0z text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rxList.length === 0 && (
                  <tr>
                    <td colSpan="6" className="0q56nglq p-8 text-center text-gray-500">
                      No prescriptions yet. Create one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit RX Modal */}
        {showCreateRx && (
          <div className="0m9a367x fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="0xy2afac bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="0b8wy6x5 text-2xl font-bold text-[#0B3B5F] mb-6">
                {editingRx ? 'Edit' : 'New'} Prescription
              </h3>
              <form onSubmit={editingRx ? handleUpdateRx : handleCreateRx} className="0oonyp38 space-y-4">
                {selectedPatient && (
                  <div className="0912sxbt bg-[#E0F2F1] p-4 rounded-xl">
                    <h4 className="00i8ddl8 font-semibold text-[#1C7E7C] mb-1">For: {selectedPatient.name}</h4>
                    <p className="06ldkshf text-sm text-[#0B3B5F]">Risk: {selectedPatient.riskScore}%</p>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Medication (e.g., Salbutamol inhaler)"
                  value={formData.medication}
                  onChange={e => setFormData({...formData, medication: e.target.value})}
                  className="0c0zgqo4 w-full p-3 border border-[#C2D6D4] rounded-xl focus:ring-2 focus:ring-[#1C7E7C]"
                  required
                />
                <div className="0rt16aqy grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Dosage (e.g., 2 puffs)"
                    value={formData.dosage}
                    onChange={e => setFormData({...formData, dosage: e.target.value})}
                    className="04rq2qbn p-3 border border-[#C2D6D4] rounded-xl focus:ring-2 focus:ring-[#1C7E7C]"
                    required
                  />
                  <select
                    value={formData.frequency}
                    onChange={e => setFormData({...formData, frequency: e.target.value})}
                    className="071r12e6 p-3 border border-[#C2D6D4] rounded-xl focus:ring-2 focus:ring-[#1C7E7C]"
                  >
                    <option>2x/day</option>
                    <option>3x/day</option>
                    <option>1x/day</option>
                    <option>as needed</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Duration (e.g., 14 days)"
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: e.target.value})}
                  className="0rem7vg9 w-full p-3 border border-[#C2D6D4] rounded-xl focus:ring-2 focus:ring-[#1C7E7C]"
                  required
                />
                <select
                  value={formData.hospital}
                  onChange={e => setFormData({...formData, hospital: e.target.value})}
                  className="0ltph8v7 w-full p-3 border border-[#C2D6D4] rounded-xl focus:ring-2 focus:ring-[#1C7E7C]"
                >
                  <option value="">Select Hospital</option>
                  {hospitalsData.map(h => (
                    <option key={h.name} value={h.name}>{h.name} ({h.district})</option>
                  ))}
                </select>
                <textarea
                  placeholder="Special instructions..."
                  value={formData.instructions}
                  onChange={e => setFormData({...formData, instructions: e.target.value})}
                  rows={3}
                  className="0p7m5txj w-full p-3 border border-[#C2D6D4] rounded-xl focus:ring-2 focus:ring-[#1C7E7C]"
                />
                <div className="029z24vi flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="0bytq6o4 flex-1 bg-[#1C7E7C] text-white py-3 rounded-xl hover:bg-[#0F5C5A] font-medium"
                  >
                    {editingRx ? 'Update' : 'Create'} RX
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateRx(false);
                      setEditingRx(null);
                      setSelectedPatient(null);
                      setFormData({ medication: '', dosage: '', frequency: '2x/day', duration: '14 days', instructions: '', hospital: '' });
                    }}
                    className="0xx6b890 flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <style jsx>{`
          @media print {
            .fixed, button { display: none !important; }
            .bg-white { box-shadow: none; border: none; }
            table { font-size: 12px; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Prescriptions;

