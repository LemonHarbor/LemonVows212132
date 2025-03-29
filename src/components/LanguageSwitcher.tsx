import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useLanguage } from '@hooks/useLanguage';

const LanguageSwitcherContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LanguageButton = styled.button<{ active: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: ${props => props.active ? '#f0f0f0' : 'transparent'};
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  
  return (
    <LanguageSwitcherContainer>
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
    </LanguageSwitcherContainer>
  );
};

export default LanguageSwitcher;
