import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => (
  <div className="07mfou1a flex h-screen bg-gray-50">
    <Sidebar />
    <main className="0dq1cdyw flex-1 overflow-auto p-4 lg:p-8 ml-0 lg:ml-64">
      {children}
    </main>
  </div>
);

export default Layout;
