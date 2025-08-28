import { useTranslation } from 'react-i18next';
import overrides from '../locales/overrides.json';

/**
 * Custom translation hook with override support
 * This allows developers to override specific translations during development
 * Usage: const { t } = useCustomTranslation();
 */
export const useCustomTranslation = (namespace = 'common') => {
  const { t: originalT, i18n } = useTranslation(namespace);
  
  const t = (key, options) => {
    // Check if there's an override for this key
    const overrideKey = key.split('.').reduce((obj, k) => obj?.[k], overrides);
    
    if (overrideKey && typeof overrideKey === 'string') {
      return overrideKey;
    }
    
    // Fallback to original translation
    return originalT(key, options);
  };
  
  return { t, i18n };
};

export default useCustomTranslation;
