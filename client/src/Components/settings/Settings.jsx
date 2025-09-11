import React, { useState } from 'react';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import Navbar from '../../Client/Components/Navbar';
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
    <>
      <Navbar />
      <div 
        className="min-h-screen transition-colors duration-200 pt-16 sm:pt-20"
        style={{ 
          backgroundColor: isDark ? '#111827' : '#ffffff' 
        }}
      >
        
        {/* Header Section */}
        <div 
          className="border-b border-gray-100 dark:border-gray-800 shadow-sm"
          style={{ 
            backgroundColor: isDark ? '#111827' : '#ffffff' 
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6 sm:py-8">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-cog text-white text-xl sm:text-2xl"></i>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
                    style={{ 
                      color: isDark ? '#ffffff' : '#111827' 
                    }}
                  >
                    {t('settings.title')}
                  </h1>
                  <p 
                    className="mt-1 sm:mt-2 text-sm sm:text-base max-w-2xl"
                    style={{ 
                      color: isDark ? '#9ca3af' : '#6b7280' 
                    }}
                  >
                    Manage your preferences and account settings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div 
            className="rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col"
            style={{ 
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              height: '75vh',
              minHeight: '600px'
            }}
          >
            
            {/* Mobile Tab Navigation */}
            <div 
              className="lg:hidden border-b border-gray-200 dark:border-gray-600 px-4 py-4 flex-shrink-0"
              style={{ 
                backgroundColor: isDark ? '#374151' : '#ffffff' 
              }}
            >
              <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-emerald-100 shadow-md border border-emerald-200'
                        : 'hover:shadow-sm'
                    }`}
                    style={{
                      backgroundColor: activeTab === tab.id 
                        ? (isDark ? '#065f46' : '#d1fae5') 
                        : 'transparent',
                      color: activeTab === tab.id
                        ? (isDark ? '#a7f3d0' : '#047857')
                        : (isDark ? '#d1d5db' : '#374151'),
                      borderColor: activeTab === tab.id 
                        ? (isDark ? '#047857' : '#a7f3d0') 
                        : 'transparent'
                    }}
                  >
                    <i className={`${tab.icon} text-sm`}></i>
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Content Area */}
            <div 
              className="lg:hidden flex-1 overflow-hidden"
            >
              <div 
                className="h-full overflow-y-auto p-4 sm:p-6"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: isDark ? '#4B5563 #1F2937' : '#CBD5E1 #F1F5F9'
                }}
              >
                <div className="max-w-4xl h-full">
                  {ActiveComponent && <ActiveComponent />}
                </div>
              </div>
            </div>

            <div className="hidden lg:flex h-full">
              {/* Desktop Sidebar Navigation */}
              <div 
                className="flex flex-col w-80 xl:w-96 border-r border-gray-200 dark:border-gray-600 flex-shrink-0"
                style={{ 
                  backgroundColor: isDark ? '#374151' : '#ffffff' 
                }}
              >
                <div className="flex-1 py-8 px-6">
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-left transition-all duration-300 group hover:shadow-md hover:scale-[1.01] shadow-lg border scale-[1.02]"
                        style={{
                          backgroundColor: activeTab === tab.id 
                            ? (isDark ? '#065f46' : '#ecfdf5') 
                            : 'transparent',
                          color: activeTab === tab.id
                            ? (isDark ? '#a7f3d0' : '#047857')
                            : (isDark ? '#d1d5db' : '#374151'),
                          borderColor: activeTab === tab.id 
                            ? (isDark ? '#047857' : '#a7f3d0') 
                            : 'transparent'
                        }}
                      >
                        <div 
                          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                          style={{
                            backgroundColor: activeTab === tab.id
                              ? (isDark ? '#047857' : '#d1fae5')
                              : (isDark ? '#4b5563' : '#f9fafb'),
                            color: activeTab === tab.id
                              ? (isDark ? '#a7f3d0' : '#047857')
                              : (isDark ? '#9ca3af' : '#6b7280')
                          }}
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

              {/* Main Content Area */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div 
                  className="h-full overflow-y-auto p-6 sm:p-8 lg:p-10 pb-8 sm:pb-12 lg:pb-16"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: isDark ? '#4B5563 #1F2937' : '#CBD5E1 #F1F5F9'
                  }}
                >
                  <div className="max-w-4xl h-full">
                    {ActiveComponent && <ActiveComponent />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Spacing */}
        <div className="h-8 sm:h-16"></div>
      </div>
    </>
  );
};

export default Settings;
