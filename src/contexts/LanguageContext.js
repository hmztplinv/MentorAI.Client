import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import trTranslation from '../locales/tr.json';
import enTranslation from '../locales/en.json';

// i18next yapılandırması
i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: {
        translation: trTranslation,
      },
      en: {
        translation: enTranslation,
      },
    },
    lng: localStorage.getItem('language') || 'tr',
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false,
    },
  });

// Context oluştur
const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  // localStorage'dan dil tercihi al veya varsayılan olarak Türkçe kullan
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'tr';
  });

  // Dil değiştiğinde i18next'i güncelle
  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  }, [language]);

  // Dil değiştirme fonksiyonu
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  // Context değerleri
  const value = {
    language,
    changeLanguage,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// Custom hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === null) {
    throw new Error('useLanguage hook must be used within a LanguageProvider');
  }
  return context;
};