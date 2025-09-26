import { useTranslation } from '../contexts/LanguageContext'; // Perbarui import

export const LanguageSwitcher = () => {
    const { language, setLanguage } = useTranslation();

    return (
        <div className="flex items-center p-1 bg-neutral-200 rounded-full text-sm font-semibold">
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full transition-colors ${language === 'en' ? 'bg-white shadow' : 'text-neutral-500'}`}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('zh-HANT')}
                className={`px-3 py-1 rounded-full transition-colors ${language === 'zh-HANT' ? 'bg-white shadow' : 'text-neutral-500'}`}
            >
                繁
            </button>
        </div>
    );
};