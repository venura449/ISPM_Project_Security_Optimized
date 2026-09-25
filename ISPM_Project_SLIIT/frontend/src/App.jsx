import { AuthProvider, AuthContext } from "./context/AuthContext";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";
import EmployeeLogin from "./components/EmployeeLogin";
import EmployeeDashboard from "./components/EmployeeDashboard";
import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function AppContent() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-spinner fa-spin text-4xl text-indigo-600"></i>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isEmployee = localStorage.getItem("userType") === "employee";
  const isAdmin = localStorage.getItem("userType") === "admin";

  return (
    <Routes>
      {/* Employee Portal Routes */}
      <Route
        path="/employee-login"
        element={
          isAuthenticated && isEmployee ? (
            <Navigate to="/employee-dashboard" />
          ) : (
            <EmployeeLogin />
          )
        }
      />
      <Route
        path="/employee-dashboard"
        element={
          isAuthenticated && isEmployee ? (
            <EmployeeDashboard />
          ) : (
            <Navigate to="/employee-login" />
          )
        }
      />

      {/* Admin Portal Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated && localStorage.getItem("userType") !== "employee" ? (
            <Navigate to="/dashboard" />
          ) : (
            <AuthPage />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated && localStorage.getItem("userType") !== "employee" ? (
            <Dashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Default redirect */}
      <Route
        path="/"
        element={
          isAuthenticated && localStorage.getItem("userType") !== "employee" ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
