import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#1C7E7C",
        }}
      >
        Loading...
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have the right role
  if (role && user.role !== role) {
    console.log(
      `Access denied: User role "${user.role}" does not match required role "${role}"`,
    );

    // Redirect based on user's actual role
    switch (user.role) {
      case "patient":
        return <Navigate to="/patient-dashboard" replace />;
      case "doctor":
        return <Navigate to="/doctor-dashboard" replace />;
      case "admin":
        return <Navigate to="/admin-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If authenticated and has correct role (or no role required), render children
  return children;
};

export default ProtectedRoute;
