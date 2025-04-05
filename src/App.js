import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import NewSession from './pages/NewSession';
import Sessions from './pages/Sessions';
import SessionChat from './pages/SessionChat';
import Settings from './pages/Settings';
import Therapies from './pages/Therapies';

// Components
import Layout from './components/common/Layout';
import Loading from './components/common/Loading';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <Loading fullScreen />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
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
                  path="/sessions" 
                  element={
                    <ProtectedRoute>
                      <Sessions />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/sessions/:sessionId" 
                  element={
                    <ProtectedRoute>
                      <SessionChat />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/new-session" 
                  element={
                    <ProtectedRoute>
                      <NewSession />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/therapies" 
                  element={
                    <ProtectedRoute>
                      <Therapies />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;