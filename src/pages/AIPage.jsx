import React from "react";
import { Link } from "react-router-dom";

const AIPage = () => {
  return (
    <div style={{ padding: "40px" }}>
      <h1>AI Risk Analysis</h1>
      <Link to="/patient-dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default AIPage;
