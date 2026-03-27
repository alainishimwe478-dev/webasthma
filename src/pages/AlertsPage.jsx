import React from "react";
import { Link } from "react-router-dom";

const AlertsPage = () => {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Alerts</h1>
      <Link to="/patient-dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default AlertsPage;
