import React, { useState, useEffect } from 'react';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeSwitch from './ThemeSwitch';

const Preferences = () => {
  const { t, i18n } = useCustomTranslation();
  const { theme, changeTheme, isDark } = useTheme();
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
    <div className="space-y-6 lg:space-y-8">
      {/* Full-Screen Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 h-screen w-screen z-50 flex items-center justify-center bg-black/60">
          <div className="flex items-center space-x-4">
            <div 
              className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent"
              style={{ borderColor: isDark ? '#a78bfa' : '#8b5cf6', borderTopColor: 'transparent' }}
            ></div>
            <span 
              className="text-lg font-semibold"
              style={{ color: '#ffffff' }}
            >
              Updating...
            </span>
          </div>
        </div>
      )}

      {/* Modern Success Alert - Centered Popup */}
      {showSuccess && (
        <div className="fixed inset-0 h-full z-50 flex items-center justify-center bg-black/60">
          <div 
            className="border border-emerald-200/50 dark:border-emerald-700/50 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl max-w-sm mx-4 transform animate-in fade-in zoom-in duration-300"
            style={{ backgroundColor: isDark ? '#0f3730' : '#f0fdfa' }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: isDark ? '#047857' : '#d1fae5' }}
            >
              <i 
                className="fas fa-check text-2xl"
                style={{ color: isDark ? '#6ee7b7' : '#047857' }}
              ></i>
            </div>
            <h3 
              className="font-semibold text-lg mb-2"
              style={{ color: isDark ? '#6ee7b7' : '#047857' }}
            >
              {t('settings.preferences_updated')}
            </h3>
            <p 
              className="text-sm opacity-80"
              style={{ color: isDark ? '#86efac' : '#059669' }}
            >
              Your preferences have been saved successfully
            </p>
          </div>
        </div>
      )}

      {/* Language Preferences */}
      <div 
        className="border border-gray-200/50 dark:border-gray-600/50 rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
        style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ backgroundColor: isDark ? '#1e40af' : '#dbeafe' }}
            >
              <i 
                className="fas fa-globe text-xl"
                style={{ color: isDark ? '#60a5fa' : '#1e40af' }}
              ></i>
            </div>
            <div className="flex-1">
              <h3 
                className="text-xl lg:text-2xl font-semibold"
                style={{ color: isDark ? '#ffffff' : '#111827' }}
              >
                {t('preferences.language_preference')}
              </h3>
              <p 
                className="text-sm lg:text-base mt-1"
                style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
              >
                Choose your preferred language for the interface
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              disabled={isLoading}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${
                selectedLanguage === language.code
                  ? 'shadow-lg scale-[1.02]'
                  : 'shadow-sm hover:shadow-md'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              style={{
                borderColor: selectedLanguage === language.code 
                  ? (isDark ? '#10b981' : '#10b981')
                  : (isDark ? '#374151' : '#e5e7eb'),
                backgroundColor: selectedLanguage === language.code
                  ? (isDark ? '#064e3b' : '#ecfdf5')
                  : (isDark ? '#1f2937' : '#ffffff')
              }}
            >
              <div className="flex items-center justify-center space-x-4">
                <span className="text-3xl lg:text-4xl">{language.flag}</span>
                <div className="text-center">
                  <span 
                    className="font-semibold text-base lg:text-lg block"
                    style={{ 
                      color: selectedLanguage === language.code
                        ? (isDark ? '#6ee7b7' : '#047857')
                        : (isDark ? '#d1d5db' : '#374151')
                    }}
                  >
                    {language.name}
                  </span>
                </div>
              </div>
              {selectedLanguage === language.code && (
                <div className="absolute -top-2 -right-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: isDark ? '#10b981' : '#10b981' }}
                  >
                    <i className="fas fa-check text-white text-xs"></i>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Preferences */}
      <div 
        className="border border-gray-200/50 dark:border-gray-600/50 rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
        style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-6 sm:space-y-0">
          {/* Theme Info */}
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ backgroundColor: isDark ? '#7c3aed' : '#ede9fe' }}
            >
              <i 
                className="fas fa-palette text-xl"
                style={{ color: isDark ? '#a78bfa' : '#7c3aed' }}
              ></i>
            </div>
            <div className="flex-1">
              <h3 
                className="text-xl lg:text-2xl font-semibold"
                style={{ color: isDark ? '#ffffff' : '#111827' }}
              >
                {t('preferences.theme')}
              </h3>
              <p 
                className="text-sm lg:text-base mt-1"
                style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
              >
                Switch between light and dark mode
              </p>
            </div>
          </div>

          {/* Animated Theme Switch */}
          <div className="flex flex-col items-center sm:items-end">
            <div className="flex items-center space-x-4">
              <span 
                className={`text-sm font-medium transition-opacity duration-200 ${!isDark ? 'opacity-100' : 'opacity-50'}`}
                style={{ color: isDark ? '#d1d5db' : '#374151' }}
              >
                <i className="fas fa-sun mr-1"></i>
                Light
              </span>
              <ThemeSwitch 
                isDark={isDark}
                onChange={(isChecked) => handleThemeChange(isChecked ? 'dark' : 'light')}
                disabled={isLoading}
              />
              <span 
                className={`text-sm font-medium transition-opacity duration-200 ${isDark ? 'opacity-100' : 'opacity-50'}`}
                style={{ color: isDark ? '#d1d5db' : '#374151' }}
              >
                <i className="fas fa-moon mr-1"></i>
                Dark
              </span>
            </div>
          </div>
        </div>

        {/* Optional: Auto theme info - you can remove this if you don't want auto theme */}
        {theme === 'auto' && (
          <div 
            className="mt-6 p-4 rounded-xl border"
            style={{ 
              backgroundColor: isDark ? '#374151' : '#f9fafb',
              borderColor: isDark ? '#4b5563' : '#e5e7eb'
            }}
          >
            <div className="flex items-center space-x-2">
              <i 
                className="fas fa-info-circle text-sm"
                style={{ color: isDark ? '#8b5cf6' : '#7c3aed' }}
              ></i>
              <p 
                className="text-sm"
                style={{ color: isDark ? '#d1d5db' : '#374151' }}
              >
                Auto theme follows your system preference. Currently showing {isDark ? 'dark' : 'light'} mode.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preferences;
