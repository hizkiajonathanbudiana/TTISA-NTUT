// import { createContext, useContext, useState, ReactNode } from 'react';

// // Impor file JSON terjemahan kita secara langsung
// import enTranslations from '../locales/en/translation.json';
// import zhHantTranslations from '../locales/zh-HANT/translation.json';

// // Gabungkan semua terjemahan dalam satu objek
// const translations = {
//     en: enTranslations,
//     'zh-HANT': zhHantTranslations,
// };

// type Language = 'en' | 'zh-HANT';

// interface LanguageContextType {
//     language: Language;
//     setLanguage: (language: Language) => void;
//     t: (key: string) => string;
// }

// const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// export const LanguageProvider = ({ children }: { children: ReactNode }) => {
//     const [language, setLanguage] = useState<Language>('en'); // Default ke Bahasa Inggris

//     // Fungsi 't' (translate)
//     const t = (key: string) => {
//         // Memecah key seperti 'nav.events' menjadi ['nav', 'events']
//         const keys = key.split('.');
//         // Mencari nilai dari objek terjemahan
//         let result = translations[language];
//         for (const k of keys) {
//             result = result?.[k];
//         }
//         return result || key; // Jika tidak ditemukan, kembalikan key aslinya
//     };

//     const value = { language, setLanguage, t };

//     return (
//         <LanguageContext.Provider value={value}>
//             {children}
//         </LanguageContext.Provider>
//     );
// };

// // Custom hook untuk menggunakan terjemahan
// export const useTranslation = () => {
//     const context = useContext(LanguageContext);
//     if (context === undefined) {
//         throw new Error('useTranslation must be used within a LanguageProvider');
//     }
//     return context;
// };

import { createContext, useContext, useState, type ReactNode } from 'react';
import enTranslations from '../locales/en/translation.json';
import zhHantTranslations from '../locales/zh-HANT/translation.json';

const translations = {
  en: enTranslations,
  'zh-HANT': zhHantTranslations,
};

type Language = 'en' | 'zh-HANT';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) return key;
    }
    return result || key;
  };

  const value = { language, setLanguage, t };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) { throw new Error('useTranslation must be used within a LanguageProvider'); }
  return context;
};