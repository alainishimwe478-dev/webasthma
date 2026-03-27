import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import PatientDashboard from '../components/Dashboard/PatientDashboard';
import DoctorDashboard from '../components/Dashboard/DoctorDashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import Sidebar from '../components/Layout/Sidebar';
import Navbar from '../components/Layout/Navbar';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'patient') {
    return <Navigate to="/patient/dashboard" replace />;
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'doctor':
        return <DoctorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className="05q7nfbk flex h-screen bg-gray-100">
      <Sidebar />
      <div className="0ws4jiab flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="0qkhirnz flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
