import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n';

export const LanguageSwitcher: React.FC = () => {
    const { lang, setLang, languages } = useLanguage();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handle = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    const current = languages.find(l => l.code === lang);

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-sm font-medium transition-colors">
                <span className="text-base">{current?.code === 'ar' ? '🇹🇳' : current?.code === 'en' ? '🇬🇧' : '🇫🇷'}</span>
                <span>{current?.nativeName}</span>
            </button>
            {open && (
                <div className="absolute right-0 mt-1 bg-white rounded-xl shadow-lg border border-amber-100 py-1 z-50 min-w-[130px]">
                    {languages.map(l => (
                        <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-amber-50 ${l.code === lang ? 'bg-amber-50 font-semibold text-amber-800' : 'text-gray-700'}`}>
                            <span className="text-base">{l.code === 'ar' ? '🇹🇳' : l.code === 'en' ? '🇬🇧' : '🇫🇷'}</span>
                            {l.nativeName}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};