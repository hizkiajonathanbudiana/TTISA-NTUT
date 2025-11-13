// // // // import { useQuery } from "@tanstack/react-query";
// // // // import { supabase } from "../../contexts/AuthContext";
// // // // import { Link } from "react-router-dom";

// // // // type Stat = { label: string; value: number; link: string; };
// // // // type UpcomingEvent = { title_en: string | null; start_at: string; };

// // // // const StatCard = ({ label, value, link }: Stat) => (
// // // //     <Link to={link} className="block bg-white p-6 rounded-lg shadow hover:-translate-y-1 transition-transform">
// // // //         <p className="text-sm font-medium text-text-secondary">{label}</p>
// // // //         <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>
// // // //     </Link>
// // // // );

// // // // export const CmsDashboardPage = () => {
// // // //     const { data: stats } = useQuery({
// // // //         queryKey: ['cms_dashboard_stats'],
// // // //         queryFn: async () => {
// // // //             const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
// // // //             const { count: pendingRegsCount } = await supabase.from('event_registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending');
// // // //             const { data: upcomingEvents, error } = await supabase.from('events').select('title_en, start_at').eq('status', 'upcoming').order('start_at').limit(3);
// // // //             if (error) throw error;
// // // //             return { usersCount, pendingRegsCount, upcomingEvents };
// // // //         }
// // // //     });

// // // //     return (
// // // //         <div className="space-y-8">
// // // //             <h1 className="text-3xl font-bold">Dashboard</h1>

// // // //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // // //                 <StatCard label="Total Users" value={stats?.usersCount ?? 0} link="/cms/users" />
// // // //                 <StatCard label="Pending Registrations" value={stats?.pendingRegsCount ?? 0} link="/cms/events" />
// // // //                 <StatCard label="Upcoming Events" value={stats?.upcomingEvents?.length ?? 0} link="/cms/events" />
// // // //             </div>

// // // //             <div>
// // // //                 <h2 className="text-2xl font-bold mb-4">Next 3 Upcoming Events</h2>
// // // //                 <div className="bg-white rounded-lg shadow">
// // // //                     <ul className="divide-y divide-border">
// // // //                         {stats?.upcomingEvents?.map(event => (
// // // //                             <li key={event.start_at} className="p-4 flex justify-between items-center">
// // // //                                 <span className="font-semibold">{event.title_en}</span>
// // // //                                 <span className="text-sm text-text-secondary">{new Date(event.start_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
// // // //                             </li>
// // // //                         ))}
// // // //                         {stats?.upcomingEvents?.length === 0 && <li className="p-4 text-center text-text-secondary">No upcoming events.</li>}
// // // //                     </ul>
// // // //                 </div>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // };

// // // import { useQuery } from "@tanstack/react-query";
// // // import { supabase } from "../../contexts/AuthContext";
// // // import { Link } from "react-router-dom";

// // // type Stat = { label: string; value: number; link: string; };
// // // type UpcomingEvent = { title_en: string | null; start_at: string; };

// // // const StatCard = ({ label, value, link }: Stat) => (
// // //     <Link to={link} className="block bg-white p-6 rounded-lg shadow hover:-translate-y-1 transition-transform">
// // //         <p className="text-sm font-medium text-text-secondary">{label}</p>
// // //         <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>
// // //     </Link>
// // // );

// // // export const CmsDashboardPage = () => {
// // //     const { data: stats } = useQuery({
// // //         queryKey: ['cms_dashboard_stats'],
// // //         queryFn: async () => {
// // //             const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
// // //             const { count: pendingRegsCount } = await supabase.from('event_registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending');
// // //             const { data: upcomingEvents, error } = await supabase
// // //                 .from('events')
// // //                 .select('title_en, start_at')
// // //                 .gte('start_at', new Date().toISOString())
// // //                 .order('start_at', { ascending: true })
// // //                 .limit(3);
// // //             if (error) throw error;
// // //             //p
// // //             // const { data: session } = await supabase.auth.getSession();
// // //             // if (!session.session) throw new Error('No session');

// // //             // const response = await supabase.functions.invoke('get-dashboard-stats', {
// // //             //     body: { page, limit, search },
// // //             // });

// // //             // if (response.error) console.log(response.error);
// // //             // console.log(response.data);

// // //             const { data: session } = await supabase.auth.getSession();
// // //             if (!session.session) throw new Error('No session');

// // //             const response = await supabase.functions.invoke('get-dashboard-stats', {
// // //                 headers: {
// // //                     Authorization: `Bearer ${session.session.access_token}`,
// // //                 },
// // //             });

// // //             if (response.error) {
// // //                 console.error('Function error:', response.error);
// // //             } else {
// // //                 console.log('Function data:', response.data);
// // //             }


// // //             ///p
// // //             return { usersCount, pendingRegsCount, upcomingEvents: upcomingEvents as UpcomingEvent[] };
// // //         }
// // //     });

// // //     return (
// // //         <div className="space-y-8">
// // //             <h1 className="text-3xl font-bold">Dashboard</h1>

// // //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // //                 <StatCard label="Total Users" value={stats?.usersCount ?? 0} link="/cms/users" />
// // //                 <StatCard label="Pending Registrations" value={stats?.pendingRegsCount ?? 0} link="/cms/events" />
// // //                 <StatCard label="Upcoming Events" value={stats?.upcomingEvents?.length ?? 0} link="/cms/events" />
// // //             </div>

// // //             <div>
// // //                 <h2 className="text-2xl font-bold mb-4">Next 3 Upcoming Events</h2>
// // //                 <div className="bg-white rounded-lg shadow">
// // //                     <ul className="divide-y divide-border">
// // //                         {stats?.upcomingEvents?.map(event => (
// // //                             <li key={event.start_at} className="p-4 flex justify-between items-center">
// // //                                 <span className="font-semibold">{event.title_en}</span>
// // //                                 <span className="text-sm text-text-secondary">{new Date(event.start_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
// // //                             </li>
// // //                         ))}
// // //                         {stats?.upcomingEvents?.length === 0 && <li className="p-4 text-center text-text-secondary">No upcoming events.</li>}
// // //                     </ul>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // import { useQuery } from "@tanstack/react-query";
// // import { supabase } from "../../contexts/AuthContext";
// // import { Link } from "react-router-dom";

// // type Stat = { label: string; value: number; link: string; };
// // type UpcomingEvent = { title_en: string | null; start_at: string; };

// // const StatCard = ({ label, value, link }: Stat) => (
// //     <Link to={link} className="block bg-white p-6 rounded-lg shadow hover:-translate-y-1 transition-transform">
// //         <p className="text-sm font-medium text-text-secondary">{label}</p>
// //         <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>
// //     </Link>
// // );

// // export const CmsDashboardPage = () => {
// //     const { data: stats } = useQuery({
// //         queryKey: ['cms_dashboard_stats'],
// //         queryFn: async () => {
// //             const { data: session } = await supabase.auth.getSession();
// //             if (!session.session) throw new Error('No session');

// //             const response = await supabase.functions.invoke('get-dashboard-stats', {
// //                 headers: {
// //                     Authorization: `Bearer ${session.session.access_token}`,
// //                 },
// //             });

// //             if (response.error) {
// //                 console.error('Function error:', response.error);
// //                 throw response.error;
// //             }


// //             console.log(response.data);

// //             // safety check
// //             const safeData = response.data ?? {};
// //             const usersCount = typeof safeData.usersCount === 'number' ? safeData.usersCount : 0;
// //             const pendingRegistrations = typeof safeData.pendingRegistrations === 'number' ? safeData.pendingRegistrations : 0;
// //             const upcomingEvents = Array.isArray(safeData.upcomingEvents) ? safeData.upcomingEvents : [];

// //             return { usersCount, pendingRegistrations, upcomingEvents };
// //         }
// //     });

// //     return (
// //         <div className="space-y-8">
// //             <h1 className="text-3xl font-bold">Dashboard</h1>

// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                 <StatCard label="Total Users" value={stats?.usersCount ?? 0} link="/cms/users" />
// //                 <StatCard label="Pending Registrations" value={stats?.pendingRegistrations ?? 0} link="/cms/events" />
// //                 <StatCard label="Upcoming Events" value={stats?.upcomingEvents?.length ?? 0} link="/cms/events" />
// //             </div>

// //             <div>
// //                 <h2 className="text-2xl font-bold mb-4">Next 3 Upcoming Events</h2>
// //                 <div className="bg-white rounded-lg shadow">
// //                     <ul className="divide-y divide-border">
// //                         {stats?.upcomingEvents?.map(event => (
// //                             <li key={event.start_at} className="p-4 flex justify-between items-center">
// //                                 <span className="font-semibold">{event.title_en ?? 'No title'}</span>
// //                                 <span className="text-sm text-text-secondary">
// //                                     {event.start_at ? new Date(event.start_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'TBA'}
// //                                 </span>
// //                             </li>
// //                         ))}
// //                         {stats?.upcomingEvents?.length === 0 && <li className="p-4 text-center text-text-secondary">No upcoming events.</li>}
// //                     </ul>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };


// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "../../contexts/AuthContext";
// import { Link } from "react-router-dom";

// type Stat = { label: string; value: number; link: string; };
// type UpcomingEvent = { title_en: string | null; start_at: string; };

// const StatCard = ({ label, value, link }: Stat) => (
//     <Link to={link} className="block bg-white p-6 rounded-lg shadow hover:-translate-y-1 transition-transform">
//         <p className="text-sm font-medium text-text-secondary">{label}</p>
//         <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>
//     </Link>
// );

// export const CmsDashboardPage = () => {
//     const { data: stats } = useQuery({
//         queryKey: ['cms_dashboard_stats'],
//         queryFn: async () => {
//             const { data: session } = await supabase.auth.getSession();
//             if (!session.session) throw new Error('No session');

//             const response = await supabase.functions.invoke('get-dashboard-stats', {
//                 headers: {
//                     Authorization: `Bearer ${session.session.access_token}`,
//                 },
//             });

//             if (response.error) {
//                 console.error('Function error:', response.error);
//                 throw response.error;
//             }


//             // console.log(response.data);

//             // safety check
//             const safeData = response.data.data ?? {};
//             const usersCount = typeof safeData.usersCount === 'number' ? safeData.usersCount : 0;
//             const pendingRegistrations = typeof safeData.pendingRegistrations === 'number' ? safeData.pendingRegistrations : 0;
//             const upcomingEvents = Array.isArray(safeData.upcomingEvents) ? safeData.upcomingEvents : [];

//             return { usersCount, pendingRegistrations, upcomingEvents };
//         }
//     });

//     return (
//         <div className="space-y-8">
//             <h1 className="text-3xl font-bold">Dashboard</h1>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <StatCard label="Total Users" value={stats?.usersCount ?? 0} link="/cms/users" />
//                 <StatCard label="Pending Registrations" value={stats?.pendingRegistrations ?? 0} link="/cms/events" />
//                 <StatCard label="Upcoming Events" value={stats?.upcomingEvents?.length ?? 0} link="/cms/events" />
//             </div>

//             <div>
//                 <h2 className="text-2xl font-bold mb-4">Next 3 Upcoming Events</h2>
//                 <div className="bg-white rounded-lg shadow">
//                     <ul className="divide-y divide-border">
//                         {stats?.upcomingEvents?.map(event => (
//                             <li key={event.start_at} className="p-4 flex justify-between items-center">
//                                 <span className="font-semibold">{event.title_en ?? 'No title'}</span>
//                                 <span className="text-sm text-text-secondary">
//                                     {event.start_at ? new Date(event.start_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'TBA'}
//                                 </span>
//                             </li>
//                         ))}
//                         {stats?.upcomingEvents?.length === 0 && <li className="p-4 text-center text-text-secondary">No upcoming events.</li>}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// };

import { useQuery } from "@tanstack/react-query";
import { supabase, useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

type Stat = { label: string; value: number; link: string; };
type UpcomingEvent = { title_en: string | null; start_at: string; };

// Definisikan tipe data yang akan dikembalikan oleh query
type DashboardStats = {
    usersCount: number;
    pendingRegistrations: number;
    upcomingEvents: UpcomingEvent[];
};

const StatCard = ({ label, value, link }: Stat) => (
    <Link to={link} className="block bg-white p-6 rounded-lg shadow hover:-translate-y-1 transition-transform">
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>
    </Link>
);

export const CmsDashboardPage = () => {
    const { session } = useAuth(); // Gunakan session untuk mengecek otentikasi

    const { data: stats } = useQuery<DashboardStats>({ // Tentukan tipe data di sini
        queryKey: ['cms_dashboard_stats'],
        queryFn: async (): Promise<DashboardStats> => { // Tentukan tipe data Promise di sini
            if (!session?.access_token) throw new Error('No session');

            const response = await supabase.functions.invoke('get-dashboard-stats', {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });

            if (response.error) {
                console.error('Function error:', response.error);
                throw response.error;
            }

            const safeData = response.data.data ?? {};
            const usersCount = typeof safeData.usersCount === 'number' ? safeData.usersCount : 0;
            const pendingRegistrations = typeof safeData.pendingRegistrations === 'number' ? safeData.pendingRegistrations : 0;

            // Beri tipe data eksplisit di sini untuk keamanan
            const upcomingEvents: UpcomingEvent[] = Array.isArray(safeData.upcomingEvents) ? safeData.upcomingEvents : [];

            return { usersCount, pendingRegistrations, upcomingEvents };
        },
        enabled: !!session, // Gunakan 'session' untuk 'enabled'
    });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Users" value={stats?.usersCount ?? 0} link="/cms/users" />
                <StatCard label="Pending Registrations" value={stats?.pendingRegistrations ?? 0} link="/cms/events" />
                <StatCard label="Upcoming Events" value={stats?.upcomingEvents?.length ?? 0} link="/cms/events" />
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Next 3 Upcoming Events</h2>
                <div className="bg-white rounded-lg shadow">
                    <ul className="divide-y divide-border">
                        {/* 'event' sekarang sudah memiliki tipe data yang benar (UpcomingEvent) */}
                        {stats?.upcomingEvents?.map(event => (
                            <li key={event.start_at} className="p-4 flex justify-between items-center">
                                <span className="font-semibold">{event.title_en ?? 'No title'}</span>
                                <span className="text-sm text-text-secondary">
                                    {event.start_at ? new Date(event.start_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'TBA'}
                                </span>
                            </li>
                        ))}
                        {stats?.upcomingEvents?.length === 0 && <li className="p-4 text-center text-text-secondary">No upcoming events.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};