import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/landing/LandingPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import SettingsPage from './pages/settings/SettingsPage';
import HelpPage from './pages/help/HelpPage';
import FieldMappingPage from './pages/dashboard/FieldMappingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/profile/ProfilePage';
import ChatBotButton from './components/ChatBotButton';
import UserProvider, { useUser } from './contexts/UserContext';

// AuthGuard component to protect routes
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!userProfile.isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [userProfile.isAuthenticated, navigate, location]);
  
  if (!userProfile.isAuthenticated) {
    return null; // Don't render the protected content
  }
  
  return <>{children}</>;
};

// AppContent component that uses hooks (can't use hooks directly in App)
const AppContent: React.FC = () => {
  const { preferences, isLoading } = useUser();
  
  // Apply dark mode class to the html element
  useEffect(() => {
    // Default to dark mode until user preferences are loaded
    if (isLoading) {
      document.documentElement.classList.add('dark');
    } else if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode, isLoading]);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route element={<Layout />}>
          <Route 
            path="/dashboard" 
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <AuthGuard>
                <SettingsPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/help" 
            element={
              <AuthGuard>
                <HelpPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/field-mapping" 
            element={
              <AuthGuard>
                <FieldMappingPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            } 
          />
        </Route>
      </Routes>
      
      {/* Chatbot button that appears on all pages */}
      <ChatBotButton />
    </>
  );
};

function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App; 