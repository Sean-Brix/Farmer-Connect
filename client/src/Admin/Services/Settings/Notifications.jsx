import React, { useState, useEffect } from 'react';
import { useCustomTranslation } from '../../../hooks/useCustomTranslation';
import { useTheme } from '../../../contexts/ThemeContext';

const Notifications = () => {
  const { t } = useCustomTranslation();
  const { isDark } = useTheme();
  
  const [notifications, setNotifications] = useState({
    email: {
      seminar_updates: true,
      distribution_alerts: true,
      system_notifications: false,
      admin_alerts: true,
    },
    push: {
      seminar_updates: true,
      distribution_alerts: true,
      system_notifications: true,
      admin_alerts: true,
    },
    sms: {
      seminar_updates: false,
      distribution_alerts: true,
      system_notifications: false,
      admin_alerts: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load notification preferences from backend on mount
  useEffect(() => {
    const loadNotificationPreferences = async () => {
      try {
        const response = await fetch('/api/preferences/notifications', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.notifications) {
            setNotifications(data.notifications);
          }
        } else {
          // Load from localStorage as fallback
          const saved = localStorage.getItem('adminNotificationPreferences');
          if (saved) {
            setNotifications(JSON.parse(saved));
          }
        }
      } catch (error) {
        console.error('Error loading notification preferences:', error);
        // Load from localStorage as fallback
        const saved = localStorage.getItem('adminNotificationPreferences');
        if (saved) {
          setNotifications(JSON.parse(saved));
        }
      }
    };

    loadNotificationPreferences();
  }, []);

  const handleToggle = (type, setting) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [setting]: !prev[type][setting]
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save to backend
      const response = await fetch('/api/preferences/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ notifications }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        console.error('Failed to save notification preferences to backend');
      }
      
      // Save to localStorage as well for offline access
      localStorage.setItem('adminNotificationPreferences', JSON.stringify(notifications));
      
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      // Still save locally if backend fails
      localStorage.setItem('adminNotificationPreferences', JSON.stringify(notifications));
    } finally {
      setIsLoading(false);
    }
  };

  const notificationTypes = [
    {
      key: 'email',
      title: t('notifications.email_notifications'),
      description: 'Receive admin updates via email',
      icon: 'fas fa-envelope',
      color: 'blue',
    },
    {
      key: 'push',
      title: t('notifications.push_notifications'),
      description: 'Receive browser push notifications for admin alerts',
      icon: 'fas fa-bell',
      color: 'emerald',
    },
    {
      key: 'sms',
      title: t('notifications.sms_notifications'),
      description: 'Receive critical admin updates via SMS',
      icon: 'fas fa-sms',
      color: 'purple',
    },
  ];

  const notificationSettings = [
    {
      key: 'seminar_updates',
      title: t('notifications.seminar_updates'),
      description: 'Get notified about new seminars and enrollment updates',
    },
    {
      key: 'distribution_alerts',
      title: t('notifications.distribution_alerts'),
      description: 'Receive alerts about distribution schedules and inventory changes',
    },
    {
      key: 'system_notifications',
      title: t('notifications.system_notifications'),
      description: 'System updates, maintenance, and security notifications',
    },
    {
      key: 'admin_alerts',
      title: 'Admin Alerts',
      description: 'User registrations, support requests, and critical admin notifications',
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 h-full z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div 
            className={`border rounded-xl p-6 flex items-center space-x-4 shadow-2xl max-w-md mx-4 ${
              isDark 
                ? 'border-emerald-700 bg-emerald-900' 
                : 'border-emerald-200 bg-emerald-50'
            }`}
          >
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-emerald-800' : 'bg-emerald-200'
              }`}
            >
              <i 
                className={`fas fa-check text-xl ${
                  isDark ? 'text-emerald-300' : 'text-emerald-700'
                }`}
              ></i>
            </div>
            <div>
              <span 
                className={`font-medium text-lg block ${
                  isDark ? 'text-emerald-300' : 'text-emerald-700'
                }`}
              >
                {t('settings.settings_saved')}
              </span>
              <p 
                className={`text-sm mt-1 opacity-80 ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}
              >
                Your admin notification preferences have been updated
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 
          className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Admin {t('settings.notifications')}
        </h2>
        <p 
          className={`${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Manage how you receive admin notifications and updates
        </p>
      </div>

      {/* Notification Type Cards */}
      {notificationTypes.map((type) => (
        <div 
          key={type.key}
          className={`rounded-2xl p-6 border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-shrink-0">
              <div 
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  type.color === 'blue' 
                    ? (isDark ? 'bg-blue-900' : 'bg-blue-100')
                    : type.color === 'emerald'
                    ? (isDark ? 'bg-emerald-900' : 'bg-emerald-100')
                    : (isDark ? 'bg-purple-900' : 'bg-purple-100')
                }`}
              >
                <i 
                  className={`${type.icon} text-xl ${
                    type.color === 'blue' 
                      ? (isDark ? 'text-blue-300' : 'text-blue-600')
                      : type.color === 'emerald'
                      ? (isDark ? 'text-emerald-300' : 'text-emerald-600')
                      : (isDark ? 'text-purple-300' : 'text-purple-600')
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
                {type.title}
              </h3>
              <p 
                className={`text-base mb-6 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {type.description}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {notificationSettings.map((setting) => (
              <div 
                key={setting.key}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex-1 min-w-0 mr-4">
                  <h4 
                    className={`font-medium mb-1 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {setting.title}
                  </h4>
                  <p 
                    className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {setting.description}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications[type.key][setting.key]}
                    onChange={() => handleToggle(type.key, setting.key)}
                  />
                  <div 
                    className={`relative w-11 h-6 rounded-full peer transition-colors duration-200 ${
                      notifications[type.key][setting.key]
                        ? 'bg-emerald-600'
                        : (isDark ? 'bg-gray-600' : 'bg-gray-200')
                    }`}
                  >
                    <div 
                      className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ${
                        notifications[type.key][setting.key] ? 'transform translate-x-full' : ''
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <i className="fas fa-save"></i>
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Notifications;
