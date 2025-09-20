import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '../contexts/AuthContext';
import { useMemo } from 'react';

type Event = {
    id: string;
    title: string;
    slug: string;
    start_at: string;
    location: string | null;
    banner_url: string | null;
};

const fetchEvents = async (): Promise<Event[]> => {
    const { data, error } = await supabase
        .from('events')
        .select('id, title, slug, start_at, location, banner_url')
        .order('start_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
};

const EventCard = ({ event }: { event: Event }) => {
    const eventDate = new Date(event.start_at);
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = eventDate.getDate();

    return (
        <Link to={`/events/${event.slug}`} className="block group bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex">
            <div className="flex-shrink-0 bg-primary text-white text-center p-4 w-24 flex flex-col justify-center">
                <span className="text-sm font-bold">{month}</span>
                <span className="text-3xl font-bold">{day}</span>
            </div>
            <div className="p-4 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-neutral-800 group-hover:text-primary">{event.title}</h3>
                <p className="text-sm text-neutral-500 mt-1">{event.location || 'Location TBD'}</p>
            </div>
        </Link>
    );
};

export const EventsPage = () => {
    const { data: events, isLoading, error } = useQuery<Event[]>({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    const { upcomingEvents, pastEvents } = useMemo(() => {
        if (!events) return { upcomingEvents: [], pastEvents: [] };

        const now = new Date();
        const upcoming = events.filter(e => new Date(e.start_at) >= now);
        const past = events.filter(e => new Date(e.start_at) < now).reverse();

        return { upcomingEvents: upcoming, pastEvents: past };
    }, [events]);

    if (isLoading) {
        return <div className="text-center py-12">Loading events...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-system-danger">Error loading events: {error.message}</div>;
    }

    return (
        <div className="space-y-12">
            <section>
                <h1 className="text-3xl font-bold text-neutral-800 mb-6">Upcoming Events</h1>
                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-neutral-500 bg-white rounded-lg shadow-sm">
                        <p>No upcoming events scheduled. Please check back later!</p>
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-3xl font-bold text-neutral-800 mb-6">Past Events</h2>
                {pastEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pastEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-neutral-500 bg-white rounded-lg shadow-sm">
                        <p>No past events to show.</p>
                    </div>
                )}
            </section>
        </div>
    );
};