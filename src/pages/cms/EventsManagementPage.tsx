// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import { supabase, useAuth } from '../../contexts/AuthContext';
// // import toast from 'react-hot-toast';
// // import { useState } from 'react';
// // import { useForm, useWatch } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { z } from 'zod';
// // import { Link } from 'react-router-dom';
// // import { Pagination } from '../../components/Pagination';

// // const EventSchema = z.object({
// //   title_en: z.string().min(3, 'English title is required'),
// //   title_zh_hant: z.string().min(1, 'Chinese title is required'),
// //   description_en: z.string().optional(),
// //   description_zh_hant: z.string().optional(),
// //   slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/),
// //   banner_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
// //   location: z.string().optional(),
// //   start_at: z.string().min(1, 'Start date is required'),
// //   end_at: z.string().min(1, 'End date is required'),
// //   cta_post_id: z.string().optional(),
// //   cta_text_en: z.string().optional(),
// //   cta_text_zh_hant: z.string().optional(),
// //   is_paid: z.boolean(),
// //   price: z.number().optional().nullable(),
// // }).refine((data) => {
// //   // If it's a paid event, price must be provided and greater than 0
// //   if (data.is_paid) {
// //     return data.price != null && data.price > 0;
// //   }
// //   return true;
// // }, {
// //   message: "Price is required for paid events and must be greater than 0",
// //   path: ["price"]
// // });

// // type EventFormInputs = z.infer<typeof EventSchema>;
// // type Event = EventFormInputs & { id: string; created_by: string; start_at: string; };
// // type PostSelection = { id: string; title_en: string | null; };

// // // API functions
// // const getCMSEvents = async (page: number, limit: number, search: string) => {
// //   let query = supabase.from('events').select('*', { count: 'exact' });

// //   if (search) {
// //     query = query.or(`title_en.ilike.%${search}%,title_zh_hant.ilike.%${search}%,slug.ilike.%${search}%`);
// //   }

// //   const { data, error, count } = await query
// //     .order('created_at', { ascending: false })
// //     .range((page - 1) * limit, page * limit - 1);

// //   if (error) throw error;

// //   return {
// //     data,
// //     pagination: {
// //       page,
// //       totalPages: Math.ceil((count || 0) / limit),
// //       total: count || 0,
// //       hasPrev: page > 1,
// //       hasNext: page < Math.ceil((count || 0) / limit)
// //     }
// //   };
// // };

// // const crudEvent = async (method: 'CREATE' | 'UPDATE' | 'DELETE', eventData: any) => {
// //   if (method === 'CREATE') {
// //     const { error } = await supabase.from('events').insert([eventData]);
// //     if (error) throw error;
// //   } else if (method === 'UPDATE') {
// //     const { id, ...updateData } = eventData;
// //     const { error } = await supabase.from('events').update(updateData).eq('id', id);
// //     if (error) throw error;
// //   } else if (method === 'DELETE') {
// //     const { error } = await supabase.from('events').delete().eq('id', eventData.id);
// //     if (error) throw error;
// //   }
// // };

// // const EventForm = ({ event, onFormSubmit, onCancel, posts }: {
// //   event?: Event | null,
// //   onFormSubmit: (data: EventFormInputs) => void,
// //   onCancel: () => void,
// //   posts: PostSelection[]
// // }) => {
// //   const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
// //   const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<EventFormInputs>({
// //     defaultValues: event ? {
// //       ...event,
// //       start_at: event.start_at ? new Date(event.start_at).toISOString().slice(0, 16) : '',
// //       end_at: event.end_at ? new Date(event.end_at).toISOString().slice(0, 16) : ''
// //     } : {
// //       cta_post_id: '',
// //       is_paid: false
// //     },
// //     resolver: zodResolver(EventSchema)
// //   });
// //   const isPaid = useWatch({ control, name: 'is_paid' });

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
// //       <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-full overflow-y-auto">
// //         <h2 className="text-2xl font-bold mb-4">{event ? 'Edit Event' : 'Create New Event'}</h2>
// //         <div className="border-b border-gray-200 mb-4">
// //           <nav className="-mb-px flex space-x-8">
// //             <button type="button" onClick={() => setActiveTab('en')}
// //               className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'en' ? 'border-primary text-primary' : 'border-transparent text-gray-500'
// //                 }`}>
// //               English
// //             </button>
// //             <button type="button" onClick={() => setActiveTab('zh')}
// //               className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'zh' ? 'border-primary text-primary' : 'border-transparent text-gray-500'
// //                 }`}>
// //               Chinese
// //             </button>
// //           </nav>
// //         </div>
// //         <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
// //           <div className={activeTab === 'en' ? 'block' : 'hidden'}>
// //             <div className="space-y-4">
// //               <div>
// //                 <label>Title (English)</label>
// //                 <input {...register('title_en')} className="mt-1 w-full p-2 border rounded-md" />
// //                 {errors.title_en && <p className="text-sm text-system-danger">{errors.title_en.message}</p>}
// //               </div>
// //               <div>
// //                 <label>Description (English)</label>
// //                 <textarea {...register('description_en')} rows={4} className="mt-1 w-full p-2 border rounded-md" />
// //               </div>
// //             </div>
// //           </div>
// //           <div className={activeTab === 'zh' ? 'block' : 'hidden'}>
// //             <div className="space-y-4">
// //               <div>
// //                 <label>Title (Chinese)</label>
// //                 <input {...register('title_zh_hant')} className="mt-1 w-full p-2 border rounded-md" />
// //                 {errors.title_zh_hant && <p className="text-sm text-system-danger">{errors.title_zh_hant.message}</p>}
// //               </div>
// //               <div>
// //                 <label>Description (Chinese)</label>
// //                 <textarea {...register('description_zh_hant')} rows={4} className="mt-1 w-full p-2 border rounded-md" />
// //               </div>
// //             </div>
// //           </div>
// //           <hr className="my-6" />
// //           <div>
// //             <label>URL Slug</label>
// //             <input {...register('slug')} className="mt-1 w-full p-2 border rounded-md" />
// //             {errors.slug && <p className="text-sm text-system-danger">{errors.slug.message}</p>}
// //           </div>
// //           <div>
// //             <label>Banner Image URL</label>
// //             <input {...register('banner_url')} className="mt-1 w-full p-2 border rounded-md" />
// //             {errors.banner_url && <p className="text-sm text-system-danger">{errors.banner_url.message}</p>}
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <div>
// //               <label>Start Time</label>
// //               <input type="datetime-local" {...register('start_at')} className="mt-1 w-full p-2 border rounded-md" />
// //               {errors.start_at && <p className="text-sm text-system-danger">{errors.start_at.message}</p>}
// //             </div>
// //             <div>
// //               <label>End Time</label>
// //               <input type="datetime-local" {...register('end_at')} className="mt-1 w-full p-2 border rounded-md" />
// //               {errors.end_at && <p className="text-sm text-system-danger">{errors.end_at.message}</p>}
// //             </div>
// //           </div>
// //           <div>
// //             <label>Location</label>
// //             <input {...register('location')} className="mt-1 w-full p-2 border rounded-md" />
// //           </div>
// //           <hr />
// //           <div className="space-y-4 p-4 border rounded-md bg-neutral-50">
// //             <h3 className="font-semibold text-lg">Payment Details</h3>
// //             <div className="flex items-center gap-2">
// //               <input type="checkbox" {...register('is_paid')} className="h-4 w-4 rounded" />
// //               <label>This is a paid event</label>
// //             </div>
// //             {isPaid && (
// //               <div className="space-y-4 pt-4 border-t">
// //                 <div>
// //                   <label className="block text-sm font-medium">Price (NTD)</label>
// //                   <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="mt-1 w-full p-2 border rounded-md" />
// //                   {errors.price && <p className="text-sm text-system-danger">{errors.price.message}</p>}
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //           <hr />
// //           <div className="space-y-4 p-4 border rounded-md bg-neutral-50">
// //             <h3 className="font-semibold text-lg">Call to Action (Optional)</h3>
// //             <div>
// //               <label className="block text-sm font-medium">Link to Post</label>
// //               <select {...register('cta_post_id')} className="mt-1 w-full p-2 border rounded-md bg-white">
// //                 <option value="">None</option>
// //                 {posts?.map(post => (
// //                   <option key={post.id} value={post.id}>{post.title_en}</option>
// //                 ))}
// //               </select>
// //             </div>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div>
// //                 <label>Button Text (English)</label>
// //                 <input {...register('cta_text_en')} placeholder="e.g., Read More Here!" className="mt-1 w-full p-2 border rounded-md" />
// //               </div>
// //               <div>
// //                 <label>Button Text (Chinese)</label>
// //                 <input {...register('cta_text_zh_hant')} placeholder="e.g., 閱讀更多" className="mt-1 w-full p-2 border rounded-md" />
// //               </div>
// //             </div>
// //           </div>
// //           <div className="flex justify-end space-x-4 pt-4">
// //             <button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">
// //               Cancel
// //             </button>
// //             <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">
// //               {isSubmitting ? 'Saving...' : 'Save Event'}
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export const EventsManagementPage = () => {
// //   const [isFormOpen, setIsFormOpen] = useState(false);
// //   const [editingEvent, setEditingEvent] = useState<Event | null>(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const queryClient = useQueryClient();
// //   const { user } = useAuth();

// //   const { data: eventsData, isLoading } = useQuery({
// //     queryKey: ['cms_events', currentPage, searchTerm],
// //     queryFn: () => getCMSEvents(currentPage, 20, searchTerm),
// //     enabled: !!user,
// //   });

// //   const { data: postsData = [] } = useQuery({
// //     queryKey: ['cms_posts'],
// //     queryFn: async () => {
// //       const { data, error } = await supabase.from('posts').select('id, title_en').order('created_at', { ascending: false });
// //       if (error) throw error;
// //       return data as PostSelection[];
// //     },
// //     enabled: !!user,
// //   });

// //   const mutation = useMutation({
// //     mutationFn: async (eventData: EventFormInputs) => {
// //       if (!user) throw new Error("You must be logged in.");

// //       const dataToSubmit = {
// //         ...eventData,
// //         start_at: new Date(eventData.start_at).toISOString(),
// //         end_at: new Date(eventData.end_at).toISOString(),
// //         cta_post_id: eventData.cta_post_id || null,
// //         price: eventData.is_paid ? eventData.price : null,
// //         ...(editingEvent ? { id: editingEvent.id } : { created_by: user.id })
// //       };

// //       return crudEvent(editingEvent ? 'UPDATE' : 'CREATE', dataToSubmit);
// //     },
// //     onSuccess: () => {
// //       toast.success(`Event ${editingEvent ? 'updated' : 'created'} successfully!`);
// //       queryClient.invalidateQueries({ queryKey: ['cms_events'] });
// //       setIsFormOpen(false);
// //       setEditingEvent(null);
// //     },
// //     onError: (error: Error) => {
// //       toast.error(error.message);
// //     }
// //   });

// //   const deleteMutation = useMutation({
// //     mutationFn: async (eventToDelete: Event) => {
// //       return crudEvent('DELETE', { id: eventToDelete.id });
// //     },
// //     onSuccess: () => {
// //       toast.success('Event deleted.');
// //       queryClient.invalidateQueries({ queryKey: ['cms_events'] });
// //     },
// //     onError: (error: Error) => {
// //       toast.error(error.message);
// //     },
// //   });

// //   const handleSearch = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setCurrentPage(1);
// //     queryClient.invalidateQueries({ queryKey: ['cms_events'] });
// //   };

// //   const handlePageChange = (newPage: number) => {
// //     setCurrentPage(newPage);
// //   };

// //   const events = eventsData?.data || [];
// //   const posts = postsData;
// //   const pagination = eventsData?.pagination;

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h1 className="text-3xl font-bold">Manage Events</h1>
// //         <button
// //           onClick={() => { setEditingEvent(null); setIsFormOpen(true); }}
// //           className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold"
// //         >
// //           Create New Event
// //         </button>
// //       </div>

// //       {/* Search */}
// //       <form onSubmit={handleSearch} className="flex gap-4">
// //         <input
// //           type="text"
// //           placeholder="Search events by title or slug..."
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //           className="flex-1 p-2 border rounded-md"
// //         />
// //         <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-hover font-semibold">
// //           Search
// //         </button>
// //       </form>

// //       {isFormOpen && (
// //         <EventForm
// //           event={editingEvent}
// //           onFormSubmit={(data) => mutation.mutate(data)}
// //           onCancel={() => { setIsFormOpen(false); setEditingEvent(null); }}
// //           posts={posts}
// //         />
// //       )}

// //       <div className="bg-white shadow-md rounded-lg overflow-x-auto">
// //         <table className="min-w-full responsive-table">
// //           <thead className="bg-neutral-100">
// //             <tr>
// //               <th className="p-4 text-left font-semibold">Title (English)</th>
// //               <th className="p-4 text-left font-semibold">Date</th>
// //               <th className="p-4 text-left font-semibold">Status</th>
// //               <th className="p-4 text-right font-semibold">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {isLoading ? (
// //               <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
// //             ) : events?.map((event: any) => {
// //               const isPast = new Date(event.start_at) < new Date();
// //               return (
// //                 <tr key={event.id}>
// //                   <td data-label="Title">{event.title_en}</td>
// //                   <td data-label="Date">{new Date(event.start_at).toLocaleDateString()}</td>
// //                   <td data-label="Status">
// //                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isPast ? 'bg-neutral-200 text-neutral-800' : 'bg-green-100 text-green-800'
// //                       }`}>
// //                       {isPast ? 'Past' : 'Upcoming'}
// //                     </span>
// //                   </td>
// //                   <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
// //                     <Link
// //                       to={`/cms/events/${event.id}/registrations`}
// //                       className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600 inline-block w-full md:w-auto"
// //                     >
// //                       Registrants
// //                     </Link>
// //                     <button
// //                       onClick={() => { setEditingEvent(event); setIsFormOpen(true); }}
// //                       className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover w-full md:w-auto"
// //                     >
// //                       Edit
// //                     </button>
// //                     <button
// //                       onClick={() => window.confirm('Are you sure you want to delete this event?') && deleteMutation.mutate(event)}
// //                       className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700 w-full md:w-auto"
// //                     >
// //                       Delete
// //                     </button>
// //                   </td>
// //                 </tr>
// //               )
// //             })}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Pagination */}
// //       {pagination && pagination.totalPages > 1 && (
// //         <Pagination
// //           currentPage={currentPage}
// //           totalPages={pagination.totalPages}
// //           onPageChange={handlePageChange}
// //         />
// //       )}
// //     </div>
// //   );
// // };


// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase, useAuth } from '../../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import { useState } from 'react';
// import { useForm, useWatch } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Link } from 'react-router-dom';
// import { Pagination } from '../../components/Pagination';

// const EventSchema = z.object({
//   title_en: z.string().min(3, 'English title is required'),
//   title_zh_hant: z.string().min(1, 'Chinese title is required'),
//   description_en: z.string().optional(),
//   description_zh_hant: z.string().optional(),
//   slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/),
//   banner_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
//   location: z.string().optional(),
//   start_at: z.string().min(1, 'Start date is required'),
//   end_at: z.string().min(1, 'End date is required'),
//   cta_post_id: z.string().optional(),
//   cta_text_en: z.string().optional(),
//   cta_text_zh_hant: z.string().optional(),
//   is_paid: z.boolean(),
//   price: z.number().optional().nullable(),
// }).refine((data) => {
//   // If it's a paid event, price must be provided and greater than 0
//   if (data.is_paid) {
//     return data.price != null && data.price > 0;
//   }
//   return true;
// }, {
//   message: "Price is required for paid events and must be greater than 0",
//   path: ["price"]
// });

// type EventFormInputs = z.infer<typeof EventSchema>;
// type Event = EventFormInputs & { id: string; created_by: string; start_at: string; };
// type PostSelection = { id: string; title_en: string | null; };

// // API functions getCMSEvents dan crudEvent dihapus karena sudah digantikan oleh Edge Functions

// const EventForm = ({ event, onFormSubmit, onCancel, posts }: {
//   event?: Event | null,
//   onFormSubmit: (data: EventFormInputs) => void,
//   onCancel: () => void,
//   posts: PostSelection[]
// }) => {
//   const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
//   const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<EventFormInputs>({
//     defaultValues: event ? {
//       ...event,
//       start_at: event.start_at ? new Date(event.start_at).toISOString().slice(0, 16) : '',
//       end_at: event.end_at ? new Date(event.end_at).toISOString().slice(0, 16) : ''
//     } : {
//       cta_post_id: '',
//       is_paid: false
//     },
//     resolver: zodResolver(EventSchema)
//   });
//   const isPaid = useWatch({ control, name: 'is_paid' });

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-full overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4">{event ? 'Edit Event' : 'Create New Event'}</h2>
//         <div className="border-b border-gray-200 mb-4">
//           <nav className="-mb-px flex space-x-8">
//             <button type="button" onClick={() => setActiveTab('en')}
//               className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'en' ? 'border-primary text-primary' : 'border-transparent text-gray-500'
//                 }`}>
//               English
//             </button>
//             <button type="button" onClick={() => setActiveTab('zh')}
//               className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'zh' ? 'border-primary text-primary' : 'border-transparent text-gray-500'
//                 }`}>
//               Chinese
//             </button>
//           </nav>
//         </div>
//         <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
//           <div className={activeTab === 'en' ? 'block' : 'hidden'}>
//             <div className="space-y-4">
//               <div>
//                 <label>Title (English)</label>
//                 <input {...register('title_en')} className="mt-1 w-full p-2 border rounded-md" />
//                 {errors.title_en && <p className="text-sm text-system-danger">{errors.title_en.message}</p>}
//               </div>
//               <div>
//                 <label>Description (English)</label>
//                 <textarea {...register('description_en')} rows={4} className="mt-1 w-full p-2 border rounded-md" />
//               </div>
//             </div>
//           </div>
//           <div className={activeTab === 'zh' ? 'block' : 'hidden'}>
//             <div className="space-y-4">
//               <div>
//                 <label>Title (Chinese)</label>
//                 <input {...register('title_zh_hant')} className="mt-1 w-full p-2 border rounded-md" />
//                 {errors.title_zh_hant && <p className="text-sm text-system-danger">{errors.title_zh_hant.message}</p>}
//               </div>
//               <div>
//                 <label>Description (Chinese)</label>
//                 <textarea {...register('description_zh_hant')} rows={4} className="mt-1 w-full p-2 border rounded-md" />
//               </div>
//             </div>
//           </div>
//           <hr className="my-6" />
//           <div>
//             <label>URL Slug</label>
//             <input {...register('slug')} className="mt-1 w-full p-2 border rounded-md" />
//             {errors.slug && <p className="text-sm text-system-danger">{errors.slug.message}</p>}
//           </div>
//           <div>
//             <label>Banner Image URL</label>
//             <input {...register('banner_url')} className="mt-1 w-full p-2 border rounded-md" />
//             {errors.banner_url && <p className="text-sm text-system-danger">{errors.banner_url.message}</p>}
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label>Start Time</label>
//               <input type="datetime-local" {...register('start_at')} className="mt-1 w-full p-2 border rounded-md" />
//               {errors.start_at && <p className="text-sm text-system-danger">{errors.start_at.message}</p>}
//             </div>
//             <div>
//               <label>End Time</label>
//               <input type="datetime-local" {...register('end_at')} className="mt-1 w-full p-2 border rounded-md" />
//               {errors.end_at && <p className="text-sm text-system-danger">{errors.end_at.message}</p>}
//             </div>
//           </div>
//           <div>
//             <label>Location</label>
//             <input {...register('location')} className="mt-1 w-full p-2 border rounded-md" />
//           </div>
//           <hr />
//           <div className="space-y-4 p-4 border rounded-md bg-neutral-50">
//             <h3 className="font-semibold text-lg">Payment Details</h3>
//             <div className="flex items-center gap-2">
//               <input type="checkbox" {...register('is_paid')} className="h-4 w-4 rounded" />
//               <label>This is a paid event</label>
//             </div>
//             {isPaid && (
//               <div className="space-y-4 pt-4 border-t">
//                 <div>
//                   <label className="block text-sm font-medium">Price (NTD)</label>
//                   <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="mt-1 w-full p-2 border rounded-md" />
//                   {errors.price && <p className="text-sm text-system-danger">{errors.price.message}</p>}
//                 </div>
//               </div>
//             )}
//           </div>
//           <hr />
//           <div className="space-y-4 p-4 border rounded-md bg-neutral-50">
//             <h3 className="font-semibold text-lg">Call to Action (Optional)</h3>
//             <div>
//               <label className="block text-sm font-medium">Link to Post</label>
//               <select {...register('cta_post_id')} className="mt-1 w-full p-2 border rounded-md bg-white">
//                 <option value="">None</option>
//                 {posts?.map(post => (
//                   <option key={post.id} value={post.id}>{post.title_en}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label>Button Text (English)</label>
//                 <input {...register('cta_text_en')} placeholder="e.g., Read More Here!" className="mt-1 w-full p-2 border rounded-md" />
//               </div>
//               <div>
//                 <label>Button Text (Chinese)</label>
//                 <input {...register('cta_text_zh_hant')} placeholder="e.g., 閱讀更多" className="mt-1 w-full p-2 border rounded-md" />
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-end space-x-4 pt-4">
//             <button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">
//               Cancel
//             </button>
//             <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">
//               {isSubmitting ? 'Saving...' : 'Save Event'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export const EventsManagementPage = () => {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingEvent, setEditingEvent] = useState<Event | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');
//   const queryClient = useQueryClient();
//   const { user } = useAuth();

//   const { data, isLoading } = useQuery({
//     queryKey: ['cms_events_and_posts', currentPage, searchTerm],
//     queryFn: async () => {
//       const { data, error } = await supabase.functions.invoke('get-cms-events', {
//         body: {
//           page: currentPage,
//           limit: 20,
//           search: searchTerm
//         }
//       });

//       if (error) throw new Error(error.message);
//       // data sekarang berisi { events, posts, pagination }
//       return data;
//     },
//     enabled: !!user,
//   });

//   // Ambil data dari hasil query tunggal
//   const events = data?.events || [];
//   const posts = data?.posts || [];
//   const pagination = data?.pagination;

//   const mutation = useMutation({
//     mutationFn: async (eventData: EventFormInputs) => {
//       if (!user) throw new Error("You must be logged in.");

//       const dataToSubmit = {
//         ...eventData,
//         start_at: new Date(eventData.start_at).toISOString(),
//         end_at: new Date(eventData.end_at).toISOString(),
//         cta_post_id: eventData.cta_post_id || null,
//         price: eventData.is_paid ? eventData.price : null,
//         ...(editingEvent ? { id: editingEvent.id } : { created_by: user.id })
//       };

//       // Panggil edge function 'crud-event'
//       const { error } = await supabase.functions.invoke('crud-event', {
//         body: {
//           method: editingEvent ? 'UPDATE' : 'CREATE',
//           eventData: dataToSubmit
//         }
//       });

//       if (error) throw new Error(error.message);
//     },
//     onSuccess: () => {
//       toast.success(`Event ${editingEvent ? 'updated' : 'created'} successfully!`);
//       queryClient.invalidateQueries({ queryKey: ['cms_events_and_posts'] });
//       setIsFormOpen(false);
//       setEditingEvent(null);
//     },
//     onError: (error: Error) => {
//       toast.error(error.message);
//     }
//   });

//   const deleteMutation = useMutation({
//     mutationFn: async (eventToDelete: Event) => {
//       // Panggil edge function 'crud-event'
//       const { error } = await supabase.functions.invoke('crud-event', {
//         body: {
//           method: 'DELETE',
//           eventData: { id: eventToDelete.id }
//         }
//       });

//       if (error) throw new Error(error.message);
//     },
//     onSuccess: () => {
//       toast.success('Event deleted.');
//       queryClient.invalidateQueries({ queryKey: ['cms_events_and_posts'] });
//     },
//     onError: (error: Error) => {
//       // Ini akan menangkap error dari edge function, 
//       // termasuk "Cannot delete event with existing registrations"
//       toast.error(error.message);
//     },
//   });

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     setCurrentPage(1);
//     // Invalidate query yang benar
//     queryClient.invalidateQueries({ queryKey: ['cms_events_and_posts'] });
//   };

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Manage Events</h1>
//         <button
//           onClick={() => { setEditingEvent(null); setIsFormOpen(true); }}
//           className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold"
//         >
//           Create New Event
//         </button>
//       </div>

//       {/* Search */}
//       <form onSubmit={handleSearch} className="flex gap-4">
//         <input
//           type="text"
//           placeholder="Search events by title or slug..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="flex-1 p-2 border rounded-md"
//         />
//         <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-hover font-semibold">
//           Search
//         </button>
//       </form>

//       {isFormOpen && (
//         <EventForm
//           event={editingEvent}
//           onFormSubmit={(data) => mutation.mutate(data)}
//           onCancel={() => { setIsFormOpen(false); setEditingEvent(null); }}
//           posts={posts}
//         />
//       )}

//       <div className="bg-white shadow-md rounded-lg overflow-x-auto">
//         <table className="min-w-full responsive-table">
//           <thead className="bg-neutral-100">
//             <tr>
//               <th className="p-4 text-left font-semibold">Title (English)</th>
//               <th className="p-4 text-left font-semibold">Date</th>
//               <th className="p-4 text-left font-semibold">Status</th>
//               <th className="p-4 text-right font-semibold">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoading ? (
//               <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
//             ) : events?.map((event: any) => {
//               const isPast = new Date(event.start_at) < new Date();
//               return (
//                 <tr key={event.id}>
//                   <td data-label="Title">{event.title_en}</td>
//                   <td data-label="Date">{new Date(event.start_at).toLocaleDateString()}</td>
//                   <td data-label="Status">
//                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isPast ? 'bg-neutral-200 text-neutral-800' : 'bg-green-100 text-green-800'
//                       }`}>
//                       {isPast ? 'Past' : 'Upcoming'}
//                     </span>
//                   </td>
//                   <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
//                     <Link
//                       to={`/cms/events/${event.id}/registrations`}
//                       className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600 inline-block w-full md:w-auto"
//                     >
//                       Registrants
//                     </Link>
//                     <button
//                       onClick={() => { setEditingEvent(event); setIsFormOpen(true); }}
//                       className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover w-full md:w-auto"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => window.confirm('Are you sure you want to delete this event?') && deleteMutation.mutate(event)}
//                       className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700 w-full md:w-auto"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {pagination && pagination.totalPages > 1 && (
//         <Pagination
//           currentPage={currentPage}
//           totalPages={pagination.totalPages}
//           onPageChange={handlePageChange}
//         />
//       )}
//     </div>
//   );
// };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState, useCallback, useEffect } from 'react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Pagination } from '../../components/Pagination';
import clsx from 'clsx';
import { uploadImageToSupabase } from '../../utils/storage';

// Skema untuk Event (banner_url dihapus dari sini, akan di-handle manual)
const EventSchema = z.object({
  title_en: z.string().min(3, 'English title is required'),
  title_zh_hant: z.string().min(1, 'Chinese title is required'),
  description_en: z.string().optional(),
  description_zh_hant: z.string().optional(),
  slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/),
  location: z.string().optional(),
  start_at: z.string().min(1, 'Start date is required'),
  end_at: z.string().min(1, 'End date is required'),
  cta_post_id: z.string().optional(),
  cta_text_en: z.string().optional(),
  cta_text_zh_hant: z.string().optional(),
  is_paid: z.boolean(),
  price: z.number().optional().nullable(),
  // banner_url dihapus dari Zod, karena bukan lagi input form
}).refine((data) => {
  if (data.is_paid) {
    return data.price != null && data.price > 0;
  }
  return true;
}, {
  message: "Price is required for paid events and must be greater than 0",
  path: ["price"]
});

type EventFormInputs = z.infer<typeof EventSchema>;
// Tambahkan banner_url kembali ke tipe Event utama
type Event = EventFormInputs & { id: string; created_by: string; start_at: string; banner_url: string | null; };
type PostSelection = { id: string; title_en: string | null; };

// --- KOMPONEN UPLOADER BANNER BARU (VERSI SIMPLE) ---
const EventBannerUploader = ({ existingBanner, onFileChange }: {
  existingBanner: string | null;
  onFileChange: (file: File | null, newUrl: string | null) => void;
}) => {
  const [newFile, setNewFile] = useState<File | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(existingBanner);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    onFileChange(newFile, currentUrl);
  }, [newFile, currentUrl, onFileChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0]);
      setCurrentUrl(null); // Hapus gambar lama jika ada
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setNewFile(e.dataTransfer.files[0]);
      setCurrentUrl(null); // Hapus gambar lama jika ada
      e.dataTransfer.clearData();
    }
  }, []);

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };

  const handleRemoveImage = () => {
    setNewFile(null);
    setCurrentUrl(null);
  };

  const previewUrl = newFile ? URL.createObjectURL(newFile) : currentUrl;

  return (
    <div>
      <label className="block text-sm font-medium">Event Banner</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragEvents}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        className={clsx('mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors', isDragging ? 'border-primary bg-blue-50' : 'border-border')}
      >
        <input id="banner-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <label htmlFor="banner-upload" className="cursor-pointer">
          <p className="text-text-secondary">Drag & drop banner or click to browse</p>
        </label>
      </div>
      {previewUrl && (
        <div className="mt-4 relative w-full aspect-[16/9] max-w-sm">
          <img src={previewUrl} className="w-full h-full object-cover rounded-md border" />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};


// --- EVENT FORM (DIUPDATE) ---
const EventForm = ({ event, onFormSubmit, onCancel, posts }: {
  event?: Event | null,
  onFormSubmit: (data: EventFormInputs, bannerFile: File | null, existingBannerUrl: string | null) => void,
  onCancel: () => void,
  posts: PostSelection[]
}) => {
  const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [existingBannerUrl, setExistingBannerUrl] = useState<string | null>(event?.banner_url || null);

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<EventFormInputs>({
    defaultValues: event ? {
      ...event,
      start_at: event.start_at ? new Date(event.start_at).toISOString().slice(0, 16) : '',
      end_at: event.end_at ? new Date(event.end_at).toISOString().slice(0, 16) : ''
    } : {
      cta_post_id: '',
      is_paid: false
    },
    resolver: zodResolver(EventSchema)
  });
  const isPaid = useWatch({ control, name: 'is_paid' });

  // Kirim data form DAN file banner saat submit
  const onSubmit: SubmitHandler<EventFormInputs> = (data) => {
    onFormSubmit(data, bannerFile, existingBannerUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{event ? 'Edit Event' : 'Create New Event'}</h2>
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8">
            <button type="button" onClick={() => setActiveTab('en')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'en' ? 'border-primary text-primary' : 'border-transparent text-gray-500'
                }`}>
              English
            </button>
            <button type="button" onClick={() => setActiveTab('zh')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'zh' ? 'border-primary text-primary' : 'border-transparent text-gray-500'
                }`}>
              Chinese
            </button>
          </nav>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className={activeTab === 'en' ? 'block' : 'hidden'}>
            <div className="space-y-4">
              <div>
                <label>Title (English)</label>
                <input {...register('title_en')} className="mt-1 w-full p-2 border rounded-md" />
                {errors.title_en && <p className="text-sm text-system-danger">{errors.title_en.message}</p>}
              </div>
              <div>
                <label>Description (English)</label>
                <textarea {...register('description_en')} rows={4} className="mt-1 w-full p-2 border rounded-md" />
              </div>
            </div>
          </div>
          <div className={activeTab === 'zh' ? 'block' : 'hidden'}>
            <div className="space-y-4">
              <div>
                <label>Title (Chinese)</label>
                <input {...register('title_zh_hant')} className="mt-1 w-full p-2 border rounded-md" />
                {errors.title_zh_hant && <p className="text-sm text-system-danger">{errors.title_zh_hant.message}</p>}
              </div>
              <div>
                <label>Description (Chinese)</label>
                <textarea {...register('description_zh_hant')} rows={4} className="mt-1 w-full p-2 border rounded-md" />
              </div>
            </div>
          </div>
          <hr className="my-6" />
          <div>
            <label>URL Slug</label>
            <input {...register('slug')} className="mt-1 w-full p-2 border rounded-md" />
            {errors.slug && <p className="text-sm text-system-danger">{errors.slug.message}</p>}
          </div>

          {/* --- INPUT URL DIGANTI DENGAN UPLOADER --- */}
          <EventBannerUploader
            existingBanner={existingBannerUrl}
            onFileChange={(file, url) => {
              setBannerFile(file);
              setExistingBannerUrl(url);
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Start Time</label>
              <input type="datetime-local" {...register('start_at')} className="mt-1 w-full p-2 border rounded-md" />
              {errors.start_at && <p className="text-sm text-system-danger">{errors.start_at.message}</p>}
            </div>
            <div>
              <label>End Time</label>
              <input type="datetime-local" {...register('end_at')} className="mt-1 w-full p-2 border rounded-md" />
              {errors.end_at && <p className="text-sm text-system-danger">{errors.end_at.message}</p>}
            </div>
          </div>
          <div>
            <label>Location</label>
            <input {...register('location')} className="mt-1 w-full p-2 border rounded-md" />
          </div>
          <hr />
          <div className="space-y-4 p-4 border rounded-md bg-neutral-50">
            <h3 className="font-semibold text-lg">Payment Details</h3>
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register('is_paid')} className="h-4 w-4 rounded" />
              <label>This is a paid event</label>
            </div>
            {isPaid && (
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium">Price (NTD)</label>
                  <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="mt-1 w-full p-2 border rounded-md" />
                  {errors.price && <p className="text-sm text-system-danger">{errors.price.message}</p>}
                </div>
              </div>
            )}
          </div>
          <hr />
          <div className="space-y-4 p-4 border rounded-md bg-neutral-50">
            <h3 className="font-semibold text-lg">Call to Action (Optional)</h3>
            <div>
              <label className="block text-sm font-medium">Link to Post</label>
              <select {...register('cta_post_id')} className="mt-1 w-full p-2 border rounded-md bg-white">
                <option value="">None</option>
                {posts?.map(post => (
                  <option key={post.id} value={post.id}>{post.title_en}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Button Text (English)</label>
                <input {...register('cta_text_en')} placeholder="e.g., Read More Here!" className="mt-1 w-full p-2 border rounded-md" />
              </div>
              <div>
                <label>Button Text (Chinese)</label>
                <input {...register('cta_text_zh_hant')} placeholder="e.g., 閱讀更多" className="mt-1 w-full p-2 border rounded-md" />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- HALAMAN UTAMA (DIUPDATE) ---
export const EventsManagementPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const { session } = useAuth(); // <-- Ganti ke session

  const { data, isLoading } = useQuery({
    queryKey: ['cms_events_and_posts', currentPage, searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-cms-events', {
        body: {
          page: currentPage,
          limit: 20,
          search: searchTerm
        }
      });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!session, // <-- Ganti ke session
  });

  const events = data?.events || [];
  const posts = data?.posts || [];
  const pagination = data?.pagination;

  // --- MUTASI (DIUPDATE UNTUK UPLOAD) ---
  const mutation = useMutation({
    mutationFn: async ({ eventData, bannerFile, existingBannerUrl }: {
      eventData: EventFormInputs,
      bannerFile: File | null,
      existingBannerUrl: string | null
    }) => {
      if (!session) throw new Error("You must be logged in.");

      let finalBannerUrl: string | null = existingBannerUrl;

      // 1. Upload file baru jika ada
      if (bannerFile) {
        toast.loading('Uploading banner image...');
        try {
          const { publicUrl } = await uploadImageToSupabase(bannerFile, {
            folder: 'events/banners',
            compression: {
              maxWidth: 1920,
              maxHeight: 1080,
              quality: 0.82,
              convertTo: 'image/webp',
              maxOutputBytes: 100 * 1024,
            },
            cacheControl: '86400',
          });
          finalBannerUrl = publicUrl;
        } finally {
          toast.dismiss();
        }
      }

      // 2. Siapkan data untuk dikirim ke edge function
      const dataToSubmit = {
        ...eventData,
        banner_url: finalBannerUrl, // <-- Masukkan URL banner-nya
        start_at: new Date(eventData.start_at).toISOString(),
        end_at: new Date(eventData.end_at).toISOString(),
        // ========================================================
        // INI PERBAIKANNYA: ganti cta_event_id ke cta_post_id
        // ========================================================
        cta_post_id: eventData.cta_post_id || null,
        price: eventData.is_paid ? eventData.price : null,
        ...(editingEvent ? { id: editingEvent.id } : { created_by: session.user.id })
      };

      // 3. Panggil edge function 'crud-event'
      const { error } = await supabase.functions.invoke('crud-event', {
        body: {
          method: editingEvent ? 'UPDATE' : 'CREATE',
          eventData: dataToSubmit
        }
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success(`Event ${editingEvent ? 'updated' : 'created'} successfully!`);
      queryClient.invalidateQueries({ queryKey: ['cms_events_and_posts'] });
      setIsFormOpen(false);
      setEditingEvent(null);
    },
    onError: (error: Error) => {
      toast.dismiss(); // Hapus toast 'loading' jika ada error
      toast.error(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (eventToDelete: Event) => {
      if (!session) throw new Error("Not authenticated");
      const { error } = await supabase.functions.invoke('crud-event', {
        body: {
          method: 'DELETE',
          eventData: { id: eventToDelete.id }
        }
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success('Event deleted.');
      queryClient.invalidateQueries({ queryKey: ['cms_events_and_posts'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    queryClient.invalidateQueries({ queryKey: ['cms_events_and_posts'] });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <button
          onClick={() => { setEditingEvent(null); setIsFormOpen(true); }}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold"
        >
          Create New Event
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4">
        <input
          type="text"
          placeholder="Search events by title or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded-md"
        />
        <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-hover font-semibold">
          Search
        </button>
      </form>

      {isFormOpen && (
        <EventForm
          event={editingEvent}
          onFormSubmit={(formData, file, url) => mutation.mutate({ eventData: formData, bannerFile: file, existingBannerUrl: url })}
          onCancel={() => { setIsFormOpen(false); setEditingEvent(null); }}
          posts={posts}
        />
      )}

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
            ) : events?.map((event: any) => {
              const isPast = new Date(event.start_at) < new Date();
              return (
                <tr key={event.id}>
                  <td data-label="Title">{event.title_en}</td>
                  <td data-label="Date">{new Date(event.start_at).toLocaleDateString()}</td>
                  <td data-label="Status">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isPast ? 'bg-neutral-200 text-neutral-800' : 'bg-green-100 text-green-800'
                      }`}>
                      {isPast ? 'Past' : 'Upcoming'}
                    </span>
                  </td>
                  <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
                    <Link
                      to={`/cms/events/${event.id}/registrations`}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600 inline-block w-full md:w-auto"
                    >
                      Registrants
                    </Link>
                    <button
                      onClick={() => { setEditingEvent(event); setIsFormOpen(true); }}
                      className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover w-full md:w-auto"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => window.confirm('Are you sure?') && deleteMutation.mutate(event)}
                      className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700 w-full md:w-auto"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};