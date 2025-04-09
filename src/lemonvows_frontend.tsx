// LemonVows Frontend Implementation
// This file contains the frontend implementation for the LemonVows wedding planning app

// Using React with TypeScript for the frontend implementation
// The code is structured to work with the WeWeb no-code platform

// ----- COMPONENT STRUCTURE -----

/**
 * App.tsx - Main application component
 * This is the entry point for the application
 */
// Main imports
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { globalSupabaseClient } from './api/supabaseClient';

// Import components
import LoginComponent from './components/auth/Login';
import RsvpEntryComponent from './components/rsvp/RsvpEntry';
import RsvpFormComponent from './components/rsvp/RsvpForm';
import RsvpConfirmationComponent from './components/rsvp/RsvpConfirmation';
import DashboardComponent from './components/dashboard/Dashboard';
import GuestManagementComponent from './components/guests/GuestManagement';
import TablePlanningComponent from './components/tables/TablePlanning';
import MenuManagementComponent from './components/menu/MenuManagement';
import StatisticsDashboardComponent from './components/statistics/StatisticsDashboard';
import SettingsComponent from './components/settings/Settings';
import AdminDashboardComponent from './components/admin/AdminDashboard';
import WeddingManagementComponent from './components/admin/WeddingManagement';
import UserManagementComponent from './components/admin/UserManagement';
import ProtectedRouteComponent from './components/auth/ProtectedRoute';
import LemonVowsGlobalStyle from './styles/GlobalStyle';
import { lemonVowsTheme } from './styles/theme';
import { LemonVowsUserProvider } from './contexts/UserContext';
import { LemonVowsLanguageProvider } from './contexts/LanguageContext';

/**
 * App component - Main application component
 */
const App = () => {
  return (
    <Router>
      <ThemeProvider theme={lemonVowsTheme}>
      <LemonVowsGlobalStyle />
      <LemonVowsLanguageProvider>
        <LemonVowsUserProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/rsvp/:code" element={<RsvpEntryComponent />} />
            <Route path="/rsvp/:code/form" element={<RsvpFormComponent />} />
            <Route path="/rsvp/:code/confirmation" element={<RsvpConfirmationComponent />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRouteComponent>
                <DashboardComponent />
              </ProtectedRouteComponent>
            } />
            <Route path="/guests" element={
              <ProtectedRouteComponent>
                <GuestManagementComponent />
              </ProtectedRouteComponent>
            } />
            <Route path="/tables" element={
              <ProtectedRouteComponent>
                <TablePlanningComponent />
              </ProtectedRouteComponent>
            } />
            <Route path="/menu" element={
              <ProtectedRouteComponent>
                <MenuManagementComponent />
              </ProtectedRouteComponent>
            } />
            <Route path="/statistics" element={
              <ProtectedRouteComponent>
                <StatisticsDashboardComponent />
              </ProtectedRouteComponent>
            } />
            <Route path="/settings" element={
              <ProtectedRouteComponent>
                <SettingsComponent />
              </ProtectedRouteComponent>
            } />
            <Route path="/admin" element={
              <ProtectedRouteComponent>
                <AdminDashboardComponent />
              </ProtectedRouteComponent>
            } />
            <Route path="/admin/weddings" element={
              <ProtectedRouteComponent>
                <WeddingManagementComponent />
              </ProtectedRouteComponent>
            } />
            <Route path="/admin/users" element={
              <ProtectedRouteComponent>
                <UserManagementComponent />
              </ProtectedRouteComponent>
            } />
            
            {/* Default route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </LemonVowsUserProvider>
      </LemonVowsLanguageProvider>
    </ThemeProvider>
    </Router>
  );
};

export default App;
