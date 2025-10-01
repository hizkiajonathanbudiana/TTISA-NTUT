
// // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // import { supabase } from '../../contexts/AuthContext';
// // // import toast from 'react-hot-toast';
// // // import { useState } from 'react';
// // // import { useForm, type SubmitHandler } from 'react-hook-form';
// // // import { zodResolver } from '@hookform/resolvers/zod';
// // // import { z } from 'zod';
// // // import { Link } from 'react-router-dom';

// // // const EventSchema = z.object({
// // //     title_en: z.string().min(3, 'English title is required'),
// // //     title_zh_hant: z.string().min(1, 'Chinese title is required'),
// // //     description_en: z.string().optional(),
// // //     description_zh_hant: z.string().optional(),
// // //     slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
// // //     banner_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
// // //     location: z.string().optional(),
// // //     start_at: z.string().min(1, 'Start date is required'),
// // //     end_at: z.string().min(1, 'End date is required'),
// // //     status: z.enum(['upcoming', 'past', 'cancelled']),
// // // });

// // // type EventFormInputs = z.infer<typeof EventSchema>;
// // // type Event = EventFormInputs & { id: string };

// // // const EventForm = ({ event, onFormSubmit, onCancel }: { event?: Event | null, onFormSubmit: (data: EventFormInputs) => void, onCancel: () => void }) => {
// // //     const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
// // //     const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EventFormInputs>({
// // //         defaultValues: event ? {
// // //             ...event,
// // //             start_at: event.start_at ? new Date(event.start_at).toISOString().slice(0, 16) : '',
// // //             end_at: event.end_at ? new Date(event.end_at).toISOString().slice(0, 16) : '',
// // //         } : { status: 'upcoming' },
// // //         resolver: zodResolver(EventSchema),
// // //     });

// // //     return (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
// // //             <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-full overflow-y-auto">
// // //                 <h2 className="text-2xl font-bold mb-4">{event ? 'Edit Event' : 'Create New Event'}</h2>
// // //                 <div className="border-b border-gray-200 mb-4">
// // //                     <nav className="-mb-px flex space-x-8" aria-label="Tabs">
// // //                         <button type="button" onClick={() => setActiveTab('en')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'en' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>English</button>
// // //                         <button type="button" onClick={() => setActiveTab('zh')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'zh' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Chinese (Traditional)</button>
// // //                     </nav>
// // //                 </div>
// // //                 <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
// // //                     <div className={activeTab === 'en' ? 'block' : 'hidden'}><div className="space-y-4"><div><label className="block text-sm font-medium">Title (English)</label><input {...register('title_en')} className="mt-1 w-full p-2 border rounded-md" />{errors.title_en && <p className="text-sm text-system-danger">{errors.title_en.message}</p>}</div><div><label className="block text-sm font-medium">Description (English)</label><textarea {...register('description_en')} rows={4} className="mt-1 w-full p-2 border rounded-md" /></div></div></div>
// // //                     <div className={activeTab === 'zh' ? 'block' : 'hidden'}><div className="space-y-4"><div><label className="block text-sm font-medium">Title (Chinese)</label><input {...register('title_zh_hant')} className="mt-1 w-full p-2 border rounded-md" />{errors.title_zh_hant && <p className="text-sm text-system-danger">{errors.title_zh_hant.message}</p>}</div><div><label className="block text-sm font-medium">Description (Chinese)</label><textarea {...register('description_zh_hant')} rows={4} className="mt-1 w-full p-2 border rounded-md" /></div></div></div>
// // //                     <hr className="my-6" />
// // //                     <div><label className="block text-sm font-medium">URL Slug (Unique Identifier)</label><input {...register('slug')} className="mt-1 w-full p-2 border rounded-md" />{errors.slug && <p className="text-sm text-system-danger">{errors.slug.message}</p>}</div>
// // //                     <div><label className="block text-sm font-medium">Banner Image URL</label><input {...register('banner_url')} className="mt-1 w-full p-2 border rounded-md" />{errors.banner_url && <p className="text-sm text-system-danger">{errors.banner_url.message}</p>}</div>
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium">Start Time</label><input type="datetime-local" {...register('start_at')} className="mt-1 w-full p-2 border rounded-md" />{errors.start_at && <p className="text-sm text-system-danger">{errors.start_at.message}</p>}</div><div><label className="block text-sm font-medium">End Time</label><input type="datetime-local" {...register('end_at')} className="mt-1 w-full p-2 border rounded-md" />{errors.end_at && <p className="text-sm text-system-danger">{errors.end_at.message}</p>}</div></div>
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium">Location</label><input {...register('location')} className="mt-1 w-full p-2 border rounded-md" /></div><div><label className="block text-sm font-medium">Status</label><select {...register('status')} className="mt-1 w-full p-2 border rounded-md bg-white"><option value="upcoming">Upcoming</option><option value="past">Past</option><option value="cancelled">Cancelled</option></select></div></div>
// // //                     <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Event'}</button></div>
// // //                 </form>
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // export const EventsManagementPage = () => {
// // //     const [isFormOpen, setIsFormOpen] = useState(false);
// // //     const [editingEvent, setEditingEvent] = useState<Event | null>(null);
// // //     const queryClient = useQueryClient();

// // //     const { data: events, isLoading } = useQuery<Event[]>({
// // //         queryKey: ['cms_events'],
// // //         queryFn: async () => {
// // //             const { data, error } = await supabase.from('events').select('*').order('start_at', { ascending: false });
// // //             if (error) throw new Error(error.message);
// // //             return data;
// // //         },
// // //     });

// // //     const mutation = useMutation({
// // //         mutationFn: async (eventData: EventFormInputs) => {
// // //             const dataToSubmit = { ...eventData, start_at: new Date(eventData.start_at).toISOString(), end_at: new Date(eventData.end_at).toISOString() };
// // //             if (editingEvent) {
// // //                 const { error } = await supabase.from('events').update(dataToSubmit).eq('id', editingEvent.id);
// // //                 if (error) throw error;
// // //             } else {
// // //                 const { error } = await supabase.from('events').insert(dataToSubmit);
// // //                 if (error) throw error;
// // //             }
// // //         },
// // //         onSuccess: () => {
// // //             toast.success(`Event ${editingEvent ? 'updated' : 'created'} successfully!`);
// // //             queryClient.invalidateQueries({ queryKey: ['cms_events'] });
// // //             setIsFormOpen(false);
// // //             setEditingEvent(null);
// // //         },
// // //         onError: (error) => { toast.error(error.message); }
// // //     });

// // //     const deleteMutation = useMutation({
// // //         mutationFn: async (eventId: string) => {
// // //             const { error } = await supabase.from('events').delete().eq('id', eventId);
// // //             if (error) throw error;
// // //         },
// // //         onSuccess: () => {
// // //             toast.success('Event deleted.');
// // //             queryClient.invalidateQueries({ queryKey: ['cms_events'] });
// // //         },
// // //         onError: (error) => { toast.error(error.message); }
// // //     });

// // //     return (
// // //         <div className="space-y-6">
// // //             <div className="flex justify-between items-center">
// // //                 <h1 className="text-3xl font-bold">Manage Events</h1>
// // //                 <button onClick={() => { setEditingEvent(null); setIsFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Create New Event</button>
// // //             </div>
// // //             {isFormOpen && <EventForm event={editingEvent} onFormSubmit={(data) => mutation.mutate(data)} onCancel={() => { setIsFormOpen(false); setEditingEvent(null); }} />}
// // //             <div className="bg-white shadow-md rounded-lg overflow-x-auto">
// // //                 <table className="min-w-full responsive-table">
// // //                     <thead className="bg-neutral-100">
// // //                         <tr>
// // //                             <th className="p-4 text-left font-semibold">Title (English)</th>
// // //                             <th className="p-4 text-left font-semibold">Date</th>
// // //                             <th className="p-4 text-left font-semibold">Status</th>
// // //                             <th className="p-4 text-right font-semibold">Actions</th>
// // //                         </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                         {isLoading ? (<tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>) :
// // //                             events?.map(event => (
// // //                                 <tr key={event.id}>
// // //                                     <td data-label="Title">{event.title_en}</td>
// // //                                     <td data-label="Date">{new Date(event.start_at).toLocaleDateString()}</td>
// // //                                     <td data-label="Status">
// // //                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-neutral-200 text-neutral-800'}`}>{event.status}</span>
// // //                                     </td>
// // //                                     <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
// // //                                         <Link to={`/cms/events/${event.id}/registrations`} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600 inline-block w-full md:w-auto">Registrants</Link>
// // //                                         <button onClick={() => { setEditingEvent(event); setIsFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover w-full md:w-auto">Edit</button>
// // //                                         <button onClick={() => window.confirm('Are you sure?') && deleteMutation.mutate(event.id)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700 w-full md:w-auto">Delete</button>
// // //                                     </td>
// // //                                 </tr>
// // //                             ))}
// // //                     </tbody>
// // //                 </table>
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import { supabase, useAuth } from '../../contexts/AuthContext';
// // import toast from 'react-hot-toast';
// // import { useState } from 'react';
// // import { useForm, type SubmitHandler } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { z } from 'zod';
// // import { Link } from 'react-router-dom';

// // const EventSchema = z.object({ title_en: z.string().min(3, 'English title is required'), title_zh_hant: z.string().min(1, 'Chinese title is required'), description_en: z.string().optional(), description_zh_hant: z.string().optional(), slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'), banner_url: z.string().url('Must be a valid URL').optional().or(z.literal('')), location: z.string().optional(), start_at: z.string().min(1, 'Start date is required'), end_at: z.string().min(1, 'End date is required'), status: z.enum(['upcoming', 'past', 'cancelled']), });
// // type EventFormInputs = z.infer<typeof EventSchema>;
// // type Event = EventFormInputs & { id: string };

// // const EventForm = ({ event, onFormSubmit, onCancel }: { event?: Event | null, onFormSubmit: (data: EventFormInputs) => void, onCancel: () => void }) => {
// //     const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
// //     const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EventFormInputs>({ defaultValues: event ? { ...event, start_at: event.start_at ? new Date(event.start_at).toISOString().slice(0, 16) : '', end_at: event.end_at ? new Date(event.end_at).toISOString().slice(0, 16) : '', } : { status: 'upcoming' }, resolver: zodResolver(EventSchema), });
// //     return (<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"><div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-full overflow-y-auto"><h2 className="text-2xl font-bold mb-4">{event ? 'Edit Event' : 'Create New Event'}</h2><div className="border-b border-gray-200 mb-4"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button type="button" onClick={() => setActiveTab('en')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'en' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>English</button><button type="button" onClick={() => setActiveTab('zh')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'zh' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>Chinese (Traditional)</button></nav></div><form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4"><div className={activeTab === 'en' ? 'block' : 'hidden'}><div className="space-y-4"><div><label className="block text-sm font-medium">Title (English)</label><input {...register('title_en')} className="mt-1 w-full p-2 border rounded-md" />{errors.title_en && <p className="text-sm text-system-danger">{errors.title_en.message}</p>}</div><div><label className="block text-sm font-medium">Description (English)</label><textarea {...register('description_en')} rows={4} className="mt-1 w-full p-2 border rounded-md" /></div></div></div><div className={activeTab === 'zh' ? 'block' : 'hidden'}><div className="space-y-4"><div><label className="block text-sm font-medium">Title (Chinese)</label><input {...register('title_zh_hant')} className="mt-1 w-full p-2 border rounded-md" />{errors.title_zh_hant && <p className="text-sm text-system-danger">{errors.title_zh_hant.message}</p>}</div><div><label className="block text-sm font-medium">Description (Chinese)</label><textarea {...register('description_zh_hant')} rows={4} className="mt-1 w-full p-2 border rounded-md" /></div></div></div><hr className="my-6" /><div><label className="block text-sm font-medium">URL Slug (Unique Identifier)</label><input {...register('slug')} className="mt-1 w-full p-2 border rounded-md" />{errors.slug && <p className="text-sm text-system-danger">{errors.slug.message}</p>}</div><div><label className="block text-sm font-medium">Banner Image URL</label><input {...register('banner_url')} className="mt-1 w-full p-2 border rounded-md" />{errors.banner_url && <p className="text-sm text-system-danger">{errors.banner_url.message}</p>}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium">Start Time</label><input type="datetime-local" {...register('start_at')} className="mt-1 w-full p-2 border rounded-md" />{errors.start_at && <p className="text-sm text-system-danger">{errors.start_at.message}</p>}</div><div><label className="block text-sm font-medium">End Time</label><input type="datetime-local" {...register('end_at')} className="mt-1 w-full p-2 border rounded-md" />{errors.end_at && <p className="text-sm text-system-danger">{errors.end_at.message}</p>}</div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium">Location</label><input {...register('location')} className="mt-1 w-full p-2 border rounded-md" /></div><div><label className="block text-sm font-medium">Status</label><select {...register('status')} className="mt-1 w-full p-2 border rounded-md bg-white"><option value="upcoming">Upcoming</option><option value="past">Past</option><option value="cancelled">Cancelled</option></select></div></div><div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Event'}</button></div></form></div></div>);
// // };

// // export const EventsManagementPage = () => {
// //     const [isFormOpen, setIsFormOpen] = useState(false);
// //     const [editingEvent, setEditingEvent] = useState<Event | null>(null);
// //     const queryClient = useQueryClient();
// //     const { user } = useAuth();

// //     const { data: events, isLoading } = useQuery<Event[]>({ queryKey: ['cms_events'], queryFn: async () => { const { data, error } = await supabase.from('events').select('*').order('start_at', { ascending: false }); if (error) throw new Error(error.message); return data; }, });

// //     const mutation = useMutation({
// //         mutationFn: async (eventData: EventFormInputs) => {
// //             if (!user) throw new Error("You must be logged in to create an event.");
// //             const dataToSubmit = { ...eventData, start_at: new Date(eventData.start_at).toISOString(), end_at: new Date(eventData.end_at).toISOString() };
// //             if (editingEvent) {
// //                 const { error } = await supabase.from('events').update(dataToSubmit).eq('id', editingEvent.id);
// //                 if (error) throw error;
// //             } else {
// //                 const { error } = await supabase.from('events').insert({ ...dataToSubmit, created_by: user.id });
// //                 if (error) throw error;
// //             }
// //         },
// //         onSuccess: () => { toast.success(`Event ${editingEvent ? 'updated' : 'created'} successfully!`); queryClient.invalidateQueries({ queryKey: ['cms_events'] }); setIsFormOpen(false); setEditingEvent(null); },
// //         onError: (error) => { toast.error(error.message); }
// //     });

// //     const deleteMutation = useMutation({ mutationFn: async (eventId: string) => { const { error } = await supabase.from('events').delete().eq('id', eventId); if (error) throw error; }, onSuccess: () => { toast.success('Event deleted.'); queryClient.invalidateQueries({ queryKey: ['cms_events'] }); }, onError: (error) => { toast.error(error.message); } });

// //     return (
// //         <div className="space-y-6">
// //             <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Manage Events</h1><button onClick={() => { setEditingEvent(null); setIsFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Create New Event</button></div>
// //             {isFormOpen && <EventForm event={editingEvent} onFormSubmit={(data) => mutation.mutate(data)} onCancel={() => { setIsFormOpen(false); setEditingEvent(null); }} />}
// //             <div className="bg-white shadow-md rounded-lg overflow-x-auto">
// //                 <table className="min-w-full responsive-table">
// //                     <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Title (English)</th><th className="p-4 text-left font-semibold">Date</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
// //                     <tbody>
// //                         {isLoading ? (<tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>) :
// //                             events?.map(event => (
// //                                 <tr key={event.id}><td data-label="Title">{event.title_en}</td><td data-label="Date">{new Date(event.start_at).toLocaleDateString()}</td><td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-neutral-200 text-neutral-800'}`}>{event.status}</span></td><td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2"><Link to={`/cms/events/${event.id}/registrations`} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600 inline-block w-full md:w-auto">Registrants</Link><button onClick={() => { setEditingEvent(event); setIsFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover w-full md:w-auto">Edit</button><button onClick={() => window.confirm('Are you sure?') && deleteMutation.mutate(event.id)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700 w-full md:w-auto">Delete</button></td></tr>
// //                             ))}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </div>
// //     );
// // };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';

const EventSchema = z.object({
  title_en: z.string().min(3, 'English title is required'),
  title_zh_hant: z.string().min(1, 'Chinese title is required'),
  description_en: z.string().optional(),
  description_zh_hant: z.string().optional(),
  slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/),
  banner_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  start_at: z.string().min(1, 'Start date is required'),
  end_at: z.string().min(1, 'End date is required'),
  status: z.enum(['upcoming', 'past', 'cancelled']),
  cta_post_id: z.string().optional(),
  cta_text_en: z.string().optional(),
  cta_text_zh_hant: z.string().optional(),
});

type EventFormInputs = z.infer<typeof EventSchema>;
type Event = EventFormInputs & { id: string };
type PostSelection = { id: string; title_en: string | null; };

const EventForm = ({ event, onFormSubmit, onCancel }: { event?: Event | null, onFormSubmit: (data: EventFormInputs) => void, onCancel: () => void }) => {
  const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EventFormInputs>({
    defaultValues: event ? {
      ...event,
      start_at: event.start_at ? new Date(event.start_at).toISOString().slice(0, 16) : '',
      end_at: event.end_at ? new Date(event.end_at).toISOString().slice(0, 16) : '',
    } : { status: 'upcoming', cta_post_id: '' },
    resolver: zodResolver(EventSchema)
  });
  const { data: posts } = useQuery<PostSelection[]>({
    queryKey: ['post_selection_list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('posts').select('id, title_en').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{event ? 'Edit Event' : 'Create New Event'}</h2>
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8">
            <button type="button" onClick={() => setActiveTab('en')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'en' ? 'border-primary text-primary' : 'border-transparent'}`}>English</button>
            <button type="button" onClick={() => setActiveTab('zh')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'zh' ? 'border-primary text-primary' : 'border-transparent'}`}>Chinese</button>
          </nav>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className={activeTab === 'en' ? 'block' : 'hidden'}>
            <div className="space-y-4">
              <div><label>Title (English)</label><input {...register('title_en')} className="mt-1 w-full p-2 border rounded-md" />{errors.title_en && <p className="text-sm text-system-danger">{errors.title_en.message}</p>}</div>
              <div><label>Description (English)</label><textarea {...register('description_en')} rows={4} className="mt-1 w-full p-2 border rounded-md" /></div>
            </div>
          </div>
          <div className={activeTab === 'zh' ? 'block' : 'hidden'}>
            <div className="space-y-4">
              <div><label>Title (Chinese)</label><input {...register('title_zh_hant')} className="mt-1 w-full p-2 border rounded-md" />{errors.title_zh_hant && <p className="text-sm text-system-danger">{errors.title_zh_hant.message}</p>}</div>
              <div><label>Description (Chinese)</label><textarea {...register('description_zh_hant')} rows={4} className="mt-1 w-full p-2 border rounded-md" /></div>
            </div>
          </div>
          <hr className="my-6"/>
          <div><label>URL Slug</label><input {...register('slug')} className="mt-1 w-full p-2 border rounded-md" />{errors.slug && <p className="text-sm text-system-danger">{errors.slug.message}</p>}</div>
          <div><label>Banner Image URL</label><input {...register('banner_url')} className="mt-1 w-full p-2 border rounded-md" />{errors.banner_url && <p className="text-sm text-system-danger">{errors.banner_url.message}</p>}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label>Start Time</label><input type="datetime-local" {...register('start_at')} className="mt-1 w-full p-2 border rounded-md" />{errors.start_at && <p className="text-sm text-system-danger">{errors.start_at.message}</p>}</div>
            <div><label>End Time</label><input type="datetime-local" {...register('end_at')} className="mt-1 w-full p-2 border rounded-md" />{errors.end_at && <p className="text-sm text-system-danger">{errors.end_at.message}</p>}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label>Location</label><input {...register('location')} className="mt-1 w-full p-2 border rounded-md" /></div>
            <div><label>Status</label><select {...register('status')} className="mt-1 w-full p-2 border rounded-md bg-white"><option value="upcoming">Upcoming</option><option value="past">Past</option><option value="cancelled">Cancelled</option></select></div>
          </div>
          <hr/>
          <div className="space-y-4 p-4 border rounded-md bg-neutral-50">
            <h3 className="font-semibold text-lg">Call to Action (Optional)</h3>
            <div>
              <label className="block text-sm font-medium">Link to Post</label>
              <select {...register('cta_post_id')} className="mt-1 w-full p-2 border rounded-md bg-white">
                <option value="">None</option>
                {posts?.map(post => (<option key={post.id} value={post.id}>{post.title_en}</option>))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label>Button Text (English)</label><input {...register('cta_text_en')} placeholder="e.g., Read More Here!" className="mt-1 w-full p-2 border rounded-md" /></div>
              <div><label>Button Text (Chinese)</label><input {...register('cta_text_zh_hant')} placeholder="e.g., 閱讀更多" className="mt-1 w-full p-2 border rounded-md" /></div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Event'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EventsManagementPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['cms_events'],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*').order('start_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
  const mutation = useMutation({
    mutationFn: async (eventData: EventFormInputs) => {
      if (!user) throw new Error("You must be logged in.");
      const dataToSubmit = { ...eventData, start_at: new Date(eventData.start_at).toISOString(), end_at: new Date(eventData.end_at).toISOString(), cta_post_id: eventData.cta_post_id || null, };
      if (editingEvent) {
        const { error } = await supabase.from('events').update(dataToSubmit).eq('id', editingEvent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('events').insert({ ...dataToSubmit, created_by: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(`Event ${editingEvent ? 'updated' : 'created'} successfully!`);
      queryClient.invalidateQueries({ queryKey: ['cms_events'] });
      setIsFormOpen(false);
      setEditingEvent(null);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase.from('events').delete().eq('id', eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Event deleted.');
      queryClient.invalidateQueries({ queryKey: ['cms_events'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <button onClick={() => { setEditingEvent(null); setIsFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Create New Event</button>
      </div>
      {isFormOpen && <EventForm event={editingEvent} onFormSubmit={(data) => mutation.mutate(data)} onCancel={() => { setIsFormOpen(false); setEditingEvent(null); }} />}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full responsive-table">
          <thead className="bg-neutral-100">
            <tr>
              <th className="p-4 text-left font-semibold">Title (English)</th>
              <th className="p-4 text-left font-semibold">Date</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
            ) : events?.map(event => (
              <tr key={event.id}>
                <td data-label="Title">{event.title_en}</td>
                <td data-label="Date">{new Date(event.start_at).toLocaleDateString()}</td>
                <td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-neutral-200 text-neutral-800'}`}>{event.status}</span></td>
                <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
                  <Link to={`/cms/events/${event.id}/registrations`} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600 inline-block w-full md:w-auto">Registrants</Link>
                  <button onClick={() => { setEditingEvent(event); setIsFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover w-full md:w-auto">Edit</button>
                  <button onClick={() => window.confirm('Are you sure?') && deleteMutation.mutate(event.id)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700 w-full md:w-auto">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
