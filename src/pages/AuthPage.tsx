import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { supabase } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
type AuthFormInputs = z.infer<typeof AuthSchema>;

export const AuthPage = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { session } = useAuth();

    useEffect(() => { if (session) navigate('/profile'); }, [session, navigate]);
    const { register, handleSubmit, formState: { errors } } = useForm<AuthFormInputs>({ resolver: zodResolver(AuthSchema) });

    const handleAuthAction: SubmitHandler<AuthFormInputs> = async (data) => {
        setLoading(true);
        try {
            if (isLoginView) {
                const { error } = await supabase.auth.signInWithPassword(data);
                if (error) throw error;
                toast.success('Logged in successfully!');
                navigate('/profile');
            } else {
                const { error } = await supabase.auth.signUp(data);
                if (error) throw error;
                toast.success('Check your email for the verification link!');
            }
        } catch (error: any) {
            toast.error(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };
    const signInWithGoogle = async () => { await supabase.auth.signInWithOAuth({ provider: 'google' }); };

    return (
        <div className="flex justify-center items-center py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-neutral-800">{isLoginView ? 'Welcome Back!' : 'Create an Account'}</h2>
                <button onClick={signInWithGoogle} className="w-full flex justify-center items-center py-2 px-4 border rounded-md shadow-sm bg-white hover:bg-neutral-100">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.9 0 6.9 1.6 9.1 3.7l6.8-6.8C35.9 2.5 30.4 0 24 0 14.3 0 6.1 5.5 2.4 13.6l8.3 6.5C12.4 14.1 17.7 9.5 24 9.5z"></path><path fill="#34A853" d="M46.2 25.4c0-1.7-.2-3.3-.5-4.9H24v9.3h12.4c-.5 3-2.2 5.6-4.8 7.3l7.9 6.1c4.6-4.2 7.2-10.2 7.2-17.8z"></path><path fill="#FBBC05" d="M10.7 20.1c-1-3 .3-6.3 2.9-8.3l-8.3-6.5C.2 10.6-1.2 17.5 1.5 23.5l9.2-3.4z"></path><path fill="#EA4335" d="M24 48c6.5 0 12-2.1 16-5.6l-7.9-6.1c-2.2 1.5-5 2.4-8.1 2.4-6.3 0-11.6-4.6-13.6-10.8l-8.3 6.5C6.1 42.5 14.3 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
                    {isLoginView ? 'Sign in with Google' : 'Sign up with Google'}
                </button>
                <div className="flex items-center justify-center"><span className="w-full border-t"></span><span className="px-2 text-xs text-neutral-500">OR</span><span className="w-full border-t"></span></div>
                <form onSubmit={handleSubmit(handleAuthAction)} className="space-y-4">
                    <div>
                        <label htmlFor="email">Email address</label>
                        <input id="email" type="email" {...register('email')} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                        {errors.email && <p className="mt-1 text-sm text-system-danger">{errors.email.message}</p>}
                    </div>
                    <div>
                        <div className="flex justify-between items-center"><label htmlFor="password">Password</label>{isLoginView && <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</Link>}</div>
                        <input id="password" type="password" {...register('password')} className="mt-1 block w-full px-3 py-2 border rounded-md" />
                        {errors.password && <p className="mt-1 text-sm text-system-danger">{errors.password.message}</p>}
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover disabled:opacity-50">{loading ? 'Processing...' : (isLoginView ? 'Login' : 'Sign Up')}</button>
                </form>
                <p className="text-sm text-center text-neutral-500">{isLoginView ? "Don't have an account?" : 'Already have an account?'} <button onClick={() => setIsLoginView(!isLoginView)} className="ml-1 font-semibold text-primary hover:underline">{isLoginView ? 'Sign up' : 'Login'}</button></p>
            </div>
        </div>
    );
};