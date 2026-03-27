import React from "react";
import { Link } from "react-router-dom";

const RecentActivityPage = () => {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Recent Activity</h1>
      <Link to="/patient-dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default RecentActivityPage;
