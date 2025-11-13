// // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // import { useParams, Link } from 'react-router-dom';
// // // // import { supabase } from '../../contexts/AuthContext';
// // // // import toast from 'react-hot-toast';
// // // // import { useState } from 'react';
// // // // import { QRCodeSVG } from 'qrcode.react';

// // // // type Registration = {
// // // //   id: string;
// // // //   user_id: string;
// // // //   status: 'pending' | 'accepted' | 'rejected';
// // // //   english_name: string | null;
// // // //   student_id: string | null;
// // // //   department: string | null;
// // // //   nationality: string | null;
// // // //   email: string | null;
// // // //   payment_proof_url: string | null;
// // // // };
// // // // type Token = { id: string; event_id: string; token: string; expires_at: string; };

// // // // const CheckInTokenManager = ({ eventId }: { eventId: string }) => {
// // // //   const [activeToken, setActiveToken] = useState<Token | null>(null);
// // // //   const { data: latestToken, isLoading } = useQuery<Token | null>({ queryKey: ['latest_token', eventId], queryFn: async () => { const { data, error } = await supabase.from('event_attendance_tokens').select('*').eq('event_id', eventId).order('created_at', { ascending: false }).limit(1).single(); if (error && error.code !== 'PGRST116') return null; if (data && new Date(data.expires_at) > new Date()) { setActiveToken(data); } return data || null; }, });
// // // //   const generateMutation = useMutation({ mutationFn: async () => { const { data: { session } } = await supabase.auth.getSession(); if (!session) throw new Error("Not authenticated"); const response = await supabase.functions.invoke('generate-attendance-token', { body: { event_id: eventId }, }); if (response.error) throw response.error; return response.data as Token; }, onSuccess: (data) => { toast.success(`New token generated: ${data.token}`); setActiveToken(data); }, onError: (error) => toast.error(error.message), });
// // // //   if (isLoading) return <p>Loading check-in status...</p>;
// // // //   const checkInUrl = activeToken ? `${window.location.origin}/checkin/${activeToken.token}` : '';
// // // //   return (
// // // //     <div className="bg-neutral-100 p-6 rounded-lg">
// // // //       <h2 className="text-xl font-bold mb-4">Event Check-in</h2>
// // // //       {activeToken ? (
// // // //         <div className="flex flex-col md:flex-row items-center gap-6">
// // // //           <div className="bg-white p-4 rounded-md"><QRCodeSVG value={checkInUrl} size={128} /></div>
// // // //           <div><p className="font-semibold">Active Check-in Code:</p><p className="text-3xl font-mono tracking-widest my-2">{activeToken.token}</p><p className="text-sm text-neutral-500">Expires: {new Date(activeToken.expires_at).toLocaleString()}</p><Link to={`/print/qr/${eventId}`} target="_blank" className="px-4 py-2 mt-2 inline-block bg-neutral-800 text-white rounded-md hover:bg-black text-sm font-semibold">Print QR Code</Link></div>
// // // //         </div>
// // // //       ) : ( <p>No active check-in token for this event.</p> )}
// // // //       <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold disabled:opacity-50">{generateMutation.isPending ? 'Generating...' : 'Generate New 24-Hour Token'}</button>
// // // //     </div>
// // // //   );
// // // // };

// // // // export const EventRegistrationsPage = () => {
// // // //   const { id: eventId } = useParams<{ id: string }>();
// // // //   if (!eventId) return <div>Event ID not found.</div>;
// // // //   const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
// // // //   const queryClient = useQueryClient();

// // // //   const { data: event, isLoading: isEventLoading } = useQuery({
// // // //     queryKey: ['cms_event', eventId],
// // // //     queryFn: async () => { const { data, error } = await supabase.from('events').select('title_en').eq('id', eventId!).single(); if (error) throw new Error(error.message); return data; },
// // // //   });

// // // //   const { data: registrations, isLoading: areRegsLoading } = useQuery<Registration[]>({
// // // //     queryKey: ['registrations', eventId, statusFilter],
// // // //     queryFn: async () => { 
// // // //       let query = supabase.from('registration_details').select('*').eq('event_id', eventId!);
// // // //       if (statusFilter !== 'all') {
// // // //         query = query.eq('status', statusFilter);
// // // //       }
// // // //       const { data, error } = await query.order('created_at', { ascending: false });
// // // //       if (error) throw new Error(error.message); 
// // // //       return data; 
// // // //     },
// // // //   });

// // // //   const updateStatusMutation = useMutation({
// // // //     mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' }) => {
// // // //       const { error } = await supabase.from('event_registrations').update({ status: newStatus }).eq('id', registrationId);
// // // //       if (error) throw error;
// // // //       return { registrationId, newStatus };
// // // //     },
// // // //     onSuccess: () => {
// // // //       toast.success("Registration status updated!");
// // // //       queryClient.invalidateQueries({ queryKey: ['registrations', eventId, statusFilter] });
// // // //     },
// // // //     onError: (error) => toast.error(error.message),
// // // //   });

// // // //   const isLoading = isEventLoading || areRegsLoading;

// // // //   return (
// // // //     <div className="space-y-6">
// // // //       <div><Link to="/cms/events" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all events</Link><h1 className="text-3xl font-bold">Manage Registrations for "{event?.title_en || '...'}"</h1></div>
// // // //       <CheckInTokenManager eventId={eventId!} />
// // // //       <div>
// // // //         <h2 className="text-2xl font-bold mb-4">Registrants ({registrations?.length || 0})</h2>
// // // //         <div className="mb-4"><select onChange={(e) => setStatusFilter(e.target.value as any)} value={statusFilter} className="p-2 border rounded-md bg-white"><option value="all">All</option><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option></select></div>
// // // //         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
// // // //           <table className="min-w-full responsive-table">
// // // //             <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Name</th><th className="p-4 text-left font-semibold">Department</th><th className="p-4 text-left font-semibold">Payment Proof</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
// // // //             <tbody>
// // // //               {isLoading ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> : 
// // // //               registrations?.map(reg => (
// // // //                 <tr key={reg.id}>
// // // //                   <td data-label="Name" className="font-medium"><Link to={`/cms/users/${reg.user_id}`} className="text-primary hover:underline">{reg.english_name || 'N/A'}</Link></td>
// // // //                   <td data-label="Department">{reg.department || 'N/A'}</td>
// // // //                   <td data-label="Payment Proof">{reg.payment_proof_url ? <a href={reg.payment_proof_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-semibold">View Proof</a> : <span className="text-xs text-neutral-400">N/A</span>}</td>
// // // //                   <td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${ reg.status === 'accepted' ? 'bg-green-100 text-green-800' : reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{reg.status}</span></td>
// // // //                   <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
// // // //                     {reg.status === 'pending' && (
// // // //                       <><button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'accepted' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Accept</button>
// // // //                       <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'rejected' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Reject</button></>
// // // //                     )}
// // // //                   </td>
// // // //                 </tr>
// // // //               ))}
// // // //             </tbody>
// // // //           </table>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

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

// // //   const queryKey = ['registrations', eventId, statusFilter];
// // //   const { data: registrations, isLoading: areRegsLoading } = useQuery<Registration[]>({
// // //     queryKey: queryKey,
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
// //     mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' | 'pending' }) => {
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
// //                       <>
// //                         <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'accepted' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Accept</button>
// //                         <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'rejected' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Reject</button>
// //                       </>
// //                     )}
// //                     {(reg.status === 'accepted' || reg.status === 'rejected') && (
// //                       <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'pending' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-neutral-500 text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Move to Pending</button>
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

// // Tipe Data
// type Registration = {
//   id: string;
//   user_id: string;
//   status: 'pending' | 'accepted' | 'rejected';
//   created_at: string;
//   users: {
//     english_name: string | null;
//     student_id: string | null;
//     department: string | null;
//     nationality: string | null;
//     email: string | null;
//   } | null;
//   payment_proof_url: string | null;
// };
// type Token = { id: string; event_id: string; token: string; expires_at: string; };
// type Review = {
//   id: string;
//   rating: number;
//   comment: string | null;
//   created_at: string;
//   users: {
//     english_name: string | null;
//     avatar_url: string | null;
//   } | null;
// };

// // Token API functions
// const getLatestToken = async (eventId: string) => {
//   const { data: { session } } = await supabase.auth.getSession();
//   if (!session) throw new Error('Not authenticated');

//   const { data, error } = await supabase
//     .from('attendance_tokens')
//     .select('*')
//     .eq('event_id', eventId)
//     .gte('expires_at', new Date().toISOString())
//     .order('created_at', { ascending: false })
//     .limit(1)
//     .single();

//   if (error && error.code !== 'PGRST116') throw error;
//   return data as Token | null;
// };

// const generateAttendanceToken = async (eventId: string) => {
//   const { data: { session } } = await supabase.auth.getSession();
//   if (!session) throw new Error('Not authenticated');

//   // Generate a random 6-digit token
//   const token = Math.floor(100000 + Math.random() * 900000).toString();
//   const expiresAt = new Date();
//   expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

//   const { data, error } = await supabase
//     .from('attendance_tokens')
//     .insert({
//       event_id: eventId,
//       token: token,
//       expires_at: expiresAt.toISOString()
//     })
//     .select()
//     .single();

//   if (error) throw error;
//   return data as Token;
// };

// // Komponen CheckInTokenManager dengan Edge Function
// const CheckInTokenManager = ({ eventId }: { eventId: string }) => {
//   const [activeToken, setActiveToken] = useState<Token | null>(null);
//   const { isLoading } = useQuery<Token | null>({
//     queryKey: ['latest_token', eventId],
//     queryFn: async () => {
//       const token = await getLatestToken(eventId);
//       if (token && new Date(token.expires_at) > new Date()) {
//         setActiveToken(token);
//       }
//       return token;
//     },
//   });
//   const generateMutation = useMutation({
//     mutationFn: async () => await generateAttendanceToken(eventId),
//     onSuccess: (data) => {
//       toast.success(`New token generated: ${data.token}`);
//       setActiveToken(data);
//     },
//     onError: (error) => toast.error(error.message),
//   });
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
//       ) : (<p>No active check-in token for this event.</p>)}
//       <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold disabled:opacity-50">{generateMutation.isPending ? 'Generating...' : 'Generate New 24-Hour Token'}</button>
//     </div>
//   );
// };

// // Event and Registration API functions
// const getEventTitle = async (eventId: string) => {
//   const { data: { session } } = await supabase.auth.getSession();
//   if (!session) throw new Error('Not authenticated');

//   const { data, error } = await supabase
//     .from('events')
//     .select('title_en')
//     .eq('id', eventId)
//     .single();

//   if (error) throw error;
//   return data;
// };

// const getRegistrations = async (eventId: string, statusFilter: string) => {
//   const { data: { session } } = await supabase.auth.getSession();
//   if (!session) throw new Error('Not authenticated');

//   let query = supabase
//     .from('event_registrations')
//     .select(`
//       id,
//       user_id,
//       status,
//       created_at,
//       payment_proof_url,
//       users!user_id (
//         english_name,
//         student_id,
//         department,
//         nationality,
//         email
//       )
//     `)
//     .eq('event_id', eventId);

//   if (statusFilter !== 'all') {
//     query = query.eq('status', statusFilter);
//   }

//   const { data, error } = await query.order('created_at', { ascending: false });

//   if (error) throw error;
//   return data as any;
// };

// const getReviews = async (eventId: string) => {
//   const { data: { session } } = await supabase.auth.getSession();
//   if (!session) throw new Error('Not authenticated');

//   const { data, error } = await supabase
//     .from('event_reviews')
//     .select(`
//       id,
//       rating,
//       comment,
//       created_at,
//       users!user_id (
//         english_name,
//         avatar_url
//       )
//     `)
//     .eq('event_id', eventId)
//     .order('created_at', { ascending: false });

//   if (error) throw error;
//   return data as any;
// };

// const updateRegistrationStatus = async (registrationId: string, newStatus: string) => {
//   const { data: { session } } = await supabase.auth.getSession();
//   if (!session) throw new Error('Not authenticated');

//   const { error } = await supabase
//     .from('event_registrations')
//     .update({ status: newStatus })
//     .eq('id', registrationId);

//   if (error) throw error;
//   return { success: true };
// };

// const deleteReview = async (reviewId: string) => {
//   const { data: { session } } = await supabase.auth.getSession();
//   if (!session) throw new Error('Not authenticated');

//   const { error } = await supabase
//     .from('event_reviews')
//     .delete()
//     .eq('id', reviewId);

//   if (error) throw error;
//   return { success: true };
// };

// // Komponen Halaman Utama
// export const EventRegistrationsPage = () => {
//   const { id: eventId } = useParams<{ id: string }>();
//   if (!eventId) return <div>Event ID not found.</div>;
//   const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
//   const queryClient = useQueryClient();

//   // Query untuk Judul Event - Updated to use Edge Function
//   const { data: event, isLoading: isEventLoading } = useQuery({
//     queryKey: ['cms_event', eventId],
//     queryFn: async () => await getEventTitle(eventId),
//   });

//   // Query untuk Registrasi - Updated to use Edge Function
//   const { data: registrations, isLoading: areRegsLoading } = useQuery<Registration[]>({
//     queryKey: ['registrations', eventId, statusFilter],
//     queryFn: async () => await getRegistrations(eventId, statusFilter),
//   });

//   // Query untuk Reviews - Updated to use Edge Function
//   const { data: reviews, isLoading: areReviewsLoading } = useQuery<Review[]>({
//     queryKey: ['reviews', eventId],
//     queryFn: async () => await getReviews(eventId),
//   });

//   // Mutasi untuk Update Status Registrasi - Updated to use Edge Function
//   const updateStatusMutation = useMutation({
//     mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' | 'pending' }) => {
//       await updateRegistrationStatus(registrationId, newStatus);
//     },
//     onSuccess: () => {
//       toast.success("Registration status updated!");
//       queryClient.invalidateQueries({ queryKey: ['registrations', eventId, statusFilter] });
//     },
//     onError: (error) => toast.error(error.message),
//   });

//   // Mutasi untuk Delete Review - Updated to use Edge Function
//   const deleteReviewMutation = useMutation({
//     mutationFn: async (reviewId: string) => {
//       await deleteReview(reviewId);
//     },
//     onSuccess: () => {
//       toast.success("Review deleted successfully!");
//       queryClient.invalidateQueries({ queryKey: ['reviews', eventId] });
//     },
//     onError: (error) => toast.error(error.message),
//   });

//   const isLoading = isEventLoading || areRegsLoading || areReviewsLoading;

//   return (
//     <div className="space-y-8">
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
//                 registrations?.map(reg => (
//                   <tr key={reg.id}>
//                     <td data-label="Name" className="font-medium"><Link to={`/cms/users/${reg.user_id}`} className="text-primary hover:underline">{reg.users?.english_name || 'N/A'}</Link></td>
//                     <td data-label="Department">{reg.users?.department || 'N/A'}</td>
//                     <td data-label="Payment Proof">{reg.payment_proof_url ? <a href={reg.payment_proof_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-semibold">View Proof</a> : <span className="text-xs text-neutral-400">N/A</span>}</td>
//                     <td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${reg.status === 'accepted' ? 'bg-green-100 text-green-800' : reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{reg.status}</span></td>
//                     <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
//                       {reg.status === 'pending' && (
//                         <><button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'accepted' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Accept</button>
//                           <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'rejected' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Reject</button></>
//                       )}
//                       {(reg.status === 'accepted' || reg.status === 'rejected') && (
//                         <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'pending' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-neutral-500 text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Move to Pending</button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- BAGIAN BARU UNTUK MANAGE REVIEWS --- */}
//       <div>
//         <h2 className="text-2xl font-bold mb-4">Event Reviews ({reviews?.length || 0})</h2>
//         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
//           <table className="min-w-full responsive-table">
//             <thead className="bg-neutral-100">
//               <tr>
//                 <th className="p-4 text-left font-semibold">Author</th>
//                 <th className="p-4 text-left font-semibold">Rating</th>
//                 <th className="p-4 text-left font-semibold">Comment</th>
//                 <th className="p-4 text-right font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading ? <tr><td colSpan={4} className="p-4 text-center">Loading reviews...</td></tr> :
//                 !reviews || reviews.length === 0 ? <tr><td colSpan={4} className="p-4 text-center text-neutral-500">No reviews found for this event.</td></tr> :
//                   reviews.map(review => (
//                     <tr key={review.id}>
//                       <td data-label="Author" className="font-medium">{review.users?.english_name || 'N/A'}</td>
//                       <td data-label="Rating"><span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></td>
//                       <td data-label="Comment" className="text-sm text-neutral-600">{review.comment || <span className="text-neutral-400 italic">No comment</span>}</td>
//                       <td data-label="Actions" className="text-right">
//                         <button
//                           onClick={() => window.confirm('Are you sure you want to delete this review?') && deleteReviewMutation.mutate(review.id)}
//                           disabled={deleteReviewMutation.isPending}
//                           className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { supabase, useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Tipe Data (Disesuaikan dengan data 'flat' dari Views)
type Registration = {
  id: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  payment_proof_url: string | null;
  // Data user sekarang 'flat' dari view registration_details
  english_name: string | null;
  student_id: string | null;
  department: string | null;
  nationality: string | null;
  email: string | null;
};
type Token = { id: string; event_id: string; token: string; expires_at: string; };
type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  // Data user sekarang 'flat' dari view event_reviews_with_author
  english_name: string | null;
  avatar_url: string | null;
};

// Komponen CheckInTokenManager dengan Edge Function
const CheckInTokenManager = ({ eventId }: { eventId: string }) => {
  const [activeToken, setActiveToken] = useState<Token | null>(null);
  const { session } = useAuth(); // <-- Ganti dari user ke session

  // Menggunakan 'crud-event-registrations' untuk GET_LATEST_TOKEN
  const { isLoading } = useQuery<Token | null>({
    queryKey: ['latest_token', eventId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('crud-event-registrations', {
        body: { action: 'get_latest_token', eventId }
      });
      if (error) throw error;

      // Edge function mengembalikan { data: token }, jadi kita ambil data.data
      const token = data.data;
      if (token && new Date(token.expires_at) > new Date()) {
        setActiveToken(token);
      }
      return token;
    },
    enabled: !!session, // <-- Ganti dari user ke session
  });

  // Menggunakan 'generate-attendance-token'
  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error("Not authenticated"); // <-- Cek session
      const { data, error } = await supabase.functions.invoke('generate-attendance-token', {
        body: { event_id: eventId }
      });
      if (error) throw error;
      // Edge function ini mengembalikan token-nya langsung
      return data as Token;
    },
    onSuccess: (data) => {
      toast.success(`New token generated: ${data.token}`);
      setActiveToken(data);
    },
    onError: (error) => toast.error(error.message),
  });

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
  const { session } = useAuth(); // <-- Ganti dari user ke session

  // Query untuk Judul Event - Updated to use Edge Function
  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ['cms_event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('crud-event-registrations', {
        body: { action: 'get_event_title', eventId }
      });
      if (error) throw error;
      return data.data; // Mengambil data dari { data: ... }
    },
    enabled: !!session, // <-- Ganti dari user ke session
  });

  // Query untuk Registrasi - Updated to use Edge Function
  const { data: registrations, isLoading: areRegsLoading } = useQuery<Registration[]>({
    queryKey: ['registrations', eventId, statusFilter],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('crud-event-registrations', {
        body: { action: 'get_registrations', eventId, statusFilter }
      });
      if (error) throw error;
      return data.data; // Mengambil data dari { data: ... }
    },
    enabled: !!session, // <-- Ganti dari user ke session
  });

  // Query untuk Reviews - Updated to use Edge Function
  const { data: reviews, isLoading: areReviewsLoading } = useQuery<Review[]>({
    queryKey: ['reviews', eventId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('crud-event-registrations', {
        body: { action: 'get_reviews', eventId }
      });
      if (error) throw error;
      return data.data; // Mengambil data dari { data: ... }
    },
    enabled: !!session, // <-- Ganti dari user ke session
  });

  // Mutasi untuk Update Status Registrasi - Updated to use Edge Function
  const updateStatusMutation = useMutation({
    mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' | 'pending' }) => {
      if (!session) throw new Error("Not authenticated"); // <-- Cek session
      const { error } = await supabase.functions.invoke('crud-event-registrations', {
        body: { action: 'update_registration_status', registrationId, newStatus }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Registration status updated!");
      queryClient.invalidateQueries({ queryKey: ['registrations', eventId, statusFilter] });
    },
    onError: (error) => toast.error(error.message),
  });

  // Mutasi untuk Delete Review - Updated to use Edge Function
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      if (!session) throw new Error("Not authenticated"); // <-- Cek session
      const { error } = await supabase.functions.invoke('crud-event-registrations', {
        body: { action: 'delete_review', reviewId }
      });
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
                    {/* [PERUBAHAN] Menggunakan data flat: reg.english_name, bukan reg.users.english_name */}
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
                      {/* [PERUBAHAN] Menggunakan data flat: review.english_name */}
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