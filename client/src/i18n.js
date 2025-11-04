import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import tlCommon from './locales/tl/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  tl: {
    common: tlCommon,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.MODE === 'development',
    
    // Default namespace
    defaultNS: 'common',
    ns: ['common'],

    // Key separator
    keySeparator: '.',
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    // React options
    react: {
      useSuspense: false,
      // Bind i18n events to trigger React re-renders
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    },
  });

export default i18n;
