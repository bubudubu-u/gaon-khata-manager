import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PersonsList from './pages/PersonsList';
import PersonForm from './pages/PersonForm';
import PersonDetail from './pages/PersonDetail';
import KhataEntries from './pages/KhataEntries';
import KhataForm from './pages/KhataForm';
import KhataDetail from './pages/KhataDetail';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Loading spinner
import LoadingScreen from './components/common/LoadingScreen';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

// Public Route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1a472a',
                color: '#fff',
                fontSize: '16px',
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={
                <PublicRoute><Login /></PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute><Register /></PublicRoute>
              } />
            </Route>

            {/* Protected Routes */}
            <Route element={
              <ProtectedRoute><MainLayout /></ProtectedRoute>
            }>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/persons" element={<PersonsList />} />
              <Route path="/persons/new" element={<PersonForm />} />
              <Route path="/persons/:id" element={<PersonDetail />} />
              <Route path="/persons/:id/edit" element={<PersonForm />} />
              <Route path="/khata" element={<KhataEntries />} />
              <Route path="/khata/new" element={<KhataForm />} />
              <Route path="/khata/:id" element={<KhataDetail />} />
              <Route path="/khata/:id/edit" element={<KhataForm />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
