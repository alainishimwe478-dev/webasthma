import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MyPatients from "./pages/MyPatients";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import EducationalHub from "./pages/EducationalHub";
import PatientLayout from "@/layouts/PatientLayout";
import PatientDashboard from "./pages/PatientDashboard";
import PatientDetails from "./pages/PatientDetails";
import Alerts from "./pages/Patient/Alerts";
import Environment from "./pages/Patient/Environment";
import Profile from "./pages/Patient/Profile";
import AIRisk from "./pages/Patient/AIRisk";
import LogSymptoms from "./pages/Patient/LogSymptoms";
import RecentActivity from "./pages/Patient/RecentActivity";
import Hospitals from "./pages/Patient/Hospitals";
import SystemAnalytics from "./pages/SystemAnalytics";
import ManageUsers from "./pages/ManageUsers";
import AdminEnvironment from "./pages/Environment";
import Settings from "./pages/Settings";
import ContentManagement from "./pages/ContentManagement";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="0fhehhbl p-8 text-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/education"
        element={
          <ProtectedRoute>
            <EducationalHub />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <MyPatients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute>
            <PatientDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/system-analytics"
        element={
          <ProtectedRoute>
            <SystemAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/symptoms"
        element={<Navigate to="/patient/log-symptoms" replace />}
      />
      <Route
        path="/alerts"
        element={<Navigate to="/patient/alerts" replace />}
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/environment"
        element={
          <ProtectedRoute>
            <AdminEnvironment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/content"
        element={
          <ProtectedRoute>
            <ContentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/environment/:userId?"
        element={
          <ProtectedRoute>
            <Environment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/symptoms/:userId?"
        element={
          <ProtectedRoute>
            <LogSymptoms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient"
        element={
          <ProtectedRoute>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="ai-risk" element={<AIRisk />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="log-symptoms" element={<LogSymptoms />} />
        <Route path="recent-activity" element={<RecentActivity />} />
        <Route path="hospitals" element={<Hospitals />} />
        <Route path="environment" element={<Environment />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Toaster position="top-right" />
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
