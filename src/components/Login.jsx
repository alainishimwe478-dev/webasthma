import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    // Create user data
    const userData = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email: email,
      role: role,
    };

    console.log("Logging in:", userData);
    login(userData);

    // Redirect based on role
    if (role === "patient") {
      navigate("/patient-dashboard");
    } else if (role === "doctor") {
      navigate("/doctor-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0B3B5F, #1C7E7C)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#0B3B5F",
            marginBottom: "30px",
          }}
        >
          Asthma Shield
        </h2>

        {error && (
          <div
            style={{
              background: "#ffebee",
              color: "#c33",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#1C7E7C",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "#f3f8fb",
            borderRadius: "12px",
            border: "1px solid #d3e3f1",
            color: "#0f3c5f",
            fontSize: "14px",
          }}
        >
          <div style={{ fontWeight: "700", marginBottom: "10px" }}>
            Demo credentials
          </div>
          <div style={{ marginBottom: "6px" }}>
            <strong>Doctor</strong>: doctor@example.com / doctor123
          </div>
          <div>
            <strong>Admin</strong>: admin@example.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
