import React, { useState } from 'react';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';
import Navbar from '../../Client/Components/Navbar';
import Preferences from './Preferences';
import Notifications from './Notifications';
import AccountSettings from './AccountSettings';

const Settings = () => {
  const { t } = useCustomTranslation();
  const [activeTab, setActiveTab] = useState('preferences');

  const tabs = [
    { 
      id: 'preferences', 
      label: t('settings.preferences'), 
      icon: 'fas fa-cog',
      component: Preferences 
    },
    { 
      id: 'notifications', 
      label: t('settings.notifications'), 
      icon: 'fas fa-bell',
      component: Notifications 
    },
    { 
      id: 'account', 
      label: t('settings.account_settings'), 
      icon: 'fas fa-user-cog',
      component: AccountSettings 
    },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-cog text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>
                <p className="text-gray-600 mt-1">Manage your preferences and account settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4 bg-gray-50 border-r border-gray-200">
              <nav className="p-6">
                <ul className="space-y-2">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-emerald-100 text-emerald-800 font-medium shadow-sm'
                            : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                        }`}
                      >
                        <i className={`${tab.icon} text-lg`}></i>
                        <span>{tab.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4 p-6 lg:p-8">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Settings;
