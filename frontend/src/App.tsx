import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import GuestDashboard from './pages/guest/GuestDashboard';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSensors from './pages/admin/AdminSensors';
import AdminEnergy from './pages/admin/AdminEnergy';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute>{isAdmin ? <AdminDashboard /> : <UserDashboard />}</ProtectedRoute>} />
      <Route path="/admin/sensors" element={<ProtectedRoute adminOnly><AdminSensors /></ProtectedRoute>} />
      <Route path="/admin/energy" element={<ProtectedRoute adminOnly><AdminEnergy /></ProtectedRoute>} />
      <Route path="/" element={<GuestDashboard />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
