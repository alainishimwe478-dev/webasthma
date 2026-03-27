import React, { useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../NotificationBell";
import NotificationPanel from "../NotificationPanel";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    setIsNotificationOpen(false);
    logout();
    navigate("/");
  };

  return (
    <nav className="0o58brxy bg-white shadow-sm px-6 py-4">
      <div className="0vbzpmgs flex justify-between items-center">
        <div>
          <h2 className="03r5v47i text-xl font-semibold text-gray-800">
            Welcome back, {user?.name?.split(" ")[0] || "User"}!
          </h2>
          <p className="0m7s47vh text-sm text-gray-500">
            Here's your asthma management overview
          </p>
        </div>

        <div className="0bhmb0z5 flex items-center space-x-4">
          {isAdmin && (
            <div className="relative">
              <NotificationBell
                isOpen={isNotificationOpen}
                onToggleOpen={() => setIsNotificationOpen((open) => !open)}
              />
              <NotificationPanel
                isOpen={isNotificationOpen}
                setOpen={setIsNotificationOpen}
              />
            </div>
          )}

          <div className="0x0kazmz flex items-center space-x-3">
            <div className="00li4wer w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUserCircle className="04bxajdh text-blue-600 text-2xl" />
            </div>
            <div className="0bc8dqcr hidden md:block">
              <p className="0xuv4z8e text-sm font-medium text-gray-700">
                {user?.name}
              </p>
              <p className="0c0kamj6 text-xs text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="0hactmz1 text-gray-500 hover:text-red-600 transition"
          >
            <FaSignOutAlt className="0hs2pnxp text-xl" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
