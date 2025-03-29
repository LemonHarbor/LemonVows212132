// LemonVows Frontend Implementation
// This file contains the frontend implementation for the LemonVows wedding planning app

// Using React with TypeScript for the frontend implementation
// The code is structured to work with the WeWeb no-code platform

// ----- COMPONENT STRUCTURE -----

/**
 * App.tsx - Main application component
 * This is the entry point for the application
 */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { ThemeProvider } from 'styled-components';

// Import components
import Login from './components/auth/Login';
import RsvpEntry from './components/rsvp/RsvpEntry';
import RsvpForm from './components/rsvp/RsvpForm';
import RsvpConfirmation from './components/rsvp/RsvpConfirmation';
import Dashboard from './components/dashboard/Dashboard';
import GuestManagement from './components/guests/GuestManagement';
import TablePlanning from './components/tables/TablePlanning';
import MenuManagement from './components/menu/MenuManagement';
import StatisticsDashboard from './components/statistics/StatisticsDashboard';
import Settings from './components/settings/Settings';
import AdminDashboard from './components/admin/AdminDashboard';
import WeddingManagement from './components/admin/WeddingManagement';
import UserManagement from './components/admin/UserManagement';
import LanguageSelector from './components/common/LanguageSelector';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { UserProvider } from './contexts/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { theme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <LanguageProvider>
        <UserProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/rsvp" element={<RsvpEntry />} />
              <Route path="/rsvp/:code" element={<RsvpForm />} />
              <Route path="/rsvp/confirmation" element={<RsvpConfirmation />} />
              
              {/* Protected routes - Couple */}
              <Route path="/dashboard" element={
                <ProtectedRoute roles={['couple', 'admin']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/guests" element={
                <ProtectedRoute roles={['couple', 'admin']}>
                  <GuestManagement />
                </ProtectedRoute>
              } />
              <Route path="/tables" element={
                <ProtectedRoute roles={['couple', 'admin']}>
                  <TablePlanning />
                </ProtectedRoute>
              } />
              <Route path="/menu" element={
                <ProtectedRoute roles={['couple', 'admin']}>
                  <MenuManagement />
                </ProtectedRoute>
              } />
              <Route path="/statistics" element={
                <ProtectedRoute roles={['couple', 'admin']}>
                  <StatisticsDashboard />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute roles={['couple', 'admin']}>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Protected routes - Admin */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/weddings" element={
                <ProtectedRoute roles={['admin']}>
                  <WeddingManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute roles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              
              {/* Default route */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
            <LanguageSelector />
          </Router>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;

/**
 * contexts/UserContext.tsx - User context for authentication and user data
 */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { createClient, User } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface UserContextType {
  user: User | null;
  userDetails: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isCouple: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on component mount
    const session = supabase.auth.session();
    setUser(session?.user || null);
    
    if (session?.user) {
      fetchUserDetails(session.user.id);
    } else {
      setLoading(false);
    }

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        if (currentUser) {
          await fetchUserDetails(currentUser.id);
        } else {
          setUserDetails(null);
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user, error } = await supabase.auth.signIn({ email, password });
      
      if (error) throw error;
      
      if (user) {
        await fetchUserDetails(user.id);
      }
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUserDetails(null);
  };

  const isAdmin = () => {
    return userDetails?.role === 'admin';
  };

  const isCouple = () => {
    return userDetails?.role === 'couple';
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userDetails,
        loading,
        login,
        logout,
        isAdmin,
        isCouple,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

/**
 * contexts/LanguageContext.tsx - Language context for multilingual support
 */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

type Language = 'de' | 'en' | 'fr' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, string>;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('de');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    // Load translations
    fetchTranslations();
  }, []);

  useEffect(() => {
    // Save language preference
    localStorage.setItem('language', language);
    
    // Update user preference if logged in
    const session = supabase.auth.session();
    if (session?.user) {
      updateUserLanguagePreference(session.user.id, language);
    }
  }, [language]);

  const fetchTranslations = async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*');
      
      if (error) throw error;
      
      const translationsMap: Record<string, string> = {};
      data.forEach((item) => {
        translationsMap[item.key] = item[language] || item.de || item.key;
      });
      
      setTranslations(translationsMap);
    } catch (error) {
      console.error('Error fetching translations:', error);
    }
  };

  const updateUserLanguagePreference = async (userId: string, language: Language) => {
    try {
      await supabase
        .from('users')
        .update({ preferred_language: language })
        .eq('id', userId);
    } catch (error) {
      console.error('Error updating user language preference:', error);
    }
  };

  const translate = (key: string) => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations,
        translate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

/**
 * components/auth/Login.tsx - Login component
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../../contexts/UserContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, Logo, Input, Button, ErrorMessage } from '../common/StyledComponents';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

const LoginCard = styled(Card)`
  width: 400px;
  padding: 2rem;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ForgotPassword = styled.a`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  align-self: flex-end;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SignUpLink = styled.p`
  font-size: 0.875rem;
  text-align: center;
  margin-top: 1rem;
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useUser();
  const { translate } = useLanguage();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { error } = await login(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <Logo />
        <h2>{translate('login.title')}</h2>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <LoginForm onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">{translate('login.email')}</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password">{translate('login.password')}</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <ForgotPassword href="#">{translate('login.forgot_password')}</ForgotPassword>
          
          <Button type="submit" disabled={loading}>
            {loading ? translate('common.loading') : translate('login.submit')}
          </Button>
        </LoginForm>
        
        <SignUpLink>
          {translate('login.no_account')} <a href="#">{translate('login.sign_up')}</a>
        </SignUpLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;

/**
 * components/rsvp/RsvpEntry.tsx - RSVP code entry component
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, Logo, Input, Button, ErrorMessage } from '../common/StyledComponents';

const RsvpEntryContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

const RsvpEntryCard = styled(Card)`
  width: 400px;
  padding: 2rem;
  text-align: center;
`;

const RsvpForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const RsvpEntry: React.FC = () => {
  const [rsvpCode, setRsvpCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { translate } = useLanguage();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // In a real implementation, we would validate the RSVP code here
      // For the test environment, we'll just navigate to the RSVP form
      navigate(`/rsvp/${rsvpCode}`);
    } catch (err) {
      setError('Invalid RSVP code');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <RsvpEntryContainer>
      <RsvpEntryCard>
        <Logo />
        <h2>{translate('rsvp.enter_code')}</h2>
        <p>{translate('rsvp.enter_code_description')}</p>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <RsvpForm onSubmit={handleSubmit}>
          <div>
            <Input
              type="text"
              value={rsvpCode}
              onChange={(e) => setRsvpCode(e.target.value)}
              placeholder={translate('rsvp.code_placeholder')}
              required
            />
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? translate('common.loading') : translate('rsvp.submit')}
          </Button>
        </RsvpForm>
      </RsvpEntryCard>
    </RsvpEntryContainer>
  );
};

export default RsvpEntry;

/**
 * components/common/LanguageSelector.tsx - Language selector component
 */
import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSelectorContainer = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
`;

const LanguageButton = styled.button<{ active: boolean }>`
  background-color: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.darkGray};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  margin-left: 0.25rem;
  cursor: pointer;
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  
  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.lightGray};
  }
`;

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <LanguageSelectorContainer>
      <LanguageButton
        active={language === 'de'}
        onClick={() => setLanguage('de')}
      >
        DE
      </LanguageButton>
      <LanguageButton
        active={language === 'en'}
        onClick={() => setLanguage('en')}
      >
        EN
      </LanguageButton>
      <LanguageButton
        active={language === 'fr'}
        onClick={() => setLanguage('fr')}
      >
        FR
      </LanguageButton>
      <LanguageButton
        active={language === 'es'}
        onClick={() => setLanguage('es')}
      >
        ES
      </LanguageButton>
    </LanguageSelectorContainer>
  );
};

export default LanguageSelector;

/**
 * components/common/StyledComponents.tsx - Reusable styled components
 */
import styled from 'styled-components';

export const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

export const Logo = styled.div`
  width: 150px;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.primary};
  margin: 0 auto 1.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
  
  &:after {
    content: 'LemonVows';
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.mediumGray};
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

export const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.mediumGray};
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.errorLight};
  color: ${({ theme }) => theme.colors.error};
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

export const SuccessMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.successLight};
  color: ${({ theme }) => theme.colors.success};
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

export const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const Sidebar = styled.div`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.darkGray};
  color: white;
  padding: 1.5rem 0;
`;

export const SidebarLogo = styled.div`
  padding: 0 1.5rem;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
`;

export const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const SidebarMenuItem = styled.li<{ active?: boolean }>`
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  background-color: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  
  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.mediumGray};
  }
`;

export const MainContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h1 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  th, td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  }
  
  th {
    background-color: ${({ theme }) => theme.colors.lightGray};
    font-weight: 500;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
`;

export const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const DangerButton = styled(ActionButton)`
  color: ${({ theme }) => theme.colors.error};
`;

export const Badge = styled.span<{ type: 'success' | 'warning' | 'error' | 'info' }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'success': return theme.colors.successLight;
      case 'warning': return theme.colors.warningLight;
      case 'error': return theme.colors.errorLight;
      case 'info': return theme.colors.infoLight;
    }
  }};
  
  color: ${({ type, theme }) => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'error': return theme.colors.error;
      case 'info': return theme.colors.info;
    }
  }};
`;

/**
 * styles/theme.ts - Theme configuration
 */
export const theme = {
  colors: {
    primary: '#3498db',
    primaryDark: '#2980b9',
    secondary: '#2ecc71',
    accent: '#e91e63',
    success: '#4CAF50',
    successLight: '#E8F5E9',
    warning: '#FF9800',
    warningLight: '#FFF8E1',
    error: '#F44336',
    errorLight: '#FFEBEE',
    info: '#2196F3',
    infoLight: '#E3F2FD',
    darkGray: '#333333',
    mediumGray: '#777777',
    lightGray: '#f5f5f5',
    white: '#ffffff',
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Roboto', sans-serif",
  },
  fontSizes: {
    h1: '24px',
    h2: '20px',
    h3: '18px',
    h4: '16px',
    body: '14px',
    small: '12px',
  },
  breakpoints: {
    xs: '576px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
  },
};

/**
 * styles/GlobalStyle.ts - Global styles
 */
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Roboto:wght@300;400;500;700&display=swap');
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.body};
    color: ${({ theme }) => theme.colors.darkGray};
    line-height: 1.5;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    margin-top: 0;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default GlobalStyle;

/**
 * components/dashboard/Dashboard.tsx - Dashboard component for couples
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '../../contexts/UserContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Layout from '../common/Layout';
import { Card, Button } from '../common/StyledComponents';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const DashboardCard = styled(Card)`
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: ${({ theme }) => theme.fontSizes.h3};
  }
`;

const WeddingOverviewCard = styled(DashboardCard)`
  grid-column: 1 / -1;
`;

const WeddingDetail = styled.div`
  margin-bottom: 0.5rem;
  
  strong {
    font-weight: 500;
  }
`;

const RsvpStatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  
  input[type="checkbox"] {
    margin-right: 0.5rem;
  }
`;

const ActivityItem = styled.div`
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const ViewAllLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const Dashboard: React.FC = () => {
  const { userDetails } = useUser();
  const { translate } = useLanguage();
  const [wedding, setWedding] = useState<any>(null);
  const [rsvpStats, setRsvpStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([
    { id: 1, text: 'Send invitations', completed: true },
    { id: 2, text: 'Finalize menu', completed: false },
    { id: 3, text: 'Complete seating', completed: false },
    { id: 4, text: 'Confirm vendors', completed: false },
  ]);
  
  useEffect(() => {
    if (userDetails) {
      fetchWeddingData();
    }
  }, [userDetails]);
  
  const fetchWeddingData = async () => {
    try {
      // Fetch wedding data
      const { data: weddingData, error: weddingError } = await supabase
        .from('weddings')
        .select('*')
        .eq('couple_id', userDetails.id)
        .single();
      
      if (weddingError) throw weddingError;
      setWedding(weddingData);
      
      // Fetch RSVP statistics
      const { data: statsData, error: statsError } = await supabase
        .from('statistics')
        .select('*')
        .eq('wedding_id', weddingData.id)
        .single();
      
      if (statsError) throw statsError;
      setRsvpStats(statsData);
      
      // Fetch recent activity (simplified for test environment)
      setRecentActivity([
        { id: 1, text: 'John Smith accepted', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 2, text: 'Mary Johnson declined', timestamp: new Date(Date.now() - 172800000).toISOString() },
        { id: 3, text: 'Table #3 added', timestamp: new Date(Date.now() - 259200000).toISOString() },
      ]);
    } catch (error) {
      console.error('Error fetching wedding data:', error);
    }
  };
  
  const handleTaskToggle = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  return (
    <Layout title={translate('dashboard.title')}>
      {wedding && (
        <>
          <WeddingOverviewCard>
            <h3>{translate('dashboard.wedding_overview')}</h3>
            <WeddingDetail>
              <strong>{translate('dashboard.wedding_date')}:</strong> {new Date(wedding.wedding_date).toLocaleDateString()}
            </WeddingDetail>
            <WeddingDetail>
              <strong>{translate('dashboard.location')}:</strong> {wedding.location}
            </WeddingDetail>
            <WeddingDetail>
              <strong>{translate('dashboard.style')}:</strong> {wedding.style}
            </WeddingDetail>
            <WeddingDetail>
              <strong>{translate('dashboard.rsvp_deadline')}:</strong> {new Date(wedding.rsvp_deadline).toLocaleDateString()}
            </WeddingDetail>
          </WeddingOverviewCard>
          
          <DashboardGrid>
            <DashboardCard>
              <h3>{translate('dashboard.rsvp_status')}</h3>
              {rsvpStats && (
                <>
                  <RsvpStatusItem>
                    <span>{translate('stats.accepted')}:</span>
                    <strong>{rsvpStats.accepted_count}</strong>
                  </RsvpStatusItem>
                  <RsvpStatusItem>
                    <span>{translate('stats.declined')}:</span>
                    <strong>{rsvpStats.declined_count}</strong>
                  </RsvpStatusItem>
                  <RsvpStatusItem>
                    <span>{translate('stats.pending')}:</span>
                    <strong>{rsvpStats.pending_count}</strong>
                  </RsvpStatusItem>
                </>
              )}
              <ViewAllLink to="/statistics">{translate('dashboard.view_details')}</ViewAllLink>
            </DashboardCard>
            
            <DashboardCard>
              <h3>{translate('dashboard.tasks')}</h3>
              {tasks.map(task => (
                <TaskItem key={task.id}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskToggle(task.id)}
                  />
                  <span>{task.text}</span>
                </TaskItem>
              ))}
              <ViewAllLink to="#">{translate('dashboard.view_all_tasks')}</ViewAllLink>
            </DashboardCard>
            
            <DashboardCard>
              <h3>{translate('dashboard.recent_activity')}</h3>
              {recentActivity.map(activity => (
                <ActivityItem key={activity.id}>
                  • {activity.text}
                </ActivityItem>
              ))}
            </DashboardCard>
            
            <DashboardCard>
              <h3>{translate('dashboard.quick_actions')}</h3>
              <Button as={Link} to="/guests" style={{ display: 'block', marginBottom: '0.75rem' }}>
                {translate('dashboard.add_guest')}
              </Button>
              <Button as={Link} to="/guests" style={{ display: 'block', marginBottom: '0.75rem' }}>
                {translate('dashboard.send_reminder')}
              </Button>
              <Button as={Link} to="/statistics" style={{ display: 'block' }}>
                {translate('dashboard.export_data')}
              </Button>
            </DashboardCard>
          </DashboardGrid>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;

/**
 * components/common/Layout.tsx - Common layout component
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../../contexts/UserContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  PageContainer,
  Sidebar,
  SidebarLogo,
  SidebarMenu,
  SidebarMenuItem,
  MainContent,
  PageHeader
} from './StyledComponents';

const UserMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const UserMenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.darkGray};
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:after {
    content: '▼';
    font-size: 0.75rem;
    margin-left: 0.5rem;
  }
`;

const UserMenuDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  min-width: 150px;
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  z-index: 100;
`;

const UserMenuDropdownItem = styled.button`
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const { userDetails, logout } = useUser();
  const { translate } = useLanguage();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  
  const isAdmin = userDetails?.role === 'admin';
  const isActivePath = (path: string) => location.pathname === path;
  
  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };
  
  return (
    <PageContainer>
      <Sidebar>
        <SidebarLogo>LemonVows</SidebarLogo>
        <SidebarMenu>
          {isAdmin ? (
            <>
              <SidebarMenuItem active={isActivePath('/admin')}>
                <Link to="/admin">{translate('nav.admin_dashboard')}</Link>
              </SidebarMenuItem>
              <SidebarMenuItem active={isActivePath('/admin/weddings')}>
                <Link to="/admin/weddings">{translate('nav.weddings')}</Link>
              </SidebarMenuItem>
              <SidebarMenuItem active={isActivePath('/admin/users')}>
                <Link to="/admin/users">{translate('nav.users')}</Link>
              </SidebarMenuItem>
              <SidebarMenuItem active={isActivePath('/admin/settings')}>
                <Link to="/admin/settings">{translate('nav.settings')}</Link>
              </SidebarMenuItem>
            </>
          ) : (
            <>
              <SidebarMenuItem active={isActivePath('/dashboard')}>
                <Link to="/dashboard">{translate('nav.dashboard')}</Link>
              </SidebarMenuItem>
              <SidebarMenuItem active={isActivePath('/guests')}>
                <Link to="/guests">{translate('nav.guests')}</Link>
              </SidebarMenuItem>
              <SidebarMenuItem active={isActivePath('/tables')}>
                <Link to="/tables">{translate('nav.tables')}</Link>
              </SidebarMenuItem>
              <SidebarMenuItem active={isActivePath('/menu')}>
                <Link to="/menu">{translate('nav.menu')}</Link>
              </SidebarMenuItem>
              <SidebarMenuItem active={isActivePath('/statistics')}>
                <Link to="/statistics">{translate('nav.statistics')}</Link>
              </SidebarMenuItem>
              <SidebarMenuItem active={isActivePath('/settings')}>
                <Link to="/settings">{translate('nav.settings')}</Link>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </Sidebar>
      
      <MainContent>
        <PageHeader>
          <h1>{title}</h1>
          
          <UserMenu>
            <UserMenuButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
              {userDetails?.first_name} {userDetails?.last_name}
            </UserMenuButton>
            
            <UserMenuDropdown isOpen={userMenuOpen}>
              <UserMenuDropdownItem onClick={() => setUserMenuOpen(false)}>
                {translate('user_menu.profile')}
              </UserMenuDropdownItem>
              <UserMenuDropdownItem onClick={handleLogout}>
                {translate('user_menu.logout')}
              </UserMenuDropdownItem>
            </UserMenuDropdown>
          </UserMenu>
        </PageHeader>
        
        {children}
      </MainContent>
    </PageContainer>
  );
};

export default Layout;

/**
 * components/statistics/StatisticsDashboard.tsx - Statistics dashboard component
 */
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import styled from 'styled-components';
import { useUser } from '../../contexts/UserContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Layout from '../common/Layout';
import { Card, Button, Table } from '../common/StyledComponents';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ExportDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const ExportButton = styled(Button)`
  display: flex;
  align-items: center;
  
  &:after {
    content: '▼';
    font-size: 0.75rem;
    margin-left: 0.5rem;
  }
`;

const ExportOptions = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  min-width: 100px;
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  z-index: 100;
`;

const ExportOption = styled.button`
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SummaryCard = styled(Card)<{ type: 'total' | 'accepted' | 'declined' | 'pending' | 'accommodation' }>`
  text-align: center;
  padding: 1.5rem;
  
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'total': return theme.colors.infoLight;
      case 'accepted': return theme.colors.successLight;
      case 'declined': return theme.colors.errorLight;
      case 'pending': return theme.colors.warningLight;
      case 'accommodation': return theme.colors.lightGray;
    }
  }};
  
  .card-icon {
    font-size: 24px;
    margin-bottom: 0.5rem;
    color: ${({ type, theme }) => {
      switch (type) {
        case 'total': return theme.colors.info;
        case 'accepted': return theme.colors.success;
        case 'declined': return theme.colors.error;
        case 'pending': return theme.colors.warning;
        case 'accommodation': return theme.colors.darkGray;
      }
    }};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.fontSizes.small};
    margin: 0 0 0.5rem;
    color: ${({ theme }) => theme.colors.mediumGray};
  }
  
  .card-value {
    font-size: 24px;
    font-weight: 500;
  }
  
  .card-percentage {
    font-size: ${({ theme }) => theme.fontSizes.small};
    color: ${({ theme }) => theme.colors.mediumGray};
  }
`;

const ChartContainer = styled(Card)`
  margin-bottom: 1.5rem;
  
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
`;

const ChartWrapper = styled.div`
  height: 300px;
`;

const DashboardRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const StatisticsDashboard: React.FC = () => {
  const { userDetails } = useUser();
  const { translate } = useLanguage();
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any>(null);
  const [groupsData, setGroupsData] = useState<any>(null);
  const [tablesData, setTablesData] = useState<any>(null);
  
  useEffect(() => {
    if (userDetails) {
      fetchStatisticsData();
    }
  }, [userDetails]);
  
  const fetchStatisticsData = async () => {
    try {
      // Fetch wedding ID
      const { data: weddingData, error: weddingError } = await supabase
        .from('weddings')
        .select('id')
        .eq('couple_id', userDetails.id)
        .single();
      
      if (weddingError) throw weddingError;
      
      // Fetch basic statistics
      const { data: statsData, error: statsError } = await supabase
        .from('statistics')
        .select('*')
        .eq('wedding_id', weddingData.id)
        .single();
      
      if (statsError) throw statsError;
      setStatistics(statsData);
      
      // For the test environment, we'll use mock data for the charts
      // In a real implementation, these would be fetched from the backend
      
      // Mock timeline data
      setTimelineData({
        labels: ['Mar 1', 'Mar 5', 'Mar 10', 'Mar 15', 'Mar 20', 'Mar 25'],
        datasets: [
          {
            label: translate('stats.cumulative_accepted'),
            data: [0, 10, 20, 30, 40, 45],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            fill: true
          },
          {
            label: translate('stats.cumulative_declined'),
            data: [0, 2, 5, 8, 10, 12],
            borderColor: '#F44336',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            fill: true
          },
          {
            label: translate('stats.daily_accepted'),
            data: [0, 10, 10, 10, 10, 5],
            borderColor: '#8BC34A',
            backgroundColor: 'rgba(139, 195, 74, 0.5)',
            type: 'bar'
          },
          {
            label: translate('stats.daily_declined'),
            data: [0, 2, 3, 3, 2, 2],
            borderColor: '#FF9800',
            backgroundColor: 'rgba(255, 152, 0, 0.5)',
            type: 'bar'
          }
        ]
      });
      
      // Mock groups data
      setGroupsData({
        labels: ['Family', 'Friends', 'Colleagues'],
        datasets: [
          {
            label: translate('stats.accepted'),
            data: [20, 15, 10],
            backgroundColor: 'rgba(76, 175, 80, 0.7)'
          },
          {
            label: translate('stats.declined'),
            data: [5, 4, 3],
            backgroundColor: 'rgba(244, 67, 54, 0.7)'
          },
          {
            label: translate('stats.pending'),
            data: [10, 8, 5],
            backgroundColor: 'rgba(255, 152, 0, 0.7)'
          }
        ]
      });
      
      // Mock tables data
      setTablesData([
        { id: 1, name: 'Table 1', capacity: 8, assigned: 8, accepted: 6, declined: 1, pending: 1, utilization: 75 },
        { id: 2, name: 'Table 2', capacity: 8, assigned: 6, accepted: 4, declined: 0, pending: 2, utilization: 67 },
        { id: 3, name: 'Table 3', capacity: 8, assigned: 4, accepted: 2, declined: 1, pending: 1, utilization: 50 },
        { id: 4, name: 'Table 4', capacity: 8, assigned: 8, accepted: 7, declined: 0, pending: 1, utilization: 88 },
        { id: 5, name: 'Table 5', capacity: 8, assigned: 5, accepted: 3, declined: 2, pending: 0, utilization: 60 },
        { id: 6, name: 'Head Table', capacity: 6, assigned: 6, accepted: 6, declined: 0, pending: 0, utilization: 100 },
      ]);
    } catch (error) {
      console.error('Error fetching statistics data:', error);
    }
  };
  
  const handleExport = (format: string) => {
    // In a real implementation, this would call the backend to generate the export
    console.log(`Exporting statistics as ${format}`);
    setExportMenuOpen(false);
  };
  
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };
  
  return (
    <Layout title={translate('stats.dashboard_title')}>
      <DashboardHeader>
        <Button onClick={fetchStatisticsData}>
          {translate('stats.refresh')}
        </Button>
        
        <ExportDropdown>
          <ExportButton onClick={() => setExportMenuOpen(!exportMenuOpen)}>
            {translate('stats.export')}
          </ExportButton>
          
          <ExportOptions isOpen={exportMenuOpen}>
            <ExportOption onClick={() => handleExport('csv')}>CSV</ExportOption>
            <ExportOption onClick={() => handleExport('excel')}>Excel</ExportOption>
            <ExportOption onClick={() => handleExport('pdf')}>PDF</ExportOption>
          </ExportOptions>
        </ExportDropdown>
      </DashboardHeader>
      
      {statistics && (
        <>
          <h2>{translate('stats.rsvp_summary')}</h2>
          <SummaryCards>
            <SummaryCard type="total">
              <div className="card-icon">👥</div>
              <h3>{translate('stats.total_guests')}</h3>
              <div className="card-value">{statistics.total_guests}</div>
            </SummaryCard>
            
            <SummaryCard type="accepted">
              <div className="card-icon">✓</div>
              <h3>{translate('stats.accepted')}</h3>
              <div className="card-value">{statistics.accepted_count}</div>
              <div className="card-percentage">
                {calculatePercentage(statistics.accepted_count, statistics.total_guests)}%
              </div>
            </SummaryCard>
            
            <SummaryCard type="declined">
              <div className="card-icon">✗</div>
              <h3>{translate('stats.declined')}</h3>
              <div className="card-value">{statistics.declined_count}</div>
              <div className="card-percentage">
                {calculatePercentage(statistics.declined_count, statistics.total_guests)}%
              </div>
            </SummaryCard>
            
            <SummaryCard type="pending">
              <div className="card-icon">⏱</div>
              <h3>{translate('stats.pending')}</h3>
              <div className="card-value">{statistics.pending_count}</div>
              <div className="card-percentage">
                {calculatePercentage(statistics.pending_count, statistics.total_guests)}%
              </div>
            </SummaryCard>
            
            <SummaryCard type="accommodation">
              <div className="card-icon">🏨</div>
              <h3>{translate('stats.needs_accommodation')}</h3>
              <div className="card-value">{statistics.needs_accommodation_count}</div>
              <div className="card-percentage">
                {calculatePercentage(statistics.needs_accommodation_count, statistics.accepted_count)}%
                <span className="percentage-label"> {translate('stats.of_accepted')}</span>
              </div>
            </SummaryCard>
          </SummaryCards>
          
          <ChartContainer>
            <h3>{translate('stats.rsvp_timeline')}</h3>
            <ChartWrapper>
              {timelineData && (
                <Line
                  data={timelineData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: translate('stats.date')
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: translate('stats.responses')
                        },
                        beginAtZero: true
                      }
                    }
                  }}
                />
              )}
            </ChartWrapper>
          </ChartContainer>
          
          <DashboardRow>
            <ChartContainer>
              <h3>{translate('stats.guest_groups')}</h3>
              <ChartWrapper>
                {groupsData && (
                  <Bar
                    data={groupsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          stacked: true,
                          title: {
                            display: true,
                            text: translate('stats.guest_group')
                          }
                        },
                        y: {
                          stacked: true,
                          title: {
                            display: true,
                            text: translate('stats.guests')
                          },
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                )}
              </ChartWrapper>
            </ChartContainer>
            
            <ChartContainer>
              <h3>{translate('stats.dietary_requirements')}</h3>
              <ChartWrapper>
                {statistics && (
                  <Pie
                    data={{
                      labels: [
                        translate('food.vegetarian'),
                        translate('food.vegan'),
                        translate('food.gluten_free'),
                        translate('food.dairy_free'),
                        translate('stats.with_allergies')
                      ],
                      datasets: [{
                        data: [
                          statistics.vegetarian_count,
                          statistics.vegan_count,
                          statistics.gluten_free_count,
                          statistics.dairy_free_count,
                          statistics.with_allergies_count
                        ],
                        backgroundColor: [
                          'rgba(76, 175, 80, 0.7)',
                          'rgba(139, 195, 74, 0.7)',
                          'rgba(255, 235, 59, 0.7)',
                          'rgba(255, 152, 0, 0.7)',
                          'rgba(244, 67, 54, 0.7)'
                        ]
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right'
                        }
                      }
                    }}
                  />
                )}
              </ChartWrapper>
            </ChartContainer>
          </DashboardRow>
          
          <ChartContainer>
            <h3>{translate('stats.table_statistics')}</h3>
            {tablesData && (
              <Table>
                <thead>
                  <tr>
                    <th>{translate('stats.table')}</th>
                    <th>{translate('stats.capacity')}</th>
                    <th>{translate('stats.assigned')}</th>
                    <th>{translate('stats.available')}</th>
                    <th>{translate('stats.accepted')}</th>
                    <th>{translate('stats.declined')}</th>
                    <th>{translate('stats.pending')}</th>
                    <th>{translate('stats.utilization')}</th>
                  </tr>
                </thead>
                <tbody>
                  {tablesData.map((table: any) => (
                    <tr key={table.id}>
                      <td>{table.name}</td>
                      <td>{table.capacity}</td>
                      <td>{table.assigned}</td>
                      <td>{table.capacity - table.assigned}</td>
                      <td>{table.accepted}</td>
                      <td>{table.declined}</td>
                      <td>{table.pending}</td>
                      <td>
                        <div style={{
                          width: '100%',
                          height: '20px',
                          backgroundColor: '#f5f5f5',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${table.utilization}%`,
                            backgroundColor: 
                              table.utilization >= 80 ? '#4CAF50' :
                              table.utilization >= 50 ? '#FF9800' : '#F44336',
                            borderRadius: '10px'
                          }}></div>
                          <span style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#333',
                            fontSize: '12px',
                            fontWeight: 500
                          }}>
                            {table.utilization}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </ChartContainer>
        </>
      )}
    </Layout>
  );
};

export default StatisticsDashboard;
