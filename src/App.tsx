import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import TablePlannerPage from './pages/TablePlannerPage';
import GuestManagementPage from './pages/GuestManagementPage';
import BudgetPlannerPage from './pages/BudgetPlannerPage';
import MusicRequestsPage from './pages/MusicRequestsPage';
import GalleryPage from './pages/GalleryPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import DemoPage from './pages/DemoPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;

const theme = {
  colors: {
    primary: 'var(--primary-color)',
    secondary: 'var(--secondary-color)',
    text: 'var(--text-color)',
    background: 'var(--background-color)',
  },
  fonts: {
    main: 'var(--font-family)',
  },
  breakpoints: {
    xs: '480px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
  },
};

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: appLoading } = useApp();
  
  if (authLoading || appLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContainer>
          <Navbar />
          <MainContent>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/table-planner" 
                element={
                  <ProtectedRoute>
                    <TablePlannerPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/guests" 
                element={
                  <ProtectedRoute>
                    <GuestManagementPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/budget" 
                element={
                  <ProtectedRoute>
                    <BudgetPlannerPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/music" 
                element={
                  <ProtectedRoute>
                    <MusicRequestsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/gallery" 
                element={
                  <ProtectedRoute>
                    <GalleryPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MainContent>
          <Footer />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
};

export default App;
