// LemonVows Multilingual Support Implementation
// This file contains the implementation of multilingual support for the LemonVows wedding planning app

/**
 * i18n/index.js - Internationalization configuration
 */
import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../api/supabase';

// Available languages
export const LANGUAGES = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  es: 'Español'
};

// Default language
export const DEFAULT_LANGUAGE = 'de';

// Create language context
const LanguageContext = createContext();

/**
 * LanguageProvider component
 * Provides language context to the application
 */
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  // Load translations on mount and when language changes
  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  // Load translations from the database
  const loadTranslations = async (lang) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('translations')
        .select('*');
      
      if (error) {
        console.error('Error loading translations:', error);
        return;
      }
      
      // Format translations as key-value pairs
      const formattedTranslations = {};
      data.forEach(item => {
        formattedTranslations[item.key] = item[lang] || item.de; // Fallback to German
      });
      
      setTranslations(formattedTranslations);
    } catch (error) {
      console.error('Error loading translations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Change language and save preference
  const changeLanguage = async (lang) => {
    if (LANGUAGES[lang]) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
      
      // Update user preference if logged in
      const session = supabase.auth.session();
      if (session?.user) {
        try {
          await supabase
            .from('users')
            .update({ preferred_language: lang })
            .eq('id', session.user.id);
        } catch (error) {
          console.error('Error updating user language preference:', error);
        }
      }
    }
  };

  // Translate a key
  const translate = (key, params = {}) => {
    if (!key) return '';
    
    let text = translations[key] || key;
    
    // Replace parameters in the text
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, value);
    });
    
    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        languages: LANGUAGES,
        changeLanguage,
        translate,
        loading
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};

/**
 * i18n/translations.js - Translation utilities
 */
import { supabase } from '../api/supabase';

// Get all translations
export const getAllTranslations = async () => {
  try {
    const { data, error } = await supabase
      .from('translations')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching translations:', error);
    throw error;
  }
};

// Get translations for a specific language
export const getTranslationsForLanguage = async (language) => {
  try {
    const { data, error } = await supabase
      .from('translations')
      .select(`key, ${language}`);
    
    if (error) {
      throw error;
    }
    
    // Format translations as key-value pairs
    const formattedTranslations = {};
    data.forEach(item => {
      formattedTranslations[item.key] = item[language] || item.de; // Fallback to German
    });
    
    return formattedTranslations;
  } catch (error) {
    console.error(`Error fetching translations for ${language}:`, error);
    throw error;
  }
};

// Add a new translation
export const addTranslation = async (key, translations) => {
  try {
    const { data, error } = await supabase
      .from('translations')
      .insert([{
        key,
        de: translations.de || '',
        en: translations.en || '',
        fr: translations.fr || '',
        es: translations.es || ''
      }]);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error adding translation:', error);
    throw error;
  }
};

// Update an existing translation
export const updateTranslation = async (key, translations) => {
  try {
    const { data, error } = await supabase
      .from('translations')
      .update({
        de: translations.de,
        en: translations.en,
        fr: translations.fr,
        es: translations.es
      })
      .eq('key', key);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating translation:', error);
    throw error;
  }
};

// Delete a translation
export const deleteTranslation = async (key) => {
  try {
    const { data, error } = await supabase
      .from('translations')
      .delete()
      .eq('key', key);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting translation:', error);
    throw error;
  }
};

// Import translations from a JSON file
export const importTranslations = async (translationsData) => {
  try {
    // First get existing translations to avoid duplicates
    const { data: existingTranslations } = await supabase
      .from('translations')
      .select('key');
    
    const existingKeys = existingTranslations.map(t => t.key);
    
    // Prepare data for upsert
    const translationsToUpsert = Object.entries(translationsData).map(([key, translations]) => ({
      key,
      de: translations.de || '',
      en: translations.en || '',
      fr: translations.fr || '',
      es: translations.es || ''
    }));
    
    // Split into new and existing translations
    const newTranslations = translationsToUpsert.filter(t => !existingKeys.includes(t.key));
    const updatedTranslations = translationsToUpsert.filter(t => existingKeys.includes(t.key));
    
    // Insert new translations
    if (newTranslations.length > 0) {
      const { error: insertError } = await supabase
        .from('translations')
        .insert(newTranslations);
      
      if (insertError) {
        throw insertError;
      }
    }
    
    // Update existing translations
    for (const translation of updatedTranslations) {
      const { error: updateError } = await supabase
        .from('translations')
        .update({
          de: translation.de,
          en: translation.en,
          fr: translation.fr,
          es: translation.es
        })
        .eq('key', translation.key);
      
      if (updateError) {
        throw updateError;
      }
    }
    
    return {
      added: newTranslations.length,
      updated: updatedTranslations.length
    };
  } catch (error) {
    console.error('Error importing translations:', error);
    throw error;
  }
};

// Export translations to a JSON file
export const exportTranslations = async () => {
  try {
    const { data, error } = await supabase
      .from('translations')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Format data for export
    const formattedTranslations = {};
    data.forEach(item => {
      formattedTranslations[item.key] = {
        de: item.de || '',
        en: item.en || '',
        fr: item.fr || '',
        es: item.es || ''
      };
    });
    
    return formattedTranslations;
  } catch (error) {
    console.error('Error exporting translations:', error);
    throw error;
  }
};

/**
 * i18n/TranslationManager.js - Admin component for managing translations
 */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from './index';
import {
  getAllTranslations,
  addTranslation,
  updateTranslation,
  deleteTranslation,
  importTranslations,
  exportTranslations
} from './translations';
import Layout from '../components/common/Layout';
import {
  Button,
  Input,
  Table,
  Card,
  ErrorMessage,
  SuccessMessage
} from '../components/common/StyledComponents';

const TranslationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled(Input)`
  width: 300px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TranslationForm = styled.form`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const TranslationManager = () => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState([]);
  const [filteredTranslations, setFilteredTranslations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [formData, setFormData] = useState({
    key: '',
    de: '',
    en: '',
    fr: '',
    es: ''
  });
  
  // Load translations on mount
  useEffect(() => {
    loadTranslations();
  }, []);
  
  // Filter translations when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = translations.filter(
        t => t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
             t.de.toLowerCase().includes(searchTerm.toLowerCase()) ||
             t.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
             t.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
             t.es.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTranslations(filtered);
    } else {
      setFilteredTranslations(translations);
    }
  }, [searchTerm, translations]);
  
  // Load all translations
  const loadTranslations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getAllTranslations();
      setTranslations(data);
      setFilteredTranslations(data);
    } catch (error) {
      setError('Error loading translations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      if (editingKey) {
        // Update existing translation
        await updateTranslation(editingKey, {
          de: formData.de,
          en: formData.en,
          fr: formData.fr,
          es: formData.es
        });
        
        setSuccess('Translation updated successfully');
      } else {
        // Add new translation
        if (!formData.key) {
          setError('Translation key is required');
          setLoading(false);
          return;
        }
        
        // Check if key already exists
        if (translations.some(t => t.key === formData.key)) {
          setError('Translation key already exists');
          setLoading(false);
          return;
        }
        
        await addTranslation(formData.key, {
          de: formData.de,
          en: formData.en,
          fr: formData.fr,
          es: formData.es
        });
        
        setSuccess('Translation added successfully');
      }
      
      // Reset form and reload translations
      resetForm();
      await loadTranslations();
    } catch (error) {
      setError('Error saving translation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle editing a translation
  const handleEdit = (translation) => {
    setFormData({
      key: translation.key,
      de: translation.de || '',
      en: translation.en || '',
      fr: translation.fr || '',
      es: translation.es || ''
    });
    setEditingKey(translation.key);
    setShowForm(true);
  };
  
  // Handle deleting a translation
  const handleDelete = async (key) => {
    if (!window.confirm('Are you sure you want to delete this translation?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await deleteTranslation(key);
      
      setSuccess('Translation deleted successfully');
      await loadTranslations();
    } catch (error) {
      setError('Error deleting translation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      key: '',
      de: '',
      en: '',
      fr: '',
      es: ''
    });
    setEditingKey(null);
    setShowForm(false);
  };
  
  // Handle importing translations
  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = async (event) => {
          try {
            const json = JSON.parse(event.target.result);
            const result = await importTranslations(json);
            
            setSuccess(`Translations imported successfully: ${result.added} added, ${result.updated} updated`);
            await loadTranslations();
          } catch (error) {
            setError('Error parsing import file');
            console.error(error);
          } finally {
            setLoading(false);
          }
        };
        
        reader.readAsText(file);
      } catch (error) {
        setError('Error importing translations');
        console.error(error);
        setLoading(false);
      }
    };
    
    input.click();
  };
  
  // Handle exporting translations
  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await exportTranslations();
      
      // Create a download link
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lemonvows_translations_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('Error exporting translations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout title={translate('admin.translations.title')}>
      <TranslationHeader>
        <SearchInput
          type="text"
          placeholder={translate('admin.translations.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <ButtonGroup>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? translate('common.cancel') : translate('admin.translations.add')}
          </Button>
          <Button onClick={handleImport}>
            {translate('admin.translations.import')}
          </Button>
          <Button onClick={handleExport}>
            {translate('admin.translations.export')}
          </Button>
        </ButtonGroup>
      </TranslationHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      {showForm && (
        <Card>
          <h3>
            {editingKey
              ? translate('admin.translations.edit')
              : translate('admin.translations.add')}
          </h3>
          
          <TranslationForm onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="key">{translate('admin.translations.key')}</label>
              <Input
                id="key"
                name="key"
                value={formData.key}
                onChange={handleInputChange}
                disabled={!!editingKey}
                required
              />
            </div>
            
            <FormRow>
              <div>
                <label htmlFor="de">Deutsch (DE)</label>
                <Input
                  id="de"
                  name="de"
                  value={formData.de}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="en">English (EN)</label>
                <Input
                  id="en"
                  name="en"
                  value={formData.en}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="fr">Français (FR)</label>
                <Input
                  id="fr"
                  name="fr"
                  value={formData.fr}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="es">Español (ES)</label>
                <Input
                  id="es"
                  name="es"
                  value={formData.es}
                  onChange={handleInputChange}
                />
              </div>
            </FormRow>
            
            <FormActions>
              <Button type="button" onClick={resetForm}>
                {translate('common.cancel')}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? translate('common.loading')
                  : editingKey
                    ? translate('common.save')
                    : translate('common.add')}
              </Button>
            </FormActions>
          </TranslationForm>
        </Card>
      )}
      
      <Card>
        <Table>
          <thead>
            <tr>
              <th>{translate('admin.translations.key')}</th>
              <th>DE</th>
              <th>EN</th>
              <th>FR</th>
              <th>ES</th>
              <th>{translate('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading && !filteredTranslations.length ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  {translate('common.loading')}
                </td>
              </tr>
            ) : filteredTranslations.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  {translate('admin.translations.no_results')}
                </td>
              </tr>
            ) : (
              filteredTranslations.map((translation) => (
                <tr key={translation.key}>
                  <td>{translation.key}</td>
                  <td>{translation.de}</td>
                  <td>{translation.en}</td>
                  <td>{translation.fr}</td>
                  <td>{translation.es}</td>
                  <td>
                    <ButtonGroup>
                      <Button onClick={() => handleEdit(translation)}>
                        {translate('common.edit')}
                      </Button>
                      <Button onClick={() => handleDelete(translation.key)}>
                        {translate('common.delete')}
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Layout>
  );
};

export default TranslationManager;

/**
 * components/common/LanguageSelector.js - Language selector component
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../i18n';

const LanguageSelectorContainer = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
`;

const LanguageButton = styled.button`
  background-color: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.darkGray};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  margin-left: 0.25rem;
  cursor: pointer;
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  
  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.lightGray};
  }
`;

const LanguageDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const LanguageDropdownButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:after {
    content: '▼';
    font-size: 0.75rem;
    margin-left: 0.5rem;
  }
`;

const LanguageDropdownContent = styled.div`
  display: ${({ show }) => (show ? 'block' : 'none')};
  position: absolute;
  bottom: 100%;
  right: 0;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const LanguageOption = styled.button`
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  background-color: ${({ active }) => active ? '#f1f1f1' : 'transparent'};
  cursor: pointer;
  
  &:hover {
    background-color: #f1f1f1;
  }
`;

const LanguageSelector = () => {
  const { language, languages, changeLanguage } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setShowDropdown(false);
  };
  
  return (
    <LanguageSelectorContainer>
      {/* Simple button version */}
      {Object.keys(languages).map((lang) => (
        <LanguageButton
          key={lang}
          active={language === lang}
          onClick={() => changeLanguage(lang)}
        >
          {lang.toUpperCase()}
        </LanguageButton>
      ))}
      
      {/* Dropdown version (alternative) */}
      {/* <LanguageDropdown>
        <LanguageDropdownButton onClick={() => setShowDropdown(!showDropdown)}>
          {languages[language]}
        </LanguageDropdownButton>
        <LanguageDropdownContent show={showDropdown}>
          {Object.entries(languages).map(([lang, name]) => (
            <LanguageOption
              key={lang}
              active={language === lang}
              onClick={() => handleLanguageChange(lang)}
            >
              {name}
            </LanguageOption>
          ))}
        </LanguageDropdownContent>
      </LanguageDropdown> */}
    </LanguageSelectorContainer>
  );
};

export default LanguageSelector;

/**
 * components/common/DateFormatter.js - Date formatter component with localization
 */
import React from 'react';
import { useLanguage } from '../../i18n';

// Map of language codes to locale codes
const LOCALE_MAP = {
  de: 'de-DE',
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES'
};

// Date format options
const DATE_FORMATS = {
  short: {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  },
  medium: {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  long: {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  },
  full: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
};

// Time format options
const TIME_FORMATS = {
  short: {
    hour: 'numeric',
    minute: 'numeric'
  },
  medium: {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }
};

const DateFormatter = ({ date, format = 'medium', includeTime = false, timeFormat = 'short' }) => {
  const { language } = useLanguage();
  const locale = LOCALE_MAP[language] || LOCALE_MAP.de;
  
  if (!date) return null;
  
  // Parse date if it's a string
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Get format options
  const dateFormatOptions = DATE_FORMATS[format] || DATE_FORMATS.medium;
  const timeFormatOptions = includeTime ? TIME_FORMATS[timeFormat] || TIME_FORMATS.short : {};
  
  // Combine options
  const options = { ...dateFormatOptions, ...timeFormatOptions };
  
  // Format date
  const formattedDate = new Intl.DateTimeFormat(locale, options).format(dateObj);
  
  return <span>{formattedDate}</span>;
};

export default DateFormatter;

/**
 * components/common/NumberFormatter.js - Number formatter component with localization
 */
import React from 'react';
import { useLanguage } from '../../i18n';

// Map of language codes to locale codes
const LOCALE_MAP = {
  de: 'de-DE',
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES'
};

// Number format options
const NUMBER_FORMATS = {
  decimal: {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  },
  percent: {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  },
  currency: {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
};

const NumberFormatter = ({ value, format = 'decimal', options = {} }) => {
  const { language } = useLanguage();
  const locale = LOCALE_MAP[language] || LOCALE_MAP.de;
  
  if (value === undefined || value === null) return null;
  
  // Get format options
  const formatOptions = { ...NUMBER_FORMATS[format], ...options };
  
  // Format number
  const formattedNumber = new Intl.NumberFormat(locale, formatOptions).format(value);
  
  return <span>{formattedNumber}</span>;
};

export default NumberFormatter;

/**
 * components/rsvp/RsvpForm.js - RSVP form with multilingual support
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../../i18n';
import { useRsvp } from '../../hooks/useRsvp';
import {
  Card,
  Button,
  Input,
  ErrorMessage
} from '../common/StyledComponents';
import DateFormatter from '../common/DateFormatter';

// ... (rest of the component implementation)

/**
 * Default translations for initial setup
 * These would be loaded into the database during application setup
 */
export const DEFAULT_TRANSLATIONS = {
  // Common translations
  'common.save': {
    de: 'Speichern',
    en: 'Save',
    fr: 'Enregistrer',
    es: 'Guardar'
  },
  'common.cancel': {
    de: 'Abbrechen',
    en: 'Cancel',
    fr: 'Annuler',
    es: 'Cancelar'
  },
  'common.delete': {
    de: 'Löschen',
    en: 'Delete',
    fr: 'Supprimer',
    es: 'Eliminar'
  },
  'common.edit': {
    de: 'Bearbeiten',
    en: 'Edit',
    fr: 'Modifier',
    es: 'Editar'
  },
  'common.add': {
    de: 'Hinzufügen',
    en: 'Add',
    fr: 'Ajouter',
    es: 'Añadir'
  },
  'common.yes': {
    de: 'Ja',
    en: 'Yes',
    fr: 'Oui',
    es: 'Sí'
  },
  'common.no': {
    de: 'Nein',
    en: 'No',
    fr: 'Non',
    es: 'No'
  },
  'common.loading': {
    de: 'Wird geladen...',
    en: 'Loading...',
    fr: 'Chargement...',
    es: 'Cargando...'
  },
  'common.actions': {
    de: 'Aktionen',
    en: 'Actions',
    fr: 'Actions',
    es: 'Acciones'
  },
  'common.search': {
    de: 'Suchen',
    en: 'Search',
    fr: 'Rechercher',
    es: 'Buscar'
  },
  'common.filter': {
    de: 'Filtern',
    en: 'Filter',
    fr: 'Filtrer',
    es: 'Filtrar'
  },
  'common.sort': {
    de: 'Sortieren',
    en: 'Sort',
    fr: 'Trier',
    es: 'Ordenar'
  },
  'common.export': {
    de: 'Exportieren',
    en: 'Export',
    fr: 'Exporter',
    es: 'Exportar'
  },
  'common.import': {
    de: 'Importieren',
    en: 'Import',
    fr: 'Importer',
    es: 'Importar'
  },
  'common.error': {
    de: 'Fehler',
    en: 'Error',
    fr: 'Erreur',
    es: 'Error'
  },
  'common.success': {
    de: 'Erfolg',
    en: 'Success',
    fr: 'Succès',
    es: 'Éxito'
  },
  
  // Login translations
  'login.title': {
    de: 'Anmelden',
    en: 'Log In',
    fr: 'Connexion',
    es: 'Iniciar Sesión'
  },
  'login.email': {
    de: 'E-Mail',
    en: 'Email',
    fr: 'Email',
    es: 'Correo Electrónico'
  },
  'login.password': {
    de: 'Passwort',
    en: 'Password',
    fr: 'Mot de passe',
    es: 'Contraseña'
  },
  'login.forgot_password': {
    de: 'Passwort vergessen?',
    en: 'Forgot password?',
    fr: 'Mot de passe oublié?',
    es: '¿Olvidó su contraseña?'
  },
  'login.submit': {
    de: 'Anmelden',
    en: 'Log In',
    fr: 'Se connecter',
    es: 'Iniciar Sesión'
  },
  'login.no_account': {
    de: 'Noch kein Konto?',
    en: 'Don\'t have an account?',
    fr: 'Vous n\'avez pas de compte?',
    es: '¿No tiene una cuenta?'
  },
  'login.sign_up': {
    de: 'Registrieren',
    en: 'Sign Up',
    fr: 'S\'inscrire',
    es: 'Registrarse'
  },
  
  // RSVP translations
  'rsvp.enter_code': {
    de: 'RSVP-Code eingeben',
    en: 'Enter RSVP Code',
    fr: 'Entrez le code RSVP',
    es: 'Ingrese el código RSVP'
  },
  'rsvp.enter_code_description': {
    de: 'Bitte geben Sie Ihren RSVP-Code ein, um auf die Einladung zu antworten.',
    en: 'Please enter your RSVP code to respond to the invitation.',
    fr: 'Veuillez entrer votre code RSVP pour répondre à l\'invitation.',
    es: 'Por favor, ingrese su código RSVP para responder a la invitación.'
  },
  'rsvp.code_placeholder': {
    de: 'RSVP-Code',
    en: 'RSVP Code',
    fr: 'Code RSVP',
    es: 'Código RSVP'
  },
  'rsvp.submit': {
    de: 'Absenden',
    en: 'Submit',
    fr: 'Soumettre',
    es: 'Enviar'
  },
  'rsvp.hello': {
    de: 'Hallo',
    en: 'Hello',
    fr: 'Bonjour',
    es: 'Hola'
  },
  'rsvp.invitation_to': {
    de: 'Sie sind eingeladen zu',
    en: 'You are invited to',
    fr: 'Vous êtes invité à',
    es: 'Está invitado a'
  },
  'rsvp.your_response': {
    de: 'Ihre Antwort',
    en: 'Your Response',
    fr: 'Votre Réponse',
    es: 'Su Respuesta'
  },
  'rsvp.will_attend': {
    de: 'Ja, ich werde teilnehmen',
    en: 'Yes, I will attend',
    fr: 'Oui, je participerai',
    es: 'Sí, asistiré'
  },
  'rsvp.will_not_attend': {
    de: 'Nein, ich kann nicht teilnehmen',
    en: 'No, I cannot attend',
    fr: 'Non, je ne peux pas participer',
    es: 'No, no puedo asistir'
  },
  'rsvp.accompanying_persons': {
    de: 'Begleitpersonen',
    en: 'Accompanying Persons',
    fr: 'Personnes Accompagnantes',
    es: 'Personas Acompañantes'
  },
  'rsvp.need_accommodation': {
    de: 'Benötigen Sie Unterkunft?',
    en: 'Do you need accommodation?',
    fr: 'Avez-vous besoin d\'hébergement?',
    es: '¿Necesita alojamiento?'
  },
  'rsvp.accommodation_description': {
    de: 'Bitte ankreuzen, wenn Sie Unterkunft benötigen',
    en: 'Please check if you need accommodation',
    fr: 'Veuillez cocher si vous avez besoin d\'hébergement',
    es: 'Marque si necesita alojamiento'
  },
  'rsvp.menu_selection': {
    de: 'Menüauswahl',
    en: 'Menu Selection',
    fr: 'Sélection de Menu',
    es: 'Selección de Menú'
  },
  'rsvp.allergies': {
    de: 'Allergien',
    en: 'Allergies',
    fr: 'Allergies',
    es: 'Alergias'
  },
  'rsvp.allergies_description': {
    de: 'Bitte wählen Sie alle zutreffenden Allergien aus',
    en: 'Please select all applicable allergies',
    fr: 'Veuillez sélectionner toutes les allergies applicables',
    es: 'Por favor seleccione todas las alergias aplicables'
  },
  'rsvp.special_requests': {
    de: 'Besondere Wünsche',
    en: 'Special Requests',
    fr: 'Demandes Spéciales',
    es: 'Solicitudes Especiales'
  },
  'rsvp.special_requests_placeholder': {
    de: 'Geben Sie hier besondere Wünsche oder Anmerkungen ein',
    en: 'Enter any special requests or notes here',
    fr: 'Entrez ici toutes demandes spéciales ou remarques',
    es: 'Ingrese cualquier solicitud especial o notas aquí'
  },
  'rsvp.submit_response': {
    de: 'Antwort absenden',
    en: 'Submit Response',
    fr: 'Soumettre la Réponse',
    es: 'Enviar Respuesta'
  },
  'rsvp.thank_you': {
    de: 'Vielen Dank!',
    en: 'Thank You!',
    fr: 'Merci!',
    es: '¡Gracias!'
  },
  'rsvp.response_received': {
    de: 'Ihre Antwort wurde erfolgreich übermittelt.',
    en: 'Your response has been successfully submitted.',
    fr: 'Votre réponse a été soumise avec succès.',
    es: 'Su respuesta ha sido enviada con éxito.'
  },
  'rsvp.your_response_summary': {
    de: 'Zusammenfassung Ihrer Antwort',
    en: 'Your Response Summary',
    fr: 'Résumé de Votre Réponse',
    es: 'Resumen de Su Respuesta'
  },
  'rsvp.status': {
    de: 'Status',
    en: 'Status',
    fr: 'Statut',
    es: 'Estado'
  },
  'rsvp.accommodation': {
    de: 'Unterkunft',
    en: 'Accommodation',
    fr: 'Hébergement',
    es: 'Alojamiento'
  },
  'rsvp.menu_selections': {
    de: 'Menüauswahl',
    en: 'Menu Selections',
    fr: 'Sélections de Menu',
    es: 'Selecciones de Menú'
  },
  'rsvp.contact_couple': {
    de: 'Bei Fragen kontaktieren Sie bitte das Brautpaar.',
    en: 'Please contact the couple if you have any questions.',
    fr: 'Veuillez contacter le couple si vous avez des questions.',
    es: 'Por favor contacte a la pareja si tiene alguna pregunta.'
  },
  
  // Food translations
  'food.vegetarian': {
    de: 'Vegetarisch',
    en: 'Vegetarian',
    fr: 'Végétarien',
    es: 'Vegetariano'
  },
  'food.vegan': {
    de: 'Vegan',
    en: 'Vegan',
    fr: 'Végétalien',
    es: 'Vegano'
  },
  'food.gluten_free': {
    de: 'Glutenfrei',
    en: 'Gluten-free',
    fr: 'Sans gluten',
    es: 'Sin gluten'
  },
  'food.dairy_free': {
    de: 'Laktosefrei',
    en: 'Dairy-free',
    fr: 'Sans lactose',
    es: 'Sin lácteos'
  },
  'food.starter': {
    de: 'Vorspeise',
    en: 'Starter',
    fr: 'Entrée',
    es: 'Entrante'
  },
  'food.main_course': {
    de: 'Hauptgang',
    en: 'Main Course',
    fr: 'Plat Principal',
    es: 'Plato Principal'
  },
  'food.dessert': {
    de: 'Nachspeise',
    en: 'Dessert',
    fr: 'Dessert',
    es: 'Postre'
  },
  
  // Navigation translations
  'nav.dashboard': {
    de: 'Dashboard',
    en: 'Dashboard',
    fr: 'Tableau de bord',
    es: 'Panel de control'
  },
  'nav.guests': {
    de: 'Gäste',
    en: 'Guests',
    fr: 'Invités',
    es: 'Invitados'
  },
  'nav.tables': {
    de: 'Tische',
    en: 'Tables',
    fr: 'Tables',
    es: 'Mesas'
  },
  'nav.menu': {
    de: 'Menü',
    en: 'Menu',
    fr: 'Menu',
    es: 'Menú'
  },
  'nav.statistics': {
    de: 'Statistiken',
    en: 'Statistics',
    fr: 'Statistiques',
    es: 'Estadísticas'
  },
  'nav.settings': {
    de: 'Einstellungen',
    en: 'Settings',
    fr: 'Paramètres',
    es: 'Configuración'
  },
  'nav.admin_dashboard': {
    de: 'Admin-Dashboard',
    en: 'Admin Dashboard',
    fr: 'Tableau de bord admin',
    es: 'Panel de administración'
  },
  'nav.weddings': {
    de: 'Hochzeiten',
    en: 'Weddings',
    fr: 'Mariages',
    es: 'Bodas'
  },
  'nav.users': {
    de: 'Benutzer',
    en: 'Users',
    fr: 'Utilisateurs',
    es: 'Usuarios'
  },
  
  // User menu translations
  'user_menu.profile': {
    de: 'Profil',
    en: 'Profile',
    fr: 'Profil',
    es: 'Perfil'
  },
  'user_menu.logout': {
    de: 'Abmelden',
    en: 'Logout',
    fr: 'Déconnexion',
    es: 'Cerrar sesión'
  },
  
  // Dashboard translations
  'dashboard.title': {
    de: 'Dashboard',
    en: 'Dashboard',
    fr: 'Tableau de bord',
    es: 'Panel de control'
  },
  'dashboard.wedding_overview': {
    de: 'Hochzeitsübersicht',
    en: 'Wedding Overview',
    fr: 'Aperçu du mariage',
    es: 'Resumen de la boda'
  },
  'dashboard.wedding_date': {
    de: 'Hochzeitsdatum',
    en: 'Wedding Date',
    fr: 'Date du mariage',
    es: 'Fecha de la boda'
  },
  'dashboard.location': {
    de: 'Ort',
    en: 'Location',
    fr: 'Lieu',
    es: 'Ubicación'
  },
  'dashboard.style': {
    de: 'Stil',
    en: 'Style',
    fr: 'Style',
    es: 'Estilo'
  },
  'dashboard.rsvp_deadline': {
    de: 'RSVP-Frist',
    en: 'RSVP Deadline',
    fr: 'Date limite RSVP',
    es: 'Fecha límite RSVP'
  },
  'dashboard.rsvp_status': {
    de: 'RSVP-Status',
    en: 'RSVP Status',
    fr: 'Statut RSVP',
    es: 'Estado RSVP'
  },
  'dashboard.tasks': {
    de: 'Aufgaben',
    en: 'Tasks',
    fr: 'Tâches',
    es: 'Tareas'
  },
  'dashboard.recent_activity': {
    de: 'Letzte Aktivitäten',
    en: 'Recent Activity',
    fr: 'Activité récente',
    es: 'Actividad reciente'
  },
  'dashboard.quick_actions': {
    de: 'Schnellaktionen',
    en: 'Quick Actions',
    fr: 'Actions rapides',
    es: 'Acciones rápidas'
  },
  'dashboard.view_details': {
    de: 'Details anzeigen',
    en: 'View Details',
    fr: 'Voir les détails',
    es: 'Ver detalles'
  },
  'dashboard.view_all_tasks': {
    de: 'Alle Aufgaben anzeigen',
    en: 'View All Tasks',
    fr: 'Voir toutes les tâches',
    es: 'Ver todas las tareas'
  },
  'dashboard.add_guest': {
    de: 'Gast hinzufügen',
    en: 'Add Guest',
    fr: 'Ajouter un invité',
    es: 'Añadir invitado'
  },
  'dashboard.send_reminder': {
    de: 'Erinnerung senden',
    en: 'Send Reminder',
    fr: 'Envoyer un rappel',
    es: 'Enviar recordatorio'
  },
  'dashboard.export_data': {
    de: 'Daten exportieren',
    en: 'Export Data',
    fr: 'Exporter les données',
    es: 'Exportar datos'
  },
  
  // Statistics translations
  'stats.dashboard_title': {
    de: 'Statistik-Dashboard',
    en: 'Statistics Dashboard',
    fr: 'Tableau de Bord des Statistiques',
    es: 'Panel de Estadísticas'
  },
  'stats.refresh': {
    de: 'Aktualisieren',
    en: 'Refresh',
    fr: 'Actualiser',
    es: 'Actualizar'
  },
  'stats.export': {
    de: 'Exportieren',
    en: 'Export',
    fr: 'Exporter',
    es: 'Exportar'
  },
  'stats.rsvp_summary': {
    de: 'RSVP-Zusammenfassung',
    en: 'RSVP Summary',
    fr: 'Résumé des RSVP',
    es: 'Resumen de RSVP'
  },
  'stats.total_guests': {
    de: 'Gesamtzahl der Gäste',
    en: 'Total Guests',
    fr: 'Nombre Total d\'Invités',
    es: 'Total de Invitados'
  },
  'stats.accepted': {
    de: 'Zusagen',
    en: 'Accepted',
    fr: 'Acceptés',
    es: 'Aceptados'
  },
  'stats.declined': {
    de: 'Absagen',
    en: 'Declined',
    fr: 'Déclinés',
    es: 'Rechazados'
  },
  'stats.pending': {
    de: 'Ausstehend',
    en: 'Pending',
    fr: 'En Attente',
    es: 'Pendientes'
  },
  'stats.needs_accommodation': {
    de: 'Benötigt Unterkunft',
    en: 'Needs Accommodation',
    fr: 'Besoin d\'Hébergement',
    es: 'Necesita Alojamiento'
  },
  'stats.of_accepted': {
    de: 'der Zusagen',
    en: 'of accepted',
    fr: 'des acceptés',
    es: 'de aceptados'
  },
  'stats.rsvp_timeline': {
    de: 'RSVP-Zeitverlauf',
    en: 'RSVP Timeline',
    fr: 'Chronologie des RSVP',
    es: 'Cronología de RSVP'
  },
  'stats.cumulative_accepted': {
    de: 'Kumulative Zusagen',
    en: 'Cumulative Accepted',
    fr: 'Acceptés Cumulés',
    es: 'Aceptados Acumulados'
  },
  'stats.cumulative_declined': {
    de: 'Kumulative Absagen',
    en: 'Cumulative Declined',
    fr: 'Déclinés Cumulés',
    es: 'Rechazados Acumulados'
  },
  'stats.daily_accepted': {
    de: 'Tägliche Zusagen',
    en: 'Daily Accepted',
    fr: 'Acceptés Quotidiens',
    es: 'Aceptados Diarios'
  },
  'stats.daily_declined': {
    de: 'Tägliche Absagen',
    en: 'Daily Declined',
    fr: 'Déclinés Quotidiens',
    es: 'Rechazados Diarios'
  },
  'stats.date': {
    de: 'Datum',
    en: 'Date',
    fr: 'Date',
    es: 'Fecha'
  },
  'stats.responses': {
    de: 'Antworten',
    en: 'Responses',
    fr: 'Réponses',
    es: 'Respuestas'
  },
  'stats.guest_groups': {
    de: 'Gästegruppen',
    en: 'Guest Groups',
    fr: 'Groupes d\'Invités',
    es: 'Grupos de Invitados'
  },
  'stats.guest_group': {
    de: 'Gästegruppe',
    en: 'Guest Group',
    fr: 'Groupe d\'Invités',
    es: 'Grupo de Invitados'
  },
  'stats.guests': {
    de: 'Gäste',
    en: 'Guests',
    fr: 'Invités',
    es: 'Invitados'
  },
  'stats.table_statistics': {
    de: 'Tischstatistiken',
    en: 'Table Statistics',
    fr: 'Statistiques des Tables',
    es: 'Estadísticas de Mesas'
  },
  'stats.table': {
    de: 'Tisch',
    en: 'Table',
    fr: 'Table',
    es: 'Mesa'
  },
  'stats.capacity': {
    de: 'Kapazität',
    en: 'Capacity',
    fr: 'Capacité',
    es: 'Capacidad'
  },
  'stats.assigned': {
    de: 'Zugewiesen',
    en: 'Assigned',
    fr: 'Assignés',
    es: 'Asignados'
  },
  'stats.available': {
    de: 'Verfügbar',
    en: 'Available',
    fr: 'Disponibles',
    es: 'Disponibles'
  },
  'stats.utilization': {
    de: 'Auslastung',
    en: 'Utilization',
    fr: 'Utilisation',
    es: 'Utilización'
  },
  'stats.dietary_requirements': {
    de: 'Ernährungsanforderungen',
    en: 'Dietary Requirements',
    fr: 'Exigences Alimentaires',
    es: 'Requisitos Dietéticos'
  },
  'stats.with_allergies': {
    de: 'Mit Allergien',
    en: 'With Allergies',
    fr: 'Avec Allergies',
    es: 'Con Alergias'
  },
  
  // Admin translations
  'admin.translations.title': {
    de: 'Übersetzungen verwalten',
    en: 'Manage Translations',
    fr: 'Gérer les traductions',
    es: 'Administrar traducciones'
  },
  'admin.translations.search': {
    de: 'Übersetzungen durchsuchen',
    en: 'Search translations',
    fr: 'Rechercher des traductions',
    es: 'Buscar traducciones'
  },
  'admin.translations.add': {
    de: 'Übersetzung hinzufügen',
    en: 'Add Translation',
    fr: 'Ajouter une traduction',
    es: 'Añadir traducción'
  },
  'admin.translations.edit': {
    de: 'Übersetzung bearbeiten',
    en: 'Edit Translation',
    fr: 'Modifier la traduction',
    es: 'Editar traducción'
  },
  'admin.translations.import': {
    de: 'Übersetzungen importieren',
    en: 'Import Translations',
    fr: 'Importer des traductions',
    es: 'Importar traducciones'
  },
  'admin.translations.export': {
    de: 'Übersetzungen exportieren',
    en: 'Export Translations',
    fr: 'Exporter des traductions',
    es: 'Exportar traducciones'
  },
  'admin.translations.key': {
    de: 'Schlüssel',
    en: 'Key',
    fr: 'Clé',
    es: 'Clave'
  },
  'admin.translations.no_results': {
    de: 'Keine Übersetzungen gefunden',
    en: 'No translations found',
    fr: 'Aucune traduction trouvée',
    es: 'No se encontraron traducciones'
  }
};

/**
 * Script to initialize translations in the database
 * This would be run during application setup
 */
export const initializeTranslations = async () => {
  try {
    console.log('Initializing translations...');
    
    // Import default translations
    const result = await importTranslations(DEFAULT_TRANSLATIONS);
    
    console.log(`Translations initialized: ${result.added} added, ${result.updated} updated`);
    return result;
  } catch (error) {
    console.error('Error initializing translations:', error);
    throw error;
  }
};
