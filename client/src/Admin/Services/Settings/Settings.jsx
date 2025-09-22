import React, { useState } from 'react';
import { useCustomTranslation } from '../../../hooks/useCustomTranslation';
import { useTheme } from '../../../contexts/ThemeContext.jsx';
import Preferences from './Preferences';
import Notifications from './Notifications';
import AccountSettings from './AccountSettings';
import ProfileSettings from './ProfileSettings';

const Settings = () => {
  const { t } = useCustomTranslation();
  const { theme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('preferences');

  const tabs = [
    { 
      id: 'preferences', 
      label: t('settings.preferences'), 
      icon: 'fas fa-cog',
      component: Preferences 
    },
    { 
      id: 'profile', 
      label: 'Profile Settings', 
      icon: 'fas fa-user',
      component: ProfileSettings 
    },
    { 
      id: 'notifications', 
      label: t('settings.notifications'), 
      icon: 'fas fa-bell',
      component: Notifications 
    },
    { 
      id: 'account', 
      label: 'Account Settings', 
      icon: 'fas fa-user-cog',
      component: AccountSettings 
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div 
      className={`min-h-screen transition-colors duration-200 py-8 px-4 sm:px-6 lg:px-8 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      
      {/* Header Section - flattened, icon inline with title */}
      <div className="mt-20 mb-8 px-2">
        <h1 className={`flex items-center gap-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>
          <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
            <i className="fas fa-cog text-white text-xl sm:text-2xl"></i>
          </span>
          Admin Settings
        </h1>
        <p className={`mt-1 sm:mt-2 text-sm sm:text-base max-w-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your admin preferences and account settings</p>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto">
        <div 
          className={`rounded-2xl sm:rounded-3xl shadow-xl border overflow-hidden flex flex-col ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
          style={{ 
            height: '75vh',
            minHeight: '600px'
          }}
        >
          
          {/* Mobile Tab Navigation */}
          <div 
            className={`lg:hidden border-b px-4 py-4 flex-shrink-0 ${
              isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? `shadow-md border ${
                          isDark 
                            ? 'bg-emerald-900 text-emerald-300 border-emerald-700' 
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`
                      : `hover:shadow-sm ${
                          isDark 
                            ? 'text-gray-300 hover:bg-gray-600' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`
                  }`}
                >
                  <i className={`${tab.icon} text-sm`}></i>
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Content Area */}
          <div className="lg:hidden flex-1 overflow-hidden">
            <div 
              className="h-full overflow-y-auto p-4 sm:p-6"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: isDark ? '#4B5563 #1F2937' : '#CBD5E1 #F1F5F9'
              }}
            >
              <div className="max-w-4xl h-full pb-8">
                {ActiveComponent && <ActiveComponent />}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex h-full">
            {/* Desktop Sidebar Navigation */}
            <div 
              className={`flex flex-col w-80 xl:w-96 border-r flex-shrink-0 ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex-1 py-8 px-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-left transition-all duration-300 group hover:shadow-md hover:scale-[1.01] shadow-lg border scale-[1.02] ${
                        activeTab === tab.id
                          ? `${
                              isDark 
                                ? 'bg-emerald-900 text-emerald-300 border-emerald-700' 
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`
                          : `${
                              isDark 
                                ? 'text-gray-300 border-transparent hover:bg-gray-600' 
                                : 'text-gray-700 border-transparent hover:bg-gray-100'
                            }`
                      }`}
                    >
                      <div 
                        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          activeTab === tab.id
                            ? `${
                                isDark 
                                  ? 'bg-emerald-800 text-emerald-300' 
                                  : 'bg-emerald-100 text-emerald-700'
                              }`
                            : `${
                                isDark 
                                  ? 'bg-gray-600 text-gray-400' 
                                  : 'bg-gray-200 text-gray-600'
                              }`
                        }`}
                      >
                        <i className={`${tab.icon} text-lg`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-base font-medium block truncate">{tab.label}</span>
                      </div>
                      {activeTab === tab.id && (
                        <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Desktop Content Area */}
            <div className="flex-1 overflow-hidden">
              <div 
                className="h-full overflow-y-auto p-8"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: isDark ? '#4B5563 #1F2937' : '#CBD5E1 #F1F5F9'
                }}
              >
                <div className="max-w-4xl h-full pb-8">
                  {ActiveComponent && <ActiveComponent />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
