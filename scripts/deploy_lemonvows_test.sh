#!/bin/bash

# LemonVows Test Deployment Script
# This script sets up and deploys a test version of the LemonVows wedding planning app

# Exit on error
set -e

echo "Starting LemonVows test deployment..."

# Create project directory
mkdir -p /home/ubuntu/lemonvows-test
cd /home/ubuntu/lemonvows-test

# Initialize package.json
echo "Initializing package.json..."
cat > package.json << 'EOF'
{
  "name": "lemonvows-test",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@supabase/supabase-js": "^1.35.6",
    "chart.js": "^3.9.1",
    "react": "^18.2.0",
    "react-chartjs-2": "^4.3.1",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.4.2",
    "styled-components": "^5.3.6",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/node": "^16.11.64",
    "@types/react": "^18.0.21",
    "@types/react-dom": "^18.0.6",
    "@types/styled-components": "^5.1.26",
    "react-scripts": "5.0.1",
    "typescript": "^4.8.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF

# Create .env file with Supabase configuration
echo "Creating .env file..."
cat > .env << 'EOF'
REACT_APP_SUPABASE_URL=https://xyzcompletely123fake.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBsZXRlbHkxMjNmYWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MTY1MjExMzAsImV4cCI6MTkzMjA5NzEzMH0.fake_key_for_testing_purposes_only
EOF

# Create project structure
echo "Creating project structure..."
mkdir -p public src/api src/components/auth src/components/common src/components/dashboard src/components/guests src/components/menu src/components/rsvp src/components/statistics src/components/tables src/components/admin src/contexts src/hooks src/i18n src/styles

# Copy source files from our development files
echo "Copying source files..."
cp /home/ubuntu/lemonvows_frontend.tsx /home/ubuntu/lemonvows-test/src/frontend.tsx
cp /home/ubuntu/lemonvows_backend_integration.js /home/ubuntu/lemonvows-test/src/backend.js
cp /home/ubuntu/lemonvows_multilingual_support.js /home/ubuntu/lemonvows-test/src/i18n/index.js
cp /home/ubuntu/lemonvows_test_data.sql /home/ubuntu/lemonvows-test/database/init.sql

# Create index.html
echo "Creating index.html..."
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#3498db" />
    <meta
      name="description"
      content="LemonVows - Wedding Planning App"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <title>LemonVows</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# Create manifest.json
echo "Creating manifest.json..."
cat > public/manifest.json << 'EOF'
{
  "short_name": "LemonVows",
  "name": "LemonVows Wedding Planning",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#3498db",
  "background_color": "#ffffff"
}
EOF

# Create index.js
echo "Creating index.js..."
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# Create App.js
echo "Creating App.js..."
cat > src/App.js << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import TranslationManager from './i18n/TranslationManager';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { UserProvider } from './contexts/UserContext';
import { LanguageProvider } from './i18n';
import { theme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';

const App = () => {
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
              <Route path="/admin/translations" element={
                <ProtectedRoute roles={['admin']}>
                  <TranslationManager />
                </ProtectedRoute>
              } />
              
              {/* Default route */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
EOF

# Create styles/theme.js
echo "Creating theme.js..."
cat > src/styles/theme.js << 'EOF'
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
EOF

# Create styles/GlobalStyle.js
echo "Creating GlobalStyle.js..."
cat > src/styles/GlobalStyle.js << 'EOF'
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
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
EOF

# Create contexts/UserContext.js
echo "Creating UserContext.js..."
cat > src/contexts/UserContext.js << 'EOF'
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../api/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
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

  const fetchUserDetails = async (userId) => {
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

  const login = async (email, password) => {
    try {
      // For the test environment, we'll simulate login with test accounts
      let testUser = null;
      let testUserDetails = null;
      
      if (email === 'admin@lemonvows.com' && password === 'TestAdmin2025!') {
        testUser = { id: '11111111-1111-1111-1111-111111111111' };
        testUserDetails = {
          id: '11111111-1111-1111-1111-111111111111',
          email: 'admin@lemonvows.com',
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          preferred_language: 'de'
        };
      } else if (email === 'couple1@lemonvows.com' && password === 'TestCouple2025!') {
        testUser = { id: '22222222-2222-2222-2222-222222222222' };
        testUserDetails = {
          id: '22222222-2222-2222-2222-222222222222',
          email: 'couple1@lemonvows.com',
          first_name: 'Sarah',
          last_name: 'Smith',
          role: 'couple',
          preferred_language: 'de'
        };
      } else if (email === 'couple2@lemonvows.com' && password === 'TestCouple2025!') {
        testUser = { id: '33333333-3333-3333-3333-333333333333' };
        testUserDetails = {
          id: '33333333-3333-3333-3333-333333333333',
          email: 'couple2@lemonvows.com',
          first_name: 'Emma',
          last_name: 'Johnson',
          role: 'couple',
          preferred_language: 'en'
        };
      }
      
      if (testUser) {
        setUser(testUser);
        setUserDetails(testUserDetails);
        return { error: null };
      }
      
      return { error: { message: 'Invalid login credentials' } };
    } catch (error) {
      return { error };
    }
  };

  const logout = async () => {
    setUser(null);
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
EOF

# Create api/supabase.js
echo "Creating supabase.js..."
cat > src/api/supabase.js << 'EOF'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// For the test environment, we'll mock the Supabase client
// This allows us to simulate database operations without an actual Supabase instance

// Mock database tables with test data
const mockDatabase = {
  users: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'admin@lemonvows.com',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      preferred_language: 'de'
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'couple1@lemonvows.com',
      first_name: 'Sarah',
      last_name: 'Smith',
      role: 'couple',
      preferred_language: 'de'
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      email: 'couple2@lemonvows.com',
      first_name: 'Emma',
      last_name: 'Johnson',
      role: 'couple',
      preferred_language: 'en'
    }
  ],
  weddings: [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      couple_id: '22222222-2222-2222-2222-222222222222',
      wedding_name: 'Sarah & Michael',
      wedding_date: '2025-06-15',
      location: 'Grand Hotel, Berlin',
      description: 'We are excited to celebrate our special day with you!',
      style: 'elegant',
      rsvp_deadline: '2025-05-01',
      subscription_tier: 'premium'
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      couple_id: '33333333-3333-3333-3333-333333333333',
      wedding_name: 'Emma & James',
      wedding_date: '2025-07-22',
      location: 'Seaside Resort, Hamburg',
      description: 'Join us for our beach wedding celebration!',
      style: 'boho',
      rsvp_deadline: '2025-06-15',
      subscription_tier: 'basic'
    }
  ],
  // Add more mock data for other tables as needed
};

// Override Supabase methods with mock implementations
supabase.from = (table) => {
  return {
    select: (columns) => {
      return {
        eq: (column, value) => {
          return {
            single: () => {
              const result = mockDatabase[table]?.find(item => item[column] === value);
              return {
                data: result || null,
                error: result ? null : { message: `No ${table} found with ${column} = ${value}` }
              };
            },
            in: (column2, values) => {
              return {
                data: mockDatabase[table]?.filter(item => values.includes(item[column2])) || [],
                error: null
              };
            }
          };
        },
        order: (column, { ascending }) => {
          const sorted = [...(mockDatabase[table] || [])].sort((a, b) => {
            if (ascending) {
              return a[column] > b[column] ? 1 : -1;
            } else {
              return a[column] < b[column] ? 1 : -1;
            }
          });
          return {
            data: sorted,
            error: null
          };
        },
        data: mockDatabase[table] || [],
        error: null
      };
    },
    insert: (items) => {
      if (!mockDatabase[table]) {
        mockDatabase[table] = [];
      }
      const newItems = items.map(item => ({ ...item, id: Math.random().toString(36).substring(2, 15) }));
      mockDatabase[table].push(...newItems);
      return {
        data: newItems,
        error: null
      };
    },
    update: (updates) => {
      return {
        eq: (column, value) => {
          const index = mockDatabase[table]?.findIndex(item => item[column] === value);
          if (index !== -1 && index !== undefined) {
            mockDatabase[table][index] = { ...mockDatabase[table][index], ...updates };
            return {
              data: mockDatabase[table][index],
              error: null
            };
          }
          return {
            data: null,
            error: { message: `No ${table} found with ${column} = ${value}` }
          };
        }
      };
    },
    delete: () => {
      return {
        eq: (column, value) => {
          const index = mockDatabase[table]?.findIndex(item => item[column] === value);
          if (index !== -1 && index !== undefined) {
            const deleted = mockDatabase[table].splice(index, 1);
            return {
              data: deleted,
              error: null
            };
          }
          return {
            data: null,
            error: { message: `No ${table} found with ${column} = ${value}` }
          };
        }
      };
    }
  };
};

// Mock auth methods
supabase.auth = {
  signIn: ({ email, password }) => {
    const user = mockDatabase.users.find(u => u.email === email);
    if (user) {
      return { user, error: null };
    }
    return { user: null, error: { message: 'Invalid login credentials' } };
  },
  signOut: () => {
    return { error: null };
  },
  session: () => {
    return null; // No active session by default
  },
  user: () => {
    return null; // No active user by default
  },
  onAuthStateChange: (callback) => {
    // No-op for mock
    return { data: { unsubscribe: () => {} } };
  }
};
EOF

# Create components/auth/ProtectedRoute.js
echo "Creating ProtectedRoute.js..."
cat > src/components/auth/ProtectedRoute.js << 'EOF'
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, userDetails, loading } = useUser();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (roles.length > 0 && !roles.includes(userDetails?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
EOF

# Create components/auth/Login.js
echo "Creating Login.js..."
cat > src/components/auth/Login.js << 'EOF'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../../contexts/UserContext';
import { useLanguage } from '../../i18n';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 400px;
`;

const Logo = styled.div`
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

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
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

const Button = styled.button`
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

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.errorLight};
  color: ${({ theme }) => theme.colors.error};
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
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

const TestAccountsInfo = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.infoLight};
  border-radius: 4px;
  font-size: 0.875rem;
`;

const TestAccountsList = styled.ul`
  margin-top: 0.5rem;
  padding-left: 1.5rem;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useUser();
  const { translate } = useLanguage();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { error } = await login(email, password);
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
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
        
        <TestAccountsInfo>
          <strong>Test Accounts:</strong>
          <TestAccountsList>
            <li>Admin: admin@lemonvows.com / TestAdmin2025!</li>
            <li>Couple 1: couple1@lemonvows.com / TestCouple2025!</li>
            <li>Couple 2: couple2@lemonvows.com / TestCouple2025!</li>
          </TestAccountsList>
        </TestAccountsInfo>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
EOF

# Create components/rsvp/RsvpEntry.js
echo "Creating RsvpEntry.js..."
cat > src/components/rsvp/RsvpEntry.js << 'EOF'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../../i18n';

const RsvpEntryContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

const RsvpEntryCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 400px;
  text-align: center;
`;

const Logo = styled.div`
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

const RsvpForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Input = styled.input`
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

const Button = styled.button`
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

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.errorLight};
  color: ${({ theme }) => theme.colors.error};
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const TestCodesInfo = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.infoLight};
  border-radius: 4px;
  font-size: 0.875rem;
`;

const TestCodesList = styled.ul`
  margin-top: 0.5rem;
  padding-left: 1.5rem;
  text-align: left;
`;

const RsvpEntry = () => {
  const [rsvpCode, setRsvpCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { translate } = useLanguage();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // For the test environment, we'll accept specific test codes
      const validCodes = ['jodo-abc-123', 'jasn-def-456', 'rojo-ghi-789', 'wijo-klm-789'];
      
      if (validCodes.includes(rsvpCode)) {
        navigate(`/rsvp/${rsvpCode}`);
      } else {
        setError('Invalid RSVP code');
      }
    } catch (err) {
      setError('An error occurred');
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
        
        <TestCodesInfo>
          <strong>Test RSVP Codes:</strong>
          <TestCodesList>
            <li>jodo-abc-123 (John Smith - Sarah's wedding)</li>
            <li>jasn-def-456 (Jane Smith - Sarah's wedding)</li>
            <li>rojo-ghi-789 (Robert Johnson - Sarah's wedding)</li>
            <li>wijo-klm-789 (William Johnson - Emma's wedding)</li>
          </TestCodesList>
        </TestCodesInfo>
      </RsvpEntryCard>
    </RsvpEntryContainer>
  );
};

export default RsvpEntry;
EOF

# Create a simple server.js for the test deployment
echo "Creating server.js..."
cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`LemonVows test server is running on port ${port}`);
});
EOF

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the app
echo "Building the app..."
npm run build

# Install express for serving the app
echo "Installing express..."
npm install express

echo "LemonVows test deployment setup complete!"
