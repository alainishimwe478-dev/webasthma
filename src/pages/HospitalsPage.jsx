import React from "react";
import { Link } from "react-router-dom";

const HospitalsPage = () => {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Hospitals</h1>
      <Link to="/patient-dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default HospitalsPage;
