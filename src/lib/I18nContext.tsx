import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Language = 'en' | 'es' | 'hi' | 'fr';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  home: { en: 'Home', es: 'Inicio', hi: 'मुख्य', fr: 'Accueil' },
  files: { en: 'Files', es: 'Archivos', hi: 'फ़ाइलें', fr: 'Fichiers' },
  tools: { en: 'Tools', es: 'Herramientas', hi: 'उपकरण', fr: 'Outils' },
  history: { en: 'History', es: 'Historial', hi: 'इतिहास', fr: 'Historique' },
  settings: { en: 'Settings', es: 'Ajustes', hi: 'सेटिंग्स', fr: 'Paramètres' },
  upload: { en: 'Upload PDF', es: 'Subir PDF', hi: 'पीडीएफ अपलोड करें', fr: 'Téléverser PDF' },
  welcome: { en: 'Welcome back', es: 'Bienvenido', hi: 'स्वागत है', fr: 'Bienvenue' },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n error');
  return context;
};
