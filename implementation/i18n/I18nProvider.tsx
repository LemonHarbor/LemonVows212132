import React from 'react';
import { LanguageProvider } from './LanguageContext';

// This component wraps the entire application with the LanguageProvider
const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LanguageProvider initialLanguage="de">
      {children}
    </LanguageProvider>
  );
};

export default I18nProvider;
