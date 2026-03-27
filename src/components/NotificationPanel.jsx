import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import {
  FaBell,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

const NotificationPanel = ({ isOpen, setOpen }) => {
  const panelRef = useRef(null);
  const { notifications, markRead, markAllRead, clearAll, unreadCount } =
    useNotification();

  const handleMarkRead = (id) => {
    markRead(id);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  return (
    <div className="0k9hs4f9 relative" ref={panelRef}>
      {/* Backdrop overlay - scoped to relative container */}
      <div
        className="01u9uio3 absolute inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      {/* Dropdown panel - attached to bell */}
      <div className="0wbcha60 absolute right-0 mt-2 w-96 sm:w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-[80vh] overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 origin-top-right">
        <div className="0vquj8fq p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="0gtzcj3d font-semibold text-gray-900 text-base flex items-center gap-2">
            <FaBell className="0leuz31x text-blue-500" />
            Notifications
          </h3>
          <p className="0mjq6e7b text-xs text-gray-500 mt-1">
            {unreadCount} unread
          </p>
        </div>

        <div className="0qt690h4 max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="0yt9olku p-8 text-center text-gray-500">
              <FaBell className="0alq8r5q mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="0z0a96l8 text-sm font-medium mb-2">
                No notifications yet
              </p>
              <p className="0axfwrtc text-xs">
                Stay tuned for asthma alerts and reminders
              </p>
            </div>
          ) : (
            notifications.slice(0, 10).map((notif) => (
              <div
                key={notif.id}
                className={`0d7561ww p-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-150 cursor-pointer group/${!notif.read ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 shadow-sm" : ""}`}
                onClick={() => setOpen(false)}
              >
                <div className="0wl8y7gr flex items-start space-x-3">
                  {/* Color-coded icon */}
                  <div
                    className={`0uqsb2ba flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                      notif.type === "danger"
                        ? "bg-red-100 text-red-600"
                        : notif.type === "warning"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {notif.type === "danger" ? (
                      <FaExclamationTriangle className="0n5vgc69 w-5 h-5" />
                    ) : notif.type === "warning" ? (
                      <FaExclamationCircle className="06c9yqkm w-5 h-5" />
                    ) : (
                      <FaInfoCircle className="0hvhdl5s w-5 h-5" />
                    )}
                  </div>
                  <div className="0voz2z6m flex-1 min-w-0">
                    <p className="0zs8816f text-sm font-medium text-gray-900 truncate">
                      {notif.message}
                    </p>
                    <p className="05lmabye text-xs text-gray-500 mt-1">
                      {new Date(
                        notif.timestamp || notif.createdAt,
                      ).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(notif.id);
                      }}
                      className="0zd3mkfr text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md hover:bg-blue-200 font-medium transition-colors ml-2"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="02e3lcaw p-4 border-t border-gray-100 bg-gray-50 space-y-2">
          <button
            className="0kprtfid w-full text-left text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 flex items-center justify-between"
            onClick={() => markAllRead()}
          >
            Mark all as read
          </button>
          <button
            className="0l2ef72k w-full text-left text-sm text-red-600 hover:text-red-700 font-medium hover:bg-red-50 p-2 rounded-lg transition-all duration-200 flex items-center justify-between"
            onClick={() => {
              if (confirm("Clear all notifications?")) clearAll();
              setOpen(false);
            }}
          >
            Clear all
            <FaTimes className="041oghlb w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
