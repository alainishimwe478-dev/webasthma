import React from "react";
import { FaBell } from "react-icons/fa";
import { useNotification } from "../context/NotificationContext";

const NotificationBell = ({ onToggleOpen, isOpen }) => {
  const { unreadCount } = useNotification();

  return (
    <button
      onClick={onToggleOpen}
      className="02raexfr relative p-2 text-gray-600 hover:text-blue-600 focus:outline-none rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
      aria-label="Notifications"
    >
      <FaBell className="0fdf1shy w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
      {unreadCount > 0 && (
        <span className="03quhm8h absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full min-w-[18px] h-5 shadow-sm">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
