import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, LANGUAGES } from '../i18n';
import { getTranslations, Translations } from '../i18n';

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    languages: typeof LANGUAGES;
    dir: 'ltr' | 'rtl';
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [lang, setLangState] = useState<Language>(() => {
        const saved = localStorage.getItem('rahiq_lang') as Language | null;
        return saved || 'fr';
    });

    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    const handleSetLang = (l: Language) => {
        setLangState(l);
        document.documentElement.lang = l;
        document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('rahiq_lang', l);
    };

    return (
        <LanguageContext.Provider value={{
            lang,
            setLang: handleSetLang,
            languages: LANGUAGES,
            dir,
            t: getTranslations(lang)
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