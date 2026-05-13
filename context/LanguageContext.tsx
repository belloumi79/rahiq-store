import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, LANGUAGES, t as i18nT } from '../i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('rahiq_lang') as Language | null;
    if (saved && ['fr', 'ar', 'en'].includes(saved)) {
      setLangState(saved);
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('rahiq_lang', l);
  };

  const currentLangInfo = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{
      lang,
      setLang,
      t: (key) => i18nT(lang, key),
      dir: currentLangInfo.dir,
      languages: LANGUAGES,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
