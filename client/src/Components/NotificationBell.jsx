import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useCustomTranslation } from '../hooks/useCustomTranslation';

export default function NotificationBell() {
  const { t } = useCustomTranslation();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch unread count (auto-refreshes every 30 seconds)
  const { data: countData } = useQuery({
    queryKey: ['notification-count'],
    queryFn: async () => {
      const response = await fetch('/api/notifications/unread-count', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch count');
      return response.json();
    },
    refetchInterval: 30000, // 30 seconds
    staleTime: 20000
  });

  // Fetch recent notifications when dropdown is open
  const { data: notificationsData, refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await fetch('/api/notifications?limit=10', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    },
    enabled: isOpen, // Only fetch when dropdown is open
    staleTime: 10000
  });

  const unreadCount = countData?.count || 0;
  const notifications = notificationsData?.notifications || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      refetchNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notificationIds: [notificationId] })
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['notification-count'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['notification-count'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.read) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate to related page based on type
    if (notification.relatedId) {
      switch (notification.type) {
        case 'REQUEST_APPROVED':
        case 'REQUEST_REJECTED':
          navigate('/client/services/eic');
          break;
        case 'ITEM_DUE_SOON':
        case 'ITEM_OVERDUE':
          navigate('/client/services/eic');
          break;
        case 'SEMINAR_REMINDER':
          navigate('/client/services/seminars');
          break;
        default:
          break;
      }
    }

    setIsOpen(false);
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'REQUEST_APPROVED': return '✅';
      case 'REQUEST_REJECTED': return '❌';
      case 'ITEM_DUE_SOON': return '⏰';
      case 'ITEM_OVERDUE': return '🚨';
      case 'SEMINAR_REMINDER': return '📚';
      case 'SYSTEM_ALERT': return 'ℹ️';
      default: return '🔔';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className={`relative p-2 rounded-full transition-colors ${
          isDark 
            ? 'hover:bg-gray-700 text-gray-200' 
            : 'hover:bg-gray-200 text-gray-700'
        }`}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[18px]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-80 max-h-[500px] overflow-y-auto rounded-lg shadow-lg border z-50 ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          {/* Header */}
          <div className={`sticky top-0 p-3 border-b flex justify-between items-center ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('notifications.title')}
            </h3>
            {notifications.some(n => !n.read) && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('notifications.mark_all_read')}
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.length === 0 ? (
              <div className={`p-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('notifications.no_new_notifications')}
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 cursor-pointer transition-colors ${
                    !notification.read
                      ? isDark
                        ? 'bg-blue-900/20 hover:bg-blue-900/30'
                        : 'bg-blue-50 hover:bg-blue-100'
                      : isDark
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </p>
                      <p className={`text-xs mt-0.5 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs mt-1 ${
                        isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className={`sticky bottom-0 p-2 border-t text-center ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/client/settings/notifications');
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('notifications.title')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
