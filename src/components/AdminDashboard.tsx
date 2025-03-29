import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import TranslatedText from '@components/TranslatedText';
import TranslatedButton from '@components/TranslatedButton';

const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const DashboardTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? '#f9ca24' : 'transparent'};
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#f9ca24' : 'transparent'};
  color: ${props => props.active ? '#333' : '#666'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#f9ca24' : '#f0f0f0'};
  }
`;

const ContentSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const SettingCard = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 1.5rem;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
`;

const SettingTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: #333;
`;

const SettingDescription = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
`;

const ColorPicker = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #f9ca24;
  }
`;

const SelectInput = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #f9ca24;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: #f9ca24;
  }
  
  input:checked + span:before {
    transform: translateX(26px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

type TabType = 'appearance' | 'content' | 'features' | 'users';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('appearance');
  
  // Example state for appearance settings
  const [primaryColor, setPrimaryColor] = useState('#f9ca24');
  const [secondaryColor, setSecondaryColor] = useState('#4834d4');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [darkMode, setDarkMode] = useState(false);
  
  // Example state for content settings
  const [weddingTitle, setWeddingTitle] = useState('Sarah & Thomas');
  const [weddingDate, setWeddingDate] = useState('2024-06-15');
  const [weddingLocation, setWeddingLocation] = useState('Schloss Elmau, Bayern');
  
  // Example state for feature toggles
  const [enableTablePlan, setEnableTablePlan] = useState(true);
  const [enableBudget, setEnableBudget] = useState(true);
  const [enableMusic, setEnableMusic] = useState(true);
  const [enableGallery, setEnableGallery] = useState(true);
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>
          <TranslatedText i18nKey="admin.title" />
        </DashboardTitle>
      </DashboardHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'appearance'} 
          onClick={() => setActiveTab('appearance')}
        >
          <TranslatedText i18nKey="admin.customization" />
        </Tab>
        <Tab 
          active={activeTab === 'content'} 
          onClick={() => setActiveTab('content')}
        >
          <TranslatedText i18nKey="settings.weddingDetails" />
        </Tab>
        <Tab 
          active={activeTab === 'features'} 
          onClick={() => setActiveTab('features')}
        >
          <TranslatedText i18nKey="landing.features" />
        </Tab>
        <Tab 
          active={activeTab === 'users'} 
          onClick={() => setActiveTab('users')}
        >
          <TranslatedText i18nKey="admin.users" />
        </Tab>
      </TabsContainer>
      
      {activeTab === 'appearance' && (
        <ContentSection>
          <SectionTitle>
            <TranslatedText i18nKey="admin.customization" />
          </SectionTitle>
          
          <SettingsGrid>
            <SettingCard>
              <SettingTitle>{t('settings.theme')}</SettingTitle>
              <SettingDescription>
                {t('admin.themeDescription')}
              </SettingDescription>
              <ToggleSwitch>
                <input 
                  type="checkbox" 
                  checked={darkMode} 
                  onChange={() => setDarkMode(!darkMode)} 
                />
                <span></span>
              </ToggleSwitch>
            </SettingCard>
            
            <SettingCard>
              <SettingTitle>{t('admin.primaryColor')}</SettingTitle>
              <SettingDescription>
                {t('admin.primaryColorDescription')}
              </SettingDescription>
              <ColorPicker 
                type="color" 
                value={primaryColor} 
                onChange={(e) => setPrimaryColor(e.target.value)} 
              />
            </SettingCard>
            
            <SettingCard>
              <SettingTitle>{t('admin.secondaryColor')}</SettingTitle>
              <SettingDescription>
                {t('admin.secondaryColorDescription')}
              </SettingDescription>
              <ColorPicker 
                type="color" 
                value={secondaryColor} 
                onChange={(e) => setSecondaryColor(e.target.value)} 
              />
            </SettingCard>
            
            <SettingCard>
              <SettingTitle>{t('admin.font')}</SettingTitle>
              <SettingDescription>
                {t('admin.fontDescription')}
              </SettingDescription>
              <SelectInput 
                value={fontFamily} 
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Playfair Display">Playfair Display</option>
              </SelectInput>
            </SettingCard>
          </SettingsGrid>
        </ContentSection>
      )}
      
      {activeTab === 'content' && (
        <ContentSection>
          <SectionTitle>
            <TranslatedText i18nKey="settings.weddingDetails" />
          </SectionTitle>
          
          <SettingsGrid>
            <SettingCard>
              <SettingTitle>{t('admin.weddingTitle')}</SettingTitle>
              <SettingDescription>
                {t('admin.weddingTitleDescription')}
              </SettingDescription>
              <TextInput 
                type="text" 
                value={weddingTitle} 
                onChange={(e) => setWeddingTitle(e.target.value)} 
              />
            </SettingCard>
            
            <SettingCard>
              <SettingTitle>{t('settings.weddingDate')}</SettingTitle>
              <SettingDescription>
                {t('admin.weddingDateDescription')}
              </SettingDescription>
              <TextInput 
                type="date" 
                value={weddingDate} 
                onChange={(e) => setWeddingDate(e.target.value)} 
              />
            </SettingCard>
            
            <SettingCard>
              <SettingTitle>{t('settings.weddingLocation')}</SettingTitle>
              <SettingDescription>
                {t('admin.weddingLocationDescription')}
              </SettingDescription>
              <TextInput 
                type="text" 
                value={weddingLocation} 
                onChange={(e) => setWeddingLocation(e.target.value)} 
              />
            </SettingCard>
          </SettingsGrid>
        </ContentSection>
      )}
      
      {activeTab === 'features' && (
        <ContentSection>
          <SectionTitle>
            <TranslatedText i18nKey="landing.features" />
          </SectionTitle>
          
          <SettingsGrid>
            <SettingCard>
              <SettingTitle>{t('tableplan.title')}</SettingTitle>
              <SettingDescription>
                {t('admin.tablePlanDescription')}
              </SettingDescription>
              <ToggleSwitch>
                <input 
                  type="checkbox" 
                  checked={enableTablePlan} 
                  onChange={() => setEnableTablePlan(!enableTablePlan)} 
                />
                <span></span>
              </ToggleSwitch>
            </SettingCard>
            
            <SettingCard>
              <SettingTitle>{t('budget.title')}</SettingTitle>
              <SettingDescription>
                {t('admin.budgetDescription')}
              </SettingDescription>
              <ToggleSwitch>
                <input 
                  type="checkbox" 
                  checked={enableBudget} 
                  onChange={() => setEnableBudget(!enableBudget)} 
                />
                <span></span>
              </ToggleSwitch>
            </SettingCard>
            
            <SettingCard>
              <SettingTitle>{t('music.title')}</SettingTitle>
              <SettingDescription>
                {t('admin.musicDescription')}
              </SettingDescription>
              <ToggleSwitch>
                <input 
                  type="checkbox" 
                  checked={enableMusic} 
                  onChange={() => setEnableMusic(!enableMusic)} 
                />
                <span></span>
              </ToggleSwitch>
            </SettingCard>
            
            <SettingCard>
              <SettingTitle>{t('gallery.title')}</SettingTitle>
              <SettingDescription>
                {t('admin.galleryDescription')}
              </SettingDescription>
              <ToggleSwitch>
                <input 
                  type="checkbox" 
                  checked={enableGallery} 
                  onChange={() => setEnableGallery(!enableGallery)} 
                />
                <span></span>
              </ToggleSwitch>
            </SettingCard>
          </SettingsGrid>
        </ContentSection>
      )}
      
      {activeTab === 'users' && (
        <ContentSection>
          <SectionTitle>
            <TranslatedText i18nKey="admin.users" />
          </SectionTitle>
          
          {/* User management would go here */}
          <p>{t('admin.userManagementDescription')}</p>
        </ContentSection>
      )}
      
      <ButtonGroup>
        <TranslatedButton 
          i18nKey="common.cancel" 
          variant="outline" 
        />
        <TranslatedButton 
          i18nKey="common.save" 
          variant="primary" 
        />
      </ButtonGroup>
    </DashboardContainer>
  );
};

export default AdminDashboard;
