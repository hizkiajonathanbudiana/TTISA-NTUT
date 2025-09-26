import { NavLink, Outlet } from 'react-router-dom';

const CmsLayout = () => {
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `block px-4 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-text-primary hover:bg-neutral-100'
        }`;

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-white p-4 border-r border-border flex-shrink-0">
                <h2 className="text-xl font-bold mb-4 text-text-primary">CMS Menu</h2>
                <nav className="space-y-2">
                    <NavLink to="/cms" end className={navLinkClasses}>Dashboard</NavLink>
                    <NavLink to="/cms/posts" className={navLinkClasses}>Manage Posts</NavLink>
                    <NavLink to="/cms/content" className={navLinkClasses}>Manage Pages</NavLink>
                    <NavLink to="/cms/events" className={navLinkClasses}>Manage Events</NavLink>
                    <NavLink to="/cms/teams" className={navLinkClasses}>Manage Teams</NavLink>
                    <NavLink to="/cms/users" className={navLinkClasses}>Manage Users</NavLink>
                </nav>
            </aside>
            <main className="flex-1 p-6 bg-background overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default CmsLayout;