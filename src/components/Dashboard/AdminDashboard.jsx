import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaChartLine,
  FaShieldAlt,
  FaServer,
  FaExclamationTriangle,
  FaFileCsv,
  FaFilePdf,
  FaBell,
  FaTimes,
} from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getUsers, notifications } from '../../utils/mockData';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [managedUsers, setManagedUsers] = useState(() => getUsers());

  useEffect(() => {
    const syncUsers = () => setManagedUsers(getUsers());
    window.addEventListener('managed-users-updated', syncUsers);
    return () => window.removeEventListener('managed-users-updated', syncUsers);
  }, []);

  const stats = [
    { label: 'Total Users', value: String(managedUsers.length), change: '+12%', icon: FaUsers, color: 'blue' },
    {
      label: 'Active Patients',
      value: String(managedUsers.filter((user) => user.role === 'patient').length),
      change: '+8%',
      icon: FaUsers,
      color: 'green',
    },
    {
      label: 'Active Doctors',
      value: String(managedUsers.filter((user) => user.role === 'doctor').length),
      change: '+5%',
      icon: FaUsers,
      color: 'purple',
    },
    { label: 'System Health', value: '98%', change: '-1%', icon: FaServer, color: 'green' }
  ];

  const sensors = [
    { location: 'Kigali', pm25: 45, pollen: 72, status: 'active', lastUpdate: '2 min ago' },
    { location: 'Musanze', pm25: 38, pollen: 45, status: 'active', lastUpdate: '3 min ago' },
    { location: 'Rubavu', pm25: 52, pollen: 68, status: 'active', lastUpdate: '1 min ago' },
    { location: 'Huye', pm25: 41, pollen: 35, status: 'warning', lastUpdate: '5 min ago' }
  ];

  const recentActivities = [
    { action: 'New user registered', user: 'john@example.com', time: '5 min ago', type: 'success' },
    { action: 'Doctor assigned to patient', user: 'dr.smith@example.com', time: '15 min ago', type: 'info' },
    { action: 'Risk alert triggered', user: 'High pollen in Kigali', time: '25 min ago', type: 'warning' },
    { action: 'System update completed', user: 'v2.1.0', time: '1 hour ago', type: 'success' }
  ];

  const notificationLogs = useMemo(
    () =>
      notifications.map((notification) => {
        const owner = managedUsers.find((user) => user.id === notification.userId);

        return {
          ...notification,
          ownerName: owner?.name || 'Unknown user',
          ownerEmail: owner?.email || 'No email',
        };
      }),
    [managedUsers],
  );

  const exportCsv = () => {
    const header = ['Notification ID', 'User', 'Email', 'Type', 'Status', 'Created At', 'Message'];
    const rows = notificationLogs.map((log) => [
      log.id,
      log.ownerName,
      log.ownerEmail,
      log.type,
      log.read ? 'Read' : 'Unread',
      log.createdAt,
      `"${String(log.message).replace(/"/g, '""')}"`,
    ]);

    const csv = [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-notification-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV export downloaded.');
  };

  const exportPdf = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text('Asthma Shield Admin Report', 14, 18);
    pdf.setFontSize(11);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);

    autoTable(pdf, {
      startY: 34,
      head: [['Metric', 'Value']],
      body: stats.map((stat) => [stat.label, stat.value]),
      theme: 'striped',
    });

    autoTable(pdf, {
      startY: pdf.lastAutoTable.finalY + 10,
      head: [['Location', 'PM2.5', 'Pollen', 'Status', 'Last Update']],
      body: sensors.map((sensor) => [
        sensor.location,
        `${sensor.pm25} ug/m3`,
        sensor.pollen,
        sensor.status,
        sensor.lastUpdate,
      ]),
      theme: 'striped',
    });

    autoTable(pdf, {
      startY: pdf.lastAutoTable.finalY + 10,
      head: [['User', 'Type', 'Status', 'Message']],
      body: notificationLogs.slice(0, 8).map((log) => [
        log.ownerName,
        log.type,
        log.read ? 'Read' : 'Unread',
        log.message,
      ]),
      theme: 'striped',
    });

    pdf.save(`admin-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success('PDF report downloaded.');
  };

  const quickActions = [
    {
      label: 'Export CSV',
      description: 'Download notification logs as CSV.',
      icon: FaFileCsv,
      onClick: exportCsv,
      className: 'bg-emerald-500 hover:bg-emerald-600',
    },
    {
      label: 'PDF Report',
      description: 'Generate an admin report in PDF.',
      icon: FaFilePdf,
      onClick: exportPdf,
      className: 'bg-rose-500 hover:bg-rose-600',
    },
    {
      label: 'View Notification Logs',
      description: 'Open recent system notification history.',
      icon: FaBell,
      onClick: () => setIsLogsOpen(true),
      className: 'bg-blue-500 hover:bg-blue-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-blue-100">System overview and management</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`${action.className} inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition`}
              >
                <action.icon />
                {action.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p
                  className={`text-xs ${
                    stat.change.includes('+') ? 'text-green-600' : 'text-red-600'
                  } mt-1`}
                >
                  {stat.change} from last month
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                stat.color === 'blue'
                  ? 'bg-blue-100 text-blue-600'
                  : stat.color === 'green'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-purple-100 text-purple-600'
              }`}>
                <stat.icon className="text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Environmental Sensor Network</h3>
          <button className="text-blue-600 text-sm hover:underline">Manage Sensors</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sensors.map((sensor, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{sensor.location}</h4>
                <div
                  className={`w-2 h-2 rounded-full ${
                    sensor.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                ></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">PM2.5:</span>
                  <span className="font-medium">{sensor.pm25} ug/m3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pollen:</span>
                  <span className="font-medium">{sensor.pollen}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Update:</span>
                  <span className="text-xs text-gray-400">{sensor.lastUpdate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'success'
                      ? 'bg-green-100'
                      : activity.type === 'warning'
                        ? 'bg-yellow-100'
                        : 'bg-blue-100'
                  }`}
                >
                  {activity.type === 'warning' ? (
                    <FaExclamationTriangle className="text-yellow-600 text-sm" />
                  ) : (
                    <FaShieldAlt className="text-blue-600 text-sm" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">System Health</h3>
          <div className="space-y-4">
            <HealthBar label="API Response Time" value="124ms" percentage={82} color="bg-green-500" />
            <HealthBar label="Database Usage" value="45%" percentage={45} color="bg-blue-500" />
            <HealthBar label="Storage Capacity" value="28%" percentage={28} color="bg-purple-500" />
            <HealthBar label="Active Sessions" value="342" percentage={68} color="bg-emerald-500" />
          </div>
        </motion.div>
      </div>

      {isLogsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Notification Logs</h2>
                <p className="text-sm text-slate-500">Recent patient and system notification history</p>
              </div>
              <button
                onClick={() => setIsLogsOpen(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close notification logs"
              >
                <FaTimes />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto px-6 py-4">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="py-3 pr-4">User</th>
                    <th className="py-3 pr-4">Type</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Created</th>
                    <th className="py-3">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationLogs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100 align-top">
                      <td className="py-3 pr-4">
                        <div className="font-medium text-slate-900">{log.ownerName}</div>
                        <div className="text-xs text-slate-500">{log.ownerEmail}</div>
                      </td>
                      <td className="py-3 pr-4 capitalize">{log.type}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            log.read
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {log.read ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 text-slate-700">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HealthBar = ({ label, value, percentage, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
    <div className="w-full h-2 bg-gray-200 rounded-full">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

export default AdminDashboard;
