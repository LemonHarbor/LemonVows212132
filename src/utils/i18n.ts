import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import translationDE from '@locales/de/translation.json';
import translationEN from '@locales/en/translation.json';

const resources = {
  de: {
    translation: translationDE
  },
  en: {
    translation: translationEN
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'de', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;
