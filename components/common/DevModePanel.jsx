import React, { useState } from 'react';
import styled from 'styled-components';

const DevPanelContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #2c3e50;
  color: white;
  z-index: 9999;
  transition: height 0.3s ease;
  height: ${props => props.expanded ? '300px' : '30px'};
  overflow: hidden;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
`;

const DevPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 15px;
  background-color: #34495e;
  cursor: pointer;
`;

const DevPanelTitle = styled.div`
  font-weight: bold;
`;

const DevPanelContent = styled.div`
  padding: 15px;
  height: calc(100% - 30px);
  overflow-y: auto;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #7f8c8d;
  margin-bottom: 15px;
`;

const Tab = styled.div`
  padding: 8px 15px;
  cursor: pointer;
  background-color: ${props => props.active ? '#3498db' : 'transparent'};
  border-radius: 4px 4px 0 0;
  margin-right: 5px;
  
  &:hover {
    background-color: ${props => props.active ? '#3498db' : '#465c6e'};
  }
`;

const TabContent = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  margin: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const TestAccountsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
`;

const TestAccountCard = styled.div`
  background-color: #465c6e;
  border-radius: 4px;
  padding: 10px;
`;

const RsvpCodeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
`;

const RsvpCodeCard = styled.div`
  background-color: #465c6e;
  border-radius: 4px;
  padding: 10px;
  font-size: 0.9rem;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 5px;
  
  strong {
    min-width: 120px;
    display: inline-block;
  }
`;

const DevModePanel = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('accounts');
  
  const testAccounts = [
    { role: 'Admin', email: 'admin@lemonvows.com', password: 'TestAdmin2025!' },
    { role: 'Brautpaar 1', email: 'couple1@lemonvows.com', password: 'TestCouple2025!' },
    { role: 'Brautpaar 2', email: 'couple2@lemonvows.com', password: 'TestCouple2025!' },
  ];
  
  const rsvpCodes = [
    { code: 'jodo-abc-123', guest: 'John Smith', wedding: 'Sarah & Thomas' },
    { code: 'jasn-def-456', guest: 'Jane Smith', wedding: 'Sarah & Thomas' },
    { code: 'rojo-ghi-789', guest: 'Robert Johnson', wedding: 'Sarah & Thomas' },
    { code: 'wijo-klm-789', guest: 'William Johnson', wedding: 'Emma & Michael' },
  ];
  
  const loginAs = (account) => {
    console.log(`Logging in as ${account.role}: ${account.email}`);
    // In a real implementation, this would set the authentication state
    alert(`Logged in as ${account.role}: ${account.email}`);
  };
  
  const useRsvpCode = (code) => {
    console.log(`Using RSVP code: ${code.code}`);
    // In a real implementation, this would navigate to the RSVP page with the code
    window.location.href = `/demo?code=${code.code}`;
  };
  
  const changeLanguage = (lang) => {
    console.log(`Changing language to: ${lang}`);
    // In a real implementation, this would change the application language
    alert(`Language changed to: ${lang}`);
  };
  
  return (
    <DevPanelContainer expanded={expanded}>
      <DevPanelHeader onClick={() => setExpanded(!expanded)}>
        <DevPanelTitle>LemonVows Developer Mode</DevPanelTitle>
        <div>{expanded ? '▼' : '▲'}</div>
      </DevPanelHeader>
      
      {expanded && (
        <DevPanelContent>
          <TabContainer>
            <Tab 
              active={activeTab === 'accounts'} 
              onClick={() => setActiveTab('accounts')}
            >
              Test Accounts
            </Tab>
            <Tab 
              active={activeTab === 'rsvp'} 
              onClick={() => setActiveTab('rsvp')}
            >
              RSVP Codes
            </Tab>
            <Tab 
              active={activeTab === 'language'} 
              onClick={() => setActiveTab('language')}
            >
              Language
            </Tab>
            <Tab 
              active={activeTab === 'info'} 
              onClick={() => setActiveTab('info')}
            >
              System Info
            </Tab>
          </TabContainer>
          
          <TabContent active={activeTab === 'accounts'}>
            <h3>Test Accounts</h3>
            <p>Click on an account to log in with these credentials:</p>
            
            <TestAccountsGrid>
              {testAccounts.map((account, index) => (
                <TestAccountCard key={index}>
                  <div><strong>{account.role}</strong></div>
                  <div style={{ fontSize: '0.8rem', marginBottom: '5px' }}>
                    {account.email} / {account.password}
                  </div>
                  <Button onClick={() => loginAs(account)}>Login as {account.role}</Button>
                </TestAccountCard>
              ))}
            </TestAccountsGrid>
          </TabContent>
          
          <TabContent active={activeTab === 'rsvp'}>
            <h3>Test RSVP Codes</h3>
            <p>Click on a code to use it in the RSVP form:</p>
            
            <RsvpCodeGrid>
              {rsvpCodes.map((code, index) => (
                <RsvpCodeCard key={index}>
                  <div><strong>{code.code}</strong></div>
                  <div>{code.guest}</div>
                  <div style={{ fontSize: '0.8rem', marginBottom: '5px' }}>{code.wedding}</div>
                  <Button onClick={() => useRsvpCode(code)}>Use Code</Button>
                </RsvpCodeCard>
              ))}
            </RsvpCodeGrid>
          </TabContent>
          
          <TabContent active={activeTab === 'language'}>
            <h3>Change Language</h3>
            <p>Select a language to change the application interface:</p>
            
            <div>
              <Button onClick={() => changeLanguage('de')}>Deutsch</Button>
              <Button onClick={() => changeLanguage('en')}>English</Button>
              <Button onClick={() => changeLanguage('fr')}>Français</Button>
              <Button onClick={() => changeLanguage('es')}>Español</Button>
            </div>
          </TabContent>
          
          <TabContent active={activeTab === 'info'}>
            <h3>System Information</h3>
            
            <div style={{ background: '#465c6e', padding: '10px', borderRadius: '4px' }}>
              <InfoRow>
                <strong>Environment:</strong> 
                <span>Netlify ({process.env.NODE_ENV})</span>
              </InfoRow>
              <InfoRow>
                <strong>API Endpoint:</strong> 
                <span>/.netlify/functions/api</span>
              </InfoRow>
              <InfoRow>
                <strong>Supabase URL:</strong> 
                <span>{process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured'}</span>
              </InfoRow>
              <InfoRow>
                <strong>Version:</strong> 
                <span>1.0.0</span>
              </InfoRow>
              <InfoRow>
                <strong>Build Date:</strong> 
                <span>{new Date().toISOString().split('T')[0]}</span>
              </InfoRow>
            </div>
          </TabContent>
        </DevPanelContent>
      )}
    </DevPanelContainer>
  );
};

export default DevModePanel;
