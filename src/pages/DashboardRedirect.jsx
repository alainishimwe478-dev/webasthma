import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "patient") return <Navigate to="/patient/dashboard" replace />;
  if (user.role === "doctor") return <Navigate to="/dashboard" replace />;
  if (user.role === "admin") return <Navigate to="/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

export default DashboardRedirect;
