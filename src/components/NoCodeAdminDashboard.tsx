import React from 'react';
import styled from 'styled-components';
import { media } from '../styles/ResponsiveComponents';
import { useTranslation } from 'react-i18next';

interface NoCodeAdminDashboardProps {
  isDemo?: boolean;
}

interface SettingsSection {
  id: string;
  title: string;
  icon: string;
  description: string;
}

interface SettingField {
  id: string;
  type: 'text' | 'color' | 'select' | 'toggle' | 'image' | 'textarea';
  label: string;
  value: string | boolean;
  options?: string[];
}

const Container = styled.div`
  padding: 2rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;

const Header = styled.div`
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

const Title = styled.h2`
  font-size: 1.75rem;
  margin: 0;
`;

const Description = styled.p`
  color: var(--text-light);
  margin: 0.5rem 0 2rem 0;
`;

const SectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionCard = styled.div<{ active?: boolean }>`
  background-color: ${props => props.active ? 'var(--primary-light)' : 'var(--background-light)'};
  border: 2px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: var(--border-radius-sm);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--primary-color);
    background-color: var(--primary-light);
  }
`;

const SectionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 0.5rem 0;
`;

const SectionDescription = styled.p`
  color: var(--text-light);
  margin: 0;
  font-size: 0.875rem;
`;

const SettingsContainer = styled.div`
  background-color: var(--background-light);
  border-radius: var(--border-radius-sm);
  padding: 2rem;
`;

const SettingsTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
`;

const SettingsForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  margin-bottom: 0.5rem;
  font-weight: var(--font-weight-medium);
`;

const FormInput = styled.input`
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

const ColorPickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 1px solid var(--border-color);
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: var(--primary-color);
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-color);
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

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ImagePreview = styled.div<{ hasImage: boolean }>`
  width: 100%;
  height: 200px;
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.hasImage ? 'transparent' : 'var(--background-color)'};
  background-size: cover;
  background-position: center;
  cursor: pointer;
`;

const ImagePlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-light);
`;

const ImageIcon = styled.div`
  font-size: 2rem;
`;

const ImageText = styled.div`
  font-size: 0.875rem;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  
  ${media.xs} {
    flex-direction: column;
  }
`;

const Button = styled.button<{ variant: 'primary' | 'outline' }>`
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' ? `
    background-color: var(--primary-color);
    color: var(--text-on-primary);
    border: none;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  ` : `
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    
    &:hover {
      background-color: var(--primary-light);
    }
  `}
  
  ${media.xs} {
    width: 100%;
  }
`;

const NoCodeAdminDashboard: React.FC<NoCodeAdminDashboardProps> = ({ isDemo = false }) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = React.useState<string>('design');
  const [settings, setSettings] = React.useState<Record<string, SettingField[]>>({
    design: [
      { id: 'primaryColor', type: 'color', label: t('admin.primaryColor', 'Primärfarbe'), value: '#F9CA24' },
      { id: 'secondaryColor', type: 'color', label: t('admin.secondaryColor', 'Sekundärfarbe'), value: '#6C5CE7' },
      { id: 'backgroundColor', type: 'color', label: t('admin.backgroundColor', 'Hintergrundfarbe'), value: '#FFFFFF' },
      { id: 'textColor', type: 'color', label: t('admin.textColor', 'Textfarbe'), value: '#2D3436' },
      { id: 'fontFamily', type: 'select', label: t('admin.fontFamily', 'Schriftart'), value: 'Inter', options: ['Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Playfair Display'] },
      { id: 'borderRadius', type: 'select', label: t('admin.borderRadius', 'Eckenradius'), value: 'medium', options: ['small', 'medium', 'large', 'rounded'] },
      { id: 'darkMode', type: 'toggle', label: t('admin.darkMode', 'Dunkelmodus'), value: false },
    ],
    content: [
      { id: 'siteName', type: 'text', label: t('admin.siteName', 'Website-Name'), value: 'LemonVows' },
      { id: 'siteDescription', type: 'textarea', label: t('admin.siteDescription', 'Website-Beschreibung'), value: 'Deine perfekte Hochzeitsplanungs-App' },
      { id: 'logo', type: 'image', label: t('admin.logo', 'Logo'), value: '' },
      { id: 'heroImage', type: 'image', label: t('admin.heroImage', 'Hero-Bild'), value: '' },
      { id: 'footerText', type: 'textarea', label: t('admin.footerText', 'Footer-Text'), value: '© 2024 LemonVows. Alle Rechte vorbehalten.' },
    ],
    features: [
      { id: 'enableTablePlanner', type: 'toggle', label: t('admin.enableTablePlanner', 'Tischplaner aktivieren'), value: true },
      { id: 'enableGuestManagement', type: 'toggle', label: t('admin.enableGuestManagement', 'Gästeverwaltung aktivieren'), value: true },
      { id: 'enableBudgetPlanner', type: 'toggle', label: t('admin.enableBudgetPlanner', 'Budgetplaner aktivieren'), value: true },
      { id: 'enableMusicRequests', type: 'toggle', label: t('admin.enableMusicRequests', 'Musikwünsche aktivieren'), value: true },
      { id: 'enableGallery', type: 'toggle', label: t('admin.enableGallery', 'Galerie aktivieren'), value: true },
      { id: 'enableTimeline', type: 'toggle', label: t('admin.enableTimeline', 'Zeitplan aktivieren'), value: true },
      { id: 'enableVendors', type: 'toggle', label: t('admin.enableVendors', 'Dienstleister aktivieren'), value: false },
    ],
    pricing: [
      { id: 'currency', type: 'select', label: t('admin.currency', 'Währung'), value: 'EUR', options: ['EUR', 'USD', 'GBP', 'CHF'] },
      { id: 'basicPlanPrice', type: 'text', label: t('admin.basicPlanPrice', 'Preis Basic-Plan'), value: '49' },
      { id: 'premiumPlanPrice', type: 'text', label: t('admin.premiumPlanPrice', 'Preis Premium-Plan'), value: '89' },
      { id: 'ultimatePlanPrice', type: 'text', label: t('admin.ultimatePlanPrice', 'Preis Ultimate-Plan'), value: '129' },
      { id: 'showPricing', type: 'toggle', label: t('admin.showPricing', 'Preise anzeigen'), value: true },
      { id: 'enablePromoCode', type: 'toggle', label: t('admin.enablePromoCode', 'Promo-Codes aktivieren'), value: true },
      { id: 'promoDiscount', type: 'text', label: t('admin.promoDiscount', 'Rabatt für Promo-Codes (%)'), value: '15' },
    ],
  });
  
  const sections: SettingsSection[] = [
    { id: 'design', title: t('admin.designSection', 'Design & Aussehen'), icon: '🎨', description: t('admin.designDescription', 'Passe Farben, Schriften und das allgemeine Erscheinungsbild an') },
    { id: 'content', title: t('admin.contentSection', 'Inhalte & Texte'), icon: '📝', description: t('admin.contentDescription', 'Bearbeite Texte, Bilder und andere Inhalte') },
    { id: 'features', title: t('admin.featuresSection', 'Funktionen'), icon: '⚙️', description: t('admin.featuresDescription', 'Aktiviere oder deaktiviere verschiedene Funktionen') },
    { id: 'pricing', title: t('admin.pricingSection', 'Preise & Pläne'), icon: '💰', description: t('admin.pricingDescription', 'Verwalte Preise und Abonnementpläne') },
  ];
  
  const handleSettingChange = (sectionId: string, fieldId: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [sectionId]: prev[sectionId].map(field => 
        field.id === fieldId ? { ...field, value } : field
      )
    }));
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDemo) {
      alert(t('admin.demoSaveMessage', 'In der Demo-Version werden Änderungen nicht gespeichert.'));
    } else {
      // Save to Supabase or other backend
      alert(t('admin.saveSuccess', 'Einstellungen erfolgreich gespeichert!'));
    }
  };
  
  const renderSettingField = (field: SettingField, sectionId: string) => {
    switch (field.type) {
      case 'text':
        return (
          <FormGroup key={field.id}>
            <FormLabel>{field.label}</FormLabel>
            <FormInput
              type="text"
              value={field.value as string}
              onChange={e => handleSettingChange(sectionId, field.id, e.target.value)}
            />
          </FormGroup>
        );
      
      case 'textarea':
        return (
          <FormGroup key={field.id}>
            <FormLabel>{field.label}</FormLabel>
            <FormTextarea
              value={field.value as string}
              onChange={e => handleSettingChange(sectionId, field.id, e.target.value)}
            />
          </FormGroup>
        );
      
      case 'select':
        return (
          <FormGroup key={field.id}>
            <FormLabel>{field.label}</FormLabel>
            <FormSelect
              value={field.value as string}
              onChange={e => handleSettingChange(sectionId, field.id, e.target.value)}
            >
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </FormSelect>
          </FormGroup>
        );
      
      case 'color':
        return (
          <FormGroup key={field.id}>
            <FormLabel>{field.label}</FormLabel>
            <ColorPickerContainer>
              <ColorPreview color={field.value as string} />
              <FormInput
                type="color"
                value={field.value as string}
                onChange={e => handleSettingChange(sectionId, field.id, e.target.value)}
              />
            </ColorPickerContainer>
          </FormGroup>
        );
      
      case 'toggle':
        return (
          <FormGroup key={field.id}>
            <ToggleContainer>
              <FormLabel>{field.label}</FormLabel>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={field.value as boolean}
                  onChange={e => handleSettingChange(sectionId, field.id, e.target.checked)}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </ToggleContainer>
          </FormGroup>
        );
      
      case 'image':
        return (
          <FormGroup key={field.id}>
            <FormLabel>{field.label}</FormLabel>
            <ImageUploadContainer>
              <ImagePreview
                hasImage={Boolean(field.value)}
                style={{ backgroundImage: field.value ? `url(${field.value})` : 'none' }}
                onClick={() => {
                  // In a real implementation, this would open a file picker
                  const demoImageUrl = 'https://via.placeholder.com/800x400';
                  handleSettingChange(sectionId, field.id, demoImageUrl);
                }}
              >
                {!field.value && (
                  <ImagePlaceholder>
                    <ImageIcon>📷</ImageIcon>
                    <ImageText>{t('admin.uploadImage', 'Bild hochladen')}</ImageText>
                  </ImagePlaceholder>
                )}
              </ImagePreview>
            </ImageUploadContainer>
          </FormGroup>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Container>
      <Header>
        <div>
          <Title>{t('admin.title', 'No-Code Admin-Dashboard')}</Title>
          <Description>
            {t('admin.description', 'Passe deine Hochzeitsplanungs-App ganz ohne Programmierkenntnisse an.')}
          </Description>
        </div>
      </Header>
      
      <SectionsGrid>
        {sections.map(section => (
          <SectionCard
            key={section.id}
            active={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
          >
            <SectionIcon>{section.icon}</SectionIcon>
            <SectionTitle>{section.title}</SectionTitle>
            <SectionDescription>{section.description}</SectionDescription>
          </SectionCard>
        ))}
      </SectionsGrid>
      
      <SettingsContainer>
        <SettingsTitle>
          {sections.find(s => s.id === activeSection)?.title || ''}
        </SettingsTitle>
        
        <SettingsForm onSubmit={handleSave}>
          {settings[activeSection]?.map(field => renderSettingField(field, activeSection))}
          
          <FormActions>
            <Button type="button" variant="outline" onClick={() => {
              // Reset current section to defaults
              if (isDemo) {
                alert(t('admin.demoResetMessage', 'In der Demo-Version werden Änderungen nicht zurückgesetzt.'));
              }
            }}>
              {t('admin.reset', 'Zurücksetzen')}
            </Button>
            <Button type="submit" variant="primary">
              {t('admin.save', 'Speichern')}
            </Button>
          </FormActions>
        </SettingsForm>
      </SettingsContainer>
    </Container>
  );
};

export default NoCodeAdminDashboard;
