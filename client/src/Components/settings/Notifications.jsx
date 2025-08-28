import React, { useState, useEffect } from 'react';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';

const Notifications = () => {
  const { t } = useCustomTranslation();
  
  const [notifications, setNotifications] = useState({
    email: {
      seminar_updates: true,
      distribution_alerts: true,
      system_notifications: false,
    },
    push: {
      seminar_updates: true,
      distribution_alerts: true,
      system_notifications: true,
    },
    sms: {
      seminar_updates: false,
      distribution_alerts: true,
      system_notifications: false,
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
          const saved = localStorage.getItem('notificationPreferences');
          if (saved) {
            setNotifications(JSON.parse(saved));
          }
        }
      } catch (error) {
        console.error('Error loading notification preferences:', error);
        // Load from localStorage as fallback
        const saved = localStorage.getItem('notificationPreferences');
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
      localStorage.setItem('notificationPreferences', JSON.stringify(notifications));
      
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      // Still save locally if backend fails
      localStorage.setItem('notificationPreferences', JSON.stringify(notifications));
    } finally {
      setIsLoading(false);
    }
  };

  const notificationTypes = [
    {
      key: 'email',
      title: t('notifications.email_notifications'),
      description: 'Receive updates via email',
      icon: 'fas fa-envelope',
      color: 'blue',
    },
    {
      key: 'push',
      title: t('notifications.push_notifications'),
      description: 'Receive browser push notifications',
      icon: 'fas fa-bell',
      color: 'emerald',
    },
    {
      key: 'sms',
      title: t('notifications.sms_notifications'),
      description: 'Receive updates via SMS',
      icon: 'fas fa-sms',
      color: 'purple',
    },
  ];

  const notificationSettings = [
    {
      key: 'seminar_updates',
      title: t('notifications.seminar_updates'),
      description: 'Get notified about new seminars and enrollment deadlines',
    },
    {
      key: 'distribution_alerts',
      title: t('notifications.distribution_alerts'),
      description: 'Receive alerts about distribution schedules and availability',
    },
    {
      key: 'system_notifications',
      title: t('notifications.system_notifications'),
      description: 'System updates, maintenance, and security notifications',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <i className="fas fa-check text-emerald-600"></i>
          </div>
          <span className="text-emerald-800 font-medium">{t('settings.settings_saved')}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('settings.notifications')}</h2>
        <p className="text-gray-600">Manage how you receive notifications and updates</p>
      </div>

      {/* Notification Type Cards */}
      {notificationTypes.map((type) => (
        <div key={type.key} className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-10 h-10 bg-${type.color}-100 rounded-lg flex items-center justify-center`}>
              <i className={`${type.icon} text-${type.color}-600 text-lg`}></i>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{type.title}</h3>
              <p className="text-gray-600 text-sm">{type.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            {notificationSettings.map((setting) => (
              <div key={setting.key} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{setting.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                </div>
                <div className="ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications[type.key][setting.key]}
                      onChange={() => handleToggle(type.key, setting.key)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium transition-all duration-200 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700 hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{t('common.loading')}</span>
            </div>
          ) : (
            t('settings.save_changes')
          )}
        </button>
      </div>
    </div>
  );
};

export default Notifications;
