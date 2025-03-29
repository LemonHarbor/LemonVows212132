import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import TranslatedText from '../components/TranslatedText';
import TranslatedButton from '../components/TranslatedButton';

interface DemoPageProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const DemoSection = styled.section`
  margin-bottom: 3rem;
`;

const DemoTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const DemoDescription = styled.p`
  font-size: 1.125rem;
  color: var(--text-light);
  margin-bottom: 2rem;
  max-width: 800px;
`;

const DemoTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const DemoTab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--text-on-primary)' : 'var(--text-color)'};
  border: ${props => props.active ? 'none' : '1px solid var(--border-color)'};
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  white-space: nowrap;
`;

const DemoContent = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
`;

const Footer = styled.footer`
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
  color: var(--text-light);
`;

const DemoPage: React.FC<DemoPageProps> = ({ toggleDarkMode, isDarkMode }) => {
  const [activeDemo, setActiveDemo] = React.useState<string>('table-planner');
  
  const demoTabs = [
    { id: 'table-planner', label: 'Tischplaner' },
    { id: 'guest-management', label: 'Gästeverwaltung' },
    { id: 'budget-planner', label: 'Budgetplaner' },
    { id: 'music-requests', label: 'Musikwünsche' },
    { id: 'gallery', label: 'Foto-Galerie' },
    { id: 'admin', label: 'Admin-Dashboard' },
    { id: 'auto-scaling', label: 'Auto-Skalierung' }
  ];
  
  return (
    <Container>
      <Header>
        <Logo>LemonVows</Logo>
        <Nav>
          <TranslatedButton
            i18nKey="demo.backToHome"
            defaultText="Zurück zur Startseite"
            variant="outline"
            onClick={() => window.location.href = '/'}
          />
          <TranslatedButton
            i18nKey={isDarkMode ? "demo.lightMode" : "demo.darkMode"}
            defaultText={isDarkMode ? "Light Mode" : "Dark Mode"}
            variant="text"
            onClick={toggleDarkMode}
          />
        </Nav>
      </Header>
      
      <DemoSection>
        <DemoTitle>
          <TranslatedText i18nKey="demo.title" defaultText="Interaktive Demo" />
        </DemoTitle>
        <DemoDescription>
          <TranslatedText 
            i18nKey="demo.description" 
            defaultText="Erkunden Sie die Funktionen unserer Hochzeitsplanungs-App in dieser interaktiven Demo. Wählen Sie eine Funktion aus, um sie auszuprobieren." 
          />
        </DemoDescription>
        
        <DemoTabs>
          {demoTabs.map(tab => (
            <DemoTab
              key={tab.id}
              active={activeDemo === tab.id}
              onClick={() => setActiveDemo(tab.id)}
            >
              {tab.label}
            </DemoTab>
          ))}
        </DemoTabs>
        
        <DemoContent>
          {/* We'll render different components based on the active demo */}
          <div style={{ padding: '2rem' }}>
            <h2>{demoTabs.find(tab => tab.id === activeDemo)?.label}</h2>
            <p>Demo-Inhalt wird hier angezeigt.</p>
          </div>
        </DemoContent>
      </DemoSection>
      
      <Footer>
        <p>© 2024 LemonVows. Alle Rechte vorbehalten.</p>
      </Footer>
    </Container>
  );
};

export default DemoPage;
