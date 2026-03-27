import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserMd,
  FaPlus,
  FaTimes,
  FaUser,
} from 'react-icons/fa';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    doctor: '',
    date: '',
    time: '',
    location: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`appointments_${user.id}`);
    if (stored) {
      setAppointments(JSON.parse(stored));
    } else if (user.role === 'doctor') {
      setAppointments([
        {
          id: 1,
          patient: 'Alice Uwase',
          date: '2025-04-15',
          time: '10:00',
          location: 'CHUK',
          reason: 'Follow-up',
          status: 'confirmed',
        },
        {
          id: 2,
          patient: 'Jean Niyomugabo',
          date: '2025-04-16',
          time: '14:30',
          location: 'CHUK',
          reason: 'Initial consultation',
          status: 'pending',
        },
      ]);
    } else if (user.role === 'admin') {
      setAppointments([
        {
          id: 1,
          patient: 'Alice Uwase',
          doctor: 'Dr. Jean Paul',
          date: '2025-04-15',
          time: '10:00',
          location: 'CHUK',
          reason: 'Follow-up',
          status: 'confirmed',
        },
        {
          id: 2,
          patient: 'Jean Niyomugabo',
          doctor: 'Dr. Marie Claire',
          date: '2025-04-16',
          time: '14:30',
          location: 'Muhanga Hospital',
          reason: 'Initial consultation',
          status: 'pending',
        },
      ]);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`appointments_${user.id}`, JSON.stringify(appointments));
  }, [appointments, user]);

  const handleBook = (e) => {
    e.preventDefault();
    if (!newAppointment.doctor || !newAppointment.date || !newAppointment.time) return;
    setLoading(true);
    setTimeout(() => {
      const appointment = {
        id: Date.now(),
        status: 'pending',
        patient: user.name,
        ...newAppointment,
      };
      setAppointments((prev) => [appointment, ...prev]);
      setNewAppointment({ doctor: '', date: '', time: '', location: '', reason: '' });
      setShowForm(false);
      setLoading(false);
    }, 800);
  };

  const handleCancel = (id) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'cancelled' } : app))
    );
  };

  const handleConfirm = (id) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'confirmed' } : app))
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        {user?.role === 'patient' && (
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPlus className="mr-2" /> Book Appointment
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Book New Appointment</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor</label>
              <select
                value={newAppointment.doctor}
                onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select Doctor</option>
                <option value="Dr. Jean Paul">Dr. Jean Paul</option>
                <option value="Dr. Marie Claire">Dr. Marie Claire</option>
                <option value="Dr. Kamanzi">Dr. Kamanzi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={newAppointment.location}
                onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                placeholder="e.g., CHUK, Muhanga Hospital"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <textarea
                value={newAppointment.reason}
                onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                rows="2"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Briefly describe the reason for visit"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {appointments.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No appointments found.</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {appointments.map((app) => (
              <div key={app.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <span className="font-medium">{app.date}</span>
                      <FaClock className="ml-2 text-gray-400" />
                      <span>{app.time}</span>
                    </div>
                    {user?.role === 'patient' ? (
                      <p className="text-gray-600">
                        <FaUserMd className="inline mr-1" /> {app.doctor}
                      </p>
                    ) : user?.role === 'doctor' ? (
                      <p className="text-gray-600">
                        <FaUser className="inline mr-1" /> Patient: {app.patient}
                      </p>
                    ) : (
                      <p className="text-gray-600">
                        <FaUserMd className="inline mr-1" /> Doctor: {app.doctor} | Patient: {app.patient}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      <FaMapMarkerAlt className="inline mr-1" /> {app.location || 'Not specified'}
                    </p>
                    {app.reason && <p className="text-sm text-gray-500">Reason: {app.reason}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : app.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {app.status}
                    </span>
                    {user?.role !== 'patient' && app.status === 'pending' && (
                      <button
                        onClick={() => handleConfirm(app.id)}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Confirm
                      </button>
                    )}
                    {app.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(app.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
