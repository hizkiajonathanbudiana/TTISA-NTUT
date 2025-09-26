import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';

const ForgotPasswordSchema = z.object({ email: z.string().email('Invalid email address') });
type FormInputs = z.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({ resolver: zodResolver(ForgotPasswordSchema) });

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(data.email, { redirectTo: `${window.location.origin}/update-password`, });
            if (error) throw error;
            setSubmitted(true);
        } catch (error: any) { toast.error(error.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
            {submitted ? (
                <div className="text-center"><h2 className="text-2xl font-bold text-text-primary">{t('auth.resetSuccessTitle')}</h2><p className="mt-4 text-text-secondary">{t('auth.resetSuccessText')}</p><Link to="/login" className="text-primary hover:underline mt-8 inline-block">&larr; {t('auth.backToLogin')}</Link></div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold text-center text-text-primary">{t('auth.forgotPasswordTitle')}</h2><p className="text-center text-text-secondary mt-2">{t('auth.forgotPasswordSubtitle')}</p>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
                        <div><label htmlFor="email" className="text-sm font-medium">{t('auth.emailLabel')}</label><input id="email" type="email" {...register('email')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.email && <p className="mt-1 text-sm text-system-danger">{errors.email.message}</p>}</div>
                        <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-text-primary text-background font-semibold rounded-lg hover:bg-neutral-700 disabled:opacity-50">{loading ? 'Sending...' : t('auth.sendResetLinkButton')}</button>
                    </form>
                    <p className="text-sm text-center mt-4"><Link to="/login" className="font-semibold text-primary hover:underline">{t('auth.backToLogin')}</Link></p>
                </>
            )}
        </div>
    );
};