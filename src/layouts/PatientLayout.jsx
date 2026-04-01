import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Layout/Sidebar";
import ChatWidget from "../components/Chat/ChatWidget";

const PatientLayout = () => {
  return (
    <div className="0c2t0gzj min-h-screen bg-[#fbfefe] flex">
      <Sidebar />
      <div className="0zdsk5vt flex-1 overflow-auto">
        <Outlet />
      </div>
      <ChatWidget positionClassName="bottom-8 right-8" />
    </div>
  );
};

export default PatientLayout;
