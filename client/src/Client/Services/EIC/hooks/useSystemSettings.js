import { useState, useEffect } from 'react';
import { DEFAULT_SYSTEM_SETTINGS } from '../utils/constants';

/**
 * Custom hook to fetch and manage EIC system settings
 */
export const useSystemSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/eic/settings', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch system settings');
      }

      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
      } else {
        throw new Error(data.error || 'Failed to fetch settings');
      }
    } catch (err) {
      console.error('Error fetching system settings:', err);
      setError(err.message);
      // Use default settings as fallback
      setSettings(DEFAULT_SYSTEM_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings
  };
};

export default useSystemSettings;
