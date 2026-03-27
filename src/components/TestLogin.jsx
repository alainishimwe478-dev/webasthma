import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TestLogin = () => {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("patient");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userData = {
      id: "1",
      name: email.split('@')[0] || "User",
      email: email,
      role: selectedRole,
    };
    
    console.log("📝 Logging in with:", userData);
    login(userData);
    
    // Redirect based on role
    if (selectedRole === "patient") {
      navigate("/patient-dashboard");
    } else if (selectedRole === "doctor") {
      navigate("/doctor-dashboard");
    } else if (selectedRole === "admin") {
      navigate("/admin-dashboard");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
      <h2>Test Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
        <button 
          type="submit" 
          style={{ 
            width: "100%", 
            padding: "10px", 
            background: "#1C7E7C", 
            color: "white", 
            border: "none",
            cursor: "pointer",
            borderRadius: "8px"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default TestLogin;
