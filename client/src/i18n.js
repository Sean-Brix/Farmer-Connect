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

// Get initial language from localStorage before initialization
const savedLanguage = localStorage.getItem('i18nextLng');
console.log('🌍 [i18n] Saved language from localStorage:', savedLanguage);

// Initialize i18n with localStorage persistence
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage || 'en', // Set initial language from localStorage
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

    // Language detection options - localStorage first for persistence
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
      // Don't cache to cookies to avoid conflicts
      excludeCacheFor: ['cookie'],
    },

    // React options
    react: {
      useSuspense: false,
      // Bind i18n events to trigger React re-renders
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    },
  });

console.log('🌍 [i18n] Initialized with language:', i18n.language);

// Load user's language preference from backend after initialization (if user is logged in)
const loadUserLanguagePreference = async () => {
  try {
    // Check if user is logged in by checking localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.log('🌍 [i18n] No user logged in, using localStorage language');
      return; // User not logged in, use localStorage/browser default
    }

    const response = await fetch('/api/preferences/language', {
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('🌍 [i18n] Backend language preference:', data.language);
      if (data.success && data.language && data.language !== i18n.language) {
        // Update language if different from current
        console.log('🌍 [i18n] Syncing language from backend:', data.language);
        await i18n.changeLanguage(data.language);
        localStorage.setItem('i18nextLng', data.language);
      }
    }
  } catch (error) {
    console.log('🌍 [i18n] Could not load language preference from API, using localStorage default');
  }
};

// Load language preference when i18n is ready
i18n.on('initialized', () => {
  console.log('🌍 [i18n] i18n initialized, loading user preference');
  loadUserLanguagePreference();
});

export default i18n;
