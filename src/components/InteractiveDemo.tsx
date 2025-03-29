import React, { useState } from 'react';
import styled from 'styled-components';
import { media } from '@styles/ResponsiveComponents';
import TranslatedText from '@components/TranslatedText';
import TranslatedButton from '@components/TranslatedButton';

const DemoContainer = styled.div`
  padding: 2rem;
  background-color: var(--background-light);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  
  ${media.sm} {
    padding: 1.5rem;
  }
  
  ${media.xs} {
    padding: 1rem;
  }
`;

const DemoHeader = styled.div`
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

const DemoTitle = styled.h2`
  font-size: 1.75rem;
  margin: 0;
  
  ${media.sm} {
    font-size: 1.5rem;
  }
`;

const DemoTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  ${media.xs} {
    gap: 0.5rem;
  }
`;

const DemoTab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.25rem;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--background-color)'};
  color: ${props => props.active ? 'var(--text-color)' : 'var(--text-light)'};
  border: none;
  border-radius: var(--border-radius);
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--background-light)'};
  }
  
  ${media.xs} {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
`;

const DemoContent = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  min-height: 400px;
  
  ${media.sm} {
    padding: 1.5rem;
    min-height: 300px;
  }
  
  ${media.xs} {
    padding: 1rem;
    min-height: 250px;
  }
`;

const DemoFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  
  ${media.sm} {
    flex-direction: column;
    gap: 1rem;
  }
`;

const DemoNote = styled.p`
  color: var(--text-light);
  font-size: 0.875rem;
  
  ${media.sm} {
    width: 100%;
  }
`;

const DemoActions = styled.div`
  display: flex;
  gap: 1rem;
  
  ${media.sm} {
    width: 100%;
    justify-content: space-between;
  }
`;

// Mock content for demo tabs
const TablePlanDemo = () => (
  <div>
    <h3>Interactive Table Planner</h3>
    <p>Drag and drop guests to assign them to tables. Customize table shapes, sizes, and arrangements.</p>
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <img src="/table-plan-demo.png" alt="Table Plan Demo" style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
  </div>
);

const GuestListDemo = () => (
  <div>
    <h3>Guest Management</h3>
    <p>Keep track of all your guests, their RSVPs, dietary requirements, and more.</p>
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <img src="/guest-list-demo.png" alt="Guest List Demo" style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
  </div>
);

const BudgetDemo = () => (
  <div>
    <h3>Budget Planner</h3>
    <p>Manage your wedding budget with ease. Track expenses, set category limits, and see visual breakdowns.</p>
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <img src="/budget-demo.png" alt="Budget Demo" style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
  </div>
);

const MusicDemo = () => (
  <div>
    <h3>Music Requests</h3>
    <p>Let your guests suggest songs and vote on their favorites to create the perfect playlist.</p>
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <img src="/music-demo.png" alt="Music Demo" style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
  </div>
);

const GalleryDemo = () => (
  <div>
    <h3>Photo Gallery</h3>
    <p>Share photos with your guests and let them upload their own memories from your special day.</p>
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <img src="/gallery-demo.png" alt="Gallery Demo" style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
  </div>
);

type DemoTabType = 'table-plan' | 'guest-list' | 'budget' | 'music' | 'gallery';

const InteractiveDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DemoTabType>('table-plan');
  
  const renderDemoContent = () => {
    switch (activeTab) {
      case 'table-plan':
        return <TablePlanDemo />;
      case 'guest-list':
        return <GuestListDemo />;
      case 'budget':
        return <BudgetDemo />;
      case 'music':
        return <MusicDemo />;
      case 'gallery':
        return <GalleryDemo />;
      default:
        return <TablePlanDemo />;
    }
  };
  
  return (
    <DemoContainer>
      <DemoHeader>
        <DemoTitle>
          <TranslatedText i18nKey="landing.tryItYourself" />
        </DemoTitle>
      </DemoHeader>
      
      <DemoTabs>
        <DemoTab 
          active={activeTab === 'table-plan'} 
          onClick={() => setActiveTab('table-plan')}
        >
          <TranslatedText i18nKey="tableplan.title" />
        </DemoTab>
        <DemoTab 
          active={activeTab === 'guest-list'} 
          onClick={() => setActiveTab('guest-list')}
        >
          <TranslatedText i18nKey="guests.title" />
        </DemoTab>
        <DemoTab 
          active={activeTab === 'budget'} 
          onClick={() => setActiveTab('budget')}
        >
          <TranslatedText i18nKey="budget.title" />
        </DemoTab>
        <DemoTab 
          active={activeTab === 'music'} 
          onClick={() => setActiveTab('music')}
        >
          <TranslatedText i18nKey="music.title" />
        </DemoTab>
        <DemoTab 
          active={activeTab === 'gallery'} 
          onClick={() => setActiveTab('gallery')}
        >
          <TranslatedText i18nKey="gallery.title" />
        </DemoTab>
      </DemoTabs>
      
      <DemoContent>
        {renderDemoContent()}
      </DemoContent>
      
      <DemoFooter>
        <DemoNote>
          <TranslatedText i18nKey="landing.demoNote" />
        </DemoNote>
        <DemoActions>
          <TranslatedButton 
            i18nKey="landing.learnMore" 
            variant="outline" 
          />
          <TranslatedButton 
            i18nKey="landing.getStarted" 
            variant="primary" 
          />
        </DemoActions>
      </DemoFooter>
    </DemoContainer>
  );
};

export default InteractiveDemo;
