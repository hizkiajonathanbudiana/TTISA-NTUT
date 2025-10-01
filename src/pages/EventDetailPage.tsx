// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import { Link, useParams, useNavigate } from 'react-router-dom';
// // import { supabase, useAuth } from '../contexts/AuthContext';
// // import toast from 'react-hot-toast';
// // import { useTranslation } from '../contexts/LanguageContext';
// // import { motion } from 'framer-motion';
// // import { useForm, type SubmitHandler } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { z } from 'zod';
// // import { useEffect, useState } from 'react';

// // // Types
// // type EventDetails = { id: string; slug: string; banner_url: string | null; start_at: string; end_at: string; location: string | null; user_registration_status: 'pending' | 'accepted' | 'rejected' | null; user_attendance_id: string | null; title_en: string | null; title_zh_hant: string | null; description_en: string | null; description_zh_hant: string | null; };
// // type Review = { id: string; rating: number; comment: string | null; created_at: string; english_name: string | null; avatar_url: string | null; };
// // const ReviewSchema = z.object({ rating: z.number().min(1, 'Please select a rating').max(5), comment: z.string().optional() });
// // type ReviewFormInputs = z.infer<typeof ReviewSchema>;

// // // Registration Button Sub-component
// // const RegistrationButton = ({ event }: { event: EventDetails }) => {
// //   const { user } = useAuth(); const navigate = useNavigate(); const queryClient = useQueryClient(); const { t } = useTranslation();
// //   const mutation = useMutation({ mutationFn: async () => { if (!user) throw new Error('You must be logged in to register.'); const { error } = await supabase.from('event_registrations').insert({ event_id: event.id, user_id: user.id }); if (error) throw error; }, onSuccess: () => { toast.success('Registration submitted! Awaiting approval.'); queryClient.invalidateQueries({ queryKey: ['event', event.slug] }); }, onError: (error: any) => { if (error.code === '23505') { toast.error('You are already registered for this event.'); } else { toast.error(error.message); } }, });
// //   if (!user) { return <button onClick={() => navigate('/login')} className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-hover">{t('nav.login')} to Register</button>; }
// //   if (new Date(event.start_at) < new Date()) { return <div className="w-full px-6 py-3 bg-neutral-200 text-text-secondary font-semibold rounded-lg text-center">Event Has Ended</div>; }
// //   switch (event.user_registration_status) { case 'pending': return <div className="w-full px-6 py-3 bg-yellow-400 text-yellow-800 font-semibold rounded-lg text-center">Registration Pending Approval</div>; case 'accepted': return <div className="w-full px-6 py-3 bg-secondary text-white font-semibold rounded-lg text-center">Registration Accepted!</div>; case 'rejected': return <div className="w-full px-6 py-3 bg-system-danger text-white font-semibold rounded-lg text-center">Registration Rejected</div>; default: return <button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-hover disabled:opacity-50">{mutation.isPending ? 'Registering...' : 'Register for this Event'}</button>; }
// // };

// // // Review Form Sub-component
// // const ReviewForm = ({ attendanceId, eventId, eventSlug }: { attendanceId: string, eventId: string, eventSlug: string }) => {
// //   const { user } = useAuth(); const queryClient = useQueryClient();
// //   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ReviewFormInputs>({ resolver: zodResolver(ReviewSchema) });
// //   const mutation = useMutation({ mutationFn: async (formData: ReviewFormInputs) => { const { error } = await supabase.from('reviews').insert({ ...formData, attendance_id: attendanceId, user_id: user!.id }); if (error) throw error; }, onSuccess: () => { toast.success('Thank you for your review!'); queryClient.invalidateQueries({ queryKey: ['reviews', eventId] }); queryClient.invalidateQueries({ queryKey: ['event', eventSlug] }); }, onError: (error: any) => { if (error.code === '23505') toast.error('You have already submitted a review for this event.'); else toast.error(error.message); } });
// //   return (<div className="bg-white/30 backdrop-blur rounded-xl p-6 border border-white/20 mt-8"><h3 className="text-xl font-bold mb-4">Leave a Review</h3><form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4"><div><label className="block text-sm font-medium">Rating</label><select {...register('rating', { valueAsNumber: true })} className="mt-1 p-2 w-full bg-white border rounded-md text-text-primary"><option value="">Select a rating</option><option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option></select>{errors.rating && <p className="text-sm text-system-danger">{errors.rating.message}</p>}</div><div><label className="block text-sm font-medium">Comment</label><textarea {...register('comment')} rows={4} className="mt-1 p-2 w-full border rounded-md text-text-primary" /></div><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-secondary text-white rounded-md disabled:opacity-50">{isSubmitting ? 'Submitting...' : 'Submit Review'}</button></form></div>);
// // };

// // // Review List Sub-component
// // const ReviewList = ({ eventId }: { eventId: string }) => {
// //   const { data: reviews, isLoading } = useQuery<Review[]>({ queryKey: ['reviews', eventId], queryFn: async () => { const { data, error } = await supabase.from('event_reviews_with_author').select('*').eq('event_id', eventId); if (error) throw error; return data; } });
// //   if (isLoading) return <p className="mt-8">Loading reviews...</p>;
// //   if (!reviews || reviews.length === 0) return <p className="text-text-secondary mt-8">No reviews for this event yet.</p>;
// //   return (<div className="mt-8"><h3 className="text-2xl font-bold mb-4">Event Reviews</h3><div className="space-y-6">{reviews.map(review => (<div key={review.id} className="flex gap-4"><img src={review.avatar_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${review.avatar_url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${review.english_name}`} alt={review.english_name || ''} className="w-12 h-12 rounded-full flex-shrink-0" /><div className="flex flex-col"><div className="flex items-center gap-2"><p className="font-bold">{review.english_name}</p><span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div><p className="text-text-secondary mt-1">{review.comment}</p><p className="text-xs text-neutral-500 mt-1">{new Date(review.created_at).toLocaleDateString()}</p></div></div>))}</div></div>);
// // };

// // // Main Page Component
// // export const EventDetailPage = () => {
// //   const { slug } = useParams<{ slug: string }>();
// //   const { language, t } = useTranslation();
// //   const { user } = useAuth();
// //   const [hasReviewed, setHasReviewed] = useState(false);

// //   const { data: event, isLoading, error } = useQuery({
// //     queryKey: ['event', slug],
// //     queryFn: async (): Promise<EventDetails> => {
// //       const { data, error } = await supabase.rpc('get_event_details', { p_slug: slug! }).single();
// //       if (error) throw new Error(error.message);
// //       return data;
// //     },
// //     enabled: !!slug,
// //   });

// //   const { data: reviews } = useQuery<Review[], Error>({ queryKey: ['reviews', event?.id], queryFn: async () => { const { data, error } = await supabase.from('event_reviews_with_author').select('*').eq('event_id', event!.id); if (error) throw error; return data; }, enabled: !!event?.id });
// //   useEffect(() => { if (user && reviews) { const userReview = reviews.find(r => r.avatar_url?.includes(user.id)); setHasReviewed(!!userReview); } }, [user, reviews]);

// //   const title = language === 'zh-HANT' && event?.title_zh_hant ? event.title_zh_hant : event?.title_en;
// //   const description = language === 'zh-HANT' && event?.description_zh_hant ? event.description_zh_hant : event?.description_en;

// //   if (isLoading) return <div className="text-center py-40">Loading Event...</div>;
// //   if (error) return <div className="text-center py-40 text-system-danger">Error: {error.message}</div>;
// //   if (!event) return <div className="text-center py-40">Event not found.</div>;

// //   const eventDate = new Date(event.start_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
// //   const eventTime = `${new Date(event.start_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${new Date(event.end_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
// //   const canReview = new Date(event.end_at) < new Date() && event.user_attendance_id && !hasReviewed;

// //   return (
// //     <div className="bg-background">
// //       <section className="relative min-h-[50vh] flex flex-col justify-end text-white p-8 bg-neutral-800">
// //         <img src={event.banner_url || 'https://placehold.co/1200x400'} alt={title || 'Event Banner'} className="absolute inset-0 w-full h-full object-cover opacity-40" />
// //         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
// //         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 container mx-auto">
// //           <Link to="/events" className="text-white/80 hover:text-white mb-4 inline-block">&larr; {t('events.pageTitle')}</Link>
// //           <h1 className="text-4xl md:text-6xl font-bold">{title}</h1>
// //         </motion.div>
// //       </section>

// //       <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-12 px-4">
// //         <div className="lg:col-span-2">
// //           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg">
// //             <h2 className="text-2xl font-bold text-text-primary mb-4">About this Event</h2>
// //             <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{description || 'No description available.'}</p>
// //           </motion.div>
// //           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
// //             {canReview && <ReviewForm attendanceId={event.user_attendance_id!} eventId={event.id} eventSlug={event.slug} />}
// //             <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg mt-8">
// //               <ReviewList eventId={event.id} />
// //             </div>
// //           </motion.div>
// //         </div>
// //         <div className="lg:col-span-1">
// //           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="sticky top-28">
// //             <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
// //               <h3 className="text-xl font-bold text-text-primary mb-4">Details</h3>
// //               <ul className="space-y-3 text-text-secondary">
// //                 <li className="flex items-center gap-3"><span>📅</span><span>{eventDate}</span></li>
// //                 <li className="flex items-center gap-3"><span>🕒</span><span>{eventTime}</span></li>
// //                 <li className="flex items-center gap-3"><span>📍</span><span>{event.location || 'Location TBD'}</span></li>
// //               </ul>
// //             </div>
// //             <div className="mt-6"><RegistrationButton event={event} /></div>
// //           </motion.div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Link, useParams, useNavigate } from 'react-router-dom';
// import { supabase, useAuth } from '../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import { useTranslation } from '../contexts/LanguageContext';
// import { motion } from 'framer-motion';
// import { useForm, type SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useEffect, useState } from 'react';

// // Types
// type EventDetails = { id: string; slug: string; banner_url: string | null; start_at: string; end_at: string; location: string | null; user_registration_status: 'pending' | 'accepted' | 'rejected' | null; user_attendance_id: string | null; title_en: string | null; title_zh_hant: string | null; description_en: string | null; description_zh_hant: string | null; };
// type Review = { id: string; rating: number; comment: string | null; created_at: string; english_name: string | null; avatar_url: string | null; };
// const ReviewSchema = z.object({ rating: z.number().min(1, 'Please select a rating').max(5), comment: z.string().optional() });
// type ReviewFormInputs = z.infer<typeof ReviewSchema>;

// // Registration Button Sub-component
// const RegistrationButton = ({ event }: { event: EventDetails }) => {
//   const { user } = useAuth(); const navigate = useNavigate(); const queryClient = useQueryClient(); const { t } = useTranslation();
//   const mutation = useMutation({ mutationFn: async () => { if (!user) throw new Error('You must be logged in to register.'); const { error } = await supabase.from('event_registrations').insert({ event_id: event.id, user_id: user.id }); if (error) throw error; }, onSuccess: () => { toast.success('Registration submitted! Awaiting approval.'); queryClient.invalidateQueries({ queryKey: ['event', event.slug] }); }, onError: (error: any) => { if (error.code === '23505') { toast.error('You are already registered for this event.'); } else { toast.error(error.message); } }, });
//   if (!user) { return <button onClick={() => navigate('/login')} className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-hover">{t('nav.login')} to Register</button>; }
//   if (new Date(event.start_at) < new Date()) { return <div className="w-full px-6 py-3 bg-neutral-200 text-text-secondary font-semibold rounded-lg text-center">Event Has Ended</div>; }
//   switch (event.user_registration_status) { case 'pending': return <div className="w-full px-6 py-3 bg-yellow-400 text-yellow-800 font-semibold rounded-lg text-center">Registration Pending Approval</div>; case 'accepted': return <div className="w-full px-6 py-3 bg-secondary text-white font-semibold rounded-lg text-center">Registration Accepted!</div>; case 'rejected': return <div className="w-full px-6 py-3 bg-system-danger text-white font-semibold rounded-lg text-center">Registration Rejected</div>; default: return <button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-hover disabled:opacity-50">{mutation.isPending ? 'Registering...' : 'Register for this Event'}</button>; }
// };

// // Review Form Sub-component
// const ReviewForm = ({ attendanceId, eventId, eventSlug }: { attendanceId: string, eventId: string, eventSlug: string }) => {
//   const { user } = useAuth(); const queryClient = useQueryClient();
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ReviewFormInputs>({ resolver: zodResolver(ReviewSchema) });
//   const mutation = useMutation({ mutationFn: async (formData: ReviewFormInputs) => { const { error } = await supabase.from('reviews').insert({ ...formData, attendance_id: attendanceId, user_id: user!.id }); if (error) throw error; }, onSuccess: () => { toast.success('Thank you for your review!'); queryClient.invalidateQueries({ queryKey: ['reviews', eventId] }); queryClient.invalidateQueries({ queryKey: ['event', eventSlug] }); }, onError: (error: any) => { if (error.code === '23505') toast.error('You have already submitted a review for this event.'); else toast.error(error.message); } });
//   return (<div className="bg-white/30 backdrop-blur rounded-xl p-6 border border-white/20 mt-8"><h3 className="text-xl font-bold mb-4">Leave a Review</h3><form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4"><div><label className="block text-sm font-medium">Rating</label><select {...register('rating', { valueAsNumber: true })} className="mt-1 p-2 w-full bg-white border rounded-md text-text-primary"><option value="">Select a rating</option><option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option></select>{errors.rating && <p className="text-sm text-system-danger">{errors.rating.message}</p>}</div><div><label className="block text-sm font-medium">Comment</label><textarea {...register('comment')} rows={4} className="mt-1 p-2 w-full border rounded-md text-text-primary" /></div><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-secondary text-white rounded-md disabled:opacity-50">{isSubmitting ? 'Submitting...' : 'Submit Review'}</button></form></div>);
// };

// // Review List Sub-component
// const ReviewList = ({ eventId }: { eventId: string }) => {
//   const { data: reviews, isLoading } = useQuery<Review[]>({ queryKey: ['reviews', eventId], queryFn: async () => { const { data, error } = await supabase.from('event_reviews_with_author').select('*').eq('event_id', eventId); if (error) throw error; return data; } });
//   if (isLoading) return <p className="mt-8">Loading reviews...</p>;
//   if (!reviews || reviews.length === 0) return <p className="text-text-secondary mt-8">No reviews for this event yet.</p>;
//   return (<div className="mt-8"><h3 className="text-2xl font-bold mb-4">Event Reviews</h3><div className="space-y-6">{reviews.map(review => (<div key={review.id} className="flex gap-4"><img src={review.avatar_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${review.avatar_url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${review.english_name}`} alt={review.english_name || ''} className="w-12 h-12 rounded-full flex-shrink-0" /><div className="flex flex-col"><div className="flex items-center gap-2"><p className="font-bold">{review.english_name}</p><span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div><p className="text-text-secondary mt-1">{review.comment}</p><p className="text-xs text-neutral-500 mt-1">{new Date(review.created_at).toLocaleDateString()}</p></div></div>))}</div></div>);
// };


// // Main Page Component
// export const EventDetailPage = () => {
//   const { slug } = useParams<{ slug: string }>();
//   const { language, t } = useTranslation();
//   const { user } = useAuth();
//   const [hasReviewed, setHasReviewed] = useState(false);

//   const { data: event, isLoading, error } = useQuery({
//     queryKey: ['event', slug],
//     queryFn: async (): Promise<EventDetails> => {
//       const { data, error } = await supabase.rpc('get_event_details', { p_slug: slug! }).single();
//       if (error) throw new Error(error.message);
//       return data;
//     },
//     enabled: !!slug,
//   });

//   const { data: reviews } = useQuery<Review[], Error>({ queryKey: ['reviews', event?.id], queryFn: async () => { const { data, error } = await supabase.from('event_reviews_with_author').select('*').eq('event_id', event!.id); if (error) throw new Error(error.message); return data; }, enabled: !!event?.id });
//   useEffect(() => { if (user && reviews) { const userReview = reviews.find(r => r.avatar_url?.includes(user.id)); setHasReviewed(!!userReview); } }, [user, reviews]);

//   const title = language === 'zh-HANT' && event?.title_zh_hant ? event.title_zh_hant : event?.title_en;
//   const description = language === 'zh-HANT' && event?.description_zh_hant ? event.description_zh_hant : event?.description_en;

//   if (isLoading) return <div className="text-center py-40">Loading Event...</div>;
//   if (error) return <div className="text-center py-40 text-system-danger">Error: {error.message}</div>;
//   if (!event) return <div className="text-center py-40">Event not found.</div>;

//   const eventDate = new Date(event.start_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
//   const eventTime = `${new Date(event.start_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${new Date(event.end_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
//   const canReview = new Date(event.end_at) < new Date() && event.user_attendance_id && !hasReviewed;

//   return (
//     <div className="bg-background">
//       <div className="h-20 bg-card-bg" />
//       <section className="relative min-h-[50vh] flex flex-col justify-center text-white p-8 bg-neutral-800">
//         <img src={event.banner_url || 'https://placehold.co/1200x400'} alt={title || 'Event Banner'} className="absolute inset-0 w-full h-full object-cover opacity-40" />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 container mx-auto">
//           <Link to="/events" className="text-white/80 hover:text-white mb-4 inline-block">&larr; {t('events.pageTitle')}</Link>
//           <h1 className="text-4xl md:text-6xl font-bold">{title}</h1>
//         </motion.div>
//       </section>

//       <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-12 px-4">
//         <div className="lg:col-span-2">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg">
//             <h2 className="text-2xl font-bold text-text-primary mb-4">About this Event</h2>
//             <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{description || 'No description available.'}</p>
//           </motion.div>
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
//             {canReview && <ReviewForm attendanceId={event.user_attendance_id!} eventId={event.id} eventSlug={event.slug} />}
//             <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg mt-8">
//               <ReviewList eventId={event.id} />
//             </div>
//           </motion.div>
//         </div>
//         <div className="lg:col-span-1">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="sticky top-28">
//             <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
//               <h3 className="text-xl font-bold text-text-primary mb-4">Details</h3>
//               <ul className="space-y-3 text-text-secondary">
//                 <li className="flex items-center gap-3"><span>📅</span><span>{eventDate}</span></li>
//                 <li className="flex items-center gap-3"><span>🕒</span><span>{eventTime}</span></li>
//                 <li className="flex items-center gap-3"><span>📍</span><span>{event.location || 'Location TBD'}</span></li>
//               </ul>
//             </div>
//             <div className="mt-6"><RegistrationButton event={event} /></div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase, useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useTranslation } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Types
type EventDetails = { id: string; slug: string; banner_url: string | null; start_at: string; end_at: string; location: string | null; user_registration_status: 'pending' | 'accepted' | 'rejected' | null; user_attendance_id: string | null; title_en: string | null; title_zh_hant: string | null; description_en: string | null; description_zh_hant: string | null; cta_post_id: string | null; cta_text_en: string | null; cta_text_zh_hant: string | null; };
type Review = { id: string; rating: number; comment: string | null; created_at: string; english_name: string | null; avatar_url: string | null; };
const ReviewSchema = z.object({ rating: z.number().min(1, 'Please select a rating').max(5), comment: z.string().optional() });
type ReviewFormInputs = z.infer<typeof ReviewSchema>;

// Sub-components
const CallToAction = ({ link, text, title }: { link: string, text: string, title: string }) => {
    const [showQr, setShowQr] = useState(false);
    const fullLink = `${window.location.origin}${link}`;
    return (
        <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <h3 className="text-xl font-bold text-text-primary mb-4">{title}</h3>
            <div className="flex justify-center items-center gap-4 flex-wrap">
                <Link to={link} className="bg-secondary text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-secondary-hover transition-colors shadow-lg">
                    {text}
                </Link>
                <button onClick={() => setShowQr(!showQr)} title="Show QR Code" className="p-3 bg-white/50 rounded-full hover:bg-white/80 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 20v-1m0-10a5 5 0 015 5h-1a4 4 0 00-4-4V9z" /></svg>
                </button>
            </div>
            {showQr && <div className="mt-4 bg-white p-4 inline-block rounded-lg shadow-lg"><QRCodeSVG value={fullLink} /></div>}
        </div>
    );
};
const RegistrationButton = ({ event }: { event: EventDetails }) => {
  const { user } = useAuth(); const navigate = useNavigate(); const queryClient = useQueryClient(); const { t } = useTranslation();
  const mutation = useMutation({ mutationFn: async () => { if (!user) throw new Error('You must be logged in to register.'); const { error } = await supabase.from('event_registrations').insert({ event_id: event.id, user_id: user.id }); if (error) throw error; }, onSuccess: () => { toast.success('Registration submitted! Awaiting approval.'); queryClient.invalidateQueries({ queryKey: ['event', event.slug] }); }, onError: (error: any) => { if (error.code === '23505') { toast.error('You are already registered for this event.'); } else { toast.error(error.message); } }, });
  if (!user) { return <button onClick={() => navigate('/login')} className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-hover">{t('nav.login')} to Register</button>; }
  if (new Date(event.start_at) < new Date()) { return <div className="w-full px-6 py-3 bg-neutral-200 text-text-secondary font-semibold rounded-lg text-center">Event Has Ended</div>; }
  switch (event.user_registration_status) { case 'pending': return <div className="w-full px-6 py-3 bg-yellow-400 text-yellow-800 font-semibold rounded-lg text-center">Registration Pending Approval</div>; case 'accepted': return <div className="w-full px-6 py-3 bg-secondary text-white font-semibold rounded-lg text-center">Registration Accepted!</div>; case 'rejected': return <div className="w-full px-6 py-3 bg-system-danger text-white font-semibold rounded-lg text-center">Registration Rejected</div>; default: return <button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-hover disabled:opacity-50">{mutation.isPending ? 'Registering...' : 'Register for this Event'}</button>; }
};
const ReviewForm = ({ attendanceId, eventId, eventSlug }: { attendanceId: string, eventId: string, eventSlug: string }) => {
  const { user } = useAuth(); const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ReviewFormInputs>({ resolver: zodResolver(ReviewSchema) });
  const mutation = useMutation({ mutationFn: async (formData: ReviewFormInputs) => { const { error } = await supabase.from('reviews').insert({ ...formData, attendance_id: attendanceId, user_id: user!.id }); if (error) throw error; }, onSuccess: () => { toast.success('Thank you for your review!'); queryClient.invalidateQueries({ queryKey: ['reviews', eventId] }); queryClient.invalidateQueries({ queryKey: ['event', eventSlug] }); }, onError: (error: any) => { if (error.code === '23505') toast.error('You have already submitted a review for this event.'); else toast.error(error.message); } });
  return ( <div className="bg-white/30 backdrop-blur rounded-xl p-6 border border-white/20 mt-8"><h3 className="text-xl font-bold mb-4">Leave a Review</h3><form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4"><div><label className="block text-sm font-medium">Rating</label><select {...register('rating', { valueAsNumber: true })} className="mt-1 p-2 w-full bg-white border rounded-md text-text-primary"><option value="">Select a rating</option><option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option></select>{errors.rating && <p className="text-sm text-system-danger">{errors.rating.message}</p>}</div><div><label className="block text-sm font-medium">Comment</label><textarea {...register('comment')} rows={4} className="mt-1 p-2 w-full border rounded-md text-text-primary" /></div><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-secondary text-white rounded-md disabled:opacity-50">{isSubmitting ? 'Submitting...' : 'Submit Review'}</button></form></div> );
};
const ReviewList = ({ eventId }: { eventId: string }) => {
  const { data: reviews, isLoading } = useQuery<Review[]>({ queryKey: ['reviews', eventId], queryFn: async () => { const { data, error } = await supabase.from('event_reviews_with_author').select('*').eq('event_id', eventId); if (error) throw error; return data; } });
  if (isLoading) return <p className="mt-8">Loading reviews...</p>;
  if (!reviews || reviews.length === 0) return <p className="text-text-secondary mt-8">No reviews for this event yet.</p>;
  return ( <div className="mt-8"><h3 className="text-2xl font-bold mb-4">Event Reviews</h3><div className="space-y-6">{reviews.map(review => ( <div key={review.id} className="flex gap-4"><img src={review.avatar_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${review.avatar_url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${review.english_name}`} alt={review.english_name || ''} className="w-12 h-12 rounded-full flex-shrink-0" /><div className="flex flex-col"><div className="flex items-center gap-2"><p className="font-bold">{review.english_name}</p><span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div><p className="text-text-secondary mt-1">{review.comment}</p><p className="text-xs text-neutral-500 mt-1">{new Date(review.created_at).toLocaleDateString()}</p></div></div>))}</div></div> );
};

// Main Page Component
export const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useTranslation();
  const { user } = useAuth();
  const [hasReviewed, setHasReviewed] = useState(false);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', slug],
    queryFn: async (): Promise<EventDetails> => { 
      const { data, error } = await supabase.rpc('get_event_details', { p_slug: slug! }).single(); 
      if (error) throw new Error(error.message); 
      return data; 
    },
    enabled: !!slug,
  });
  
  const { data: reviews } = useQuery<Review[], Error>({ queryKey: ['reviews', event?.id], queryFn: async () => { const { data, error } = await supabase.from('event_reviews_with_author').select('*').eq('event_id', event!.id); if (error) throw error; return data; }, enabled: !!event?.id });
  useEffect(() => { if (user && reviews) { const userReview = reviews.find(r => r.avatar_url?.includes(user.id)); setHasReviewed(!!userReview); } }, [user, reviews]);

  const title = language === 'zh-HANT' && event?.title_zh_hant ? event.title_zh_hant : event?.title_en;
  const description = language === 'zh-HANT' && event?.description_zh_hant ? event.description_zh_hant : event?.description_en;
  const ctaText = language === 'zh-HANT' && event?.cta_text_zh_hant ? event.cta_text_zh_hant : (event?.cta_text_en || "Learn More");

  if (isLoading) return <div className="text-center py-40">Loading Event...</div>;
  if (error) return <div className="text-center py-40 text-system-danger">Error: {error.message}</div>;
  if (!event) return <div className="text-center py-40">Event not found.</div>;

  const eventDate = new Date(event.start_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const eventTime = `${new Date(event.start_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${new Date(event.end_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  const canReview = new Date(event.end_at) < new Date() && event.user_attendance_id && !hasReviewed;

  return (
    <div className="bg-background">
      <div className="h-20 bg-card-bg" />
      <section className="relative min-h-[50vh] flex flex-col justify-center text-white p-8 bg-neutral-800">
        <img src={event.banner_url || 'https://placehold.co/1200x400'} alt={title || 'Event Banner'} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 container mx-auto">
          <Link to="/events" className="text-white/80 hover:text-white mb-4 inline-block">&larr; {t('events.pageTitle')}</Link>
          <h1 className="text-4xl md:text-6xl font-bold">{title}</h1>
        </motion.div>
      </section>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-12 px-4">
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg">
            <h2 className="text-2xl font-bold text-text-primary mb-4">About this Event</h2>
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{description || 'No description available.'}</p>
            {event.cta_post_id && ctaText && ( <CallToAction link={`/posts/${event.cta_post_id}`} text={ctaText} title="Related Post" /> )}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            {canReview && <ReviewForm attendanceId={event.user_attendance_id!} eventId={event.id} eventSlug={event.slug} />}
            <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg mt-8">
              <ReviewList eventId={event.id} />
            </div>
          </motion.div>
        </div>
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="sticky top-28">
            <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-xl font-bold text-text-primary mb-4">Details</h3>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-center gap-3"><span>📅</span><span>{eventDate}</span></li>
                <li className="flex items-center gap-3"><span>🕒</span><span>{eventTime}</span></li>
                <li className="flex items-center gap-3"><span>📍</span><span>{event.location || 'Location TBD'}</span></li>
              </ul>
            </div>
            <div className="mt-6"><RegistrationButton event={event} /></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};