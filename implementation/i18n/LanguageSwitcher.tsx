import React from 'react';
import { useLanguage } from './LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={`language-switcher ${className || ''}`}>
      <span>{t('settings.language')}:</span>
      <button 
        className={language === 'de' ? 'active' : ''} 
        onClick={() => setLanguage('de')}
      >
        {t('settings.german')}
      </button>
      <button 
        className={language === 'en' ? 'active' : ''} 
        onClick={() => setLanguage('en')}
      >
        {t('settings.english')}
      </button>
      
      <style jsx>{`
        .language-switcher {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .language-switcher button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }
        
        .language-switcher button:hover {
          background-color: #f5f5f5;
        }
        
        .language-switcher button.active {
          background-color: #ffbd00;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
