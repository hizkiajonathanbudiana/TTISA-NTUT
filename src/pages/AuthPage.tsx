import { useState, useEffect } from 'react';
import { supabase, useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getAppUrl } from '../utils/url';

// --- STYLES & ICONS ---
const Icon = ({ path, className = "w-5 h-5" }: { path: string; className?: string; }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}> <path strokeLinecap="round" strokeLinejoin="round" d={path} /> </svg>);
const GoogleIcon = () => (<svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"> <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 398.7 0 256S111.8 0 244 0c69.8 0 131.3 28.5 175.2 74.2L340.5 150.2C311.5 123.8 279.1 112 244 112c-73.8 0-134.3 60.3-134.3 134.8s60.5 134.7 134.3 134.7c86.3 0 112-61.7 115.6-93.1H244v-64.8h243.6c1.3 12.8 2.4 25.4 2.4 38.8z" /> </svg>);

const AuthSchema = z.object({ email: z.string().email('Invalid email address'), password: z.string().min(6, 'Password must be at least 6 characters'), });
type AuthFormInputs = z.infer<typeof AuthSchema>;

export const AuthPage = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const { session } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthFormInputs>({ resolver: zodResolver(AuthSchema) });

    useEffect(() => { if (session) navigate('/profile'); }, [session, navigate]);

    const handleFormSubmit: SubmitHandler<AuthFormInputs> = async (data) => {
        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword(data);
                if (error) throw error;
                toast.success('Welcome back!');
                navigate('/profile');
            } else {
                const { error } = await supabase.auth.signUp(data);
                if (error) throw error;
                toast.success('Registration successful! Please check your email to verify your account.');
                setMode('login');
            }
        } catch (error: any) {
            toast.error(error.error_description || error.message);
        }
    };

    const signInWithGoogle = async () => {
        const redirectTo = import.meta.env.PROD ? getAppUrl() : window.location.origin;
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo }
        });
        if (error) toast.error(error.message);
    };

    const toggleMode = () => setMode(mode === 'login' ? 'register' : 'login');

    return (
        <main className="relative min-h-screen w-full bg-background flex items-center justify-center p-4 overflow-hidden font-sans">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-50 animate-aura-1"></div>
                <div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-50 animate-aura-2"></div>
                <div className="absolute top-[20%] right-[15%] w-64 h-64 lg:w-80 lg:h-80 bg-accent-purple rounded-full filter blur-3xl opacity-40 animate-aura-3"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 space-y-6 border border-white/20 shadow-lg">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-text-primary">{mode === 'login' ? t('auth.loginTitle') : t('auth.createAccountTitle')}</h1>
                        <p className="mt-2 text-sm text-text-secondary">{mode === 'login' ? t('auth.noAccount') : t('auth.haveAccount')} <button onClick={toggleMode} className="font-semibold text-primary hover:underline">{mode === 'login' ? t('auth.signUpLink') : t('auth.loginLink')}</button></p>
                    </div>

                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                        <div className="relative">
                            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-text-secondary pointer-events-none"><Icon path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></div>
                            <input {...register('email')} type="text" placeholder={t('auth.emailLabel')} className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-transparent rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300" />
                            {errors.email && <p className="mt-1 text-xs text-system-danger">{errors.email.message}</p>}
                        </div>
                        <div className="relative">
                            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-text-secondary pointer-events-none"><Icon path="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></div>
                            <input {...register('password')} type="password" placeholder={t('auth.passwordLabel')} className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-transparent rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300" />
                            {errors.password && <p className="mt-1 text-xs text-system-danger">{errors.password.message}</p>}
                            {mode === 'login' && <Link to="/forgot-password" className="text-xs text-primary hover:underline absolute right-4 top-1/2 -translate-y-1/2">{t('auth.forgotPassword')}</Link>}
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full py-3 font-semibold text-white bg-text-primary rounded-xl hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transform active:scale-[0.98] transition-all duration-200 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Processing...' : (mode === 'login' ? t('auth.loginButton') : t('auth.signUpButton'))}
                        </button>
                    </form>

                    <div className="flex items-center"><div className="flex-grow border-t border-gray-300"></div><span className="mx-4 text-xs font-light text-text-secondary">OR</span><div className="flex-grow border-t border-gray-300"></div></div>

                    <button onClick={signInWithGoogle} disabled={isSubmitting} className="w-full flex items-center justify-center py-3 bg-white/80 rounded-xl hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transform active:scale-[0.98] transition-all duration-200 shadow-lg disabled:opacity-75 disabled:cursor-not-allowed">
                        <GoogleIcon />
                        <span className="ml-3 font-semibold text-text-secondary">{t('auth.googleButton')}</span>
                    </button>
                </div>
            </div>
        </main>
    );
};