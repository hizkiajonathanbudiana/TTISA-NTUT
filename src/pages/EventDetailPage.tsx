import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase, useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

type EventDetails = {
  id: string;
  title: string;
  description: string | null;
  banner_url: string | null;
  start_at: string;
  end_at: string;
  location: string | null;
  user_registration_status: 'pending' | 'accepted' | 'rejected' | null;
};

const RegistrationButton = ({ event }: { event: EventDetails }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('You must be logged in to register.');
      const { error } = await supabase
        .from('event_registrations')
        .insert({ event_id: event.id, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Registration submitted! Awaiting approval.');
      queryClient.invalidateQueries({ queryKey: ['event', event.slug] });
    },
    onError: (error: any) => {
      if (error.code === '23505') { // Unique constraint violation
        toast.error('You are already registered for this event.');
      } else {
        toast.error(error.message);
      }
    },
  });

  if (!user) {
    return <button onClick={() => navigate('/login')} className="w-full md:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-primary-hover">Login to Register</button>;
  }

  if (new Date(event.start_at) < new Date()) {
    return <div className="w-full md:w-auto px-6 py-3 bg-neutral-200 text-neutral-500 font-semibold rounded-md text-center">Event Has Ended</div>;
  }

  switch (event.user_registration_status) {
    case 'pending':
      return <div className="w-full md:w-auto px-6 py-3 bg-yellow-400 text-yellow-800 font-semibold rounded-md text-center">Registration Pending Approval</div>;
    case 'accepted':
      return <div className="w-full md:w-auto px-6 py-3 bg-secondary text-white font-semibold rounded-md text-center">Registration Accepted!</div>;
    case 'rejected':
      return <div className="w-full md:w-auto px-6 py-3 bg-system-danger text-white font-semibold rounded-md text-center">Registration Rejected</div>;
    default:
      return <button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="w-full md:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-primary-hover disabled:opacity-50">{mutation.isPending ? 'Registering...' : 'Register for this Event'}</button>;
  }
};


export const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: event, isLoading, error } = useQuery<EventDetails>({
    queryKey: ['event', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_event_details', { p_slug: slug })
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) return <div className="text-center py-12">Loading Event...</div>;
  if (error) return <div className="text-center py-12 text-system-danger">Error: {error.message}</div>;
  if (!event) return <div className="text-center py-12">Event not found.</div>;

  const eventDate = new Date(event.start_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const eventTime = `${new Date(event.start_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${new Date(event.end_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

  return (
    <div>
      <Link to="/events" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all events</Link>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img src={event.banner_url || 'https://placehold.co/1200x400'} alt={event.title} className="w-full h-48 md:h-80 object-cover" />
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">{event.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-neutral-500 my-4">
            <div className="flex items-center gap-2"><span>📅</span><span>{eventDate}</span></div>
            <div className="flex items-center gap-2"><span>🕒</span><span>{eventTime}</span></div>
            <div className="flex items-center gap-2"><span>📍</span><span>{event.location || 'Location TBD'}</span></div>
          </div>
          <p className="text-neutral-800 my-6">{event.description || 'No description available.'}</p>
          <div className="mt-8 border-t pt-6">
            <RegistrationButton event={event} />
          </div>
        </div>
      </div>
    </div>
  );
};