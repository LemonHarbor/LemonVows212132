import { createContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type ThemeType = 'light' | 'dark';
type LanguageType = 'de' | 'en';

interface AppContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
}

export const AppContext = createContext<AppContextType>({
  theme: 'light',
  toggleTheme: () => {},
  language: 'de',
  setLanguage: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState<ThemeType>('light');
  const [language, setLanguage] = useState<LanguageType>('de');

  useEffect(() => {
    // Apply theme to body
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    // Change language in i18n
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSetLanguage = (lang: LanguageType) => {
    setLanguage(lang);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage: handleSetLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
