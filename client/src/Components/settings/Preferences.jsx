import React, { useState, useEffect } from 'react';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';
import { useTheme } from '../../contexts/ThemeContext';

const Preferences = () => {
  const { t, i18n } = useCustomTranslation();
  const { theme, changeTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load language preference from backend on mount
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const response = await fetch('/api/preferences/language', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.language) {
            setSelectedLanguage(data.language);
            if (data.language !== i18n.language) {
              await i18n.changeLanguage(data.language);
            }
          }
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      }
    };

    loadLanguagePreference();
  }, [i18n]);

  const languages = [
    { code: 'en', name: t('settings.english'), flag: '🇺🇸' },
    { code: 'tl', name: t('settings.tagalog'), flag: '🇵🇭' },
  ];

  const themes = [
    { value: 'light', label: t('preferences.light'), icon: 'fas fa-sun' },
    { value: 'dark', label: t('preferences.dark'), icon: 'fas fa-moon' },
    { value: 'auto', label: t('preferences.auto'), icon: 'fas fa-adjust' },
  ];

  const handleLanguageChange = async (languageCode) => {
    setIsLoading(true);
    try {
      // Save to backend
      const response = await fetch('/api/preferences/language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ language: languageCode }),
      });

      if (response.ok) {
        await i18n.changeLanguage(languageCode);
        setSelectedLanguage(languageCode);
        localStorage.setItem('i18nextLng', languageCode);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        console.error('Failed to save language preference to backend');
        // Still update locally if backend fails
        await i18n.changeLanguage(languageCode);
        setSelectedLanguage(languageCode);
        localStorage.setItem('i18nextLng', languageCode);
      }
    } catch (error) {
      console.error('Error changing language:', error);
      // Fallback to local change
      await i18n.changeLanguage(languageCode);
      setSelectedLanguage(languageCode);
      localStorage.setItem('i18nextLng', languageCode);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = async (themeValue) => {
    setIsLoading(true);
    try {
      await changeTheme(themeValue);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error changing theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4 flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
            <i className="fas fa-check text-emerald-600 dark:text-emerald-300"></i>
          </div>
          <span className="text-emerald-800 dark:text-emerald-200 font-medium">
            {isLoading ? t('settings.language_changed') : t('settings.preferences_updated')}
          </span>
        </div>
      )}

      {/* Language Preferences */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
            <i className="fas fa-language text-blue-600 dark:text-blue-300 text-lg"></i>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('preferences.language_preference')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Choose your preferred language for the interface</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              disabled={isLoading}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedLanguage === language.code
                  ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
              </div>
              {selectedLanguage === language.code && (
                <div className="absolute top-2 right-2">
                  <i className="fas fa-check-circle text-emerald-600 dark:text-emerald-400"></i>
                </div>
              )}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="mt-4 flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
            <span className="text-sm">{t('common.loading')}</span>
          </div>
        )}
      </div>

      {/* Theme Preferences */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
            <i className="fas fa-palette text-purple-600 dark:text-purple-300 text-lg"></i>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('preferences.theme')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Choose your preferred theme appearance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => handleThemeChange(themeOption.value)}
              disabled={isLoading}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                theme === themeOption.value
                  ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex flex-col items-center space-y-2">
                <i className={`${themeOption.icon} text-2xl`}></i>
                <span className="font-medium">{themeOption.label}</span>
              </div>
              {theme === themeOption.value && (
                <div className="absolute top-2 right-2">
                  <i className="fas fa-check-circle text-purple-600 dark:text-purple-400"></i>
                </div>
              )}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="mt-4 flex items-center space-x-2 text-purple-600 dark:text-purple-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 dark:border-purple-400"></div>
            <span className="text-sm">{t('common.loading')}</span>
          </div>
        )}
      </div>

      {/* Development Override Info */}
      <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <i className="fas fa-info-circle text-amber-600 dark:text-amber-300"></i>
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-200">Developer Translation Override</h4>
            <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
              To override specific translations during development, edit the 
              <code className="bg-amber-100 dark:bg-amber-800 px-2 py-1 rounded mx-1 text-xs">src/locales/overrides.json</code> 
              file. This allows you to customize text without modifying the main translation files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
