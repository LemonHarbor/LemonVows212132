import { useContext } from 'react';
import { AppContext } from '@context/AppContext';

export const useLanguage = () => {
  const { language, setLanguage } = useContext(AppContext);
  
  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };
  
  return {
    language,
    setLanguage,
    toggleLanguage,
    isGerman: language === 'de',
    isEnglish: language === 'en'
  };
};
