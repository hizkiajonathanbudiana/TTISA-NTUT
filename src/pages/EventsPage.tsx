import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '../contexts/AuthContext';
import { useMemo } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { getFullUrl } from '../utils/url';

type Event = {
    id: string;
    slug: string;
    title_en: string | null;
    title_zh_hant: string | null;
    start_at: string;
    location: string | null;
};

const EventCard = ({ event }: { event: Event }) => {
    const { language } = useTranslation();
    const eventDate = new Date(event.start_at);
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = eventDate.getDate();
    const title = language === 'zh-HANT' && event.title_zh_hant ? event.title_zh_hant : event.title_en;

    return (
        <Link to={`/events/${event.slug}`} className="block bg-white/50 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center h-full">
            <div className="flex-shrink-0 text-center w-16">
                <p className="text-sm font-bold text-secondary">{month}</p>
                <p className="text-3xl font-bold text-text-primary">{day}</p>
            </div>
            <div className="ml-4 border-l border-white/30 pl-4">
                <h3 className="font-bold text-text-primary leading-tight">{title}</h3>
                <p className="text-xs text-text-secondary mt-1">{event.location || 'Location TBD'}</p>
            </div>
        </Link>
    );
};

export const EventsPage = () => {
    const { t } = useTranslation();
    const { data: events, isLoading, error } = useQuery<Event[]>({
        queryKey: ['events'],
        queryFn: async () => {
            const { data, error } = await supabase.from('events').select('id, slug, title_en, title_zh_hant, start_at, location').order('start_at', { ascending: true });
            if (error) throw new Error(error.message);
            return data;
        },
    });

    const { upcomingEvents, pastEvents } = useMemo(() => {
        if (!events) return { upcomingEvents: [], pastEvents: [] };
        const now = new Date();
        const upcoming = events.filter(e => new Date(e.start_at) >= now);
        const past = events.filter(e => new Date(e.start_at) < now).reverse();
        return { upcomingEvents: upcoming, pastEvents: past };
    }, [events]);

    if (isLoading) return <div className="text-center py-40">Loading events...</div>;
    if (error) return <div className="text-center py-40 text-system-danger">Error loading events: {error.message}</div>;

    return (
        <div className="bg-background">
            <SEO
                title="Events - TTISA NTUT"
                description="Discover upcoming events and activities organized by TTISA at National Taiwan University of Science and Technology. Join networking sessions, cultural events, and academic workshops."
                keywords="TTISA events, NTUT activities, international student events, Taiwan Tech events, student networking, cultural activities"
                url={getFullUrl('/events')}
            />
            <section className="relative pt-40 pb-20 flex items-center justify-center text-center p-4 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-50">
                    <div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
                </div>
                <div className="relative z-10 max-w-3xl">
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold text-text-primary">{t('events.pageTitle')}</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-4 text-lg md:text-xl text-text-secondary">{t('events.pageSubtitle')}</motion.p>
                </div>
            </section>

            <section className="py-16 md:py-24 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">{t('events.upcoming')}</h2>
                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
                    </div>
                ) : (
                    <div className="text-center py-12 text-text-secondary bg-white/30 backdrop-blur-sm rounded-lg"><p>{t('events.noUpcoming')}</p></div>
                )}
            </section>

            <section className="py-16 md:py-24 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">{t('events.past')}</h2>
                {pastEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pastEvents.map(event => <EventCard key={event.id} event={event} />)}
                    </div>
                ) : (
                    <div className="text-center py-12 text-text-secondary bg-white/30 backdrop-blur-sm rounded-lg"><p>{t('events.noPast')}</p></div>
                )}
            </section>
        </div>
    );
};