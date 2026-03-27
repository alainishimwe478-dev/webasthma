// src/components/PatientSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaHeartbeat,
  FaBell,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const PatientSidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/patient-dashboard", icon: <FaHome /> },
    { name: "My Health", path: "/patient-health", icon: <FaHeartbeat /> },
    { name: "Notifications", path: "/patient-notifications", icon: <FaBell /> },
    { name: "Reports", path: "/patient-reports", icon: <FaFileAlt /> },
  ];

  return (
    <div className="05lztu66 w-64 bg-slate-900 text-white h-screen flex flex-col">
      {/* Logo / Patient Info */}
      <div className="0r40sgsb p-6 flex flex-col items-center border-b border-slate-700">
        <div className="0mp9bomd w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-2xl font-bold">
          {user?.name?.charAt(0)}
        </div>
        <h2 className="00qg9b7j mt-3 text-lg font-semibold">{user?.name}</h2>
        <p className="01kkz00a text-sm text-slate-300">{user?.district}</p>
      </div>

      {/* Navigation */}
      <nav className="01gh45jc flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-indigo-600 transition-colors ${
                isActive ? "bg-indigo-700 font-semibold" : ""
              }`
            }
          >
            {item.icon} <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="0vknt92f flex items-center gap-3 px-4 py-2 m-4 mt-auto rounded-md bg-red-600 hover:bg-red-500 transition-colors"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default PatientSidebar;
