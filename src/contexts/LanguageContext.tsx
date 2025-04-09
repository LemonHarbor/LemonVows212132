import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the language context type
interface LanguageContextType {
  language: string;
  changeLanguage: (newLanguage: string) => void;
  t: (key: string) => string;
  loading: boolean;
  translations: Record<string, any>;
}

// Create a context for language settings
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Provider component that wraps the app and provides language context
export const LemonVowsLanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Load translations for the current language
  useEffect(() => {
    const loadTranslations = async () => {
      setLoading(true);
      try {
        // This would typically be an API call to fetch translations
        // For now, we'll use a simple object with some basic translations
        const defaultTranslations: Record<string, any> = {
          en: {
            common: {
              welcome: 'Welcome to LemonVows',
              login: 'Login',
              register: 'Register',
              logout: 'Logout',
              dashboard: 'Dashboard',
              settings: 'Settings',
              guests: 'Guests',
              tables: 'Tables',
              menu: 'Menu',
              statistics: 'Statistics',
              save: 'Save',
              cancel: 'Cancel',
              delete: 'Delete',
              edit: 'Edit',
              add: 'Add',
              search: 'Search',
              filter: 'Filter',
              sort: 'Sort',
              loading: 'Loading...',
              error: 'An error occurred',
              success: 'Success!',
            },
          },
          de: {
            common: {
              welcome: 'Willkommen bei LemonVows',
              login: 'Anmelden',
              register: 'Registrieren',
              logout: 'Abmelden',
              dashboard: 'Dashboard',
              settings: 'Einstellungen',
              guests: 'Gäste',
              tables: 'Tische',
              menu: 'Menü',
              statistics: 'Statistiken',
              save: 'Speichern',
              cancel: 'Abbrechen',
              delete: 'Löschen',
              edit: 'Bearbeiten',
              add: 'Hinzufügen',
              search: 'Suchen',
              filter: 'Filtern',
              sort: 'Sortieren',
              loading: 'Wird geladen...',
              error: 'Ein Fehler ist aufgetreten',
              success: 'Erfolg!',
            },
          },
        };

        // Set translations for the current language
        setTranslations(defaultTranslations[language] || defaultTranslations.en);
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  // Change language function
  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Initialize language from localStorage if available
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Translate function
  const t = (key: string): string => {
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    let result: any = translations;

    // Navigate through the nested properties
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        // Return the key if translation not found
        return key;
      }
    }

    return result;
  };

  // Context value
  const value = {
    language,
    changeLanguage,
    t,
    loading,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
