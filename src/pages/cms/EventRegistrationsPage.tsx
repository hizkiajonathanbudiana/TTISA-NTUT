// // // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // // import { useParams, Link } from 'react-router-dom';
// // // // // // import { supabase } from '../../contexts/AuthContext';
// // // // // // import toast from 'react-hot-toast';
// // // // // // import { useState } from 'react';
// // // // // // import { QRCodeSVG } from 'qrcode.react';

// // // // // // type Registration = { id: string; created_at: string; status: 'pending' | 'accepted' | 'rejected'; english_name: string | null; student_id: string | null; email: string | null; };
// // // // // // type Token = { id: string; event_id: string; token: string; expires_at: string; };

// // // // // // const CheckInTokenManager = ({ eventId }: { eventId: string }) => {
// // // // // //     const [activeToken, setActiveToken] = useState<Token | null>(null);
// // // // // //     const { data: latestToken, isLoading } = useQuery<Token | null>({ queryKey: ['latest_token', eventId], queryFn: async () => { const { data, error } = await supabase.from('event_attendance_tokens').select('*').eq('event_id', eventId).order('created_at', { ascending: false }).limit(1).single(); if (error && error.code !== 'PGRST116') return null; if (data && new Date(data.expires_at) > new Date()) { setActiveToken(data); } return data || null; }, });
// // // // // //     const generateMutation = useMutation({ mutationFn: async () => { const { data: { session } } = await supabase.auth.getSession(); if (!session) throw new Error("Not authenticated"); const response = await supabase.functions.invoke('generate-attendance-token', { body: { event_id: eventId }, }); if (response.error) throw response.error; return response.data as Token; }, onSuccess: (data) => { toast.success(`New token generated: ${data.token}`); setActiveToken(data); }, onError: (error) => toast.error(error.message), });
// // // // // //     if (isLoading) return <p>Loading check-in status...</p>;
// // // // // //     const checkInUrl = activeToken ? `${window.location.origin}/checkin/${activeToken.token}` : '';
// // // // // //     return (<div className="bg-neutral-100 p-6 rounded-lg mb-6"> <h2 className="text-xl font-bold mb-4">Event Check-in</h2> {activeToken ? (<div className="flex flex-col md:flex-row items-center gap-6"><div className="bg-white p-4 rounded-md"><QRCodeSVG value={checkInUrl} size={128} /></div><div><p className="font-semibold">Active Check-in Code:</p><p className="text-3xl font-mono tracking-widest my-2">{activeToken.token}</p><p className="text-sm text-neutral-500">Expires: {new Date(activeToken.expires_at).toLocaleString()}</p><Link to={`/print/qr/${eventId}`} target="_blank" className="px-4 py-2 mt-2 inline-block bg-neutral-800 text-white rounded-md hover:bg-black text-sm">Print QR Code</Link></div></div>) : (<p>No active check-in token for this event.</p>)} <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50">{generateMutation.isPending ? 'Generating...' : 'Generate New 24-Hour Token'}</button> </div>);
// // // // // // };

// // // // // // export const EventRegistrationsPage = () => {
// // // // // //     const { id: eventId } = useParams<{ id: string }>();
// // // // // //     if (!eventId) return <div>Event ID not found.</div>;
// // // // // //     const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
// // // // // //     const queryClient = useQueryClient();
// // // // // //     const { data: event, isLoading: isEventLoading } = useQuery({ queryKey: ['cms_event', eventId], queryFn: async () => { const { data, error } = await supabase.from('events').select('title_en').eq('id', eventId).single(); if (error) throw new Error(error.message); return data; } });
// // // // // //     const { data: registrations, isLoading: areRegsLoading } = useQuery<Registration[]>({ queryKey: ['registrations', eventId], queryFn: async () => { const { data, error } = await supabase.from('registration_details').select('*').eq('event_id', eventId!); if (error) throw new Error(error.message); return data; }, enabled: !!eventId, });

// // // // // //     const updateStatusMutation = useMutation({
// // // // // //         mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' }) => {
// // // // // //             // Step 1: Update status di database
// // // // // //             const { error: updateError } = await supabase.from('event_registrations').update({ status: newStatus }).eq('id', registrationId);
// // // // // //             if (updateError) throw updateError;

// // // // // //             // Step 2: Panggil Edge Function secara langsung
// // // // // //             const { error: functionError } = await supabase.functions.invoke('notify-registration-status', {
// // // // // //                 body: { registration_id: registrationId },
// // // // // //             });
// // // // // //             // Jika function gagal, error akan ditangkap oleh onError
// // // // // //             if (functionError) throw functionError;
// // // // // //         },
// // // // // //         onSuccess: () => {
// // // // // //             toast.success("Registration status updated and notification sent.");
// // // // // //             queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
// // // // // //         },
// // // // // //         onError: (error) => {
// // // // // //             // Sekarang kita akan mendapatkan error yang jelas di sini
// // // // // //             toast.error(`Action failed: ${error.message}`);
// // // // // //         },
// // // // // //     });

// // // // // //     const filteredRegistrations = registrations?.filter(r => statusFilter === 'all' || r.status === statusFilter);
// // // // // //     const isLoading = isEventLoading || areRegsLoading;

// // // // // //     return (
// // // // // //         <div>
// // // // // //             <Link to="/cms/events" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all events</Link>
// // // // // //             <h1 className="text-3xl font-bold mb-2">Manage "{event?.title_en || '...'}"</h1>
// // // // // //             <CheckInTokenManager eventId={eventId} />
// // // // // //             <h2 className="text-xl font-bold mb-4">Registrations</h2>
// // // // // //             <p className="text-neutral-500 mb-6">Total Registrations: {registrations?.length || 0}</p>
// // // // // //             <div className="mb-4"><select onChange={(e) => setStatusFilter(e.target.value as any)} value={statusFilter} className="p-2 border rounded-md bg-white"><option value="all">All Statuses</option><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option></select></div>
// // // // // //             {isLoading ? <p>Loading registrations...</p> : (<div className="bg-white shadow-md rounded-lg overflow-x-auto"><table className="min-w-full"><thead className="bg-neutral-100"><tr><th className="p-4 text-left">Name</th><th className="p-4 text-left">Email</th><th className="p-4 text-left">Student ID</th><th className="p-4 text-left">Status</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{filteredRegistrations?.map(reg => (<tr key={reg.id} className="border-b"><td className="p-4">{reg.english_name || 'N/A'}</td><td className="p-4">{reg.email || 'N/A'}</td><td className="p-4">{reg.student_id || 'N/A'}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${reg.status === 'accepted' ? 'bg-green-100 text-green-800' : reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{reg.status}</span></td><td className="p-4 text-right space-x-2">{reg.status === 'pending' && (<><button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'accepted' })} className="px-3 py-1 bg-secondary text-white rounded-md text-sm">Accept</button><button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'rejected' })} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm">Reject</button></>)}</td></tr>))}</tbody></table></div>)}
// // // // // //         </div>
// // // // // //     );
// // // // // // };

// // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // import { useParams, Link } from 'react-router-dom';
// // // // // import { supabase } from '../../contexts/AuthContext';
// // // // // import toast from 'react-hot-toast';
// // // // // import { useState } from 'react';
// // // // // import { QRCodeSVG } from 'qrcode.react';

// // // // // type Registration = {
// // // // //     id: string;
// // // // //     status: 'pending' | 'accepted' | 'rejected';
// // // // //     english_name: string | null;
// // // // //     student_id: string | null;
// // // // //     department: string | null;
// // // // //     nationality: string | null;
// // // // //     email: string | null;
// // // // // };
// // // // // type Token = { id: string; event_id: string; token: string; expires_at: string; };

// // // // // const CheckInTokenManager = ({ eventId }: { eventId: string }) => {
// // // // //     const [activeToken, setActiveToken] = useState<Token | null>(null);
// // // // //     const { data: latestToken, isLoading } = useQuery<Token | null>({ queryKey: ['latest_token', eventId], queryFn: async () => { const { data, error } = await supabase.from('event_attendance_tokens').select('*').eq('event_id', eventId).order('created_at', { ascending: false }).limit(1).single(); if (error && error.code !== 'PGRST116') return null; if (data && new Date(data.expires_at) > new Date()) { setActiveToken(data); } return data || null; }, });
// // // // //     const generateMutation = useMutation({ mutationFn: async () => { const { data: { session } } = await supabase.auth.getSession(); if (!session) throw new Error("Not authenticated"); const response = await supabase.functions.invoke('generate-attendance-token', { body: { event_id: eventId }, }); if (response.error) throw response.error; return response.data as Token; }, onSuccess: (data) => { toast.success(`New token generated: ${data.token}`); setActiveToken(data); }, onError: (error) => toast.error(error.message), });
// // // // //     if (isLoading) return <p>Loading check-in status...</p>;
// // // // //     const checkInUrl = activeToken ? `${window.location.origin}/checkin/${activeToken.token}` : '';
// // // // //     return (
// // // // //         <div className="bg-neutral-100 p-6 rounded-lg mb-6">
// // // // //             <h2 className="text-xl font-bold mb-4">Event Check-in</h2>
// // // // //             {activeToken ? (
// // // // //                 <div className="flex flex-col md:flex-row items-center gap-6">
// // // // //                     <div className="bg-white p-4 rounded-md"><QRCodeSVG value={checkInUrl} size={128} /></div>
// // // // //                     <div><p className="font-semibold">Active Check-in Code:</p><p className="text-3xl font-mono tracking-widest my-2">{activeToken.token}</p><p className="text-sm text-neutral-500">Expires: {new Date(activeToken.expires_at).toLocaleString()}</p><Link to={`/print/qr/${eventId}`} target="_blank" className="px-4 py-2 mt-2 inline-block bg-neutral-800 text-white rounded-md hover:bg-black text-sm">Print QR Code</Link></div>
// // // // //                 </div>
// // // // //             ) : (
// // // // //                 <p>No active check-in token for this event.</p>
// // // // //             )}
// // // // //             <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold disabled:opacity-50">{generateMutation.isPending ? 'Generating...' : 'Generate New 24-Hour Token'}</button>
// // // // //         </div>
// // // // //     );
// // // // // };

// // // // // export const EventRegistrationsPage = () => {
// // // // //     const { id: eventId } = useParams<{ id: string }>();
// // // // //     if (!eventId) return <div>Event ID not found.</div>;
// // // // //     const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
// // // // //     const queryClient = useQueryClient();

// // // // //     const { data: event, isLoading: isEventLoading } = useQuery({
// // // // //         queryKey: ['cms_event', eventId],
// // // // //         queryFn: async () => {
// // // // //             const { data, error } = await supabase.from('events').select('title_en').eq('id', eventId).single();
// // // // //             if (error) throw new Error(error.message);
// // // // //             return data;
// // // // //         }
// // // // //     });

// // // // //     const { data: registrations, isLoading: areRegsLoading } = useQuery<Registration[]>({
// // // // //         queryKey: ['registrations', eventId],
// // // // //         queryFn: async () => {
// // // // //             const { data, error } = await supabase.from('registration_details').select('*').eq('event_id', eventId!);
// // // // //             if (error) throw new Error(error.message);
// // // // //             return data;
// // // // //         },
// // // // //         enabled: !!eventId,
// // // // //     });

// // // // //     const updateStatusMutation = useMutation({
// // // // //         mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' }) => {
// // // // //             const { error } = await supabase.from('event_registrations').update({ status: newStatus }).eq('id', registrationId);
// // // // //             if (error) throw error;
// // // // //         },
// // // // //         onSuccess: () => {
// // // // //             toast.success("Registration status updated!");
// // // // //             queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
// // // // //         },
// // // // //         onError: (error) => toast.error(error.message),
// // // // //     });

// // // // //     const filteredRegistrations = registrations?.filter(r => statusFilter === 'all' || r.status === statusFilter);
// // // // //     const isLoading = isEventLoading || areRegsLoading;

// // // // //     return (
// // // // //         <div className="space-y-6">
// // // // //             <div>
// // // // //                 <Link to="/cms/events" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all events</Link>
// // // // //                 <h1 className="text-3xl font-bold">Manage Registrations for "{event?.title_en || '...'}"</h1>
// // // // //             </div>
// // // // //             <CheckInTokenManager eventId={eventId} />
// // // // //             <div>
// // // // //                 <h2 className="text-2xl font-bold mb-4">Registrants ({registrations?.length || 0})</h2>
// // // // //                 <div className="mb-4">
// // // // //                     <select onChange={(e) => setStatusFilter(e.target.value as any)} value={statusFilter} className="p-2 border rounded-md bg-white">
// // // // //                         <option value="all">All Statuses</option>
// // // // //                         <option value="pending">Pending</option>
// // // // //                         <option value="accepted">Accepted</option>
// // // // //                         <option value="rejected">Rejected</option>
// // // // //                     </select>
// // // // //                 </div>
// // // // //                 <div className="bg-white shadow-md rounded-lg overflow-x-auto">
// // // // //                     <table className="min-w-full">
// // // // //                         <thead className="bg-neutral-100">
// // // // //                             <tr>
// // // // //                                 <th className="p-4 text-left font-semibold">Name</th>
// // // // //                                 <th className="p-4 text-left font-semibold">Department</th>
// // // // //                                 <th className="p-4 text-left font-semibold">Nationality</th>
// // // // //                                 <th className="p-4 text-left font-semibold">Status</th>
// // // // //                                 <th className="p-4 text-right font-semibold">Actions</th>
// // // // //                             </tr>
// // // // //                         </thead>
// // // // //                         <tbody>
// // // // //                             {isLoading ? (
// // // // //                                 <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
// // // // //                             ) : filteredRegistrations?.map(reg => (
// // // // //                                 <tr key={reg.id} className="border-b hover:bg-neutral-50">
// // // // //                                     <td className="p-4 font-medium">{reg.english_name || 'N/A'}</td>
// // // // //                                     <td className="p-4">{reg.department || 'N/A'}</td>
// // // // //                                     <td className="p-4">{reg.nationality || 'N/A'}</td>
// // // // //                                     <td className="p-4">
// // // // //                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${reg.status === 'accepted' ? 'bg-green-100 text-green-800' : reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
// // // // //                                             {reg.status}
// // // // //                                         </span>
// // // // //                                     </td>
// // // // //                                     <td className="p-4 text-right space-x-2">
// // // // //                                         {reg.status === 'pending' && (
// // // // //                                             <>
// // // // //                                                 <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'accepted' })} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover">Accept</button>
// // // // //                                                 <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'rejected' })} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700">Reject</button>
// // // // //                                             </>
// // // // //                                         )}
// // // // //                                     </td>
// // // // //                                 </tr>
// // // // //                             ))}
// // // // //                         </tbody>
// // // // //                     </table>
// // // // //                 </div>
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // };

// // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // import { useParams, Link } from 'react-router-dom';
// // // // import { supabase } from '../../contexts/AuthContext';
// // // // import toast from 'react-hot-toast';
// // // // import { useState } from 'react';
// // // // import { QRCodeSVG } from 'qrcode.react';

// // // // type Registration = {
// // // //     id: string;
// // // //     status: 'pending' | 'accepted' | 'rejected';
// // // //     english_name: string | null;
// // // //     student_id: string | null;
// // // //     department: string | null;
// // // //     nationality: string | null;
// // // //     email: string | null;
// // // // };
// // // // type Token = { id: string; event_id: string; token: string; expires_at: string; };

// // // // const CheckInTokenManager = ({ eventId }: { eventId: string }) => {
// // // //     const [activeToken, setActiveToken] = useState<Token | null>(null);
// // // //     const { data: latestToken, isLoading } = useQuery<Token | null>({
// // // //         queryKey: ['latest_token', eventId],
// // // //         queryFn: async () => {
// // // //             const { data, error } = await supabase.from('event_attendance_tokens').select('*').eq('event_id', eventId).order('created_at', { ascending: false }).limit(1).single();
// // // //             if (error && error.code !== 'PGRST116') return null;
// // // //             if (data && new Date(data.expires_at) > new Date()) {
// // // //                 setActiveToken(data);
// // // //             }
// // // //             return data || null;
// // // //         },
// // // //     });

// // // //     const generateMutation = useMutation({
// // // //         mutationFn: async () => {
// // // //             const { data: { session } } = await supabase.auth.getSession();
// // // //             if (!session) throw new Error("Not authenticated");
// // // //             const response = await supabase.functions.invoke('generate-attendance-token', { body: { event_id: eventId }, });
// // // //             if (response.error) throw response.error;
// // // //             return response.data as Token;
// // // //         },
// // // //         onSuccess: (data) => {
// // // //             toast.success(`New token generated: ${data.token}`);
// // // //             setActiveToken(data);
// // // //         },
// // // //         onError: (error) => toast.error(error.message),
// // // //     });

// // // //     if (isLoading) return <p>Loading check-in status...</p>;
// // // //     const checkInUrl = activeToken ? `${window.location.origin}/checkin/${activeToken.token}` : '';

// // // //     return (
// // // //         <div className="bg-neutral-100 p-6 rounded-lg">
// // // //             <h2 className="text-xl font-bold mb-4">Event Check-in</h2>
// // // //             {activeToken ? (
// // // //                 <div className="flex flex-col md:flex-row items-center gap-6">
// // // //                     <div className="bg-white p-4 rounded-md">
// // // //                         <QRCodeSVG value={checkInUrl} size={128} />
// // // //                     </div>
// // // //                     <div>
// // // //                         <p className="font-semibold">Active Check-in Code:</p>
// // // //                         <p className="text-3xl font-mono tracking-widest my-2">{activeToken.token}</p>
// // // //                         <p className="text-sm text-neutral-500">Expires: {new Date(activeToken.expires_at).toLocaleString()}</p>
// // // //                         <Link to={`/print/qr/${eventId}`} target="_blank" className="px-4 py-2 mt-2 inline-block bg-neutral-800 text-white rounded-md hover:bg-black text-sm font-semibold">
// // // //                             Print QR Code
// // // //                         </Link>
// // // //                     </div>
// // // //                 </div>
// // // //             ) : (
// // // //                 <p>No active check-in token for this event.</p>
// // // //             )}
// // // //             <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold disabled:opacity-50">
// // // //                 {generateMutation.isPending ? 'Generating...' : 'Generate New 24-Hour Token'}
// // // //             </button>
// // // //         </div>
// // // //     );
// // // // };

// // // // export const EventRegistrationsPage = () => {
// // // //     const { id: eventId } = useParams<{ id: string }>();
// // // //     if (!eventId) return <div>Event ID not found.</div>;
// // // //     const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
// // // //     const queryClient = useQueryClient();

// // // //     const { data: event, isLoading: isEventLoading } = useQuery({
// // // //         queryKey: ['cms_event', eventId],
// // // //         queryFn: async () => {
// // // //             const { data, error } = await supabase.from('events').select('title_en').eq('id', eventId).single();
// // // //             if (error) throw new Error(error.message);
// // // //             return data;
// // // //         },
// // // //     });

// // // //     const { data: registrations, isLoading: areRegsLoading } = useQuery<Registration[]>({
// // // //         queryKey: ['registrations', eventId],
// // // //         queryFn: async () => {
// // // //             const { data, error } = await supabase.from('registration_details').select('*').eq('event_id', eventId!);
// // // //             if (error) throw new Error(error.message);
// // // //             return data;
// // // //         },
// // // //         enabled: !!eventId,
// // // //     });

// // // //     const updateStatusMutation = useMutation({
// // // //         mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' }) => {
// // // //             const { error } = await supabase.from('event_registrations').update({ status: newStatus }).eq('id', registrationId);
// // // //             if (error) throw error;
// // // //         },
// // // //         onSuccess: () => {
// // // //             toast.success("Registration status updated!");
// // // //             queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
// // // //         },
// // // //         onError: (error) => toast.error(error.message),
// // // //     });

// // // //     const filteredRegistrations = registrations?.filter(r => statusFilter === 'all' || r.status === statusFilter);
// // // //     const isLoading = isEventLoading || areRegsLoading;

// // // //     return (
// // // //         <div className="space-y-6">
// // // //             <div>
// // // //                 <Link to="/cms/events" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all events</Link>
// // // //                 <h1 className="text-3xl font-bold">Manage Registrations for "{event?.title_en || '...'}"</h1>
// // // //             </div>
// // // //             <CheckInTokenManager eventId={eventId} />
// // // //             <div>
// // // //                 <h2 className="text-2xl font-bold mb-4">Registrants ({registrations?.length || 0})</h2>
// // // //                 <div className="mb-4">
// // // //                     <select onChange={(e) => setStatusFilter(e.target.value as any)} value={statusFilter} className="p-2 border rounded-md bg-white">
// // // //                         <option value="all">All</option>
// // // //                         <option value="pending">Pending</option>
// // // //                         <option value="accepted">Accepted</option>
// // // //                         <option value="rejected">Rejected</option>
// // // //                     </select>
// // // //                 </div>
// // // //                 <div className="bg-white shadow-md rounded-lg overflow-x-auto">
// // // //                     <table className="min-w-full responsive-table">
// // // //                         <thead className="bg-neutral-100">
// // // //                             <tr>
// // // //                                 <th className="p-4 text-left font-semibold">Name</th>
// // // //                                 <th className="p-4 text-left font-semibold">Department</th>
// // // //                                 <th className="p-4 text-left font-semibold">Nationality</th>
// // // //                                 <th className="p-4 text-left font-semibold">Status</th>
// // // //                                 <th className="p-4 text-right font-semibold">Actions</th>
// // // //                             </tr>
// // // //                         </thead>
// // // //                         <tbody>
// // // //                             {isLoading ? (
// // // //                                 <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
// // // //                             ) : filteredRegistrations?.map(reg => (
// // // //                                 <tr key={reg.id}>
// // // //                                     <td data-label="Name">{reg.english_name || 'N/A'}</td>
// // // //                                     <td data-label="Department">{reg.department || 'N/A'}</td>
// // // //                                     <td data-label="Nationality">{reg.nationality || 'N/A'}</td>
// // // //                                     <td data-label="Status">
// // // //                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${reg.status === 'accepted' ? 'bg-green-100 text-green-800' : reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
// // // //                                             {reg.status}
// // // //                                         </span>
// // // //                                     </td>
// // // //                                     <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
// // // //                                         {reg.status === 'pending' && (
// // // //                                             <>
// // // //                                                 <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'accepted' })} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold w-full md:w-auto">Accept</button>
// // // //                                                 <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'rejected' })} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold w-full md:w-auto">Reject</button>
// // // //                                             </>
// // // //                                         )}
// // // //                                     </td>
// // // //                                 </tr>
// // // //                             ))}
// // // //                         </tbody>
// // // //                     </table>
// // // //                 </div>
// // // //             </div>
// // // //         </div>
// // // //     );
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
// // //     queryKey: ['registrations', eventId],
// // //     queryFn: async () => { const { data, error } = await supabase.from('registration_details').select('*').eq('event_id', eventId!); if (error) throw new Error(error.message); return data; },
// // //   });
  
// // //   const updateStatusMutation = useMutation({
// // //     mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' }) => {
// // //       const { error } = await supabase.from('event_registrations').update({ status: newStatus }).eq('id', registrationId);
// // //       if (error) throw error;
// // //     },
// // //     onSuccess: () => {
// // //       toast.success("Registration status updated!");
// // //       queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
// // //     },
// // //     onError: (error) => toast.error(error.message),
// // //   });

// // //   const filteredRegistrations = registrations?.filter(r => statusFilter === 'all' || r.status === statusFilter);
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
// // //             <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Name</th><th className="p-4 text-left font-semibold">Department</th><th className="p-4 text-left font-semibold">Nationality</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
// // //             <tbody>
// // //               {isLoading ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> : 
// // //               filteredRegistrations?.map(reg => (
// // //                 <tr key={reg.id}>
// // //                   <td data-label="Name" className="font-medium">
// // //                     <Link to={`/cms/users/${reg.user_id}`} className="text-primary hover:underline">{reg.english_name || 'N/A'}</Link>
// // //                   </td>
// // //                   <td data-label="Department">{reg.department || 'N/A'}</td>
// // //                   <td data-label="Nationality">{reg.nationality || 'N/A'}</td>
// // //                   <td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${ reg.status === 'accepted' ? 'bg-green-100 text-green-800' : reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{reg.status}</span></td>
// // //                   <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
// // //                     {reg.status === 'pending' && (
// // //                       <><button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'accepted' })} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold w-full md:w-auto">Accept</button>
// // //                       <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'rejected' })} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold w-full md:w-auto">Reject</button></>
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

// //   const { data: registrations, isLoading: areRegsLoading } = useQuery<Registration[]>({
// //     queryKey: ['registrations', eventId],
// //     queryFn: async () => { const { data, error } = await supabase.from('registration_details').select('*').eq('event_id', eventId!); if (error) throw new Error(error.message); return data; },
// //   });
  
// //   const updateStatusMutation = useMutation({
// //     mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' }) => {
// //       const { error } = await supabase.from('event_registrations').update({ status: newStatus }).eq('id', registrationId);
// //       if (error) throw error;
// //       return { registrationId, newStatus };
// //     },
// //     onSuccess: (data) => {
// //       // Pembaruan UI Instan
// //       queryClient.setQueryData(['registrations', eventId], (oldData: Registration[] | undefined) =>
// //         oldData ? oldData.map(reg => reg.id === data.registrationId ? { ...reg, status: data.newStatus } : reg) : []
// //       );
// //       toast.success("Registration status updated!");
// //     },
// //     onError: (error) => toast.error(error.message),
// //     onSettled: () => {
// //         // Selalu refetch data di latar belakang untuk memastikan konsistensi
// //         queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
// //     }
// //   });

// //   const filteredRegistrations = registrations?.filter(r => statusFilter === 'all' || r.status === statusFilter);
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
// //             <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Name</th><th className="p-4 text-left font-semibold">Department</th><th className="p-4 text-left font-semibold">Nationality</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
// //             <tbody>
// //               {isLoading ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> : 
// //               filteredRegistrations?.map(reg => (
// //                 <tr key={reg.id}>
// //                   <td data-label="Name" className="font-medium"><Link to={`/cms/users/${reg.user_id}`} className="text-primary hover:underline">{reg.english_name || 'N/A'}</Link></td>
// //                   <td data-label="Department">{reg.department || 'N/A'}</td>
// //                   <td data-label="Nationality">{reg.nationality || 'N/A'}</td>
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

//   const { data: registrations, isLoading: areRegsLoading } = useQuery<Registration[]>({
//     queryKey: ['registrations', eventId],
//     queryFn: async () => { const { data, error } = await supabase.from('registration_details').select('*').eq('event_id', eventId!); if (error) throw new Error(error.message); return data; },
//   });
  
//   const updateStatusMutation = useMutation({
//     mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' }) => {
//       const { error } = await supabase.from('event_registrations').update({ status: newStatus }).eq('id', registrationId);
//       if (error) throw error;
//       return { registrationId, newStatus };
//     },
//     onSuccess: (data) => {
//       // Pembaruan UI Instan
//       queryClient.setQueryData(['registrations', eventId], (oldData: Registration[] | undefined) =>
//         oldData ? oldData.map(reg => reg.id === data.registrationId ? { ...reg, status: data.newStatus } : reg) : []
//       );
//       toast.success("Registration status updated!");
//     },
//     onError: (error) => toast.error(error.message),
//     onSettled: () => {
//         // Selalu refetch data di latar belakang untuk memastikan konsistensi
//         queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
//     }
//   });

//   const filteredRegistrations = registrations?.filter(r => statusFilter === 'all' || r.status === statusFilter);
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
//             <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Name</th><th className="p-4 text-left font-semibold">Department</th><th className="p-4 text-left font-semibold">Nationality</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
//             <tbody>
//               {isLoading ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> : 
//               filteredRegistrations?.map(reg => (
//                 <tr key={reg.id}>
//                   <td data-label="Name" className="font-medium"><Link to={`/cms/users/${reg.user_id}`} className="text-primary hover:underline">{reg.english_name || 'N/A'}</Link></td>
//                   <td data-label="Department">{reg.department || 'N/A'}</td>
//                   <td data-label="Nationality">{reg.nationality || 'N/A'}</td>
//                   <td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${ reg.status === 'accepted' ? 'bg-green-100 text-green-800' : reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{reg.status}</span></td>
//                   <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
//                     {reg.status === 'pending' && (
//                       <><button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'accepted' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Accept</button>
//                       <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'rejected' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Reject</button></>
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

type Registration = {
  id: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  english_name: string | null;
  student_id: string | null;
  department: string | null;
  nationality: string | null;
  email: string | null;
};
type Token = { id: string; event_id: string; token: string; expires_at: string; };

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
      ) : ( <p>No active check-in token for this event.</p> )}
      <button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending} className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold disabled:opacity-50">{generateMutation.isPending ? 'Generating...' : 'Generate New 24-Hour Token'}</button>
    </div>
  );
};

export const EventRegistrationsPage = () => {
  const { id: eventId } = useParams<{ id: string }>();
  if (!eventId) return <div>Event ID not found.</div>;
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const queryClient = useQueryClient();

  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ['cms_event', eventId],
    queryFn: async () => { const { data, error } = await supabase.from('events').select('title_en').eq('id', eventId!).single(); if (error) throw new Error(error.message); return data; },
  });

  const { data: registrations, isLoading: areRegsLoading } = useQuery<Registration[]>({
    queryKey: ['registrations', eventId, statusFilter], // Tambahkan filter ke queryKey
    queryFn: async () => { 
      let query = supabase.from('registration_details').select('*').eq('event_id', eventId!);
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message); 
      return data; 
    },
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: async ({ registrationId, newStatus }: { registrationId: string, newStatus: 'accepted' | 'rejected' }) => {
      // PERBAIKAN: Mengupdate tabel asli 'event_registrations', bukan view
      const { error } = await supabase.from('event_registrations').update({ status: newStatus }).eq('id', registrationId);
      if (error) throw error;
      return { registrationId, newStatus };
    },
    onSuccess: () => {
      toast.success("Registration status updated!");
      queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
    },
    onError: (error) => toast.error(error.message),
  });

  const isLoading = isEventLoading || areRegsLoading;

  return (
    <div className="space-y-6">
      <div><Link to="/cms/events" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all events</Link><h1 className="text-3xl font-bold">Manage Registrations for "{event?.title_en || '...'}"</h1></div>
      <CheckInTokenManager eventId={eventId!} />
      <div>
        <h2 className="text-2xl font-bold mb-4">Registrants ({registrations?.length || 0})</h2>
        <div className="mb-4"><select onChange={(e) => setStatusFilter(e.target.value as any)} value={statusFilter} className="p-2 border rounded-md bg-white"><option value="all">All</option><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option></select></div>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full responsive-table">
            <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Name</th><th className="p-4 text-left font-semibold">Department</th><th className="p-4 text-left font-semibold">Nationality</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> : 
              registrations?.map(reg => (
                <tr key={reg.id}>
                  <td data-label="Name" className="font-medium"><Link to={`/cms/users/${reg.user_id}`} className="text-primary hover:underline">{reg.english_name || 'N/A'}</Link></td>
                  <td data-label="Department">{reg.department || 'N/A'}</td>
                  <td data-label="Nationality">{reg.nationality || 'N/A'}</td>
                  <td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${ reg.status === 'accepted' ? 'bg-green-100 text-green-800' : reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{reg.status}</span></td>
                  <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
                    {reg.status === 'pending' && (
                      <><button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'accepted' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Accept</button>
                      <button onClick={() => updateStatusMutation.mutate({ registrationId: reg.id, newStatus: 'rejected' })} disabled={updateStatusMutation.isPending} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold w-full md:w-auto disabled:opacity-50">Reject</button></>
                    )}
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