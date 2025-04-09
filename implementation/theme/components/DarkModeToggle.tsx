import React from 'react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from '../../i18n/LanguageContext';

interface DarkModeToggleProps {
  className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggleTheme}
      className={`dark-mode-toggle ${className}`}
      aria-label={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
      title={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      )}
      <span className="dark-mode-toggle__text">
        {isDark ? t('theme.lightMode') : t('theme.darkMode')}
      </span>

      <style jsx>{`
        .dark-mode-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: var(--background-secondary);
          border: 1px solid var(--border);
          border-radius: 2rem;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .dark-mode-toggle:hover {
          background-color: var(--primary-color);
          color: var(--button-text);
        }
        
        .dark-mode-toggle svg {
          width: 1.25rem;
          height: 1.25rem;
        }
        
        .dark-mode-toggle__text {
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .dark-mode-toggle__text {
            display: none;
          }
          
          .dark-mode-toggle {
            padding: 0.5rem;
          }
        }
      `}</style>
    </button>
  );
};

export default DarkModeToggle;
