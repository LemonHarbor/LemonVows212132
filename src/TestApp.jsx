import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import SupabaseTest from './components/admin/SupabaseTest';

const NavLink = styled(Link)`
  margin-right: 15px;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const NavBar = styled.nav`
  padding: 15px 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const AppContainer = styled.div`
  padding-bottom: 60px; /* Space for dev panel */
`;

const TestApp = () => {
  return (
    <Router>
      <AppContainer>
        <NavBar>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/supabase-test">Supabase Test</NavLink>
        </NavBar>
        
        <Routes>
          <Route path="/supabase-test" element={<SupabaseTest />} />
          <Route path="/" element={
            <div style={{ padding: '20px' }}>
              <h1>LemonVows Test Environment</h1>
              <p>Welcome to the LemonVows test environment. Use the navigation links to test different components.</p>
              <div style={{ marginTop: '20px' }}>
                <h2>Available Tests:</h2>
                <ul>
                  <li><NavLink to="/supabase-test">Supabase Connection Test</NavLink> - Test the connection to Supabase backend</li>
                </ul>
              </div>
            </div>
          } />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default TestApp;
