// Define i18n configuration without importing from next-i18next
export const i18nConfig = {
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en', 'fr', 'es'],
  },
  localePath: './public/locales',
};

// Create a simple useTranslation hook that returns a t function
// This avoids the React hooks compatibility issues
export const useTranslation = (namespace = 'common') => {
  // Simple translation function that returns the key
  // In a real implementation, this would look up translations
  const t = (key: string) => key;
  
  return { t };
};

export default i18nConfig;
