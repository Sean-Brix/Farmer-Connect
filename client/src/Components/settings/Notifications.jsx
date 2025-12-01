import React, { useState, useEffect } from 'react';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';
import { useTheme } from '../../contexts/ThemeContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Notifications = () => {
  const { t } = useCustomTranslation();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch current notification settings
  const { data: settingsData, isLoading: loadingSettings } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const response = await fetch('/api/notifications/settings', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    }
  });

  // Update notification settings mutation
  const updateMutation = useMutation({
    mutationFn: async (newSettings) => {
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newSettings)
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  });

  const settings = settingsData?.settings || {
    emailEnabled: true,
    requestApproved: true,
    requestRejected: true,
    itemDueSoon: true,
    itemOverdue: true,
    seminarReminder: true
  };

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    updateMutation.mutate(newSettings);
  };

  const notificationOptions = [
    {
      key: 'emailEnabled',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: 'fas fa-envelope',
      color: 'blue'
    },
    {
      key: 'requestApproved',
      title: 'Request Approved',
      description: 'Notify when your request is approved',
      icon: 'fas fa-check-circle',
      color: 'green'
    },
    {
      key: 'requestRejected',
      title: 'Request Rejected',
      description: 'Notify when your request is rejected',
      icon: 'fas fa-times-circle',
      color: 'red'
    },
    {
      key: 'itemDueSoon',
      title: 'Item Due Soon',
      description: 'Remind you when borrowed items are due soon',
      icon: 'fas fa-clock',
      color: 'yellow'
    },
    {
      key: 'itemOverdue',
      title: 'Item Overdue',
      description: 'Alert you when borrowed items are overdue',
      icon: 'fas fa-exclamation-triangle',
      color: 'orange'
    },
    {
      key: 'seminarReminder',
      title: 'Seminar Reminders',
      description: 'Remind you about upcoming seminars',
      icon: 'fas fa-graduation-cap',
      color: 'purple'
    }
  ];

  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 h-full z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div 
            className="border border-emerald-200 dark:border-emerald-700 rounded-xl p-6 flex items-center space-x-4 shadow-2xl max-w-md mx-4"
            style={{ backgroundColor: isDark ? '#065f46' : '#ecfdf5' }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: isDark ? '#047857' : '#d1fae5' }}
            >
              <i 
                className="fas fa-check text-xl"
                style={{ color: isDark ? '#a7f3d0' : '#047857' }}
              ></i>
            </div>
            <div>
              <span 
                className="font-medium text-lg block"
                style={{ color: isDark ? '#a7f3d0' : '#047857' }}
              >
                Settings Saved
              </span>
              <p 
                className="text-sm mt-1 opacity-80"
                style={{ color: isDark ? '#a7f3d0' : '#047857' }}
              >
                Your notification preferences have been updated
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 
          className="text-2xl font-bold mb-2"
          style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
          Notification Preferences
        </h2>
        <p 
          style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
        >
          Choose what notifications you want to receive
        </p>
      </div>

      {/* Notification Options */}
      <div className="grid gap-4">
        {notificationOptions.map((option) => (
          <div 
            key={option.key}
            className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 flex items-start justify-between"
            style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-${option.color}-100`}>
                <i className={`${option.icon} text-${option.color}-600 text-lg`}></i>
              </div>
              <div>
                <h4 
                  className="font-semibold text-lg"
                  style={{ color: isDark ? '#ffffff' : '#111827' }}
                >
                  {option.title}
                </h4>
                <p 
                  className="text-sm mt-1"
                  style={{ color: isDark ? '#d1d5db' : '#6b7280' }}
                >
                  {option.description}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings[option.key]}
                onChange={() => handleToggle(option.key)}
                disabled={updateMutation.isPending}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        ))}
      </div>

      {/* Info Note */}
      <div 
        className="border border-blue-200 dark:border-blue-800 rounded-xl p-4"
        style={{ backgroundColor: isDark ? '#1e3a8a' : '#eff6ff' }}
      >
        <div className="flex items-start space-x-3">
          <i 
            className="fas fa-info-circle text-lg mt-0.5"
            style={{ color: isDark ? '#93c5fd' : '#3b82f6' }}
          ></i>
          <div>
            <p 
              className="text-sm"
              style={{ color: isDark ? '#dbeafe' : '#1e40af' }}
            >
              You will always receive in-app notifications. Email notifications are sent only if enabled and according to your preferences above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
