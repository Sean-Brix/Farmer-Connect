import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themePreference, setThemePreference] = useState(() => {
    // Default to light mode
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [isDark, setIsDark] = useState(false);

  // Function to apply theme to DOM
  const applyTheme = (themeValue) => {
    let shouldBeDark = false;

    if (themeValue === 'dark') {
      shouldBeDark = true;
    } else if (themeValue === 'light') {
      shouldBeDark = false;
    } else {
      // Auto - check system preference
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setIsDark(shouldBeDark);

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

  // Load theme preference from database when user is authenticated
  const loadThemePreference = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/preferences/theme', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.theme) {
          setThemePreference(data.theme);
          localStorage.setItem('theme', data.theme);
          return data.theme;
        }
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
    return themePreference;
  };

  // Save theme preference to database
  const saveThemePreference = async (newTheme) => {
    try {
      await fetch('http://localhost:8080/api/preferences/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Function to change theme
  const changeTheme = async (newTheme) => {
    setThemePreference(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    await saveThemePreference(newTheme);
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(themePreference);

    // Listen for system theme changes when theme is set to auto
    if (themePreference === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e) => {
        applyTheme(themePreference); // Re-apply with current theme to check system preference
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, [themePreference]);

  // Load theme preference on authentication changes
  useEffect(() => {
    const handleAuthChange = async () => {
      // Check if user is authenticated and load their theme preference
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        try {
          const userTheme = await loadThemePreference();
          if (userTheme !== themePreference) {
            setThemePreference(userTheme);
            applyTheme(userTheme);
          }
        } catch (error) {
          // If there's an error, just use the current theme
          applyTheme(themePreference);
        }
      }
    };

    // Initial load
    handleAuthChange();

    // Listen for authentication state changes
    window.addEventListener('auth-changed', handleAuthChange);
    
    // Listen for focus events to re-check auth state
    window.addEventListener('focus', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('focus', handleAuthChange);
    };
  }, [themePreference]); // Add themePreference as dependency

  const value = {
    theme: themePreference, // Return the preference setting for toggle UI
    isDark,
    changeTheme,
    loadThemePreference,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
