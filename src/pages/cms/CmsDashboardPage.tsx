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
//             const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
//             const { count: pendingRegsCount } = await supabase.from('event_registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending');
//             const { data: upcomingEvents, error } = await supabase.from('events').select('title_en, start_at').eq('status', 'upcoming').order('start_at').limit(3);
//             if (error) throw error;
//             return { usersCount, pendingRegsCount, upcomingEvents };
//         }
//     });

//     return (
//         <div className="space-y-8">
//             <h1 className="text-3xl font-bold">Dashboard</h1>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <StatCard label="Total Users" value={stats?.usersCount ?? 0} link="/cms/users" />
//                 <StatCard label="Pending Registrations" value={stats?.pendingRegsCount ?? 0} link="/cms/events" />
//                 <StatCard label="Upcoming Events" value={stats?.upcomingEvents?.length ?? 0} link="/cms/events" />
//             </div>

//             <div>
//                 <h2 className="text-2xl font-bold mb-4">Next 3 Upcoming Events</h2>
//                 <div className="bg-white rounded-lg shadow">
//                     <ul className="divide-y divide-border">
//                         {stats?.upcomingEvents?.map(event => (
//                             <li key={event.start_at} className="p-4 flex justify-between items-center">
//                                 <span className="font-semibold">{event.title_en}</span>
//                                 <span className="text-sm text-text-secondary">{new Date(event.start_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
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
import { supabase } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

type Stat = { label: string; value: number; link: string; };
type UpcomingEvent = { title_en: string | null; start_at: string; };

const StatCard = ({ label, value, link }: Stat) => (
    <Link to={link} className="block bg-white p-6 rounded-lg shadow hover:-translate-y-1 transition-transform">
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>
    </Link>
);

export const CmsDashboardPage = () => {
    const { data: stats } = useQuery({
        queryKey: ['cms_dashboard_stats'],
        queryFn: async () => {
            const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
            const { count: pendingRegsCount } = await supabase.from('event_registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending');

            // --- PERBAIKAN DI SINI ---
            // Mengambil event yang akan datang berdasarkan tanggal, bukan status
            const { data: upcomingEvents, error } = await supabase
                .from('events')
                .select('title_en, start_at')
                .gte('start_at', new Date().toISOString()) // Lebih besar atau sama dengan hari ini
                .order('start_at', { ascending: true }) // Urutkan dari yang paling dekat
                .limit(3);
            // --- AKHIR PERBAIKAN ---

            if (error) throw error;
            return { usersCount, pendingRegsCount, upcomingEvents };
        }
    });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Users" value={stats?.usersCount ?? 0} link="/cms/users" />
                <StatCard label="Pending Registrations" value={stats?.pendingRegsCount ?? 0} link="/cms/events" />
                <StatCard label="Upcoming Events" value={stats?.upcomingEvents?.length ?? 0} link="/cms/events" />
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Next 3 Upcoming Events</h2>
                <div className="bg-white rounded-lg shadow">
                    <ul className="divide-y divide-border">
                        {stats?.upcomingEvents?.map(event => (
                            <li key={event.start_at} className="p-4 flex justify-between items-center">
                                <span className="font-semibold">{event.title_en}</span>
                                <span className="text-sm text-text-secondary">{new Date(event.start_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                            </li>
                        ))}
                        {stats?.upcomingEvents?.length === 0 && <li className="p-4 text-center text-text-secondary">No upcoming events.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};