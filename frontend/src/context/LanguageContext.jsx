import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('healthconnect_language') || 'en';
  });

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
    localStorage.setItem('healthconnect_language', currentLanguage);
  }, [currentLanguage, i18n]);

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
  };

  const supportedLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  ];

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, supportedLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguages() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguages must be used within a LanguageProvider');
  }
  return context;
}
