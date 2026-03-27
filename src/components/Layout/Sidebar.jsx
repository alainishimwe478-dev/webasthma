import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaChartLine,
  FaBook,
  FaBell,
  FaUserMd,
  FaUsers,
  FaCog,
  FaShieldAlt,
  FaCloudSun,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const patientLinks = [
    { to: "/patient/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    { to: "/education", icon: FaBook, label: "Educational Hub" },
    { to: "/patient/log-symptoms", icon: FaChartLine, label: "Log Symptoms" },
    { to: "/patient/alerts", icon: FaBell, label: "Alerts" },
    { to: "/patient/environment", icon: FaCloudSun, label: "Environment" },
    { to: "/patient/profile", icon: FaUserMd, label: "Profile" },
  ];

  const doctorLinks = [
    { to: "/dashboard", icon: FaTachometerAlt, label: "Overview" },
    { to: "/patients", icon: FaUsers, label: "My Patients" },
    { to: "/system-analytics", icon: FaChartLine, label: "Analytics" },
    { to: "/education", icon: FaBook, label: "Resources" },
    { to: "/patient/profile", icon: FaUserMd, label: "Profile" },
  ];

  const adminLinks = [
    { to: "/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    { to: "/users", icon: FaUsers, label: "User Management" },
    { to: "/environment", icon: FaCloudSun, label: "Sensor Network" },
    { to: "/content", icon: FaFileAlt, label: "Content Management" },
    { to: "/system-analytics", icon: FaChartLine, label: "System Analytics" },
    { to: "/settings", icon: FaCog, label: "Settings" },
  ];

  let links = patientLinks;
  if (user?.role === "doctor") links = doctorLinks;
  if (user?.role === "admin") links = adminLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="0sojwyww w-64 bg-white shadow-lg flex flex-col">
      <div className="01dmlj9w p-6 border-b">
        <div className="0e5b7vfe flex items-center space-x-2">
          <FaShieldAlt className="0m9i61a1 text-2xl text-blue-600" />
          <span className="0mpxze09 font-bold text-xl text-gray-800">
            Asthma<span className="0zbkdpis text-blue-600">Shield</span>
          </span>
        </div>
      </div>

      <nav className="0c26h75r flex-1 p-4">
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`
            }
          >
            <link.icon className="05oajhrf text-lg" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="03l3yaof p-4 border-t">
        <button
          onClick={handleLogout}
          className="0tz13yje flex items-center space-x- Ascendancy py-3 rounded-lg w-full text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          <FaSignOutAlt className="0q3dz2tv text-lg" />
          <span>Logout</span>
        </button>

        <div className="023j9z1k mt-4 bg-blue-50 rounded-lg p-3">
          <p className="0zcx2ej3 text-xs text-blue-600 font-medium">
            Current Risk Level
          </p>
          <div className="0lckvp8e flex items-center justify-between mt-1">
            <span className="06weo7vo text-sm font-bold text-green-600">
              Low Risk
            </span>
            <div className="0s84sjqf w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="0ub45ikz w-1/3 h-full bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
