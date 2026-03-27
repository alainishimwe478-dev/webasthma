import React from "react";
import { Link } from "react-router-dom";

const LandingShield = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0B3B5F" }}>
      {/* Header */}
      <nav
        style={{
          padding: "20px 40px",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "#0B3B5F", margin: 0 }}>Asthma Shield</h1>
        <div>
          <Link
            to="/login"
            style={{
              padding: "10px 20px",
              backgroundColor: "#1C7E7C",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
            }}
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 20px",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
          Welcome to Asthma Shield
        </h1>
        <p
          style={{
            fontSize: "20px",
            marginBottom: "40px",
            maxWidth: "600px",
            margin: "0 auto 40px",
          }}
        >
          AI-powered health monitoring for asthma patients in Rwanda
        </p>
        <Link
          to="/login"
          style={{
            padding: "12px 32px",
            backgroundColor: "#F4A261",
            color: "#1E2F3A",
            textDecoration: "none",
            borderRadius: "40px",
            fontWeight: "bold",
          }}
        >
          Get Started
        </Link>
      </div>

      {/* Features */}
      <div style={{ backgroundColor: "white", padding: "60px 20px" }}>
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
        >
          <h2 style={{ color: "#0B3B5F", marginBottom: "40px" }}>
            Key Features
          </h2>
          <div
            style={{
              display: "flex",
              gap: "30px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: "300px", padding: "20px" }}>
              <div style={{ fontSize: "48px" }}>📱</div>
              <h3>Symptom Tracking</h3>
              <p>Track daily symptoms and medication</p>
            </div>
            <div style={{ maxWidth: "300px", padding: "20px" }}>
              <div style={{ fontSize: "48px" }}>🌡️</div>
              <h3>Environment Monitor</h3>
              <p>Real-time air quality and pollen data</p>
            </div>
            <div style={{ maxWidth: "300px", padding: "20px" }}>
              <div style={{ fontSize: "48px" }}>🧠</div>
              <h3>AI Predictions</h3>
              <p>Early warning for asthma attacks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: "40px", textAlign: "center", color: "white" }}>
        <p>© 2026 Asthma Shield. Built for Rwanda</p>
      </footer>
    </div>
  );
};

export default LandingShield;
