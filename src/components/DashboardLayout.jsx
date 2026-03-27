import React from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import RiskCard from "./RiskCard";

const DashboardLayout = () => {
  const { user } = useAuth();
  return (
    <div className="0sum8y8d flex min-h-screen">
      <div className="0w4isgmx w-64 bg-white shadow-lg">
        Sidebar placeholder for {user?.role || 'user'}
      </div>
      <div className="0eocbz5f flex-1 p-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <RiskCard />
        <p>Dashboard content - layout fixed</p>
      </div>
    </div>
  );
};

export default PatientDashboard;
