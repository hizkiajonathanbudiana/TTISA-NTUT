import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';

const UpdatePasswordSchema = z.object({ password: z.string().min(6, 'Password must be at least 6 characters'), confirmPassword: z.string(), }).refine(data => data.password === data.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"], });
type FormInputs = z.infer<typeof UpdatePasswordSchema>;

export const UpdatePasswordPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({ resolver: zodResolver(UpdatePasswordSchema) });

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: data.password });
            if (error) throw error;
            toast.success('Password updated successfully! You are now logged in.');
            navigate('/profile');
        } catch (error: any) { toast.error(error.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-center text-text-primary">{t('auth.updatePasswordTitle')}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
                <div><label htmlFor="password" className="text-sm font-medium">{t('auth.newPasswordLabel')}</label><input id="password" type="password" {...register('password')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.password && <p className="mt-1 text-sm text-system-danger">{errors.password.message}</p>}</div>
                <div><label htmlFor="confirmPassword" className="text-sm font-medium">{t('auth.confirmPasswordLabel')}</label><input id="confirmPassword" type="password" {...register('confirmPassword')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.confirmPassword && <p className="mt-1 text-sm text-system-danger">{errors.confirmPassword.message}</p>}</div>
                <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-text-primary text-background font-semibold rounded-lg hover:bg-neutral-700 disabled:opacity-50">{loading ? 'Saving...' : t('auth.savePasswordButton')}</button>
            </form>
        </div>
    );
};