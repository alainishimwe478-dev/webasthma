import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Layout/Sidebar";

const PatientLayout = () => {
  return (
    <div className="0c2t0gzj min-h-screen bg-[#fbfefe] flex">
      <Sidebar />
      <div className="0zdsk5vt flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default PatientLayout;
