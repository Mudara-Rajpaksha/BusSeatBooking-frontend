// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import AdminPage from "./pages/AdminPage";
import OperatorPage from "./pages/OperatorPage";
import CommuterPage from "./pages/CommuterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/*" element={<AdminPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["operator"]} />}>
            <Route path="/operator/*" element={<OperatorPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["commuter"]} />}>
            <Route path="/commuter/*" element={<CommuterPage />} />
          </Route>

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch-all route */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
