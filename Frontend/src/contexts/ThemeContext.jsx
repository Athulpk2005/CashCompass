import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config/api';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Check system preference (with SSR check)
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [themeMode, setThemeModeState] = useState('system'); // 'light', 'dark', 'system'
  
  useEffect(() => {
    // Fetch user's theme preference from database
    const fetchThemePreference = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            if (userData.themeMode) {
              setThemeModeState(userData.themeMode);
              
              // Apply theme based on user's preference
              if (userData.themeMode === 'light') {
                setDarkMode(false);
              } else if (userData.themeMode === 'dark') {
                setDarkMode(true);
              } else {
                // System preference (with SSR check)
                if (typeof window !== 'undefined') {
                  setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
                }
              }
            }
          }
        } catch (err) {
          console.error('Failed to fetch theme preference:', err);
        }
      }
    };
    fetchThemePreference();
  }, []);

  useEffect(() => {
    // SSR check
    if (typeof window === 'undefined') return;
    
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const setLightMode = () => {
    setDarkMode(false);
    setThemeModeState('light');
    saveThemePreference('light');
  };

  const setDarkModeOnly = () => {
    setDarkMode(true);
    setThemeModeState('dark');
    saveThemePreference('dark');
  };

  const setSystemMode = () => {
    // SSR check
    if (typeof window === 'undefined') return;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(systemDark);
    setThemeModeState('system');
    saveThemePreference('system');
  };

  const setThemeMode = (mode) => {
    if (mode === 'light') {
      setLightMode();
    } else if (mode === 'dark') {
      setDarkModeOnly();
    } else if (mode === 'system') {
      setSystemMode();
    }
  };

  const saveThemePreference = async (mode) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_URL}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ themeMode: mode })
        });
      } catch (err) {
        console.error('Failed to save theme preference:', err);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, setLightMode, setDarkModeOnly, setSystemMode, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
