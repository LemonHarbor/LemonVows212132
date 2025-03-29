import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { media } from '@styles/ResponsiveComponents';
import TranslatedText from '@components/TranslatedText';
import TranslatedButton from '@components/TranslatedButton';
import { checkSupabaseConnection, getWeddingSettings, updateWeddingSettings } from '@services/supabase';

const AdminDashboardContainer = styled.div`
  padding: 2rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  ${media.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const AdminTitle = styled.h2`
  font-size: 1.75rem;
  margin: 0;
`;

const ConnectionStatus = styled.div<{ connected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.connected ? 'var(--success-color)' : 'var(--error-color)'};
`;

const StatusIndicator = styled.span<{ connected: boolean }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.connected ? 'var(--success-color)' : 'var(--error-color)'};
`;

const AdminTabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
  overflow-x: auto;
  
  ${media.xs} {
    width: 100%;
  }
`;

const AdminTab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-color)'};
  font-weight: ${props => props.active ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)'};
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const TabContent = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: var(--font-weight-medium);
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(249, 202, 36, 0.2);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(249, 202, 36, 0.2);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  background-color: var(--background-color);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(249, 202, 36, 0.2);
  }
`;

const ColorPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ColorOption = styled.button<{ color: string; selected: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 2px solid ${props => props.selected ? 'var(--text-dark)' : 'transparent'};
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ToggleSwitch = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleLabel = styled.span`
  margin-right: 1rem;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: var(--primary-color);
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
  
  &:focus + span {
    box-shadow: 0 0 1px var(--primary-color);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-dark);
  transition: 0.4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  ${media.xs} {
    flex-direction: column;
  }
`;

const PreviewContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--background-light);
`;

const PreviewTitle = styled.h4`
  margin-bottom: 1rem;
`;

const PreviewContent = styled.div`
  /* Preview styles will be applied dynamically */
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: var(--background-color);
`;

const FeatureToggle = styled.div`
  margin-right: 1rem;
`;

const FeatureInfo = styled.div`
  flex: 1;
`;

const FeatureName = styled.div`
  font-weight: var(--font-weight-medium);
`;

const FeatureDescription = styled.div`
  font-size: 0.875rem;
  color: var(--text-light);
`;

const UserList = styled.div`
  margin-top: 1rem;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-weight: bold;
  color: var(--text-on-primary);
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: var(--font-weight-medium);
`;

const UserEmail = styled.div`
  font-size: 0.875rem;
  color: var(--text-light);
`;

const UserRole = styled.div`
  margin-left: 1rem;
`;

const NoCodeAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    appearance: {
      primaryColor: '#f9ca24',
      secondaryColor: '#4a69bd',
      fontFamily: 'Poppins, sans-serif',
      borderRadius: '8px',
      darkMode: false,
      highContrast: false,
    },
    content: {
      siteName: 'LemonVows',
      siteDescription: 'Ihre komplette Hochzeitsplanung in einer App',
      welcomeMessage: 'Willkommen bei Ihrer Hochzeitsplanung!',
      footerText: '© 2025 LemonVows. Alle Rechte vorbehalten.',
      contactEmail: 'kontakt@lemonvows.com',
      contactPhone: '+49 123 456789',
    },
    features: {
      tablePlanner: true,
      guestManagement: true,
      budgetTracker: true,
      musicRequests: true,
      gallery: true,
      rsvp: true,
      timeline: true,
      moodboard: false,
      vendorManagement: false,
      giftRegistry: false,
    },
    users: [
      { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', avatar: 'A' },
      { id: 2, name: 'Sarah & Thomas', email: 'sarah@example.com', role: 'couple', avatar: 'S' },
      { id: 3, name: 'Guest User', email: 'guest@example.com', role: 'guest', avatar: 'G' },
    ],
  });
  
  const [previewStyles, setPreviewStyles] = useState({});
  
  useEffect(() => {
    const checkConnection = async () => {
      const { connected: isConnected } = await checkSupabaseConnection();
      setConnected(isConnected);
      setLoading(false);
      
      if (isConnected) {
        // In a real app, we would fetch the wedding ID from context or props
        const weddingId = 'demo-wedding-id';
        const { data } = await getWeddingSettings(weddingId);
        
        if (data && data.settings) {
          setSettings(prevSettings => ({
            ...prevSettings,
            ...data.settings,
          }));
        }
      }
    };
    
    checkConnection();
  }, []);
  
  useEffect(() => {
    // Update preview styles when appearance settings change
    setPreviewStyles({
      '--primary-color': settings.appearance.primaryColor,
      '--secondary-color': settings.appearance.secondaryColor,
      '--font-family': settings.appearance.fontFamily,
      '--border-radius': settings.appearance.borderRadius,
      backgroundColor: settings.appearance.darkMode ? '#1a1a2e' : '#ffffff',
      color: settings.appearance.darkMode ? '#f8f9fa' : '#2c3e50',
    });
  }, [settings.appearance]);
  
  const handleColorChange = (colorType, color) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      appearance: {
        ...prevSettings.appearance,
        [colorType]: color,
      },
    }));
  };
  
  const handleToggleChange = (settingType, setting) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [settingType]: {
        ...prevSettings[settingType],
        [setting]: !prevSettings[settingType][setting],
      },
    }));
  };
  
  const handleInputChange = (settingType, setting, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [settingType]: {
        ...prevSettings[settingType],
        [setting]: value,
      },
    }));
  };
  
  const handleSaveSettings = async () => {
    // In a real app, we would save the settings to Supabase
    const weddingId = 'demo-wedding-id';
    await updateWeddingSettings(weddingId, settings);
    
    // Apply settings to the document root for global styling
    Object.entries(previewStyles).forEach(([property, value]) => {
      if (property.startsWith('--')) {
        document.documentElement.style.setProperty(property, value);
      }
    });
    
    // Apply dark mode if enabled
    if (settings.appearance.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Apply high contrast if enabled
    if (settings.appearance.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };
  
  const colorOptions = [
    { name: 'Yellow', value: '#f9ca24' },
    { name: 'Blue', value: '#4a69bd' },
    { name: 'Green', value: '#2ecc71' },
    { name: 'Red', value: '#e74c3c' },
    { name: 'Purple', value: '#9b59b6' },
    { name: 'Orange', value: '#e67e22' },
    { name: 'Teal', value: '#1abc9c' },
    { name: 'Pink', value: '#e84393' },
  ];
  
  const fontOptions = [
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
  ];
  
  const borderRadiusOptions = [
    { name: 'None', value: '0' },
    { name: 'Small', value: '4px' },
    { name: 'Medium', value: '8px' },
    { name: 'Large', value: '12px' },
    { name: 'Round', value: '24px' },
  ];
  
  if (loading) {
    return (
      <AdminDashboardContainer>
        <div className="loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <TranslatedText i18nKey="admin.loading" />
          </div>
        </div>
      </AdminDashboardContainer>
    );
  }
  
  return (
    <AdminDashboardContainer>
      <AdminHeader>
        <AdminTitle>
          <TranslatedText i18nKey="admin.title" />
        </AdminTitle>
        <ConnectionStatus connected={connected}>
          <StatusIndicator connected={connected} />
          {connected ? (
            <TranslatedText i18nKey="admin.connected" />
          ) : (
            <TranslatedText i18nKey="admin.disconnected" />
          )}
        </ConnectionStatus>
      </AdminHeader>
      
      <AdminTabs>
        <AdminTab 
          active={activeTab === 'appearance'} 
          onClick={() => setActiveTab('appearance')}
        >
          <TranslatedText i18nKey="admin.appearance" />
        </AdminTab>
        <AdminTab 
          active={activeTab === 'content'} 
          onClick={() => setActiveTab('content')}
        >
          <TranslatedText i18nKey="admin.content" />
        </AdminTab>
        <AdminTab 
          active={activeTab === 'features'} 
          onClick={() => setActiveTab('features')}
        >
          <TranslatedText i18nKey="admin.features" />
        </AdminTab>
        <AdminTab 
          active={activeTab === 'users'} 
          onClick={() => setActiveTab('users')}
        >
          <TranslatedText i18nKey="admin.users" />
        </AdminTab>
      </AdminTabs>
      
      {activeTab === 'appearance' && (
        <TabContent>
          <SectionTitle>
            <TranslatedText i18nKey="admin.appearanceSettings" />
          </SectionTitle>
          
          <FormGroup>
            <FormLabel>
              <TranslatedText i18nKey="admin.primaryColor" />
            </FormLabel>
            <ColorPicker>
              {colorOptions.map(color => (
                <ColorOption
                  key={color.value}
                  color={color.value}
                  selected={settings.appearance.primaryColor === color.value}
                  onClick={() => handleColorChange('primaryColor', color.value)}
                  title={color.name}
                />
              ))}
            </ColorPicker>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>
              <TranslatedText i18nKey="admin.secondaryColor" />
            </FormLabel>
            <ColorPicker>
              {colorOptions.map(color => (
                <ColorOption
                  key={color.value}
                  color={color.value}
                  selected={settings.appearance.secondaryColor === color.value}
                  onClick={() => handleColorChange('secondaryColor', color.value)}
                  title={color.name}
                />
              ))}
            </ColorPicker>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>
              <TranslatedText i18nKey="admin.fontFamily" />
            </FormLabel>
            <FormSelect
              value={settings.appearance.fontFamily}
              onChange={(e) => handleInputChange('appearance', 'fontFamily', e.target.value)}
            >
              {fontOptions.map(font => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>
              <TranslatedText i18nKey="admin.borderRadius" />
            </FormLabel>
            <FormSelect
              value={settings.appearance.borderRadius}
              onChange={(e) => handleInputChange('appearance', 'borderRadius', e.target.value)}
            >
              {borderRadiusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
          
          <FormGroup>
            <ToggleSwitch>
              <ToggleLabel>
                <TranslatedText i18nKey="admin.darkMode" />
              </ToggleLabel>
              <Switch>
                <SwitchInput
                  type="checkbox"
                  checked={settings.appearance.darkMode}
                  onChange={() => handleToggleChange('appearance', 'darkMode')}
                />
                <Slider />
              </Switch>
            </ToggleSwitch>
          </FormGroup>
          
          <FormGroup>
            <ToggleSwitch>
              <ToggleLabel>
                <TranslatedText i18nKey="admin.highContrast" />
              </ToggleLabel>
              <Switch>
                <SwitchInput
                  type="checkbox"
                  checked={settings.appearance.highContrast}
                  onChange={() => handleToggleChange('appearance', 'highContrast')}
                />
                <Slider />
              </Switch>
            </ToggleSwitch>
          </FormGroup>
          
          <PreviewContainer style={previewStyles as React.CSSProperties}>
            <PreviewTitle>
              <TranslatedText i18nKey="admin.preview" />
            </PreviewTitle>
            <PreviewContent>
              <h3 style={{ fontFamily: settings.appearance.fontFamily }}>
                {settings.content.siteName}
              </h3>
              <p>{settings.content.siteDescription}</p>
              <button
                style={{
                  backgroundColor: settings.appearance.primaryColor,
                  borderRadius: settings.appearance.borderRadius,
                  padding: '10px 20px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: settings.appearance.fontFamily,
                }}
              >
                <TranslatedText i18nKey="admin.previewButton" />
              </button>
            </PreviewContent>
          </PreviewContainer>
        </TabContent>
      )}
      
      {activeTab === 'content' && (
        <TabContent>
          <SectionTitle>
            <TranslatedText i18nKey="admin.contentSettings" />
          </SectionTitle>
          
          <FormGroup>
            <FormLabel>
              <TranslatedText i18nKey="admin.siteName" />
            </FormLabel>
            <FormInput
              type="text"
              value={settings.content.siteName}
              onChange={(e) => handleInputChange('content', 'siteName', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>
              <TranslatedText i18nKey="admin.siteDescription" />
            </FormLabel>
            <FormTextarea
              value={settings.content.siteDescription}
              onChange={(e) => handleInputChange('content', 'siteDescription', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>
              <TranslatedText i18nKey="admin.welcomeMessage" />
            </FormLabel>
            <FormTextarea
              value={settings.content.welcomeMessage}
              onChange={(e) => handleInputChange('content', 'welcomeMessage', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>
              <TranslatedText i18nKey="admin.footerText" />
            </FormLabel>
            <FormInput
              type="text"
              value={settings.content.footerText}
              onChange={(e) => handleInputChange('content', 'footerText', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>
              <TranslatedText i18nKey="admin.contactEmail" />
            </FormLabel>
            <FormInput
              type="email"
              value={settings.content.contactEmail}
              onChange={(e) => handleInputChange('content', 'contactEmail', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>
              <TranslatedText i18nKey="admin.contactPhone" />
            </FormLabel>
            <FormInput
              type="tel"
              value={settings.content.contactPhone}
              onChange={(e) => handleInputChange('content', 'contactPhone', e.target.value)}
            />
          </FormGroup>
          
          <PreviewContainer style={previewStyles as React.CSSProperties}>
            <PreviewTitle>
              <TranslatedText i18nKey="admin.preview" />
            </PreviewTitle>
            <PreviewContent>
              <h3 style={{ fontFamily: settings.appearance.fontFamily }}>
                {settings.content.siteName}
              </h3>
              <p>{settings.content.siteDescription}</p>
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: settings.appearance.borderRadius }}>
                {settings.content.welcomeMessage}
              </div>
              <div style={{ marginTop: '20px', fontSize: '0.8rem' }}>
                {settings.content.footerText}
              </div>
            </PreviewContent>
          </PreviewContainer>
        </TabContent>
      )}
      
      {activeTab === 'features' && (
        <TabContent>
          <SectionTitle>
            <TranslatedText i18nKey="admin.featureSettings" />
          </SectionTitle>
          
          <FeatureList>
            <FeatureItem>
              <FeatureToggle>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={settings.features.tablePlanner}
                    onChange={() => handleToggleChange('features', 'tablePlanner')}
                  />
                  <Slider />
                </Switch>
              </FeatureToggle>
              <FeatureInfo>
                <FeatureName>
                  <TranslatedText i18nKey="admin.tablePlanner" />
                </FeatureName>
                <FeatureDescription>
                  <TranslatedText i18nKey="admin.tablePlannerDesc" />
                </FeatureDescription>
              </FeatureInfo>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureToggle>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={settings.features.guestManagement}
                    onChange={() => handleToggleChange('features', 'guestManagement')}
                  />
                  <Slider />
                </Switch>
              </FeatureToggle>
              <FeatureInfo>
                <FeatureName>
                  <TranslatedText i18nKey="admin.guestManagement" />
                </FeatureName>
                <FeatureDescription>
                  <TranslatedText i18nKey="admin.guestManagementDesc" />
                </FeatureDescription>
              </FeatureInfo>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureToggle>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={settings.features.budgetTracker}
                    onChange={() => handleToggleChange('features', 'budgetTracker')}
                  />
                  <Slider />
                </Switch>
              </FeatureToggle>
              <FeatureInfo>
                <FeatureName>
                  <TranslatedText i18nKey="admin.budgetTracker" />
                </FeatureName>
                <FeatureDescription>
                  <TranslatedText i18nKey="admin.budgetTrackerDesc" />
                </FeatureDescription>
              </FeatureInfo>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureToggle>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={settings.features.musicRequests}
                    onChange={() => handleToggleChange('features', 'musicRequests')}
                  />
                  <Slider />
                </Switch>
              </FeatureToggle>
              <FeatureInfo>
                <FeatureName>
                  <TranslatedText i18nKey="admin.musicRequests" />
                </FeatureName>
                <FeatureDescription>
                  <TranslatedText i18nKey="admin.musicRequestsDesc" />
                </FeatureDescription>
              </FeatureInfo>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureToggle>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={settings.features.gallery}
                    onChange={() => handleToggleChange('features', 'gallery')}
                  />
                  <Slider />
                </Switch>
              </FeatureToggle>
              <FeatureInfo>
                <FeatureName>
                  <TranslatedText i18nKey="admin.gallery" />
                </FeatureName>
                <FeatureDescription>
                  <TranslatedText i18nKey="admin.galleryDesc" />
                </FeatureDescription>
              </FeatureInfo>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureToggle>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={settings.features.rsvp}
                    onChange={() => handleToggleChange('features', 'rsvp')}
                  />
                  <Slider />
                </Switch>
              </FeatureToggle>
              <FeatureInfo>
                <FeatureName>
                  <TranslatedText i18nKey="admin.rsvp" />
                </FeatureName>
                <FeatureDescription>
                  <TranslatedText i18nKey="admin.rsvpDesc" />
                </FeatureDescription>
              </FeatureInfo>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureToggle>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={settings.features.timeline}
                    onChange={() => handleToggleChange('features', 'timeline')}
                  />
                  <Slider />
                </Switch>
              </FeatureToggle>
              <FeatureInfo>
                <FeatureName>
                  <TranslatedText i18nKey="admin.timeline" />
                </FeatureName>
                <FeatureDescription>
                  <TranslatedText i18nKey="admin.timelineDesc" />
                </FeatureDescription>
              </FeatureInfo>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureToggle>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={settings.features.moodboard}
                    onChange={() => handleToggleChange('features', 'moodboard')}
                  />
                  <Slider />
                </Switch>
              </FeatureToggle>
              <FeatureInfo>
                <FeatureName>
                  <TranslatedText i18nKey="admin.moodboard" />
                </FeatureName>
                <FeatureDescription>
                  <TranslatedText i18nKey="admin.moodboardDesc" />
                </FeatureDescription>
              </FeatureInfo>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureToggle>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={settings.features.vendorManagement}
                    onChange={() => handleToggleChange('features', 'vendorManagement')}
                  />
                  <Slider />
                </Switch>
              </FeatureToggle>
              <FeatureInfo>
                <FeatureName>
                  <TranslatedText i18nKey="admin.vendorManagement" />
                </FeatureName>
                <FeatureDescription>
                  <TranslatedText i18nKey="admin.vendorManagementDesc" />
                </FeatureDescription>
              </FeatureInfo>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureToggle>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={settings.features.giftRegistry}
                    onChange={() => handleToggleChange('features', 'giftRegistry')}
                  />
                  <Slider />
                </Switch>
              </FeatureToggle>
              <FeatureInfo>
                <FeatureName>
                  <TranslatedText i18nKey="admin.giftRegistry" />
                </FeatureName>
                <FeatureDescription>
                  <TranslatedText i18nKey="admin.giftRegistryDesc" />
                </FeatureDescription>
              </FeatureInfo>
            </FeatureItem>
          </FeatureList>
        </TabContent>
      )}
      
      {activeTab === 'users' && (
        <TabContent>
          <SectionTitle>
            <TranslatedText i18nKey="admin.userManagement" />
          </SectionTitle>
          
          <UserList>
            {settings.users.map(user => (
              <UserItem key={user.id}>
                <UserAvatar>{user.avatar}</UserAvatar>
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                </UserInfo>
                <UserRole>
                  <FormSelect
                    value={user.role}
                    onChange={(e) => {
                      const updatedUsers = settings.users.map(u => 
                        u.id === user.id ? { ...u, role: e.target.value } : u
                      );
                      setSettings(prevSettings => ({
                        ...prevSettings,
                        users: updatedUsers,
                      }));
                    }}
                  >
                    <option value="admin">Admin</option>
                    <option value="couple">Couple</option>
                    <option value="guest">Guest</option>
                  </FormSelect>
                </UserRole>
              </UserItem>
            ))}
          </UserList>
        </TabContent>
      )}
      
      <ButtonGroup>
        <TranslatedButton
          i18nKey="admin.saveChanges"
          variant="primary"
          size="large"
          onClick={handleSaveSettings}
        />
        <TranslatedButton
          i18nKey="admin.resetChanges"
          variant="outline"
          size="large"
          onClick={() => window.location.reload()}
        />
      </ButtonGroup>
    </AdminDashboardContainer>
  );
};

export default NoCodeAdminDashboard;
