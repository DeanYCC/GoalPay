import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'zh' | 'en' | 'jp';

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
  getLanguageName: (lang: Language) => string;
  getLanguageFlag: (lang: Language) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LANGUAGES = {
  zh: { name: '繁體中文', flag: '🇹🇼' },
  en: { name: 'English', flag: '🇺🇸' },
  jp: { name: '日本語', flag: '🇯🇵' },
} as const;

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('zh');

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('goalpay_language', lang);
  };

  const getLanguageName = (lang: Language): string => {
    return LANGUAGES[lang].name;
  };

  const getLanguageFlag = (lang: Language): string => {
    return LANGUAGES[lang].flag;
  };

  useEffect(() => {
    // Load saved language
    const savedLanguage = localStorage.getItem('goalpay_language') as Language;
    if (savedLanguage && LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else {
      // Check browser language
      const browserLang = navigator.language.split('-')[0];
      const defaultLang: Language = browserLang === 'ja' ? 'jp' : browserLang === 'zh' ? 'zh' : 'en';
      setCurrentLanguage(defaultLang);
      i18n.changeLanguage(defaultLang);
    }
  }, [i18n]);

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    getLanguageName,
    getLanguageFlag,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
