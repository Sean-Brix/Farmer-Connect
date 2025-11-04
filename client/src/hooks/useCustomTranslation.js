import { useTranslation } from 'react-i18next';
import overrides from '../locales/overrides.json';

/**
 * Custom translation hook with override support
 * This allows developers to override specific translations during development
 * Usage: const { t, i18n } = useCustomTranslation();
 * 
 * IMPORTANT: This hook subscribes to language changes and will trigger
 * component re-renders when the language is changed via i18n.changeLanguage()
 */
export const useCustomTranslation = (namespace = 'common') => {
  // useTranslation automatically subscribes to language changes
  // and triggers re-renders when language is changed
  const { t: originalT, i18n, ready } = useTranslation(namespace);
  
  const t = (key, options) => {
    // Check if there's an override for this key
    const overrideKey = key.split('.').reduce((obj, k) => obj?.[k], overrides);
    
    if (overrideKey && typeof overrideKey === 'string') {
      return overrideKey;
    }
    
    // Fallback to original translation
    return originalT(key, options);
  };
  
  // Return i18n instance so components can use i18n.changeLanguage() and i18n.language
  return { t, i18n, ready };
};

export default useCustomTranslation;
