import React from "react";
import { NavLink } from "react-router-dom";

const ChatTabs = () => {
  return (
    <div className="0qwrf44c flex border-b bg-white">
      <NavLink
        to="/chat/user"
        className={({ isActive }) =>
          `px-4 py-2 ${isActive ? "border-b-2 border-blue-500 font-bold" : ""}`
        }
      >
        User Chat
      </NavLink>
      <NavLink
        to="/chat/patient"
        className={({ isActive }) =>
          `px-4 py-2 ${isActive ? "border-b-2 border-blue-500 font-bold" : ""}`
        }
      >
        Patient Chat
      </NavLink>
      <NavLink
        to="/chat/doctor"
        className={({ isActive }) =>
          `px-4 py-2 ${isActive ? "border-b-2 border-blue-500 font-bold" : ""}`
        }
      >
        Doctor Chat
      </NavLink>
    </div>
  );
};

export default ChatTabs;