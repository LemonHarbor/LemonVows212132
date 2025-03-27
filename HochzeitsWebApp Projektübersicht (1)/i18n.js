class I18nService {
  constructor() {
    this.lang = 'de';
    this.translations = {
      de: {},
      en: {} 
    };
    this.loadTranslations();
  }

  async loadTranslations() {
    try {
      const [deRes, enRes] = await Promise.all([
        fetch('./locales/de.json').then(r => r.json()),
        fetch('./locales/en.json').then(r => r.json())
      ]);
      
      this.translations.de = deRes;
      this.translations.en = enRes;
    } catch (error) {
      console.error('Fehler beim Laden der Übersetzungen:', error);
    }
  }

  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.lang];
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }
    
    return value || key;
  }

  changeLanguage(lang) {
    if (this.translations[lang]) {
      this.lang = lang;
      document.dispatchEvent(new Event('languageChanged'));
    }
  }
}

export const i18n = new I18nService();