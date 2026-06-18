
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations } from '../localization/translations';

type Locale = 'en' | 'th';

interface LocalizationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');

  const t = (key: string, variables: Record<string, string | number> = {}) => {
    const keys = key.split('.');
    
    const findTranslation = (language: typeof translations['en']) => {
        let current: any = language;
        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                return undefined;
            }
        }
        return current;
    };

    let text = findTranslation(translations[locale]) || findTranslation(translations['en']);

    if (typeof text !== 'string') {
        return key;
    }

    let result = text;
    Object.keys(variables).forEach(varKey => {
      const regex = new RegExp(`{${varKey}}`, 'g');
      result = result.replace(regex, String(variables[varKey]));
    });

    return result;
  };

  return (
    <LocalizationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
