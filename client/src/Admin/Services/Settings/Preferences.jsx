import React, { useState, useEffect } from 'react';
import { useCustomTranslation } from '../../../hooks/useCustomTranslation';
import { useTheme } from '../../../contexts/ThemeContext';
import ThemeSwitch from '../../../Components/settings/ThemeSwitch';

const Preferences = () => {
  const { t, i18n } = useCustomTranslation();
  const { theme, changeTheme, isDark } = useTheme();
  // Initialize from localStorage to avoid flash of wrong language
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('i18nextLng') || i18n.language || 'en';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync selectedLanguage with i18n.language changes
  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      console.log('🔄 [Admin Preferences] Language changed event:', lng);
      setSelectedLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    
    // Set initial language from i18n
    if (i18n.language) {
      setSelectedLanguage(i18n.language);
    }

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);  const languages = [
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
    try {
      await changeTheme(themeValue);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error changing theme:', error);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 pb-8">
      {/* Full-Screen Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 h-screen w-screen z-50 flex items-center justify-center bg-black/60">
          <div className="flex items-center space-x-4">
            <div 
              className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent"
              style={{ borderColor: isDark ? '#a78bfa' : '#8b5cf6', borderTopColor: 'transparent' }}
            ></div>
            <span 
              className="text-lg font-medium"
              style={{ color: isDark ? '#ffffff' : '#000000' }}
            >
              {t('settings.applying')}...
            </span>
          </div>
        </div>
      )}

      {/* Success notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div 
            className={`px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 ${
              isDark ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
            }`}
          >
            <i className="fas fa-check-circle text-lg"></i>
            <span className="font-medium">{t('settings.success')}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h2 
          className={`text-2xl sm:text-3xl font-bold mb-3 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {t('settings.preferences')}
        </h2>
        <p 
          className={`text-base ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Customize your admin experience and preferences
        </p>
      </div>

      {/* Theme Section */}
      <div 
        className={`rounded-2xl p-6 sm:p-8 border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div 
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-purple-900' : 'bg-purple-100'
              }`}
            >
              <i 
                className={`fas fa-palette text-xl ${
                  isDark ? 'text-purple-300' : 'text-purple-600'
                }`}
              ></i>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 
              className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {t('preferences.theme')}
            </h3>
            <p 
              className={`text-base mb-6 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Choose your preferred theme for the application interface
            </p>
            <ThemeSwitch 
              isDark={isDark}
              onChange={(isDarkMode) => {
                const newTheme = isDarkMode ? 'dark' : 'light';
                handleThemeChange(newTheme);
              }}
            />
          </div>
        </div>
      </div>

      {/* Language Section */}
      <div 
        className={`rounded-2xl p-6 sm:p-8 border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div 
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-blue-900' : 'bg-blue-100'
              }`}
            >
              <i 
                className={`fas fa-globe text-xl ${
                  isDark ? 'text-blue-300' : 'text-blue-600'
                }`}
              ></i>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 
              className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {t('settings.language')}
            </h3>
            <p 
              className={`text-base mb-6 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {t('settings.language_description')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  disabled={isLoading}
                  className={`relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 text-left group disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedLanguage === language.code
                      ? `${
                          isDark 
                            ? 'border-emerald-500 bg-emerald-900/20' 
                            : 'border-emerald-500 bg-emerald-50'
                        } shadow-lg transform scale-105`
                      : `${
                          isDark 
                            ? 'border-gray-600 bg-gray-700 hover:border-emerald-400 hover:bg-gray-600' 
                            : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-25'
                        } hover:shadow-md hover:scale-102`
                  }`}
                >
                  {selectedLanguage === language.code && (
                    <div className="absolute -top-2 -right-2">
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isDark ? 'bg-emerald-500' : 'bg-emerald-500'
                        }`}
                      >
                        <i className="fas fa-check text-white text-xs"></i>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{language.flag}</span>
                    <div>
                      <h4 
                        className={`font-semibold ${
                          selectedLanguage === language.code
                            ? `${isDark ? 'text-emerald-300' : 'text-emerald-700'}`
                            : `${isDark ? 'text-white' : 'text-gray-900'}`
                        }`}
                      >
                        {language.name}
                      </h4>
                      <p 
                        className={`text-sm ${
                          selectedLanguage === language.code
                            ? `${isDark ? 'text-emerald-400' : 'text-emerald-600'}`
                            : `${isDark ? 'text-gray-400' : 'text-gray-500'}`
                        }`}
                      >
                        {language.code.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
