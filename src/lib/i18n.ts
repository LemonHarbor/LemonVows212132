import { useTranslation as useTranslationOriginal } from 'next-i18next';

export const i18nConfig = {
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
  },
  localePath: './public/locales',
};

// Re-export useTranslation from next-i18next
export const useTranslation = useTranslationOriginal;

export default i18nConfig;
