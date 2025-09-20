import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../contexts/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

type PrintableData = {
    title: string;
    token: string;
};

export const PrintQrPage = () => {
    const { id: eventId } = useParams<{ id: string }>();

    const { data, isLoading, error } = useQuery<PrintableData | null>({
        queryKey: ['printable_qr', eventId],
        queryFn: async () => {
            const { data: eventData, error: eventError } = await supabase
                .from('events')
                .select('title, event_attendance_tokens(token)')
                .eq('id', eventId!)
                .gte('event_attendance_tokens.expires_at', new Date().toISOString())
                .order('created_at', { foreignTable: 'event_attendance_tokens', ascending: false })
                .limit(1, { foreignTable: 'event_attendance_tokens' })
                .single();

            if (eventError) {
                if (eventError.code === 'PGRST116') return null; // No event or no token found
                throw new Error(eventError.message);
            }

            const tokenInfo = Array.isArray(eventData.event_attendance_tokens) ? eventData.event_attendance_tokens[0] : null;

            if (!tokenInfo) return null;

            return {
                title: eventData.title,
                token: tokenInfo.token,
            };
        },
        enabled: !!eventId,
    });

    if (isLoading) {
        return <div className="text-center p-12">Loading QR Code...</div>;
    }
    if (error) {
        return <div className="text-center p-12 text-system-danger">Error: {error.message}</div>;
    }
    if (!data) {
        return (
            <div className="text-center p-12">
                <h1 className="text-2xl font-bold mb-4">No Active Token Found</h1>
                <p>Either the event does not exist or there is no active, unexpired check-in token.</p>
                <Link to={`/cms/events/${eventId}/registrations`} className="text-primary hover:underline mt-4 inline-block">&larr; Go back to generate one</Link>
            </div>
        );
    }

    const checkInUrl = `${window.location.origin}/checkin/${data.token}`;

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center text-center p-8">
            <div className="print:w-full">
                <h1 className="text-4xl md:text-6xl font-bold text-neutral-800 break-words">{data.title}</h1>
                <p className="text-2xl md:text-3xl text-neutral-500 mt-4 mb-8">Scan to Check In</p>
                <div className="bg-white p-6 inline-block border-4 border-neutral-800">
                    <QRCodeSVG value={checkInUrl} size={256} className="w-64 h-64 md:w-96 md:h-96" />
                </div>
                <p className="mt-8 text-5xl md:text-7xl font-mono tracking-widest text-neutral-800">{data.token}</p>
            </div>
            <div className="absolute bottom-8 print:hidden">
                <button onClick={() => window.print()} className="px-6 py-3 bg-primary text-white font-semibold rounded-md shadow-lg hover:bg-primary-hover">Print</button>
                <Link to={`/cms/events/${eventId}/registrations`} className="ml-4 text-neutral-500 hover:underline">Cancel</Link>
            </div>
        </div>
    );
};