// // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // import { useParams, Link } from 'react-router-dom';
// // // import { supabase } from '../../contexts/AuthContext';
// // // import toast from 'react-hot-toast';
// // // import { useState } from 'react';
// // // import { QRCodeSVG } from 'qrcode.react';

// // // type Registration = {
// // //   id: string;
// // //   user_id: string;
// // //   status: 'pending' | 'accepted' | 'rejected';
// // //   english_name: string | null;
// // //   student_id: string | null;
// // //   department: string | null;
// // //   nationality: string | null;
// // //   email: string | null;
// // //   payment_proof_url: string | null;
// // // };
// // // type Token = { id: string; event_id: string; token: string; expires_at: string; };

// // // const CheckInTokenManager = ({ eventId }: { eventId: string }) => {
// // //   const [activeToken, setActiveToken] = useState<Token | null>(null);
// // //   const { data: latestToken, isLoading } = useQuery<Token | null>({ queryKey: ['latest_token', eventId], queryFn: async () => { const { data, error } = await supabase.from('event_attendance_tokens').select('*').eq('event_id', eventId).order('created_at', { ascending: false }).limit(1).single(); if (error && error.code !== 'PGRST116') return null; if (data && new Date(data.expires_at) > new Date()) { setActiveToken(data); } return data || null; }, });
// // //   const generateMutation = useMutation({ mutationFn: async () => { const { data: { session } } = await supabase.auth.getSession(); if (!session) throw new Error("Not authenticated"); const response = await supabase.functions.invoke('generate-attendance-token', { body: { event_id: eventId }, }); if (response.error) throw response.error; return response.data as Token; }, onSuccess: (data) => { toast.success(`New token generated: ${data.token}`); setActiveToken(data); }, onError: (error) => toast.error(error.message), });
// // //   if (isLoading) return <p>Loading check-in status...</p>;
// // //   const checkInUrl = activeToken ? `${window.location.origin}/checkin/${activeToken.token}` : '';
// // //   return (
// // //     <div className="bg-neutral-100 p-6 rounded-lg">
// // //       <h2 className="text-xl font-bold mb-4">Event Check-in</h2>
// // //       {activeToken ? (
// // //         <div className="flex flex-col md:flex-row items-center gap-6">
// // //           <div className="bg-white p-4 rounded-md"><QRCodeSVG value={checkInUrl} size={128} /></div>
// // //           <div><p className="font-semibold">Active Check-in Code:</p><p className="text-3xl font-mono tracking-widest my-2">{activeToken.token}</p><p className="text-sm text-neutral-500">Expires: {new Date(activeToken.expires_at).toLocaleString()}</p><Link to={`/print/qr/${eventId}`} target="_blank" className="px-4 py-2 mt-2 inline-block bg-neutral-800 text-white rounded-md hover:bg-black text-sm font-semibold">Print QR Code</Link></div>
// // //         </div>
// // //       ) : ( <p>No active check-in token for this event.</p> )}
// // //       <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold disabled:opacity-50">{generateMutation.isPending ? 'Generating...' : 'Generate New 24-Hour Token'}</button>
// // //     </div>
// // //   );
// // // };

// // // export const EventRegistrationsPage = () => {
// // //   const { id: eventId } = useParams<{ id: string }>();
// // //   if (!eventId) return <div>Event ID not found.</div>;
// // //   const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
// // //   const queryClient = useQueryClient();

// // //   const { data: event, isLoading: isEventLoading } = useQuery({
// // //     queryKey: ['cms_event', eventId],
// // //     queryFn: async () => { const { data, error } = await supabase.from('events').select('title_en').eq('id', eventId!).single(); if (error) throw new Error(error.message); return data; },
// // //   });

// // //   const { data: registrations, isLoading: areRegsLoading } = useQuery<Registration[]>({
// // //     queryKey: ['registrations', eventId, statusFilter],
// // //     queryFn: async () => { 
// // //       let query = supabase.from('registration_details').select('*').eq('event_id', eventId!);
// // //       if (statusFilter !== 'all') {
// // //         query = query.eq('status', statusFilter);
// // //       }
// // //       const { data, error } = await query.order('created_at', { ascending: false });
// // //       if (error) throw new Error(error.message); 
// // //       return data; 
// // //     },
// // //   });

// // //   const updateStatusMutation = useMutation({
// // //     mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' }) => {
// // //       const { error } = await supabase.from('event_registrations').update({ status: newStatus }).eq('id', registrationId);
// // //       if (error) throw error;
// // //       return { registrationId, newStatus };
// // //     },
// // //     onSuccess: () => {
// // //       toast.success("Registration status updated!");
// // //       queryClient.invalidateQueries({ queryKey: ['registrations', eventId, statusFilter] });
// // //     },
// // //     onError: (error) => toast.error(error.message),
// // //   });

// // //   const isLoading = isEventLoading || areRegsLoading;

// // //   return (
// // //     <div className="space-y-6">
// // //       <div><Link to="/cms/events" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all events</Link><h1 className="text-3xl font-bold">Manage Registrations for "{event?.title_en || '...'}"</h1></div>
// // //       <CheckInTokenManager eventId={eventId!} />
// // //       <div>
// // //         <h2 className="text-2xl font-bold mb-4">Registrants ({registrations?.length || 0})</h2>
// // //         <div className="mb-4"><select onChange={(e) => setStatusFilter(e.target.value as any)} value={statusFilter} className="p-2 border rounded-md bg-white"><option value="all">All</option><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option></select></div>
// // //         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
// // //           <table className="min-w-full responsive-table">
// // //             <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Name</th><th className="p-4 text-left font-semibold">Department</th><th className="p-4 text-left font-semibold">Payment Proof</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
// // //             <tbody>
// // //               {isLoading ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> : 
// // //               registrations?.map(reg => (
// // //                 <tr key={reg.id}>
// // //                   <td data-label="Name" className="font-medium"><Link to={`/cms/users/${reg.user_id}`} className="text-primary hover:underline">{reg.english_name || 'N/A'}</Link></td>
// // //                   <td data-label="Department">{reg.department || 'N/A'}</td>
// // //                   <td data-label="Payment Proof">{reg.payment_proof_url ? <a href={reg.payment_proof_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-semibold">View Proof</a> : <span className="text-xs text-neutral-400">N/A</span>}</td>
// // //                   <td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${ reg.status === 'accepted' ? 'bg-green-100 text-green-800' : reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{reg.status}</span></td>
// // //                   <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
// // //                     {reg.status === 'pending' && (
// // //                       <><button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'accepted' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Accept</button>
// // //                       <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'rejected' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Reject</button></>
// // //                     )}
// // //                   </td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import { useParams, Link } from 'react-router-dom';
// // import { supabase } from '../../contexts/AuthContext';
// // import toast from 'react-hot-toast';
// // import { useState } from 'react';
// // import { QRCodeSVG } from 'qrcode.react';

// // type Registration = {
// //   id: string;
// //   user_id: string;
// //   status: 'pending' | 'accepted' | 'rejected';
// //   english_name: string | null;
// //   student_id: string | null;
// //   department: string | null;
// //   nationality: string | null;
// //   email: string | null;
// //   payment_proof_url: string | null;
// // };
// // type Token = { id: string; event_id: string; token: string; expires_at: string; };

// // const CheckInTokenManager = ({ eventId }: { eventId: string }) => {
// //   const [activeToken, setActiveToken] = useState<Token | null>(null);
// //   const { data: latestToken, isLoading } = useQuery<Token | null>({ queryKey: ['latest_token', eventId], queryFn: async () => { const { data, error } = await supabase.from('event_attendance_tokens').select('*').eq('event_id', eventId).order('created_at', { ascending: false }).limit(1).single(); if (error && error.code !== 'PGRST116') return null; if (data && new Date(data.expires_at) > new Date()) { setActiveToken(data); } return data || null; }, });
// //   const generateMutation = useMutation({ mutationFn: async () => { const { data: { session } } = await supabase.auth.getSession(); if (!session) throw new Error("Not authenticated"); const response = await supabase.functions.invoke('generate-attendance-token', { body: { event_id: eventId }, }); if (response.error) throw response.error; return response.data as Token; }, onSuccess: (data) => { toast.success(`New token generated: ${data.token}`); setActiveToken(data); }, onError: (error) => toast.error(error.message), });
// //   if (isLoading) return <p>Loading check-in status...</p>;
// //   const checkInUrl = activeToken ? `${window.location.origin}/checkin/${activeToken.token}` : '';
// //   return (
// //     <div className="bg-neutral-100 p-6 rounded-lg">
// //       <h2 className="text-xl font-bold mb-4">Event Check-in</h2>
// //       {activeToken ? (
// //         <div className="flex flex-col md:flex-row items-center gap-6">
// //           <div className="bg-white p-4 rounded-md"><QRCodeSVG value={checkInUrl} size={128} /></div>
// //           <div><p className="font-semibold">Active Check-in Code:</p><p className="text-3xl font-mono tracking-widest my-2">{activeToken.token}</p><p className="text-sm text-neutral-500">Expires: {new Date(activeToken.expires_at).toLocaleString()}</p><Link to={`/print/qr/${eventId}`} target="_blank" className="px-4 py-2 mt-2 inline-block bg-neutral-800 text-white rounded-md hover:bg-black text-sm font-semibold">Print QR Code</Link></div>
// //         </div>
// //       ) : ( <p>No active check-in token for this event.</p> )}
// //       <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold disabled:opacity-50">{generateMutation.isPending ? 'Generating...' : 'Generate New 24-Hour Token'}</button>
// //     </div>
// //   );
// // };

// // export const EventRegistrationsPage = () => {
// //   const { id: eventId } = useParams<{ id: string }>();
// //   if (!eventId) return <div>Event ID not found.</div>;
// //   const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
// //   const queryClient = useQueryClient();

// //   const { data: event, isLoading: isEventLoading } = useQuery({
// //     queryKey: ['cms_event', eventId],
// //     queryFn: async () => { const { data, error } = await supabase.from('events').select('title_en').eq('id', eventId!).single(); if (error) throw new Error(error.message); return data; },
// //   });

// //   const queryKey = ['registrations', eventId, statusFilter];
// //   const { data: registrations, isLoading: areRegsLoading } = useQuery<Registration[]>({
// //     queryKey: queryKey,
// //     queryFn: async () => { 
// //       let query = supabase.from('registration_details').select('*').eq('event_id', eventId!);
// //       if (statusFilter !== 'all') {
// //         query = query.eq('status', statusFilter);
// //       }
// //       const { data, error } = await query.order('created_at', { ascending: false });
// //       if (error) throw new Error(error.message); 
// //       return data; 
// //     },
// //   });

// //   const updateStatusMutation = useMutation({
// //     mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' }) => {
// //       const { error } = await supabase.from('event_registrations').update({ status: newStatus }).eq('id', registrationId);
// //       if (error) throw error;
// //       return { registrationId, newStatus };
// //     },
// //     onSuccess: () => {
// //       toast.success("Registration status updated!");
// //       queryClient.invalidateQueries({ queryKey: ['registrations', eventId, statusFilter] });
// //     },
// //     onError: (error) => toast.error(error.message),
// //   });

// //   const isLoading = isEventLoading || areRegsLoading;

// //   return (
// //     <div className="space-y-6">
// //       <div><Link to="/cms/events" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all events</Link><h1 className="text-3xl font-bold">Manage Registrations for "{event?.title_en || '...'}"</h1></div>
// //       <CheckInTokenManager eventId={eventId!} />
// //       <div>
// //         <h2 className="text-2xl font-bold mb-4">Registrants ({registrations?.length || 0})</h2>
// //         <div className="mb-4"><select onChange={(e) => setStatusFilter(e.target.value as any)} value={statusFilter} className="p-2 border rounded-md bg-white"><option value="all">All</option><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option></select></div>
// //         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
// //           <table className="min-w-full responsive-table">
// //             <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Name</th><th className="p-4 text-left font-semibold">Department</th><th className="p-4 text-left font-semibold">Payment Proof</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
// //             <tbody>
// //               {isLoading ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> : 
// //               registrations?.map(reg => (
// //                 <tr key={reg.id}>
// //                   <td data-label="Name" className="font-medium"><Link to={`/cms/users/${reg.user_id}`} className="text-primary hover:underline">{reg.english_name || 'N/A'}</Link></td>
// //                   <td data-label="Department">{reg.department || 'N/A'}</td>
// //                   <td data-label="Payment Proof">{reg.payment_proof_url ? <a href={reg.payment_proof_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-semibold">View Proof</a> : <span className="text-xs text-neutral-400">N/A</span>}</td>
// //                   <td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${ reg.status === 'accepted' ? 'bg-green-100 text-green-800' : reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{reg.status}</span></td>
// //                   <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
// //                     {reg.status === 'pending' && (
// //                       <><button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'accepted' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Accept</button>
// //                       <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'rejected' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Reject</button></>
// //                     )}
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useParams, Link } from 'react-router-dom';
// import { supabase } from '../../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import { useState } from 'react';
// import { QRCodeSVG } from 'qrcode.react';

// type Registration = {
//   id: string;
//   user_id: string;
//   status: 'pending' | 'accepted' | 'rejected';
//   english_name: string | null;
//   student_id: string | null;
//   department: string | null;
//   nationality: string | null;
//   email: string | null;
//   payment_proof_url: string | null;
// };
// type Token = { id: string; event_id: string; token: string; expires_at: string; };

// const CheckInTokenManager = ({ eventId }: { eventId: string }) => {
//   const [activeToken, setActiveToken] = useState<Token | null>(null);
//   const { data: latestToken, isLoading } = useQuery<Token | null>({ queryKey: ['latest_token', eventId], queryFn: async () => { const { data, error } = await supabase.from('event_attendance_tokens').select('*').eq('event_id', eventId).order('created_at', { ascending: false }).limit(1).single(); if (error && error.code !== 'PGRST116') return null; if (data && new Date(data.expires_at) > new Date()) { setActiveToken(data); } return data || null; }, });
//   const generateMutation = useMutation({ mutationFn: async () => { const { data: { session } } = await supabase.auth.getSession(); if (!session) throw new Error("Not authenticated"); const response = await supabase.functions.invoke('generate-attendance-token', { body: { event_id: eventId }, }); if (response.error) throw response.error; return response.data as Token; }, onSuccess: (data) => { toast.success(`New token generated: ${data.token}`); setActiveToken(data); }, onError: (error) => toast.error(error.message), });
//   if (isLoading) return <p>Loading check-in status...</p>;
//   const checkInUrl = activeToken ? `${window.location.origin}/checkin/${activeToken.token}` : '';
//   return (
//     <div className="bg-neutral-100 p-6 rounded-lg">
//       <h2 className="text-xl font-bold mb-4">Event Check-in</h2>
//       {activeToken ? (
//         <div className="flex flex-col md:flex-row items-center gap-6">
//           <div className="bg-white p-4 rounded-md"><QRCodeSVG value={checkInUrl} size={128} /></div>
//           <div><p className="font-semibold">Active Check-in Code:</p><p className="text-3xl font-mono tracking-widest my-2">{activeToken.token}</p><p className="text-sm text-neutral-500">Expires: {new Date(activeToken.expires_at).toLocaleString()}</p><Link to={`/print/qr/${eventId}`} target="_blank" className="px-4 py-2 mt-2 inline-block bg-neutral-800 text-white rounded-md hover:bg-black text-sm font-semibold">Print QR Code</Link></div>
//         </div>
//       ) : ( <p>No active check-in token for this event.</p> )}
//       <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold disabled:opacity-50">{generateMutation.isPending ? 'Generating...' : 'Generate New 24-Hour Token'}</button>
//     </div>
//   );
// };

// export const EventRegistrationsPage = () => {
//   const { id: eventId } = useParams<{ id: string }>();
//   if (!eventId) return <div>Event ID not found.</div>;
//   const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
//   const queryClient = useQueryClient();

//   const { data: event, isLoading: isEventLoading } = useQuery({
//     queryKey: ['cms_event', eventId],
//     queryFn: async () => { const { data, error } = await supabase.from('events').select('title_en').eq('id', eventId!).single(); if (error) throw new Error(error.message); return data; },
//   });

//   const queryKey = ['registrations', eventId, statusFilter];
//   const { data: registrations, isLoading: areRegsLoading } = useQuery<Registration[]>({
//     queryKey: queryKey,
//     queryFn: async () => { 
//       let query = supabase.from('registration_details').select('*').eq('event_id', eventId!);
//       if (statusFilter !== 'all') {
//         query = query.eq('status', statusFilter);
//       }
//       const { data, error } = await query.order('created_at', { ascending: false });
//       if (error) throw new Error(error.message); 
//       return data; 
//     },
//   });

//   const updateStatusMutation = useMutation({
//     mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' | 'pending' }) => {
//       const { error } = await supabase.from('event_registrations').update({ status: newStatus }).eq('id', registrationId);
//       if (error) throw error;
//       return { registrationId, newStatus };
//     },
//     onSuccess: () => {
//       toast.success("Registration status updated!");
//       queryClient.invalidateQueries({ queryKey: ['registrations', eventId, statusFilter] });
//     },
//     onError: (error) => toast.error(error.message),
//   });

//   const isLoading = isEventLoading || areRegsLoading;

//   return (
//     <div className="space-y-6">
//       <div><Link to="/cms/events" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all events</Link><h1 className="text-3xl font-bold">Manage Registrations for "{event?.title_en || '...'}"</h1></div>
//       <CheckInTokenManager eventId={eventId!} />
//       <div>
//         <h2 className="text-2xl font-bold mb-4">Registrants ({registrations?.length || 0})</h2>
//         <div className="mb-4"><select onChange={(e) => setStatusFilter(e.target.value as any)} value={statusFilter} className="p-2 border rounded-md bg-white"><option value="all">All</option><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option></select></div>
//         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
//           <table className="min-w-full responsive-table">
//             <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Name</th><th className="p-4 text-left font-semibold">Department</th><th className="p-4 text-left font-semibold">Payment Proof</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
//             <tbody>
//               {isLoading ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> : 
//               registrations?.map(reg => (
//                 <tr key={reg.id}>
//                   <td data-label="Name" className="font-medium"><Link to={`/cms/users/${reg.user_id}`} className="text-primary hover:underline">{reg.english_name || 'N/A'}</Link></td>
//                   <td data-label="Department">{reg.department || 'N/A'}</td>
//                   <td data-label="Payment Proof">{reg.payment_proof_url ? <a href={reg.payment_proof_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-semibold">View Proof</a> : <span className="text-xs text-neutral-400">N/A</span>}</td>
//                   <td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${ reg.status === 'accepted' ? 'bg-green-100 text-green-800' : reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{reg.status}</span></td>
//                   <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
//                     {reg.status === 'pending' && (
//                       <>
//                         <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'accepted' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Accept</button>
//                         <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'rejected' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Reject</button>
//                       </>
//                     )}
//                     {(reg.status === 'accepted' || reg.status === 'rejected') && (
//                       <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'pending' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-neutral-500 text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Move to Pending</button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Tipe Data
type Registration = { id: string; user_id: string; status: 'pending' | 'accepted' | 'rejected'; english_name: string | null; department: string | null; payment_proof_url: string | null; };
type Token = { id: string; event_id: string; token: string; expires_at: string; };
type Review = { id: string; rating: number; comment: string | null; created_at: string; english_name: string | null; avatar_url: string | null; };

// Komponen CheckInTokenManager (Tidak berubah)
const CheckInTokenManager = ({ eventId }: { eventId: string }) => {
  const [activeToken, setActiveToken] = useState<Token | null>(null);
  const { data: latestToken, isLoading } = useQuery<Token | null>({ queryKey: ['latest_token', eventId], queryFn: async () => { const { data, error } = await supabase.from('event_attendance_tokens').select('*').eq('event_id', eventId).order('created_at', { ascending: false }).limit(1).single(); if (error && error.code !== 'PGRST116') return null; if (data && new Date(data.expires_at) > new Date()) { setActiveToken(data); } return data || null; }, });
  const generateMutation = useMutation({ mutationFn: async () => { const { data: { session } } = await supabase.auth.getSession(); if (!session) throw new Error("Not authenticated"); const response = await supabase.functions.invoke('generate-attendance-token', { body: { event_id: eventId }, }); if (response.error) throw response.error; return response.data as Token; }, onSuccess: (data) => { toast.success(`New token generated: ${data.token}`); setActiveToken(data); }, onError: (error) => toast.error(error.message), });
  if (isLoading) return <p>Loading check-in status...</p>;
  const checkInUrl = activeToken ? `${window.location.origin}/checkin/${activeToken.token}` : '';
  return (
    <div className="bg-neutral-100 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Event Check-in</h2>
      {activeToken ? (
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white p-4 rounded-md"><QRCodeSVG value={checkInUrl} size={128} /></div>
          <div><p className="font-semibold">Active Check-in Code:</p><p className="text-3xl font-mono tracking-widest my-2">{activeToken.token}</p><p className="text-sm text-neutral-500">Expires: {new Date(activeToken.expires_at).toLocaleString()}</p><Link to={`/print/qr/${eventId}`} target="_blank" className="px-4 py-2 mt-2 inline-block bg-neutral-800 text-white rounded-md hover:bg-black text-sm font-semibold">Print QR Code</Link></div>
        </div>
      ) : (<p>No active check-in token for this event.</p>)}
      <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold disabled:opacity-50">{generateMutation.isPending ? 'Generating...' : 'Generate New 24-Hour Token'}</button>
    </div>
  );
};

// Komponen Halaman Utama
export const EventRegistrationsPage = () => {
  const { id: eventId } = useParams<{ id: string }>();
  if (!eventId) return <div>Event ID not found.</div>;
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const queryClient = useQueryClient();

  // Query untuk Judul Event
  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ['cms_event', eventId],
    queryFn: async () => { const { data, error } = await supabase.from('events').select('title_en').eq('id', eventId!).single(); if (error) throw new Error(error.message); return data; },
  });

  // Query untuk Registrasi
  const { data: registrations, isLoading: areRegsLoading } = useQuery<Registration[]>({
    queryKey: ['registrations', eventId, statusFilter],
    queryFn: async () => {
      let query = supabase.from('registration_details').select('*').eq('event_id', eventId!);
      if (statusFilter !== 'all') { query = query.eq('status', statusFilter); }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  // --- FITUR BARU: Query untuk Reviews ---
  const { data: reviews, isLoading: areReviewsLoading } = useQuery<Review[]>({
    queryKey: ['reviews', eventId],
    queryFn: async () => {
      const { data, error } = await supabase.from('event_reviews_with_author').select('*').eq('event_id', eventId);
      if (error) throw new Error(error.message);
      return data;
    }
  });

  // Mutasi untuk Update Status Registrasi
  const updateStatusMutation = useMutation({
    mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' | 'pending' }) => {
      const { error } = await supabase.from('event_registrations').update({ status: newStatus }).eq('id', registrationId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Registration status updated!");
      queryClient.invalidateQueries({ queryKey: ['registrations', eventId, statusFilter] });
    },
    onError: (error) => toast.error(error.message),
  });

  // --- FITUR BARU: Mutasi untuk Delete Review ---
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['reviews', eventId] });
    },
    onError: (error) => toast.error(error.message),
  });

  const isLoading = isEventLoading || areRegsLoading || areReviewsLoading;

  return (
    <div className="space-y-8">
      <div><Link to="/cms/events" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all events</Link><h1 className="text-3xl font-bold">Manage Registrations for "{event?.title_en || '...'}"</h1></div>
      <CheckInTokenManager eventId={eventId!} />
      <div>
        <h2 className="text-2xl font-bold mb-4">Registrants ({registrations?.length || 0})</h2>
        <div className="mb-4"><select onChange={(e) => setStatusFilter(e.target.value as any)} value={statusFilter} className="p-2 border rounded-md bg-white"><option value="all">All</option><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option></select></div>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full responsive-table">
            <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Name</th><th className="p-4 text-left font-semibold">Department</th><th className="p-4 text-left font-semibold">Payment Proof</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> :
                registrations?.map(reg => (
                  <tr key={reg.id}>
                    <td data-label="Name" className="font-medium"><Link to={`/cms/users/${reg.user_id}`} className="text-primary hover:underline">{reg.english_name || 'N/A'}</Link></td>
                    <td data-label="Department">{reg.department || 'N/A'}</td>
                    <td data-label="Payment Proof">{reg.payment_proof_url ? <a href={reg.payment_proof_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-semibold">View Proof</a> : <span className="text-xs text-neutral-400">N/A</span>}</td>
                    <td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${reg.status === 'accepted' ? 'bg-green-100 text-green-800' : reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{reg.status}</span></td>
                    <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
                      {reg.status === 'pending' && (
                        <><button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'accepted' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Accept</button>
                          <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'rejected' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Reject</button></>
                      )}
                      {(reg.status === 'accepted' || reg.status === 'rejected') && (
                        <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'pending' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-neutral-500 text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Move to Pending</button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- BAGIAN BARU UNTUK MANAGE REVIEWS --- */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Event Reviews ({reviews?.length || 0})</h2>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full responsive-table">
            <thead className="bg-neutral-100">
              <tr>
                <th className="p-4 text-left font-semibold">Author</th>
                <th className="p-4 text-left font-semibold">Rating</th>
                <th className="p-4 text-left font-semibold">Comment</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={4} className="p-4 text-center">Loading reviews...</td></tr> :
                !reviews || reviews.length === 0 ? <tr><td colSpan={4} className="p-4 text-center text-neutral-500">No reviews found for this event.</td></tr> :
                  reviews.map(review => (
                    <tr key={review.id}>
                      <td data-label="Author" className="font-medium">{review.english_name || 'N/A'}</td>
                      <td data-label="Rating"><span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></td>
                      <td data-label="Comment" className="text-sm text-neutral-600">{review.comment || <span className="text-neutral-400 italic">No comment</span>}</td>
                      <td data-label="Actions" className="text-right">
                        <button
                          onClick={() => window.confirm('Are you sure you want to delete this review?') && deleteReviewMutation.mutate(review.id)}
                          disabled={deleteReviewMutation.isPending}
                          className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};