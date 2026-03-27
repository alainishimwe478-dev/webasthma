import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Layout/Sidebar";
import ChatWidget from "../components/ChatWidget";

const PatientLayout = () => {
  return (
    <div className="min-h-screen bg-[#fbfefe] flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      <ChatWidget positionClassName="bottom-8 right-8" />
    </div>
  );
};

export default PatientLayout;
