import React, { createContext, useState, useContext, useEffect } from 'react';

// Context oluştur
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // localStorage'dan tema tercihi al veya varsayılan olarak açık tema kullan
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' || false;
  });

  // Tema değiştiğinde HTML element'ine dark class'ı ekle/çıkar
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Tema tercihini localStorage'a kaydet
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Context değerleri
  const value = {
    darkMode,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme hook must be used within a ThemeProvider');
  }
  return context;
};