import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import PatientsPage from "./pages/PatientsPage";
import PatientDetails from "./pages/PatientDetails";
import AddPatientForm from "./pages/AddPatientForm";
import EducationalHub from "./pages/EducationalHub";
import SystemAnalytics from "./pages/SystemAnalytics";
import ManageUsers from "./pages/ManageUsers";
import AdminEnvironment from "./pages/Environment";
import ContentManagement from "./pages/ContentManagement";
import Settings from "./pages/Settings";
import PatientLayout from "./layouts/PatientLayout";
import PatientDashboard from "./pages/PatientDashboard";
import AIRisk from "./pages/Patient/AIRisk";
import Alerts from "./pages/Patient/Alerts";
import LogSymptoms from "./pages/Patient/LogSymptoms";
import RecentActivity from "./pages/Patient/RecentActivity";
import Hospitals from "./pages/Patient/Hospitals";
import Environment from "./pages/Patient/Environment";
import Profile from "./pages/Patient/Profile";
import PatientInbox from "./pages/PatientInbox";
import ConsultationPage from "./pages/ConsultationPage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="02crb2ez p-8 text-center">Loading...</div>;
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
            <PatientsPage />
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
        path="/doctor/patients"
        element={
          <ProtectedRoute>
            <PatientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients/add"
        element={
          <ProtectedRoute>
            <AddPatientForm />
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
        <Route path="inbox" element={<PatientInbox />} />
      </Route>
      <Route
        path="/consultation/:consultationId"
        element={
          <ProtectedRoute>
            <ConsultationPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

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
