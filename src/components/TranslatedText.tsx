import React from 'react';
import { useTranslation } from 'react-i18next';

interface TranslatedTextProps {
  i18nKey: string;
  defaultText: string;
  values?: Record<string, string | number>;
}

const TranslatedText: React.FC<TranslatedTextProps> = ({ i18nKey, defaultText, values }) => {
  const { t } = useTranslation();
  
  return <>{t(i18nKey, { defaultValue: defaultText, ...values })}</>;
};

export { TranslatedText };
export type { TranslatedTextProps };
