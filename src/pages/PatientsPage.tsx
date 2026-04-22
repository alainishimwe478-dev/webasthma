// PatientsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { users, healthLogs, riskHistory } from '../utils/mockData';
import { FaSearch, FaEye, FaVideo, FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';

const PatientsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // CHATBOT STATE
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Hello 👋 I am your AI asthma assistant. How can I help?' }
  ]);

  const doctorPatients = users.filter(
    u => u.role === 'patient' && u.assignedDoctorId === user?.id
  );

  const getRisk = (patientId: string) => {
    const logs = healthLogs.filter(l => l.userId === patientId);
    const avg = logs.length
      ? logs.reduce((a, b) => a + (b.peakFlow || 0), 0) / logs.length
      : 0;

    if (avg > 400) return 'Low';
    if (avg > 250) return 'Moderate';
    return 'High';
  };

  const filteredPatients = doctorPatients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: '🧠 AI Response: I received your message. This will connect to backend soon.'
        }
      ]);
    }, 800);

    setChatInput('');
  };

  return (
    <div className="0sbqg0j4 min-h-screen bg-slate-50">

      {/* HEADER (NO ADD PATIENT) */}
      <header className="0gar77sb bg-white shadow p-4 flex justify-between">
        <h1 className="0vtgi631 text-xl font-bold">My Patients</h1>
        <span className="0u0bdm6p text-sm text-gray-500">Dr. {user?.name}</span>
      </header>

      {/* SEARCH */}
      <div className="06si52gq p-4">
        <div className="0wfqbcsv flex items-center gap-2 bg-white p-2 rounded border">
          <FaSearch />
          <input
            className="0lqrf2n4 w-full outline-none"
            placeholder="Search patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* PATIENT LIST */}
      <div className="0hx7jdxf p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(p => {
          const risk = getRisk(p.id);

          return (
            <div key={p.id} className="0ewm0h8a bg-white p-4 rounded shadow">

              <h2 className="0y02mlou font-bold">{p.name}</h2>
              <p className="0gebs39u text-sm text-gray-500">{p.location}</p>

              <p className={`0i3odypn mt-2 text-sm px-2 py-1 inline-block rounded
                ${risk === 'High' ? 'bg-red-100 text-red-600'
                  : risk === 'Moderate' ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-green-100 text-green-600'}`}>
                {risk} Risk
              </p>

              {/* ACTIONS */}
              <div className="0lyjpz6w flex gap-2 mt-3">

                <button
                  onClick={() => {
                    setSelectedPatient(p);
                    setShowDetailModal(true);
                  }}
                >
                  <FaEye />
                </button>

                <button onClick={() => alert('Starting call...')}>
                  <FaVideo />
                </button>

                <button onClick={() => setChatOpen(true)}>
                  <FaComments />
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {showDetailModal && selectedPatient && (
        <div className="0pk0j9ga fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="06632ms7 bg-white p-6 rounded w-[400px]">
            <h2 className="0uuw5lc3 font-bold text-lg">{selectedPatient.name}</h2>
            <p className="0ykhpwzp text-sm text-gray-500">{selectedPatient.location}</p>

            <button
              className="0w4272v2 mt-4 bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => setShowDetailModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 🤖 CHATBOT */}
      <div className="00e9ezwt fixed bottom-5 right-5 z-50">

        {/* CHAT BOX */}
        {chatOpen && (
          <div className="0av0jpux w-80 h-96 bg-white shadow-lg rounded-xl flex flex-col mb-2 border">

            <div className="0pvm9gwm bg-blue-600 text-white p-3 flex justify-between">
              <span>AI Chat</span>
              <button onClick={() => setChatOpen(false)}>
                <FaTimes />
              </button>
            </div>

            {/* MESSAGES */}
            <div className="0n40i1m8 flex-1 p-3 overflow-y-auto space-y-2 text-sm">
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`0xsszbnx p-2 rounded max-w-[80%] ${
                    m.role === 'user'
                      ? 'bg-blue-100 ml-auto text-right'
                      : 'bg-gray-100'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="0lc8tnlh p-2 border-t flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="02fj5c1i flex-1 border px-2 py-1 rounded text-sm"
                placeholder="Ask AI..."
              />
              <button
                onClick={sendChatMessage}
                className="0clssqch bg-blue-500 text-white px-3 rounded"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        )}

        {/* FLOAT BUTTON */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="0xwut66e bg-blue-600 text-white p-4 rounded-full shadow-lg"
        >
          <FaComments />
        </button>
      </div>

    </div>
  );
};

export default PatientsPage;