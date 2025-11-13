// // import { NavLink, Outlet, Link } from 'react-router-dom';
// // import { useAuth } from '../../contexts/AuthContext';
// // import { useState } from 'react';
// // import clsx from 'clsx';
// // import { Icon } from './Icon';

// // const SidebarContent = () => {
// //     const navLinkClasses = ({ isActive }: { isActive: boolean }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-text-primary hover:bg-neutral-100'}`;

// //     return (
// //         <>
// //             <div className="p-4 border-b border-border">
// //                 <Link to="/cms" className="text-xl font-bold text-primary">TTISA NTUT CMS</Link>
// //             </div>
// //             <nav className="flex-grow p-4 space-y-2">
// //                 <NavLink to="/cms" end className={navLinkClasses}><Icon path="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" className="w-5 h-5" />Dashboard</NavLink>
// //                 <NavLink to="/cms/posts" className={navLinkClasses}><Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" className="w-5 h-5" />Manage Posts</NavLink>
// //                 <NavLink to="/cms/events" className={navLinkClasses}><Icon path="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" className="w-5 h-5" />Manage Events</NavLink>
// //                 <NavLink to="/cms/payments" className={navLinkClasses}><Icon path="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" className="w-5 h-5" />Manage Payments</NavLink>
// //                 <NavLink to="/cms/teams" className={navLinkClasses}><Icon path="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a3 3 0 00-4.682 2.72 9.094 9.094 0 003.741.479m7.5-13.447a3 3 0 00-4.682-2.72 9.094 9.094 0 00-3.741-.479m-4.682 2.72a3 3 0 000 5.441m8.364-5.441a3 3 0 000 5.441" className="w-5 h-5" />Manage Teams</NavLink>
// //                 <NavLink to="/cms/users" className={navLinkClasses}><Icon path="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.14.237-.28.347-.42zM9.75 7.5a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" className="w-5 h-5" />Manage Users</NavLink>
// //                 <NavLink to="/cms/content" className={navLinkClasses}><Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" className="w-5 h-5" />Manage Pages</NavLink>
// //                 <NavLink to="/cms/socials" className={navLinkClasses}><Icon path="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" className="w-5 h-5" />Manage Socials</NavLink>
// //             </nav>
// //         </>
// //     );
// // };
// // export const CmsLayout = ({ children }: { children: React.ReactNode }) => {
// //     const { profile } = useAuth();
// //     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //     return (
// //         <div className="min-h-screen bg-neutral-100 lg:flex">
// //             <aside className={clsx('fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border flex-shrink-0 flex flex-col transition-transform duration-300 lg:hidden', isSidebarOpen ? 'translate-x-0' : '-translate-x-full')}><SidebarContent /></aside>
// //             {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}
// //             <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-white border-r border-border"><SidebarContent /></aside>
// //             <div className="flex-1 flex flex-col overflow-hidden">
// //                 <header className="bg-white border-b border-border p-4 flex justify-between items-center">
// //                     <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-1 text-text-secondary"><Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" className="w-6 h-6" /></button>
// //                     <div className="flex-1" />
// //                     <div className="flex items-center gap-4"><span className="text-sm text-text-secondary">Welcome, {profile?.english_name || 'Admin'}</span><Link to="/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">View Public Site &rarr;</Link></div>
// //                 </header>
// //                 <main className="flex-1 p-6 overflow-y-auto"><Outlet /></main>
// //             </div>
// //         </div>
// //     );
// // };
// // export default CmsLayout;

// import { NavLink, Outlet, Link } from 'react-router-dom';
// import { useAuth, supabase } from '../../contexts/AuthContext';
// import { useState } from 'react';
// import clsx from 'clsx';
// import { Icon } from './Icon';
// import { useQuery } from '@tanstack/react-query';

// type UserProfile = {
//     english_name: string | null;
// };

// const SidebarContent = () => {
//     const navLinkClasses = ({ isActive }: { isActive: boolean }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-text-primary hover:bg-neutral-100'}`;

//     return (
//         <>
//             <div className="p-4 border-b border-border">
//                 <Link to="/cms" className="text-xl font-bold text-primary">TTISA NTUT CMS</Link>
//             </div>
//             <nav className="flex-grow p-4 space-y-2">
//                 <NavLink to="/cms" end className={navLinkClasses}><Icon path="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" className="w-5 h-5" />Dashboard</NavLink>
//                 <NavLink to="/cms/posts" className={navLinkClasses}><Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" className="w-5 h-5" />Manage Posts</NavLink>
//                 <NavLink to="/cms/events" className={navLinkClasses}><Icon path="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" className="w-5 h-5" />Manage Events</NavLink>
//                 <NavLink to="/cms/payments" className={navLinkClasses}><Icon path="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" className="w-5 h-5" />Manage Payments</NavLink>
//                 <NavLink to="/cms/teams" className={navLinkClasses}><Icon path="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a3 3 0 00-4.682 2.72 9.094 9.094 0 003.741.479m7.5-13.447a3 3 0 00-4.682-2.72 9.094 9.094 0 00-3.741-.479m-4.682 2.72a3 3 0 000 5.441m8.364-5.441a3 3 0 000 5.441" className="w-5 h-5" />Manage Teams</NavLink>
//                 <NavLink to="/cms/users" className={navLinkClasses}><Icon path="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.14.237-.28.347-.42zM9.75 7.5a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" className="w-5 h-5" />Manage Users</NavLink>
//                 <NavLink to="/cms/content" className={navLinkClasses}><Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" className="w-5 h-5" />Manage Pages</NavLink>
//                 <NavLink to="/cms/socials" className={navLinkClasses}><Icon path="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" className="w-5 h-5" />Manage Socials</NavLink>
//             </nav>
//         </>
//     );
// };
// export const CmsLayout = () => {
//     const { user } = useAuth();
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//     const { data: profile } = useQuery<UserProfile | null>({
//         queryKey: ['cms_layout_profile', user?.id],
//         queryFn: async () => {
//             if (!user) return null;
//             const { data, error } = await supabase
//                 .from('profiles')
//                 .select('english_name')
//                 .eq('user_id', user.id)
//                 .single();
//             if (error) {
//                 console.error("Error fetching profile for CMS layout:", error);
//                 return null;
//             }
//             return data;
//         },
//         enabled: !!user,
//     });

//     return (
//         <div className="min-h-screen bg-neutral-100 lg:flex">
//             <aside className={clsx('fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border flex-shrink-0 flex flex-col transition-transform duration-300 lg:hidden', isSidebarOpen ? 'translate-x-0' : '-translate-x-full')}><SidebarContent /></aside>
//             {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}
//             <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-white border-r border-border"><SidebarContent /></aside>
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 <header className="bg-white border-b border-border p-4 flex justify-between items-center">
//                     <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-1 text-text-secondary"><Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" className="w-6 h-6" /></button>
//                     <div className="flex-1" />
//                     <div className="flex items-center gap-4"><span className="text-sm text-text-secondary">Welcome, {profile?.english_name || 'Admin'}</span><Link to="/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">View Public Site &rarr;</Link></div>
//                 </header>
//                 <main className="flex-1 p-6 overflow-y-auto"><Outlet /></main>
//             </div>
//         </div>
//     );
// };
// export default CmsLayout;

import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth, supabase } from '../../contexts/AuthContext';
import { useState } from 'react';
import clsx from 'clsx';
import { Icon } from './Icon';
import { useQuery } from '@tanstack/react-query';

type UserProfile = {
    english_name: string | null;
};

const SidebarContent = () => {
    const navLinkClasses = ({ isActive }: { isActive: boolean }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-text-primary hover:bg-neutral-100'}`;

    return (
        <>
            <div className="p-4 border-b border-border">
                <Link to="/cms" className="text-xl font-bold text-primary">TTISA NTUT CMS</Link>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                <NavLink to="/cms" end className={navLinkClasses}><Icon path="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" className="w-5 h-5" />Dashboard</NavLink>
                <NavLink to="/cms/posts" className={navLinkClasses}><Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" className="w-5 h-5" />Manage Posts</NavLink>
                <NavLink to="/cms/events" className={navLinkClasses}><Icon path="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" className="w-5 h-5" />Manage Events</NavLink>
                <NavLink to="/cms/payments" className={navLinkClasses}><Icon path="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" className="w-5 h-5" />Manage Payments</NavLink>
                <NavLink to="/cms/teams" className={navLinkClasses}><Icon path="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a3 3 0 00-4.682 2.72 9.094 9.094 0 003.741.479m7.5-13.447a3 3 0 00-4.682-2.72 9.094 9.094 0 00-3.741-.479m-4.682 2.72a3 3 0 000 5.441m8.364-5.441a3 3 0 000 5.441" className="w-5 h-5" />Manage Teams</NavLink>
                <NavLink to="/cms/users" className={navLinkClasses}><Icon path="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.14.237-.28.347-.42zM9.75 7.5a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" className="w-5 h-5" />Manage Users</NavLink>
                <NavLink to="/cms/content" className={navLinkClasses}><Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" className="w-5 h-5" />Manage Pages</NavLink>
                <NavLink to="/cms/socials" className={navLinkClasses}><Icon path="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" className="w-5 h-5" />Manage Socials</NavLink>
            </nav>
        </>
    );
};
export const CmsLayout = () => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { data: profile } = useQuery<UserProfile | null>({
        queryKey: ['cms_layout_profile', user?.id],
        queryFn: async () => {
            if (!user) return null;

            const { data, error } = await supabase.functions.invoke('get-user-profile');

            if (error) {
                console.error("Error invoking get-user-profile function:", error);
                return null;
            }
            return data;
        },
        enabled: !!user,
    });

    return (
        <div className="min-h-screen bg-neutral-100 lg:flex">
            <aside className={clsx('fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border flex-shrink-0 flex flex-col transition-transform duration-300 lg:hidden', isSidebarOpen ? 'translate-x-0' : '-translate-x-full')}><SidebarContent /></aside>
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}
            <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-white border-r border-border"><SidebarContent /></aside>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-border p-4 flex justify-between items-center">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-1 text-text-secondary"><Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" className="w-6 h-6" /></button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-4"><span className="text-sm text-text-secondary">Welcome, {profile?.english_name || 'Admin'}</span><Link to="/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">View Public Site &rarr;</Link></div>
                </header>
                <main className="flex-1 p-6 overflow-y-auto"><Outlet /></main>
            </div>
        </div>
    );
};
export default CmsLayout;