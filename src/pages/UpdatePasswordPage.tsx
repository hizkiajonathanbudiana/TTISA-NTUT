import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdatePasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
type FormInputs = z.infer<typeof UpdatePasswordSchema>;

export const UpdatePasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                // This event is handled automatically by the Supabase client when the user lands on this page.
                // We can now allow them to update their password.
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        resolver: zodResolver(UpdatePasswordSchema),
    });

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: data.password });
            if (error) throw error;
            toast.success('Password updated successfully! You are now logged in.');
            navigate('/profile');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-neutral-800">Set a New Password</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="password">New Password</label>
                        <input id="password" type="password" {...register('password')} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                        {errors.password && <p className="mt-1 text-sm text-system-danger">{errors.password.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input id="confirmPassword" type="password" {...register('confirmPassword')} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-system-danger">{errors.confirmPassword.message}</p>}
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover disabled:opacity-50">
                        {loading ? 'Saving...' : 'Save New Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};