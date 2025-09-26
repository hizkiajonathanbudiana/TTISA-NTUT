// // // // // import { Link, Outlet } from 'react-router-dom';
// // // // // import { useAuth, supabase } from '../contexts/AuthContext';
// // // // // import { useState, useEffect } from 'react';
// // // // // import { useQuery } from '@tanstack/react-query';
// // // // // import TtisaLogo from '../assets/ttisa-logo.jpg';
// // // // // import { Footer } from './Footer';
// // // // // import { useTranslation } from '../contexts/LanguageContext';
// // // // // import { LanguageSwitcher } from './LanguageSwitcher';

// // // // // type UserProfile = {
// // // // //     english_name: string | null;
// // // // //     roles: {
// // // // //         name: 'admin' | 'organizer' | 'member';
// // // // //     } | null;
// // // // // };

// // // // // export const AppLayout = () => {
// // // // //     const { user, signOut } = useAuth();
// // // // //     const { t } = useTranslation();
// // // // //     const [isMenuOpen, setIsMenuOpen] = useState(false);

// // // // //     const { data: profile } = useQuery<UserProfile | null>({
// // // // //         queryKey: ['layout_profile', user?.id],
// // // // //         queryFn: async () => {
// // // // //             if (!user) return null;
// // // // //             const { data, error } = await supabase.from('profiles').select('english_name, users!inner(roles(name))').eq('user_id', user.id).single();
// // // // //             if (error) {
// // // // //                 console.error("Could not fetch profile, may not exist yet:", error.message);
// // // // //                 return null;
// // // // //             };
// // // // //             return { ...data, roles: data.users?.roles } as UserProfile;
// // // // //         },
// // // // //         enabled: !!user,
// // // // //     });

// // // // //     const userRole = profile?.roles?.name;
// // // // //     const canAccessCms = userRole === 'admin' || userRole === 'organizer';
// // // // //     const navLinkClass = "block md:inline-block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary transition-colors";

// // // // //     const navLinks = (
// // // // //         <>
// // // // //             <Link to="/events" className={navLinkClass}>{t('nav.events')}</Link>
// // // // //             <Link to="/posts" className={navLinkClass}>{t('nav.posts')}</Link>
// // // // //             <Link to="/teams" className={navLinkClass}>{t('nav.teams')}</Link>
// // // // //             {user && <Link to="/profile" className={navLinkClass}>{t('nav.profile')}</Link>}
// // // // //             {canAccessCms && <Link to="/cms" className={navLinkClass}>{t('nav.cms')}</Link>}
// // // // //         </>
// // // // //     );

// // // // //     return (
// // // // //         <div className="min-h-screen bg-background font-sans">
// // // // //             <header className="absolute top-0 left-0 right-0 z-40">
// // // // //                 <nav className="container mx-auto px-4 py-4">
// // // // //                     <div className="flex items-center justify-between">
// // // // //                         <Link to="/" className="flex items-center gap-2">
// // // // //                             <img src={TtisaLogo} alt="TTISA Logo" className="h-8 w-8" />
// // // // //                             <span className="text-xl font-bold text-text-primary">TTISA NTUT</span>
// // // // //                         </Link>
// // // // //                         <div className="hidden md:flex items-center space-x-2">
// // // // //                             {navLinks}
// // // // //                             <div className="ml-4 flex items-center gap-4">
// // // // //                                 {user ? (
// // // // //                                     <button onClick={signOut} className="font-semibold text-system-danger transition-colors hover:text-red-700">
// // // // //                                         {t('nav.logout')}
// // // // //                                     </button>
// // // // //                                 ) : (
// // // // //                                     <Link to="/login" className="font-semibold text-primary transition-colors hover:text-primary-hover">
// // // // //                                         {t('nav.login')}
// // // // //                                     </Link>
// // // // //                                 )}
// // // // //                                 <LanguageSwitcher />
// // // // //                             </div>
// // // // //                         </div>
// // // // //                         <div className="md:hidden flex items-center gap-4">
// // // // //                             <LanguageSwitcher />
// // // // //                             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-text-secondary bg-white/50 backdrop-blur-sm">
// // // // //                                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg>
// // // // //                             </button>
// // // // //                         </div>
// // // // //                     </div>
// // // // //                     {isMenuOpen && (
// // // // //                         <div className="md:hidden mt-4 p-4 rounded-lg bg-white/70 backdrop-blur-md">
// // // // //                             <div className="flex flex-col space-y-2">
// // // // //                                 {navLinks}
// // // // //                                 <div className="pt-4 mt-2 border-t border-border">
// // // // //                                     {user ? (
// // // // //                                         <button onClick={signOut} className="w-full text-left font-semibold text-system-danger transition-colors hover:text-red-700 px-3 py-2">
// // // // //                                             {t('nav.logout')}
// // // // //                                         </button>
// // // // //                                     ) : (
// // // // //                                         <Link to="/login" className="block text-center font-semibold text-primary transition-colors hover:text-primary-hover px-3 py-2">
// // // // //                                             {t('nav.login')}
// // // // //                                         </Link>
// // // // //                                     )}
// // // // //                                 </div>
// // // // //                             </div>
// // // // //                         </div>
// // // // //                     )}
// // // // //                 </nav>
// // // // //             </header>
// // // // //             <main>
// // // // //                 <Outlet />
// // // // //             </main>
// // // // //             <Footer />
// // // // //         </div>
// // // // //     );
// // // // // };

// // // // import { Link, Outlet } from 'react-router-dom';
// // // // import { useAuth, supabase } from '../contexts/AuthContext';
// // // // import { useState, useEffect } from 'react';
// // // // import { useQuery } from '@tanstack/react-query';
// // // // import TtisaLogo from '../assets/ttisa-logo.jpg';
// // // // import { Footer } from './Footer';
// // // // import { useTranslation } from '../contexts/LanguageContext';
// // // // import { LanguageSwitcher } from './LanguageSwitcher';

// // // // type UserProfile = {
// // // //     english_name: string | null;
// // // //     roles: {
// // // //         name: 'admin' | 'organizer' | 'member';
// // // //     } | null;
// // // // };

// // // // export const AppLayout = () => {
// // // //     const { user, signOut } = useAuth();
// // // //     const { t } = useTranslation();
// // // //     const [isMenuOpen, setIsMenuOpen] = useState(false);
// // // //     const [scrolled, setScrolled] = useState(false);

// // // //     // Efek untuk mendeteksi scroll dan mengubah tampilan navbar
// // // //     useEffect(() => {
// // // //         const handleScroll = () => {
// // // //             setScrolled(window.scrollY > 10);
// // // //         };
// // // //         window.addEventListener('scroll', handleScroll);
// // // //         return () => window.removeEventListener('scroll', handleScroll);
// // // //     }, []);

// // // //     const { data: profile } = useQuery<UserProfile | null>({
// // // //         queryKey: ['layout_profile', user?.id],
// // // //         queryFn: async () => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('english_name, users!inner(roles(name))').eq('user_id', user.id).single(); if (error) { console.error("Could not fetch profile, may not exist yet:", error.message); return null; }; return { ...data, roles: data.users?.roles } as UserProfile; },
// // // //         enabled: !!user,
// // // //     });

// // // //     const userRole = profile?.roles?.name;
// // // //     const canAccessCms = userRole === 'admin' || userRole === 'organizer';

// // // //     // Kelas dinamis untuk mengubah warna teks berdasarkan scroll
// // // //     const headerTextColor = scrolled ? 'text-text-primary' : 'text-white';
// // // //     const navLinkColor = scrolled ? 'text-text-secondary hover:text-text-primary' : 'text-neutral-200 hover:text-white';
// // // //     const navLinkClass = `block md:inline-block px-3 py-2 rounded-md text-base font-medium ${navLinkColor} transition-colors`;

// // // //     const navLinks = (
// // // //         <>
// // // //             <Link to="/events" className={navLinkClass}>{t('nav.events')}</Link>
// // // //             <Link to="/posts" className={navLinkClass}>{t('nav.posts')}</Link>
// // // //             <Link to="/teams" className={navLinkClass}>{t('nav.teams')}</Link>
// // // //             {user && <Link to="/profile" className={navLinkClass}>{t('nav.profile')}</Link>}
// // // //             {canAccessCms && <Link to="/cms" className={navLinkClass}>{t('nav.cms')}</Link>}
// // // //         </>
// // // //     );

// // // //     return (
// // // //         <div className="min-h-screen bg-background font-sans">
// // // //             {/* Header menggunakan 'sticky' agar tetap di alur dokumen */}
// // // //             <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-card-bg shadow-lg' : 'bg-gradient-to-b from-black/40 to-transparent'}`}>
// // // //                 <nav className="container mx-auto px-4 py-4">
// // // //                     <div className="flex items-center justify-between">
// // // //                         <Link to="/" className="flex items-center gap-2">
// // // //                             <img src={TtisaLogo} alt="TTISA Logo" className="h-8 w-8" />
// // // //                             <span className={`text-xl font-bold ${headerTextColor} transition-colors`}>TTISA NTUT</span>
// // // //                         </Link>
// // // //                         <div className="hidden md:flex items-center space-x-2">
// // // //                             {navLinks}
// // // //                             <div className="ml-4 flex items-center gap-4">
// // // //                                 {user ? (
// // // //                                     <button onClick={signOut} className={`font-semibold ${scrolled ? 'text-system-danger' : 'text-red-400'} transition-colors hover:text-red-600`}>{t('nav.logout')}</button>
// // // //                                 ) : (
// // // //                                     <Link to="/login" className={`font-semibold ${scrolled ? 'text-primary' : 'text-white'} transition-colors hover:text-primary-hover`}>{t('nav.login')}</Link>
// // // //                                 )}
// // // //                                 <LanguageSwitcher />
// // // //                             </div>
// // // //                         </div>
// // // //                         <div className="md:hidden flex items-center gap-4">
// // // //                             <LanguageSwitcher />
// // // //                             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 rounded-md ${scrolled ? 'text-text-secondary bg-white/50' : 'text-white'}`}>
// // // //                                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg>
// // // //                             </button>
// // // //                         </div>
// // // //                     </div>
// // // //                     {isMenuOpen && (
// // // //                         <div className="md:hidden mt-4 p-4 rounded-lg bg-card-bg backdrop-blur-md">
// // // //                             <div className="flex flex-col space-y-2">{navLinks}<div className="pt-4 mt-2 border-t border-border">{user ? (<button onClick={signOut} className="w-full text-left font-semibold text-system-danger px-3 py-2">{t('nav.logout')}</button>) : (<Link to="/login" className="block text-center font-semibold text-primary px-3 py-2">{t('nav.login')}</Link>)}</div></div>
// // // //                         </div>
// // // //                     )}
// // // //                 </nav>
// // // //             </header>
// // // //             {/* PERBAIKAN: Konten utama diberi margin-top negatif untuk ditarik ke belakang navbar */}
// // // //             <main className="-mt-20">
// // // //                 <Outlet />
// // // //             </main>
// // // //             <Footer />
// // // //         </div>
// // // //     );
// // // // };

// // // import { Link, Outlet, NavLink } from 'react-router-dom';
// // // import { useAuth, supabase } from '../contexts/AuthContext';
// // // import { useState, useEffect } from 'react';
// // // import { useQuery } from '@tanstack/react-query';
// // // import TtisaLogo from '../assets/ttisa-logo.jpg';
// // // import { Footer } from './Footer';
// // // import { useTranslation } from '../contexts/LanguageContext';
// // // import { LanguageSwitcher } from './LanguageSwitcher';
// // // import { motion, AnimatePresence } from 'framer-motion';
// // // import clsx from 'clsx';

// // // type UserProfile = {
// // //     english_name: string | null;
// // //     roles: {
// // //         name: 'admin' | 'organizer' | 'member';
// // //     } | null;
// // // };

// // // export const AppLayout = () => {
// // //     const { user, signOut } = useAuth();
// // //     const { t } = useTranslation();
// // //     const [isMenuOpen, setIsMenuOpen] = useState(false);
// // //     const [scrolled, setScrolled] = useState(false);

// // //     useEffect(() => {
// // //         const handleScroll = () => setScrolled(window.scrollY > 10);
// // //         window.addEventListener('scroll', handleScroll);
// // //         return () => window.removeEventListener('scroll', handleScroll);
// // //     }, []);

// // //     useEffect(() => {
// // //         if (isMenuOpen) {
// // //             document.body.style.overflow = 'hidden';
// // //         } else {
// // //             document.body.style.overflow = 'auto';
// // //         }
// // //         return () => { document.body.style.overflow = 'auto'; };
// // //     }, [isMenuOpen]);

// // //     const { data: profile } = useQuery<UserProfile | null>({
// // //         queryKey: ['layout_profile', user?.id],
// // //         queryFn: async () => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('english_name, users!inner(roles(name))').eq('user_id', user.id).single(); if (error) { console.error("Could not fetch profile, may not exist yet:", error.message); return null; }; return { ...data, roles: data.users?.roles } as UserProfile; },
// // //         enabled: !!user,
// // //     });

// // //     const userRole = profile?.roles?.name;
// // //     const canAccessCms = userRole === 'admin' || userRole === 'organizer';

// // //     const navLinkClass = ({ isActive }: { isActive: boolean }) => clsx(
// // //         "block md:inline-block px-3 py-2 rounded-md text-base font-medium transition-colors",
// // //         isActive ? (scrolled ? 'text-primary' : 'text-white') : (scrolled ? 'text-text-secondary hover:text-text-primary' : 'text-neutral-200 hover:text-white')
// // //     );

// // //     const navLinks = (
// // //         <>
// // //             <NavLink to="/events" className={navLinkClass}>{t('nav.events')}</NavLink>
// // //             <NavLink to="/posts" className={navLinkClass}>{t('nav.posts')}</NavLink>
// // //             <NavLink to="/teams" className={navLinkClass}>{t('nav.teams')}</NavLink>
// // //             {user && <NavLink to="/profile" className={navLinkClass}>{t('nav.profile')}</NavLink>}
// // //             {canAccessCms && <NavLink to="/cms" className={navLinkClass}>{t('nav.cms')}</NavLink>}
// // //         </>
// // //     );

// // //     return (
// // //         <div className="min-h-screen bg-background font-sans">
// // //             <header className={clsx('sticky top-0 z-40 transition-all duration-300', scrolled ? 'bg-card-bg shadow-lg' : 'bg-gradient-to-b from-black/40 to-transparent')}>
// // //                 <nav className="container mx-auto px-4 py-4">
// // //                     <div className="flex items-center justify-between">
// // //                         <Link to="/" className="flex items-center gap-2">
// // //                             <img src={TtisaLogo} alt="TTISA Logo" className="h-8 w-8" />
// // //                             <span className={clsx('text-xl font-bold transition-colors', scrolled ? 'text-text-primary' : 'text-white')}>TTISA NTUT</span>
// // //                         </Link>
// // //                         <div className="hidden md:flex items-center space-x-2">
// // //                             {navLinks}
// // //                             <div className="ml-4 flex items-center gap-4">
// // //                                 {user ? (
// // //                                     <button onClick={signOut} className={clsx('font-semibold transition-colors', scrolled ? 'text-system-danger hover:text-red-600' : 'text-red-400 hover:text-white')}>{t('nav.logout')}</button>
// // //                                 ) : (
// // //                                     <Link to="/login" className={clsx('font-semibold transition-colors', scrolled ? 'text-primary hover:text-primary-hover' : 'text-white hover:text-neutral-200')}>{t('nav.login')}</Link>
// // //                                 )}
// // //                                 <LanguageSwitcher />
// // //                             </div>
// // //                         </div>
// // //                         <div className="md:hidden flex items-center gap-4">
// // //                             <LanguageSwitcher />
// // //                             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={clsx('p-2 rounded-md', scrolled ? 'text-text-secondary bg-white/50' : 'text-white')}>
// // //                                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg>
// // //                             </button>
// // //                         </div>
// // //                     </div>
// // //                     <AnimatePresence>
// // //                         {isMenuOpen && (
// // //                             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden mt-4 overflow-hidden">
// // //                                 <div className="p-4 rounded-lg bg-card-bg backdrop-blur-md">
// // //                                     <div className="flex flex-col space-y-2">
// // //                                         <NavLink to="/events" className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary">{t('nav.events')}</NavLink>
// // //                                         <NavLink to="/posts" className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary">{t('nav.posts')}</NavLink>
// // //                                         <NavLink to="/teams" className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary">{t('nav.teams')}</NavLink>
// // //                                         {user && <NavLink to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary">{t('nav.profile')}</NavLink>}
// // //                                         {canAccessCms && <NavLink to="/cms" className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary">{t('nav.cms')}</NavLink>}
// // //                                         <div className="pt-4 mt-2 border-t border-border">{user ? (<button onClick={signOut} className="w-full text-left font-semibold text-system-danger px-3 py-2">{t('nav.logout')}</button>) : (<Link to="/login" className="block text-center font-semibold text-primary px-3 py-2">{t('nav.login')}</Link>)}</div>
// // //                                     </div>
// // //                                 </div>
// // //                             </motion.div>
// // //                         )}
// // //                     </AnimatePresence>
// // //                 </nav>
// // //             </header>
// // //             <main className="-mt-20"><Outlet /></main>
// // //             <Footer />
// // //         </div>
// // //     );
// // // };

// // import { Link, Outlet, NavLink } from 'react-router-dom';
// // import { useAuth, supabase } from '../contexts/AuthContext';
// // import { useState } from 'react';
// // import { useQuery } from '@tanstack/react-query';
// // import TtisaLogo from '../assets/ttisa-logo.jpg';
// // import { Footer } from './Footer';
// // import { useTranslation } from '../contexts/LanguageContext';
// // import { LanguageSwitcher } from './LanguageSwitcher';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import clsx from 'clsx';

// // type UserProfile = {
// //     english_name: string | null;
// //     roles: {
// //         name: 'admin' | 'organizer' | 'member';
// //     } | null;
// // };

// // export const AppLayout = () => {
// //     const { user, signOut } = useAuth();
// //     const { t } = useTranslation();
// //     const [isMenuOpen, setIsMenuOpen] = useState(false);

// //     const { data: profile } = useQuery<UserProfile | null>({
// //         queryKey: ['layout_profile', user?.id],
// //         queryFn: async () => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('english_name, users!inner(roles(name))').eq('user_id', user.id).single(); if (error) { console.error("Could not fetch profile, may not exist yet:", error.message); return null; }; return { ...data, roles: data.users?.roles } as UserProfile; },
// //         enabled: !!user,
// //     });

// //     const userRole = profile?.roles?.name;
// //     const canAccessCms = userRole === 'admin' || userRole === 'organizer';

// //     const navLinkClass = ({ isActive }: { isActive: boolean }) => clsx(
// //         "block md:inline-block px-3 py-2 rounded-md text-base font-medium transition-colors",
// //         isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
// //     );

// //     const navLinks = (
// //         <>
// //             <NavLink to="/events" className={navLinkClass}>{t('nav.events')}</NavLink>
// //             <NavLink to="/posts" className={navLinkClass}>{t('nav.posts')}</NavLink>
// //             <NavLink to="/teams" className={navLinkClass}>{t('nav.teams')}</NavLink>
// //             {user && <NavLink to="/profile" className={navLinkClass}>{t('nav.profile')}</NavLink>}
// //             {canAccessCms && <NavLink to="/cms" className={navLinkClass}>{t('nav.cms')}</NavLink>}
// //         </>
// //     );

// //     return (
// //         <div className="min-h-screen bg-background font-sans">
// //             <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
// //                 <nav className="container mx-auto px-4 py-4">
// //                     <div className="flex items-center justify-between">
// //                         <Link to="/" className="flex items-center gap-2">
// //                             <img src={TtisaLogo} alt="TTISA Logo" className="h-8 w-8" />
// //                             <span className="text-xl font-bold text-text-primary">TTISA NTUT</span>
// //                         </Link>
// //                         <div className="hidden md:flex items-center space-x-2">
// //                             {navLinks}
// //                             <div className="ml-4 flex items-center gap-4">
// //                                 {user ? (
// //                                     <button onClick={signOut} className="font-semibold text-system-danger transition-colors hover:text-red-700">{t('nav.logout')}</button>
// //                                 ) : (
// //                                     <Link to="/login" className="font-semibold text-primary transition-colors hover:text-primary-hover">{t('nav.login')}</Link>
// //                                 )}
// //                                 <LanguageSwitcher />
// //                             </div>
// //                         </div>
// //                         <div className="md:hidden flex items-center gap-4">
// //                             <LanguageSwitcher />
// //                             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-text-secondary">
// //                                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg>
// //                             </button>
// //                         </div>
// //                     </div>
// //                     <AnimatePresence>
// //                         {isMenuOpen && (
// //                             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden mt-4 overflow-hidden">
// //                                 <div className="p-4 rounded-lg bg-card-bg/80 backdrop-blur-md border border-border">
// //                                     <div className="flex flex-col space-y-2">{navLinks}<div className="pt-4 mt-2 border-t border-border">{user ? (<button onClick={signOut} className="w-full text-left font-semibold text-system-danger px-3 py-2">{t('nav.logout')}</button>) : (<Link to="/login" className="block text-center font-semibold text-primary px-3 py-2">{t('nav.login')}</Link>)}</div></div>
// //                                 </div>
// //                             </motion.div>
// //                         )}
// //                     </AnimatePresence>
// //                 </nav>
// //             </header>
// //             <main>
// //                 <Outlet />
// //             </main>
// //             <Footer />
// //         </div>
// //     );
// // };

// import { Link, Outlet, NavLink } from 'react-router-dom';
// import { useAuth, supabase } from '../contexts/AuthContext';
// import { useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import TtisaLogo from '../assets/ttisa-logo.jpg';
// import { Footer } from './Footer';
// import { useTranslation } from '../contexts/LanguageContext';
// import { LanguageSwitcher } from './LanguageSwitcher';
// import { motion, AnimatePresence } from 'framer-motion';
// import clsx from 'clsx';

// type UserProfile = {
//     english_name: string | null;
//     roles: {
//         name: 'admin' | 'organizer' | 'member';
//     } | null;
// };

// export const AppLayout = () => {
//     const { user, signOut } = useAuth();
//     const { t } = useTranslation();
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     const { data: profile } = useQuery<UserProfile | null>({
//         queryKey: ['layout_profile', user?.id],
//         queryFn: async () => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('english_name, users!inner(roles(name))').eq('user_id', user.id).single(); if (error) { console.error("Could not fetch profile, may not exist yet:", error.message); return null; }; return { ...data, roles: data.users?.roles } as UserProfile; },
//         enabled: !!user,
//     });

//     const userRole = profile?.roles?.name;
//     const canAccessCms = userRole === 'admin' || userRole === 'organizer';

//     const navLinkClass = ({ isActive }: { isActive: boolean }) => clsx(
//         "block md:inline-block px-3 py-2 rounded-md text-base font-medium transition-colors",
//         isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
//     );

//     const navLinks = (
//         <>
//             <NavLink to="/events" className={navLinkClass}>{t('nav.events')}</NavLink>
//             <NavLink to="/posts" className={navLinkClass}>{t('nav.posts')}</NavLink>
//             <NavLink to="/teams" className={navLinkClass}>{t('nav.teams')}</NavLink>
//             {user && <NavLink to="/profile" className={navLinkClass}>{t('nav.profile')}</NavLink>}
//             {canAccessCms && <NavLink to="/cms" className={navLinkClass}>{t('nav.cms')}</NavLink>}
//         </>
//     );

//     return (
//         <div className="min-h-screen bg-background font-sans">
//             <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
//                 <nav className="container mx-auto px-4 py-4">
//                     <div className="flex items-center justify-between">
//                         <Link to="/" className="flex items-center gap-2">
//                             <img src={TtisaLogo} alt="TTISA Logo" className="h-8 w-8" />
//                             <span className="text-xl font-bold text-text-primary">TTISA NTUT</span>
//                         </Link>
//                         <div className="hidden md:flex items-center space-x-2">
//                             {navLinks}
//                             <div className="ml-4 flex items-center gap-4">
//                                 {user ? (
//                                     <button onClick={signOut} className="font-semibold text-system-danger transition-colors hover:text-red-700">{t('nav.logout')}</button>
//                                 ) : (
//                                     <Link to="/login" className="font-semibold text-primary transition-colors hover:text-primary-hover">{t('nav.login')}</Link>
//                                 )}
//                                 <LanguageSwitcher />
//                             </div>
//                         </div>
//                         <div className="md:hidden flex items-center gap-4">
//                             <LanguageSwitcher />
//                             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-text-secondary">
//                                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg>
//                             </button>
//                         </div>
//                     </div>
//                     <AnimatePresence>
//                         {isMenuOpen && (
//                             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden mt-4 overflow-hidden">
//                                 <div className="p-4 rounded-lg bg-card-bg/80 backdrop-blur-md border border-border">
//                                     <div className="flex flex-col space-y-2">{navLinks}<div className="pt-4 mt-2 border-t border-border">{user ? (<button onClick={signOut} className="w-full text-left font-semibold text-system-danger px-3 py-2">{t('nav.logout')}</button>) : (<Link to="/login" className="block text-center font-semibold text-primary px-3 py-2">{t('nav.login')}</Link>)}</div></div>
//                                 </div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </nav>
//             </header>
//             {/* PERBAIKAN: Konten utama diberi margin-top negatif untuk ditarik ke belakang navbar */}
//             <main className="-mt-[80px]">
//                 <Outlet />
//             </main>
//             <Footer />
//         </div>
//     );
// };

import { Link, Outlet, NavLink } from 'react-router-dom';
import { useAuth, supabase } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import TtisaLogo from '../assets/ttisa-logo.jpg';
import { Footer } from './Footer';
import { useTranslation } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

type UserProfile = { english_name: string | null; roles: { name: 'admin' | 'organizer' | 'member' | 'developer'; } | null; };

export const AppLayout = () => {
    const { user, signOut } = useAuth();
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { data: profile } = useQuery<UserProfile | null>({
        queryKey: ['layout_profile', user?.id],
        queryFn: async () => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('english_name, users(roles(name))').eq('user_id', user.id).single(); if (error) return null; return { ...data, roles: data.users?.roles } as UserProfile; },
        enabled: !!user,
    });

    const userRole = profile?.roles?.name;
    const canAccessCms = userRole === 'admin' || userRole === 'organizer' || userRole === 'developer';

    const navLinkClass = ({ isActive }: { isActive: boolean }) => clsx("block md:inline-block px-3 py-2 rounded-md text-base font-medium transition-colors", isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary');

    const navLinks = (<> <NavLink to="/events" className={navLinkClass}>{t('nav.events')}</NavLink> <NavLink to="/posts" className={navLinkClass}>{t('nav.posts')}</NavLink> <NavLink to="/teams" className={navLinkClass}>{t('nav.teams')}</NavLink> {user && <NavLink to="/profile" className={navLinkClass}>{t('nav.profile')}</NavLink>} {canAccessCms && <NavLink to="/cms" className={navLinkClass}>{t('nav.cms')}</NavLink>} </>);

    return (
        <div className="min-h-screen bg-background font-sans">
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
                <nav className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2"><img src={TtisaLogo} alt="TTISA Logo" className="h-8 w-8" /><span className="text-xl font-bold text-text-primary">TTISA NTUT</span></Link>
                        <div className="hidden md:flex items-center space-x-2">{navLinks}<div className="ml-4 flex items-center gap-4">{user ? (<button onClick={signOut} className="font-semibold text-system-danger transition-colors hover:text-red-700">{t('nav.logout')}</button>) : (<Link to="/login" className="font-semibold text-primary transition-colors hover:text-primary-hover">{t('nav.login')}</Link>)}<LanguageSwitcher /></div></div>
                        <div className="md:hidden flex items-center gap-4"><LanguageSwitcher /><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-text-secondary"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg></button></div>
                    </div>
                    <AnimatePresence>{isMenuOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden mt-4 overflow-hidden"><div className="p-4 rounded-lg bg-card-bg/80 backdrop-blur-md border border-border"><div className="flex flex-col space-y-2">{navLinks}<div className="pt-4 mt-2 border-t border-border">{user ? (<button onClick={signOut} className="w-full text-left font-semibold text-system-danger px-3 py-2">{t('nav.logout')}</button>) : (<Link to="/login" className="block text-center font-semibold text-primary px-3 py-2">{t('nav.login')}</Link>)}</div></div></div></motion.div>)}</AnimatePresence>
                </nav>
            </header>
            <main className="-mt-[80px]"><Outlet /></main>
            <Footer />
        </div>
    );
};