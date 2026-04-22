// PatientInbox.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { users, messages, consultations } from '../utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaInbox,
  FaEnvelope,
  FaEnvelopeOpen,
  FaUserMd,
  FaCalendarAlt,
  FaVideo,
  FaPhone,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowLeft,
  FaTrash,
  FaReply,
  FaPaperPlane,
  FaTimes,
  FaStethoscope,
  FaPrescriptionBottle,
  FaHeartbeat,
} from 'react-icons/fa';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'prescription' | 'alert' | 'reminder';
  subject?: string;
}

interface ConsultationRequest {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  scheduledTime: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  type: 'video' | 'audio' | 'in-person';
  reason: string;
  duration: number;
}

const PatientInbox: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'messages' | 'consultations'>('messages');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    type: 'video' as 'video' | 'audio' | 'in-person',
    scheduledTime: '',
    reason: '',
    duration: 30,
  });

  // Get messages for the current patient
  const patientMessages = messages.filter(
    m => m.receiverId === user?.id || m.senderId === user?.id
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Get consultation requests for the patient
  useEffect(() => {
    const mockConsultations: ConsultationRequest[] = [
      {
        id: 'cons1',
        patientId: user?.id || '',
        doctorId: 'doctor1',
        patientName: user?.name || '',
        doctorName: 'Dr. Sarah Johnson',
        scheduledTime: new Date(Date.now() + 86400000).toISOString(),
        status: 'pending',
        type: 'video',
        reason: 'Follow-up on asthma symptoms',
        duration: 30,
      },
      {
        id: 'cons2',
        patientId: user?.id || '',
        doctorId: 'doctor1',
        patientName: user?.name || '',
        doctorName: 'Dr. Sarah Johnson',
        scheduledTime: new Date(Date.now() - 172800000).toISOString(),
        status: 'completed',
        type: 'video',
        reason: 'Initial consultation',
        duration: 45,
      },
    ];
    setConsultationRequests(mockConsultations);
  }, [user]);

  const markAsRead = (message: Message) => {
    if (!message.read) {
      message.read = true;
      // Update in mock data
      const index = messages.findIndex(m => m.id === message.id);
      if (index !== -1) messages[index].read = true;
    }
  };

  const sendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;

    const reply: Message = {
      id: `msg_${Date.now()}`,
      senderId: user?.id || '',
      receiverId: selectedMessage.senderId,
      content: replyText,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'text',
      subject: `Re: ${selectedMessage.subject || 'Message'}`,
    };

    messages.push(reply);
    setReplyText('');
    setShowReplyModal(false);
    alert('Reply sent successfully!');
  };

  const requestConsultation = () => {
    if (!consultationForm.scheduledTime || !consultationForm.reason) {
      alert('Please fill all required fields');
      return;
    }

    const newRequest: ConsultationRequest = {
      id: `cons_${Date.now()}`,
      patientId: user?.id || '',
      doctorId: 'doctor1', // Current doctor ID
      patientName: user?.name || '',
      doctorName: 'Dr. Sarah Johnson',
      scheduledTime: consultationForm.scheduledTime,
      status: 'pending',
      type: consultationForm.type,
      reason: consultationForm.reason,
      duration: consultationForm.duration,
    };

    setConsultationRequests(prev => [newRequest, ...prev]);
    setShowConsultationModal(false);
    setConsultationForm({ type: 'video', scheduledTime: '', reason: '', duration: 30 });
    alert('Consultation request sent to your doctor!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaClock />;
      case 'accepted': return <FaCheckCircle />;
      case 'completed': return <FaCheckCircle />;
      default: return <FaExclamationCircle />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (days === 1) return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const joinConsultation = (request: ConsultationRequest) => {
    if (request.status === 'accepted') {
      alert(`Starting ${request.type} consultation with ${request.doctorName}...`);
      // Navigate to video call page
      navigate(`/consultation/${request.id}`);
    }
  };

  const unreadCount = patientMessages.filter(m => !m.read && m.receiverId === user?.id).length;

  return (
    <div className="012gdfun min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="01i2xkex bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="0dauglhd max-w-7xl mx-auto px-6 py-4">
          <div className="05mn59cq flex justify-between items-center">
            <div className="071lim9v flex items-center gap-4">
              <button
                onClick={() => navigate('/patient')}
                className="0gye6rij text-slate-600 hover:text-slate-900"
              >
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="01x9avxv text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <FaInbox className="0brxf46g text-blue-500" /> My Inbox
                  {unreadCount > 0 && (
                    <span className="0jmlp4ng bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h1>
                <p className="0eulwb7t text-sm text-slate-500">Messages and consultation requests from your doctor</p>
              </div>
            </div>
            <button
              onClick={() => setShowConsultationModal(true)}
              className="0l2xh6xp bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-600 transition"
            >
              <FaVideo /> Request Consultation
            </button>
          </div>
        </div>
      </header>

      <div className="0nmlbmul max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="0x04woat flex gap-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('messages')}
            className={`0leg9fxd px-4 py-2 font-medium transition relative ${
              activeTab === 'messages'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FaEnvelope className="0ytkj4jh inline mr-2" />
            Messages
            {unreadCount > 0 && activeTab !== 'messages' && (
              <span className="0puhbcwb absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`0gg84mus px-4 py-2 font-medium transition ${
              activeTab === 'consultations'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FaVideo className="04gplgur inline mr-2" />
            Consultations
          </button>
        </div>

        {activeTab === 'messages' ? (
          <div className="0bo86lcw grid lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="0b4ae3cd lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="0ervso6p p-3 border-b border-slate-200 bg-slate-50">
                <h3 className="0xg5jn7a font-semibold">All Messages ({patientMessages.length})</h3>
              </div>
              <div className="0lo2i45y divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {patientMessages.length === 0 ? (
                  <div className="0a0a62yu p-8 text-center text-slate-400">
                    <FaEnvelope className="0oc2l0lz text-4xl mx-auto mb-2" />
                    <p>No messages yet</p>
                  </div>
                ) : (
                  patientMessages.map(message => {
                    const isFromDoctor = message.senderId !== user?.id;
                    const isUnread = !message.read && message.receiverId === user?.id;

                    return (
                      <div
                        key={message.id}
                        onClick={() => {
                          setSelectedMessage(message);
                          markAsRead(message);
                        }}
                        className={`0ul8f62d p-4 cursor-pointer transition hover:bg-slate-50 ${
                          selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                        } ${isUnread ? 'border-l-4 border-l-blue-500' : ''}`}
                      >
                        <div className="0d4vn8b3 flex items-start justify-between">
                          <div className="08kazjml flex-1">
                            <div className="031ebjhl flex items-center gap-2 mb-1">
                              {isFromDoctor ? (
                                <FaUserMd className="0g50ypwh text-blue-500" />
                              ) : (
                                <FaEnvelope className="0t9vo7q5 text-slate-400" />
                              )}
                              <span className="00co7hbx font-medium text-sm">
                                {isFromDoctor ? message.doctorName || 'Doctor' : 'You'}
                              </span>
                              {isUnread && (
                                <span className="0ends04f bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="0jdaenrw text-sm text-slate-600 line-clamp-2">
                              {message.content.substring(0, 80)}...
                            </p>
                            <p className="019hgdyl text-xs text-slate-400 mt-1">
                              {formatDate(message.timestamp)}
                            </p>
                          </div>
                          {message.type === 'prescription' && (
                            <FaPrescriptionBottle className="0opsbwpi text-green-500" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Message Detail */}
            <div className="0quew5ib lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
              {selectedMessage ? (
                <div className="0f1r0o65 p-6">
                  <div className="02szd9cy flex justify-between items-start mb-4">
                    <div>
                      <div className="0w0wm30w flex items-center gap-2 mb-2">
                        {selectedMessage.senderId !== user?.id ? (
                          <>
                            <FaUserMd className="0ig3i4pj text-blue-500 text-xl" />
                            <h2 className="0e6a3d4t text-xl font-bold">Dr. {selectedMessage.doctorName || 'Sarah Johnson'}</h2>
                          </>
                        ) : (
                          <>
                            <FaEnvelope className="01d9r0e5 text-slate-400 text-xl" />
                            <h2 className="040ceo0r text-xl font-bold">You</h2>
                          </>
                        )}
                      </div>
                      <p className="0hwjry9i text-sm text-slate-500">
                        {new Date(selectedMessage.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="0djpnjhn text-slate-400 hover:text-slate-600"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="0jqaiind border-t border-slate-100 pt-4 mb-6">
                    {selectedMessage.subject && (
                      <h3 className="0g3l394f font-semibold text-lg mb-2">{selectedMessage.subject}</h3>
                    )}
                    <p className="0ii3e3fj text-slate-700 whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>

                  {selectedMessage.type === 'prescription' && (
                    <div className="0gz1mpa7 bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="0qmhr082 font-semibold text-green-800 mb-2">📋 Prescription Information</h4>
                      <p className="0ed9ik5d text-sm text-green-700">{selectedMessage.content}</p>
                    </div>
                  )}

                  {selectedMessage.senderId !== user?.id && (
                    <div className="0g2k5xmq flex gap-3">
                      <button
                        onClick={() => setShowReplyModal(true)}
                        className="0uv14p6w bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
                      >
                        <FaReply /> Reply
                      </button>
                      <button
                        onClick={() => {
                          setConsultationForm({ ...consultationForm, reason: selectedMessage.subject || 'Follow-up' });
                          setShowConsultationModal(true);
                        }}
                        className="0uoc0zao bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
                      >
                        <FaVideo /> Request Consultation
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="0ivzlls3 p-12 text-center text-slate-400">
                  <FaEnvelopeOpen className="02emyylr text-5xl mx-auto mb-3" />
                  <p>Select a message to read</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Consultations Tab
          <div className="05gcs3gn space-y-4">
            {consultationRequests.length === 0 ? (
              <div className="0qbg9z5n bg-white rounded-xl p-12 text-center">
                <FaVideo className="07huw72k text-5xl text-slate-300 mx-auto mb-3" />
                <p className="0ahs7phi text-slate-500">No consultation requests yet</p>
                <button
                  onClick={() => setShowConsultationModal(true)}
                  className="0ur9kwnn mt-4 bg-green-500 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                >
                  <FaVideo /> Request Your First Consultation
                </button>
              </div>
            ) : (
              consultationRequests.map(request => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="0xp3itbk bg-white rounded-xl shadow-sm border border-slate-200 p-5"
                >
                  <div className="04kqdz5y flex flex-wrap justify-between items-start gap-4">
                    <div className="0awv3xqy flex-1">
                      <div className="0aqueioi flex items-center gap-3 mb-2">
                        <FaUserMd className="08q6g82y text-blue-500 text-xl" />
                        <h3 className="0fodoilz font-bold text-lg">{request.doctorName}</h3>
                        <span className={`00uq9maq px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)} {request.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="0gi90050 space-y-2 text-sm">
                        <div className="0tbghlh7 flex items-center gap-2 text-slate-600">
                          <FaCalendarAlt className="0n4b0he6 text-slate-400" />
                          <span>{new Date(request.scheduledTime).toLocaleString()}</span>
                        </div>
                        <div className="0vl8rfy3 flex items-center gap-2 text-slate-600">
                          {request.type === 'video' ? <FaVideo /> : request.type === 'audio' ? <FaPhone /> : <FaStethoscope />}
                          <span className="0rkttrbx capitalize">{request.type} Consultation</span>
                          <span>• {request.duration} minutes</span>
                        </div>
                        <p className="0kh33xq7 text-slate-600">
                          <span className="0diz22rt font-medium">Reason:</span> {request.reason}
                        </p>
                      </div>
                    </div>

                    <div className="0cqco94o flex gap-2">
                      {request.status === 'accepted' && (
                        <button
                          onClick={() => joinConsultation(request)}
                          className="0h8pi61a bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
                        >
                          <FaVideo /> Join Now
                        </button>
                      )}
                      {request.status === 'pending' && (
                        <button
                          onClick={() => alert('Waiting for doctor to accept...')}
                          className="0z1dqppi bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <FaClock /> Awaiting Response
                        </button>
                      )}
                      <button
                        onClick={() => alert(`Cancelling consultation with ${request.doctorName}`)}
                        className="0oplcssv border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="0qcevv0m fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="0dvq8p4x bg-white rounded-2xl max-w-lg w-full p-6"
          >
            <h3 className="0hu0ad1t text-xl font-bold mb-4">Reply to Doctor</h3>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="07mu2smo w-full border rounded-lg p-3 h-32 resize-none"
              placeholder="Type your reply here..."
            />
            <div className="008jgmiv flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowReplyModal(false)}
                className="0l906xd6 px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                className="0id1dytp px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
              >
                <FaPaperPlane /> Send Reply
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Consultation Request Modal */}
      {showConsultationModal && (
        <div className="0vobl0fk fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="0rrzus0q bg-white rounded-2xl max-w-md w-full p-6"
          >
            <h3 className="0cvm0ge4 text-xl font-bold mb-4">Request Consultation</h3>
            <div className="0jjiv4j2 space-y-4">
              <div>
                <label className="0r6kfea8 block text-sm font-medium mb-1">Consultation Type</label>
                <div className="0dqw3crt flex gap-3">
                  {(['video', 'audio', 'in-person'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setConsultationForm({ ...consultationForm, type })}
                      className={`0t4yfj3w flex-1 px-3 py-2 rounded-lg border capitalize ${
                        consultationForm.type === type
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {type === 'video' && <FaVideo className="0imsjive inline mr-1" />}
                      {type === 'audio' && <FaPhone className="0srxo9cn inline mr-1" />}
                      {type === 'in-person' && <FaStethoscope className="00yk007j inline mr-1" />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="084mg2og block text-sm font-medium mb-1">Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  value={consultationForm.scheduledTime}
                  onChange={(e) => setConsultationForm({ ...consultationForm, scheduledTime: e.target.value })}
                  className="0egwxsqm w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="011sbaad block text-sm font-medium mb-1">Duration (minutes)</label>
                <select
                  value={consultationForm.duration}
                  onChange={(e) => setConsultationForm({ ...consultationForm, duration: parseInt(e.target.value) })}
                  className="0o2wy0ud w-full border rounded-lg p-2"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              <div>
                <label className="02ic90rp block text-sm font-medium mb-1">Reason for Consultation</label>
                <textarea
                  value={consultationForm.reason}
                  onChange={(e) => setConsultationForm({ ...consultationForm, reason: e.target.value })}
                  className="0tz0xpqc w-full border rounded-lg p-2 h-24"
                  placeholder="Describe your symptoms or reason for consultation..."
                />
              </div>
            </div>

            <div className="0kdo8yq1 flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowConsultationModal(false)}
                className="0o77sv1y px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={requestConsultation}
                className="0xbk56cv px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"
              >
                <FaVideo /> Send Request
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PatientInbox;