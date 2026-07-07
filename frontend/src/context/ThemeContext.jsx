import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('healthconnect_high_contrast') === 'true';
  });

  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem('healthconnect_large_text') === 'true';
  });

  const [minDataMode, setMinDataMode] = useState(() => {
    return localStorage.getItem('healthconnect_min_data') === 'true';
  });

  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    localStorage.setItem('healthconnect_high_contrast', highContrast);
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('healthconnect_large_text', largeText);
    if (largeText) {
      document.documentElement.style.fontSize = '120%';
    } else {
      document.documentElement.style.fontSize = '';
    }
  }, [largeText]);

  useEffect(() => {
    localStorage.setItem('healthconnect_min_data', minDataMode);
  }, [minDataMode]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleLargeText = () => setLargeText(prev => !prev);
  const toggleMinDataMode = () => setMinDataMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{
      highContrast, largeText, minDataMode, isOffline,
      toggleHighContrast, toggleLargeText, toggleMinDataMode,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
