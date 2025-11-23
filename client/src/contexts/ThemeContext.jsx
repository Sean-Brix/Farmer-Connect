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
    // Always default to light mode
    const savedTheme = localStorage.getItem('theme');
    console.log('🎨 [ThemeContext] Initial theme from localStorage:', savedTheme);
    // Force light mode if no saved theme or if it's auto/dark
    if (!savedTheme || savedTheme === 'auto') {
      localStorage.setItem('theme', 'light');
      return 'light';
    }
    return savedTheme;
  });

  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const initialDark = savedTheme === 'dark';
    console.log('🎨 [ThemeContext] Initial isDark:', initialDark);
    return initialDark;
  });

  // Function to apply theme to DOM
  const applyTheme = (themeValue) => {
    console.log('🎨 [ThemeContext] applyTheme called with:', themeValue);
    
    // Only allow light or dark, no auto mode
    const shouldBeDark = themeValue === 'dark';

    console.log('🎨 [ThemeContext] shouldBeDark:', shouldBeDark);
    setIsDark(shouldBeDark);

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      console.log('🎨 [ThemeContext] Applied dark classes');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      console.log('🎨 [ThemeContext] Removed dark classes');
    }
  };

  // Load theme preference from database when user is authenticated
  const loadThemePreference = async () => {
    try {
      console.log('🎨 [ThemeContext] Loading theme preference from API...');
      const response = await fetch('/api/preferences/theme', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('🎨 [ThemeContext] API response:', data);
        if (data.success && data.theme) {
          console.log('🎨 [ThemeContext] Setting theme from API:', data.theme);
          setThemePreference(data.theme);
          localStorage.setItem('theme', data.theme);
          applyTheme(data.theme);
          return data.theme;
        }
      } else {
        console.log('🎨 [ThemeContext] API response not OK:', response.status);
      }
    } catch (error) {
      console.log('🎨 [ThemeContext] Error loading theme (API might not exist):', error.message);
    }
    return themePreference;
  };

  // Save theme preference to database
  const saveThemePreference = async (newTheme) => {
    try {
      console.log('🎨 [ThemeContext] Saving theme preference to API:', newTheme);
      const response = await fetch('/api/preferences/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ theme: newTheme }),
      });
      
      if (response.ok) {
        console.log('🎨 [ThemeContext] Theme saved to API successfully');
      } else {
        console.log('🎨 [ThemeContext] Failed to save theme to API:', response.status);
      }
    } catch (error) {
      console.log('🎨 [ThemeContext] Error saving theme (API might not exist):', error.message);
    }
  };

  // Function to change theme
  const changeTheme = async (newTheme) => {
    console.log('🎨 [ThemeContext] changeTheme called with:', newTheme);
    setThemePreference(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    // Save to API asynchronously (don't wait for it)
    saveThemePreference(newTheme).catch(err => {
      console.log('🎨 [ThemeContext] Failed to save to API, but local change applied');
    });
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    console.log('🎨 [ThemeContext] useEffect triggered, themePreference:', themePreference);
    applyTheme(themePreference);
  }, [themePreference]);

  // Load theme preference on mount (once)
  useEffect(() => {
    console.log('🎨 [ThemeContext] Initial mount - applying theme');
    // Always apply light theme on mount, ignore API
    applyTheme('light');
    
    // Optionally try to load from API but don't auto-apply
    const loadUserTheme = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        console.log('🎨 [ThemeContext] User found, attempting to load theme from API');
        try {
          const response = await fetch('/api/preferences/theme', {
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.theme && data.theme !== 'auto') {
              // Only apply if it's explicitly set and not auto
              console.log('🎨 [ThemeContext] Loaded theme from API:', data.theme);
              setThemePreference(data.theme);
              localStorage.setItem('theme', data.theme);
              applyTheme(data.theme);
            }
          }
        } catch (error) {
          console.log('🎨 [ThemeContext] Could not load theme from API');
        }
      }
    };

    loadUserTheme();
  }, []); // Only run once on mount

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
