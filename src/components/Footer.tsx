import { Link } from 'react-router-dom';
import TtisaLogo from '../assets/ttisa-logo.jpg';
import { useTranslation } from '../contexts/LanguageContext';

// Komponen Ikon sederhana
const Icon = ({ path, className = "w-6 h-6", viewBox = "0 0 24 24" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox={viewBox} stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);
// Ikon khusus untuk Instagram (menggunakan fill)
const InstagramIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.196 0-3.557.012-4.79.068-2.885.132-4.101 1.332-4.234 4.234-.056 1.233-.068 1.594-.068 4.79s.012 3.557.068 4.79c.133 2.902 1.35 4.102 4.234 4.234 1.233.056 1.594.068 4.79.068s3.557-.012 4.79-.068c2.885-.132 4.101-1.332 4.234-4.234.056-1.233.068-1.594-.068-4.79s-.012-3.557-.068-4.79c-.133-2.902-1.35-4.102-4.234-4.234-1.233-.056-1.594-.068-4.79-.068zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.435c-2.359 0-4.276-1.917-4.276-4.276s1.917-4.276 4.276-4.276 4.276 1.917 4.276 4.276-1.917 4.276-4.276 4.276zm4.905-11.458c-.965 0-1.75.785-1.75 1.75s.785 1.75 1.75 1.75 1.75-.785 1.75-1.75-.785-1.75-1.75-1.75z" /></svg>
);
const LineIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M21.928 4.832a2.221 2.221 0 0 0-1.89-1.218c-1.28-.15-3.886-.41-6.038-.41-4.737 0-7.314 1.34-8.683 2.503-1.833 1.545-2.28 3.493-2.28 4.868 0 1.28.32 3.14 1.63 4.542 1.096 1.168 2.68 1.83 4.267 1.83h.098c.502 0 .97-.132 1.37-.382l.14-.09.117.158c.28.396.6.76.96.108.02-.02.04-.03.06-.05l2.22-2.25c.34-.34.5-.78.5-1.24v-1.61h.06c2.825 0 4.21-1.31 4.79-2.19.72-1.11.83-2.25.83-2.88.01-1.4-.4-2.82-2.008-3.56z" /></svg>
);

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-card-bg border-t border-border">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="md:col-span-1 flex flex-col items-center md:items-start">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <img src={TtisaLogo} alt="TTISA Logo" className="h-8 w-8" />
                            <span className="text-xl font-bold text-primary">TTISA NTUT</span>
                        </Link>
                        <p className="text-text-secondary text-sm max-w-xs">{t('footer.description')}</p>
                    </div>
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="font-bold text-text-primary mb-4">{t('footer.contactTitle')}</h3>
                        <div className="flex flex-col items-center md:items-start space-y-3 text-sm">
                            <a href="mailto:ntut.ttisa@gmail.com" className="flex items-center gap-2 text-text-secondary transition-colors hover:text-primary">
                                <Icon path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" className="w-5 h-5 flex-shrink-0" />
                                <span>ntut.ttisa@gmail.com</span>
                            </a>
                            <a href="https://www.instagram.com/ntut_ttisa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary transition-colors hover:text-primary">
                                <InstagramIcon className="w-5 h-5 flex-shrink-0" />
                                <span>ntut_ttisa</span>
                            </a>
                            <a href="https://line.me/ti/p/~chenweize" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary transition-colors hover:text-primary">
                                <LineIcon className="w-5 h-5 flex-shrink-0" />
                                <span>chenweize</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-border pt-6 text-center text-sm text-text-secondary">
                    <p>&copy; {new Date().getFullYear()} TTISA NTUT. {t('footer.copyright')}</p>
                </div>
            </div>
        </footer>
    );
};