// Chirmo Target Language Management Service
// Manages active study language across all platform modules (English / German)

export type SupportedLanguage = 'en' | 'de';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  speechLang: string;
  speechLocale: string;
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageMeta> = {
  en: {
    code: 'en',
    name: 'İngilizce',
    nativeName: 'English',
    flag: '🇬🇧',
    speechLang: 'en-US',
    speechLocale: 'en'
  },
  de: {
    code: 'de',
    name: 'Almanca',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    speechLang: 'de-DE',
    speechLocale: 'de'
  }
};

const STORAGE_KEY = 'chirmo_active_target_language';
const EVENT_NAME = 'chirmo_target_language_changed';

type Listener = (lang: SupportedLanguage) => void;
const listeners: Set<Listener> = new Set();

export const TargetLanguageService = {
  getTargetLanguage(): SupportedLanguage {
    try {
      if (typeof localStorage === 'undefined') return 'en';
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'de' || stored === 'en') {
        return stored;
      }
      return 'en';
    } catch {
      return 'en';
    }
  },

  setTargetLanguage(lang: SupportedLanguage): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, lang);
      }
    } catch {}

    listeners.forEach((listener) => {
      try {
        listener(lang);
      } catch (err) {
        console.error('TargetLanguageService listener error:', err);
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: lang }));
    }
  },

  toggleLanguage(): SupportedLanguage {
    const current = this.getTargetLanguage();
    const next: SupportedLanguage = current === 'en' ? 'de' : 'en';
    this.setTargetLanguage(next);
    return next;
  },

  getLanguageMeta(lang?: SupportedLanguage): LanguageMeta {
    const code = lang || this.getTargetLanguage();
    return SUPPORTED_LANGUAGES[code] || SUPPORTED_LANGUAGES.en;
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
};
