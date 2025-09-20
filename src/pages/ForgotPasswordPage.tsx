import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});
type FormInputs = z.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        resolver: zodResolver(ForgotPasswordSchema),
    });

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.origin}/update-password`,
            });
            if (error) throw error;
            setSubmitted(true);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                {submitted ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-neutral-800">Check your email</h2>
                        <p className="mt-4 text-neutral-500">If an account with that email exists, we've sent a link to reset your password.</p>
                        <Link to="/login" className="text-primary hover:underline mt-8 inline-block">&larr; Back to Login</Link>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-center text-neutral-800">Forgot Password</h2>
                        <p className="text-center text-neutral-500">Enter your email and we'll send you a link to reset your password.</p>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-neutral-800">Email address</label>
                                <input id="email" type="email" {...register('email')} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                                {errors.email && <p className="mt-1 text-sm text-system-danger">{errors.email.message}</p>}
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover disabled:opacity-50">
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                        <p className="text-sm text-center">
                            <Link to="/login" className="font-semibold text-primary hover:underline">Nevermind, take me back to login</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};