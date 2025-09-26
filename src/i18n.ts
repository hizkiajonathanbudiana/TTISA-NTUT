import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Impor file terjemahan Anda secara langsung
import enTranslation from './locales/en/translation.json';
import zhHantTranslation from './locales/zh-HANT/translation.json';

i18n
    .use(initReactI18next)
    .init({
        // Masukkan terjemahan langsung ke dalam 'resources'
        resources: {
            en: {
                translation: enTranslation,
            },
            'zh-HANT': {
                translation: zhHantTranslation,
            },
        },
        lng: 'en', // Selalu mulai dengan Bahasa Inggris
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;