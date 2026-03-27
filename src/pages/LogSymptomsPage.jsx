import React from "react";
import { Link } from "react-router-dom";

const LogSymptomsPage = () => {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Log Symptoms</h1>
      <Link to="/patient-dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default LogSymptomsPage;
