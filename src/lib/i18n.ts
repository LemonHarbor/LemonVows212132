import { createI18nClient } from 'next-i18next';

export const i18nConfig = {
  defaultLocale: 'de',
  locales: ['de', 'en'],
  localePath: './public/locales',
};

export const i18n = createI18nClient({
  ...i18nConfig,
});

export default i18nConfig;
