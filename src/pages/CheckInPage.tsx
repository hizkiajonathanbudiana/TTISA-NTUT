import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../contexts/AuthContext';

type Status = 'loading' | 'success' | 'error';

export const CheckInPage = () => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<Status>('loading');
    const [message, setMessage] = useState('Checking you in...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No check-in token provided.');
            return;
        }

        const performCheckIn = async () => {
            const { data, error } = await supabase.functions.invoke('check-in', {
                body: { token },
            });

            if (error) {
                setStatus('error');
                setMessage(error.message || 'An unknown error occurred.');
            } else {
                setStatus('success');
                setMessage(data.message || 'Successfully checked in!');
            }
        };

        performCheckIn();
    }, [token]);

    const StatusDisplay = () => {
        switch (status) {
            case 'success':
                return (
                    <>
                        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
                            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h1 className="text-3xl font-bold text-neutral-800">Check-in Complete!</h1>
                    </>
                );
            case 'error':
                return (
                    <>
                        <div className="w-24 h-24 bg-system-danger rounded-full flex items-center justify-center mb-6">
                            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                        <h1 className="text-3xl font-bold text-neutral-800">Check-in Failed</h1>
                    </>
                );
            default: // loading
                return (
                    <>
                        <div className="w-24 h-24 border-4 border-dashed rounded-full animate-spin border-primary mb-6"></div>
                        <h1 className="text-3xl font-bold text-neutral-800">Processing...</h1>
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col justify-center items-center text-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <StatusDisplay />
                <p className="text-neutral-500 mt-4">{message}</p>
                <Link to="/events" className="text-primary hover:underline mt-8 inline-block">Go to Events Page</Link>
            </div>
        </div>
    );
};