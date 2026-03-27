import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaPills, 
  FaLungs,
  FaSeedling,
  FaWind,
  FaTemperatureLow,
  FaEdit,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBell,
  FaChartLine,
  FaHeartbeat,
  FaHospitalUser,
  FaSyringe,
  FaNotesMedical,
  FaUserMd,
  FaShieldAlt,
  FaSmog,
  FaTint
} from 'react-icons/fa';
import Navbar from '../../components/Layout/Navbar';
import toast from 'react-hot-toast';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+250 788 123 456',
    dateOfBirth: '1990-05-15',
    address: 'Kigali, Rwanda',
    emergencyContact: '+250 788 789 012',
    emergencyName: 'Jane Doe',
    bloodType: 'O+',
    allergies: ['Pollen', 'Dust mites', 'Pet dander'],
    primaryDoctor: 'Dr. Sarah Johnson',
    lastCheckup: '2024-01-10',
    nextAppointment: '2024-02-15'
  });

  const [triggers, setTriggers] = useState({
    pollen: true,
    dust: true,
    coldAir: false,
    exercise: false,
    stress: true,
    smoke: false,
    mold: false,
    petDander: true,
    strongOdors: false
  });

  const [medications, setMedications] = useState([
    { id: 1, name: 'Albuterol', dosage: '2 puffs', frequency: 'As needed', time: 'As needed', prescribed: '2023-06-01', refill: '2024-03-01' },
    { id: 2, name: 'Fluticasone', dosage: '1 puff', frequency: 'Twice daily', time: '8:00 AM, 8:00 PM', prescribed: '2023-08-15', refill: '2024-02-15' },
    { id: 3, name: 'Montelukast', dosage: '10mg', frequency: 'Once daily', time: '9:00 PM', prescribed: '2023-10-01', refill: '2024-04-01' }
  ]);

  const [notifications, setNotifications] = useState({
    riskAlerts: true,
    medicationReminders: true,
    environmentalAlerts: true,
    appointmentReminders: true,
    educationalTips: false,
    weeklyReports: true
  });

  const [healthMetrics, setHealthMetrics] = useState({
    avgPeakFlow: 385,
    personalBest: 420,
    avgSeverity: 2.8,
    attackFreeDays: 24,
    adherenceRate: 94
  });

  const doctorNotifications = [
    {
      id: 1,
      title: 'New update from Dr. Sarah Johnson',
      message: 'Please keep your reliever inhaler nearby this week and avoid outdoor activity during dusty afternoons.',
      time: '10 min ago',
      unread: true
    }
  ];

  const handleProfileChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleTriggerToggle = (trigger) => {
    setTriggers({ ...triggers, [trigger]: !triggers[trigger] });
  };

  const handleNotificationToggle = (setting) => {
    setNotifications({ ...notifications, [setting]: !notifications[setting] });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FaUser },
    { id: 'medical', label: 'Medical History', icon: FaHeartbeat },
    { id: 'triggers', label: 'Triggers', icon: FaExclamationTriangle },
    { id: 'medications', label: 'Medications', icon: FaPills },
    { id: 'notifications', label: 'Notifications', icon: FaBell }
  ];

  return (
    <div className="094faazz flex-1 flex flex-col min-h-screen overflow-hidden bg-gray-100">
      <Navbar />
      <main className="0ixcc37t flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        <div className="0ws8s5a3 max-w-6xl mx-auto">
            {/* Header */}
            <div className="0b8v431s mb-8">
              <h1 className="09aleak7 text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
              <p className="0gr2mhtm text-gray-600">Manage your personal information and health settings</p>
            </div>

            {/* Profile Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="0ccbmvnh bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-8 text-white"
            >
              <div className="0jy2ro6s flex flex-col md:flex-row items-center md:items-start justify-between">
                <div className="0f0tq2x6 flex items-center space-x-6 mb-4 md:mb-0">
                  <div className="0cn22a2f w-24 h-24 bg-white rounded-full flex items-center justify-center">
                    <FaUser className="0ft522qv text-5xl text-blue-600" />
                  </div>
                  <div>
                    <h2 className="05sni883 text-2xl font-bold">{profileData.name}</h2>
                    <p className="0o03gjgn text-blue-100">Patient ID: AS-{Math.floor(Math.random() * 10000)}</p>
                    <div className="0w82ua3e flex items-center space-x-4 mt-2">
                      <span className="0jo20qgd flex items-center space-x-1">
                        <FaCheckCircle className="0d3b3g07 text-green-300" />
                        <span className="0ow0nmzm text-sm">Active Member</span>
                      </span>
                      <span className="013h9l4x flex items-center space-x-1">
                        <FaChartLine className="09x5ko5i text-blue-300" />
                        <span className="03pcn53i text-sm">Risk Level: Low</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="0tyd0lry text-center md:text-right">
                  <p className="0wjixwno text-sm text-blue-100">Member Since</p>
                  <p className="0s9ir9br font-semibold">January 2024</p>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="0mkvxzx5 mt-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="0sml7tjv mb-6 flex flex-wrap gap-2 border-b border-gray-200">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`0n8fe1i5 flex items-center space-x-2 px-4 py-2 rounded-t-lg transition ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <tab.icon />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="0zuu8kqf bg-white rounded-xl shadow-sm p-6">
              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="0h4lvc4g space-y-6">
                  <div className="0evcu765 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="04ydh47q block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          className="0grglem9 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="0kje23ys flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                          <FaUser className="070zxrpm text-gray-400 flex-shrink-0" />
                          <span className="0nhueajp font-medium">{profileData.name}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="03no2fb0 block text-sm font-medium text-gray-700 mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          className="0hyo6ba3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="0rrp6loh flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                          <FaEnvelope className="061dxxgz text-gray-400 flex-shrink-0" />
                          <span>{profileData.email}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="08p9nfux block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleProfileChange('phone', e.target.value)}
                          className="0bkwntbi w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="0562q124 flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                          <FaPhone className="0ltqqvch text-gray-400 flex-shrink-0" />
                          <span>{profileData.phone}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="0s23q0ir block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                          className="0f689sop w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="09zui92g flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                          <FaCalendarAlt className="0f8qkrgi text-gray-400 flex-shrink-0" />
                          <span>{profileData.dateOfBirth}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="0acib1tv block text-sm font-medium text-gray-700 mb-1">Address</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.address}
                          onChange={(e) => handleProfileChange('address', e.target.value)}
                          className="0mq2vap0 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="0mmr6jyg flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                          <FaMapMarkerAlt className="0nrjpnik text-gray-400 flex-shrink-0" />
                          <span>{profileData.address}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="00m69j70 block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                      {isEditing ? (
                        <select
                          value={profileData.bloodType}
                          onChange={(e) => handleProfileChange('bloodType', e.target.value)}
                          className="05x5eed2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>A+</option>
                          <option>A-</option>
                          <option>B+</option>
                          <option>B-</option>
                          <option>O+</option>
                          <option>O-</option>
                          <option>AB+</option>
                          <option>AB-</option>
                        </select>
                      ) : (
                        <div className="0ob10b8z flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                          <FaHeartbeat className="02pqvssj text-gray-400 flex-shrink-0" />
                          <span className="0lp6wzgd font-semibold text-red-600">{profileData.bloodType}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="0xt61jdo border-t pt-6">
                    <h3 className="00ty3v4z text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                      <FaShieldAlt className="0olcy2ll text-blue-600" />
                      <span>Emergency Contact</span>
                    </h3>
                    <div className="0aadeus0 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="0psp1h8y block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.emergencyName}
                            onChange={(e) => handleProfileChange('emergencyName', e.target.value)}
                            className="081cls6u w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="0nlgsdko flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                            <FaUserMd className="0cwtndof text-gray-400 flex-shrink-0" />
                            <span className="0l1aekph font-medium">{profileData.emergencyName}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="0ewtb85x block text-sm font-medium text-gray-700 mb-1">Emergency Phone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={profileData.emergencyContact}
                            onChange={(e) => handleProfileChange('emergencyContact', e.target.value)}
                            className="001kaa9w w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="0y23fknm flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                            <FaPhone className="0cxcvw3v text-gray-400 flex-shrink-0" />
                            <span className="0udazjdk font-mono bg-red-100 px-2 py-1 rounded text-sm">{profileData.emergencyContact}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="0tbkqiob flex justify-end space-x-3 pt-6 border-t">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="0jbx1tod px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="0148bmko px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        <FaSave />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Medical History Tab */}
              {activeTab === 'medical' && (
                <div className="0qk4su79 space-y-8">
                  <div className="0w1vmbhq grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="0jb6sr6h bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border">
                      <div className="0s5almnn flex items-start justify-between gap-4 mb-4">
                        <div className="0m68xr3a flex items-center space-x-3">
                          <FaUserMd className="0cl6l170 text-blue-600 text-xl" />
                          <h4 className="0ngcn1kg font-bold text-xl text-gray-800">Primary Care Provider</h4>
                        </div>
                        {doctorNotifications.some((notification) => notification.unread) && (
                          <div className="0ak0u2mz inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm ring-1 ring-blue-200">
                            <span className="0g7jbh9w relative flex h-2.5 w-2.5">
                              <span className="0q3xtxsg absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                              <span className="0s7dnkp4 relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                            </span>
                            <FaBell className="087a7cdz text-blue-500" />
                            {doctorNotifications.filter((notification) => notification.unread).length} new notification
                          </div>
                        )}
                      </div>
                      <div className="095rnxqh space-y-2">
                        <p className="00bfi63d text-2xl font-bold text-gray-900">{profileData.primaryDoctor}</p>
                        <p className="0fvqxffn text-sm text-gray-600">Contact for routine checkups and prescriptions</p>
                      </div>
                      <div className="0vl3b1db mt-5 rounded-2xl border border-blue-200 bg-white/85 p-4 shadow-sm">
                        <div className="0boh9ixy flex items-start gap-3">
                          <div className="06m42iw2 mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                            <FaBell />
                          </div>
                          <div className="0ly3r9sl min-w-0 flex-1">
                            <div className="0vhyjhho flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                              <h5 className="0u41vw8n font-semibold text-gray-900">
                                {doctorNotifications[0].title}
                              </h5>
                              <span className="095zyyqx text-xs font-medium text-blue-700">
                                {doctorNotifications[0].time}
                              </span>
                            </div>
                            <p className="01yzkw0q mt-2 text-sm leading-relaxed text-gray-600">
                              {doctorNotifications[0].message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="0ngbcp28 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border">
                      <div className="0uggzbo7 flex items-center space-x-3 mb-4">
                        <FaCalendarAlt className="0l8e5ecg text-green-600 text-xl" />
                        <h4 className="0lvldrx9 font-bold text-xl text-gray-800">Recent Appointments</h4>
                      </div>
                      <div className="02b3s1da space-y-3">
                        <div className="01k2h9xf flex justify-between items-center p-3 bg-white rounded-xl">
                          <span>Last Checkup</span>
                          <span className="0gtb6shb font-semibold text-green-700">{profileData.lastCheckup}</span>
                        </div>
                        <div className="0s3vd00e flex justify-between items-center p-3 bg-white rounded-xl border-l-4 border-orange-400">
                          <span>Next Appointment</span>
                          <span className="0wy2nd8u font-semibold text-orange-700">{profileData.nextAppointment}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="0rt6ki0k grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-6 border-t">
                    <div className="0s1929eq bg-white p-6 rounded-2xl shadow-sm text-center">
                      <div className="04dxz0bc text-3xl font-bold text-blue-600 mb-2">{healthMetrics.avgPeakFlow} L/min</div>
                      <p className="0o03o5io text-sm text-gray-600 uppercase tracking-wide">Avg Peak Flow</p>
                    </div>
                    <div className="01hddrmm bg-white p-6 rounded-2xl shadow-sm text-center">
                      <div className="0s48khpm text-3xl font-bold text-green-600 mb-2">{healthMetrics.personalBest} L/min</div>
                      <p className="0hjf0yx5 text-sm text-gray-600 uppercase tracking-wide">Personal Best</p>
                    </div>
                    <div className="00sgbllr bg-white p-6 rounded-2xl shadow-sm text-center">
                      <div className="0dnkjybo text-3xl font-bold text-yellow-600 mb-2">{healthMetrics.avgSeverity}/10</div>
                      <p className="0gtnk01m text-sm text-gray-600 uppercase tracking-wide">Avg Severity</p>
                    </div>
                    <div className="06xi90dd bg-white p-6 rounded-2xl shadow-sm text-center">
                      <div className="03juwr08 text-3xl font-bold text-emerald-600 mb-2">{healthMetrics.attackFreeDays} days</div>
                      <p className="0kap82gd text-sm text-gray-600 uppercase tracking-wide">Attack-Free</p>
                    </div>
                    <div className="0fsvmwbx bg-white p-6 rounded-2xl shadow-sm text-center">
                      <div className="0448sd2w text-3xl font-bold text-purple-600 mb-2">{healthMetrics.adherenceRate}%</div>
                      <p className="0re21h0f text-sm text-gray-600 uppercase tracking-wide">Adherence</p>
                    </div>
                  </div>

                  <div className="07udmy0c pt-6 border-t">
                    <div className="01eer91f bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                      <div className="0l5m3sub flex items-start space-x-3">
                        <FaSyringe className="03ua630s text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="03z8m3vk font-bold text-lg text-yellow-900 mb-1">Known Allergies</h4>
                          <p className="0bd865h3 text-sm text-yellow-800">{profileData.allergies.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Triggers Tab */}
              {activeTab === 'triggers' && (
                <>
                  <p className="0su3rr6t text-gray-600 mb-6 leading-relaxed">
                    Select your known asthma triggers to receive personalized alerts, recommendations, 
                    and environmental warnings tailored to your sensitivity profile.
                  </p>
                  <div className="0ilfjsb7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(triggers).map(([trigger, isActive]) => (
                      <label 
                        key={trigger} 
                        className="034z2td9 group flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-xl cursor-pointer transition-all border hover:border-blue-200 hover:shadow-sm h-full"
                      >
                        <div className="06yfj8jh flex items-center space-x-3 flex-1">
                          {trigger === 'pollen' && <FaSeedling className={`0f9icgf7 text-lg ${isActive ? 'text-green-500' : 'text-gray-400'}`} />}
                          {trigger === 'dust' && <FaWind className={`0fajqc9j text-lg ${isActive ? 'text-gray-500' : 'text-gray-400'}`} />}
                          {trigger === 'coldAir' && <FaTemperatureLow className={`05szjay6 text-lg ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />}
                          {trigger === 'exercise' && <FaLungs className={`08icsgtn text-lg ${isActive ? 'text-emerald-500' : 'text-gray-400'}`} />}
                          {trigger === 'stress' && <FaExclamationTriangle className={`0mpcv51g text-lg ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />}
                          {trigger === 'smoke' && <FaSmog className={`0z3kij9d text-lg ${isActive ? 'text-gray-600' : 'text-gray-400'}`} />}
                          {trigger === 'mold' && <FaTint className={`0hfpwi8n text-lg ${isActive ? 'text-green-600' : 'text-gray-400'}`} />}
                          {trigger === 'petDander' && <FaWind className={`084g0z6j text-lg ${isActive ? 'text-yellow-500' : 'text-gray-400'}`} />}
                          {trigger === 'strongOdors' && <FaNotesMedical className={`0wxu1ft2 text-lg ${isActive ? 'text-purple-500' : 'text-gray-400'}`} />}
                          <span className="00f72274 font-medium text-gray-800 capitalize leading-tight">
                            {trigger.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        <div className="0atlfasj relative inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => handleTriggerToggle(trigger)}
                            className="0aevyk9b sr-only peer"
                          />
                          <div className="0j83cg9o w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {/* Medications Tab */}
              {activeTab === 'medications' && (
                <div className="00slyieg space-y-4">
                  {medications.map((med) => (
                    <motion.div 
                      key={med.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="0r8sxm31 group bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all hover:-translate-y-1"
                    >
                      <div className="0vilt8gg flex items-start justify-between mb-4">
                        <div className="0n8zyrrp flex items-center space-x-4">
                          <div className="01lnd3lg w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <FaPills className="0t21rbb7 text-white text-xl" />
                          </div>
                          <div>
                            <h4 className="09cyyp23 text-xl font-bold text-gray-900 mb-1">{med.name}</h4>
                            <p className="0bdzn0nd text-sm font-medium text-gray-600">{med.dosage} • {med.frequency}</p>
                          </div>
                        </div>
                        <div className="0qup3wna text-right">
                          <p className="0mtqifu1 text-xs text-gray-500 mb-1">Next dose:</p>
                          <span className="0k7qylwp text-sm font-semibold text-blue-600">{med.time}</span>
                        </div>
                      </div>
                      <div className="0i5lzs2a grid grid-cols-2 gap-4 text-sm pt-2 border-t">
                        <div>
                          <span className="024juk9m text-gray-500">Prescribed:</span>
                          <span className="0hvg5o4o ml-2 font-medium text-gray-900">{med.prescribed}</span>
                        </div>
                        <div>
                          <span className="0fv3c1ob text-gray-500">Refill by:</span>
                          <span className="0zsqaxel ml-2 font-bold text-orange-600">{med.refill}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <button className="0xwky4jp w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 font-medium transition-all text-lg">
                    + Add New Medication
                  </button>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="0kc64ueq space-y-3">
                  {Object.entries(notifications).map(([setting, isEnabled]) => (
                    <label 
                      key={setting} 
                      className="004z991o flex items-center justify-between w-full p-5 bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 rounded-xl cursor-pointer group transition-all border hover:shadow-sm hover:border-blue-200"
                    >
                      <div className="0fo0551w space-y-1">
                        <h4 className="08dlm2vx font-semibold text-gray-900 capitalize leading-tight">
                          {setting.replace(/([A-Z])/g, ' $1').replace('Alerts', 'Alerts')}
                        </h4>
                        <p className="03n1cy7v text-sm text-gray-600 leading-relaxed max-w-md">
                          {setting === 'riskAlerts' && 'Immediate notifications when your asthma risk level changes or exceeds safe thresholds.'}
                          {setting === 'medicationReminders' && 'Smart reminders for all your prescribed medications with snooze options.'}
                          {setting === 'environmentalAlerts' && 'Real-time alerts for air quality, pollen levels, and weather triggers in your area.'}
                          {setting === 'appointmentReminders' && '24/48 hour reminders for doctor visits and routine checkups.'}
                          {setting === 'educationalTips' && 'Weekly personalized educational content and asthma management tips.'}
                          {setting === 'weeklyReports' && 'Sunday summary of your health trends, achievements, and recommendations.'}
                        </p>
                      </div>
                      <div className="07argetl flex items-center">
                        <div className="0hspm3co relative inline-flex items-center mr-4">
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={() => handleNotificationToggle(setting)}
                            className="0f2rop2g sr-only peer"
                          />
                          <div className="02pctjpj w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
