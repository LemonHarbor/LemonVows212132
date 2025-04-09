import React, { useState } from 'react';
import styled from 'styled-components';

const DevModePanelContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #333;
  color: white;
  z-index: 9999;
  padding: 10px;
  font-family: monospace;
  font-size: 14px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  transition: height 0.3s ease;
  height: ${({ expanded }) => (expanded ? '300px' : '40px')};
  overflow: hidden;
`;

const DevModePanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ expanded }) => (expanded ? '10px' : '0')};
  cursor: pointer;
`;

const DevModePanelTitle = styled.div`
  font-weight: bold;
  color: #ffcc00;
`;

const DevModePanelContent = styled.div`
  display: flex;
  height: calc(100% - 40px);
  overflow: hidden;
`;

const DevModePanelSection = styled.div`
  flex: 1;
  padding: 10px;
  border-right: 1px solid #555;
  overflow-y: auto;
  
  &:last-child {
    border-right: none;
  }
`;

const SectionTitle = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  color: #ffcc00;
  border-bottom: 1px solid #555;
  padding-bottom: 5px;
`;

const Button = styled.button`
  background-color: ${({ variant }) => 
    variant === 'primary' ? '#3498db' : 
    variant === 'danger' ? '#e74c3c' : 
    '#555'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Select = styled.select`
  background-color: #444;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 5px;
  margin: 5px;
  width: 100%;
`;

const Input = styled.input`
  background-color: #444;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 5px;
  margin: 5px 0;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin: 5px 0;
`;

const InfoItem = styled.div`
  margin: 5px 0;
  font-size: 12px;
  
  span {
    color: #aaa;
  }
`;

const DevModePanel = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [userState, setUserState] = useState({
    user: null,
    userDetails: null
  });
  const [language, setLanguage] = useState('de');
  
  // Mock test accounts
  const testAccounts = [
    { email: 'admin@lemonvows.com', password: 'TestAdmin2025!', role: 'admin' },
    { email: 'couple1@lemonvows.com', password: 'TestCouple2025!', role: 'couple' },
    { email: 'couple2@lemonvows.com', password: 'TestCouple2025!', role: 'couple' }
  ];
  
  // Mock RSVP codes
  const rsvpCodes = [
    { code: 'jodo-abc-123', guest: 'John Smith', wedding: 'Sarah & Michael' },
    { code: 'jasn-def-456', guest: 'Jane Smith', wedding: 'Sarah & Michael' },
    { code: 'rojo-ghi-789', guest: 'Robert Johnson', wedding: 'Sarah & Michael' },
    { code: 'wijo-klm-789', guest: 'William Johnson', wedding: 'Emma & James' }
  ];
  
  // Mock languages
  const languages = {
    de: 'Deutsch',
    en: 'English',
    fr: 'Français',
    es: 'Español'
  };
  
  const handleLogin = (account) => {
    // Mock login
    setUserState({
      user: { id: `user-${account.role}` },
      userDetails: {
        email: account.email,
        role: account.role,
        firstName: account.email.split('@')[0]
      }
    });
  };
  
  const handleLogout = () => {
    setUserState({
      user: null,
      userDetails: null
    });
  };
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  return (
    <DevModePanelContainer expanded={expanded}>
      <DevModePanelHeader expanded={expanded} onClick={toggleExpand}>
        <DevModePanelTitle>
          🍋 LemonVows Developer Mode {expanded ? '▼' : '▲'}
        </DevModePanelTitle>
        {!expanded && (
          <div>
            {userState.user ? `Logged in as: ${userState.userDetails?.email} (${userState.userDetails?.role})` : 'Not logged in'}
            {' | '}
            Language: {language.toUpperCase()}
          </div>
        )}
      </DevModePanelHeader>
      
      {expanded && (
        <DevModePanelContent>
          <DevModePanelSection>
            <SectionTitle>Test Accounts</SectionTitle>
            {testAccounts.map((account, index) => (
              <div key={index}>
                <InfoItem>
                  <strong>{account.email}</strong> ({account.role})
                </InfoItem>
                <Button 
                  variant="primary" 
                  onClick={() => handleLogin(account)}
                >
                  Login as {account.role}
                </Button>
              </div>
            ))}
            
            {userState.user && (
              <div style={{ marginTop: '20px' }}>
                <Button variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </DevModePanelSection>
          
          <DevModePanelSection>
            <SectionTitle>RSVP Testing</SectionTitle>
            {rsvpCodes.map((rsvp, index) => (
              <div key={index}>
                <InfoItem>
                  <strong>{rsvp.code}</strong>
                  <div><span>Guest:</span> {rsvp.guest}</div>
                  <div><span>Wedding:</span> {rsvp.wedding}</div>
                </InfoItem>
                <Button 
                  onClick={() => alert(`Testing RSVP code: ${rsvp.code}`)}
                >
                  Test RSVP
                </Button>
              </div>
            ))}
          </DevModePanelSection>
          
          <DevModePanelSection>
            <SectionTitle>Settings</SectionTitle>
            
            <Label>
              Language
              <Select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </Select>
            </Label>
            
            <div style={{ marginTop: '20px' }}>
              <SectionTitle>System Info</SectionTitle>
              <InfoItem>
                <span>Version:</span> 1.0.0-dev
              </InfoItem>
              <InfoItem>
                <span>Environment:</span> Development
              </InfoItem>
              <InfoItem>
                <span>React:</span> 18.x
              </InfoItem>
            </div>
          </DevModePanelSection>
        </DevModePanelContent>
      )}
    </DevModePanelContainer>
  );
};

export default DevModePanel;
