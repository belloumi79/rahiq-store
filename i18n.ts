import fr from './locales/fr';
import ar from './locales/ar';
import en from './locales/en';

export type Language = 'fr' | 'ar' | 'en';

export type Translations = typeof fr;

export interface Translation {
  code: Language;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: Translation[] = [
  { code: 'fr', name: 'Français', nativeName: 'Français', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
];

const translations: Record<Language, Translations> = { fr, ar, en };

export function getTranslations(lang: Language): Translations {
  return translations[lang] ?? translations.fr;
}

export function t(lang: Language, key: string): string {
  const keys = key.split('.');
  let result: any = translations[lang] ?? translations.fr;
  for (const k of keys) {
    result = result?.[k];
    if (result === undefined) break;
  }
  return result ?? key;
}