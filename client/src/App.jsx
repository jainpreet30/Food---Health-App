import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Meals from './pages/Meals';
import Workout from './pages/Workout';
import Profile from './pages/Profile';
import Coach from './pages/Coach';

const PrivateRoute = ({ children, withLayout = true }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return withLayout ? <Layout>{children}</Layout> : children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<PrivateRoute withLayout={false}><Onboarding /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/meals" element={<PrivateRoute><Meals /></PrivateRoute>} />
          <Route path="/workout" element={<PrivateRoute><Workout /></PrivateRoute>} />
          <Route path="/coach" element={<PrivateRoute><Coach /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
