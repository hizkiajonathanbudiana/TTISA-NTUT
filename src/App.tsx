import { BrowserRouter, Routes, Route, Outlet, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthPage } from './pages/AuthPage';
import { useAuth } from './contexts/AuthContext';
import { ProfilePage } from './pages/ProfilePage';
import { PostsPage } from './pages/PostsPage';
import { PostDetailPage } from './pages/PostDetailPage';
import CmsLayout from './components/cms/CmsLayout';
import { PostsManagementPage } from './pages/cms/PostsManagementPage';
import { ContentManagementPage } from './pages/cms/ContentManagementPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { EventsManagementPage } from './pages/cms/EventsManagementPage';
import { EventRegistrationsPage } from './pages/cms/EventRegistrationsPage';
import { PrintQrPage } from './pages/PrintQrPage';
import { CheckInPage } from './pages/CheckInPage';
import { TeamsPage } from './pages/TeamsPage';
import { TeamsManagementPage } from './pages/cms/TeamsManagementPage';
import { TeamEditPage } from './pages/cms/TeamEditPage';
import { UsersManagementPage } from './pages/cms/UsersManagementPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { UpdatePasswordPage } from './pages/UpdatePasswordPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth(); if (loading) { return <div className="text-center py-12">Loading session...</div>; } if (!user) { return <Navigate to="/login" replace />; } return <>{children}</>;
};

const HomePage = () => <div>Home Page (Public)</div>;
const CmsDashboardPage = () => <div>Welcome to the CMS Dashboard.</div>;
const NotFoundPage = () => <div>404 - Page Not Found</div>;

const AppLayout = () => {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-neutral-100 font-sans">
      <header className="bg-white shadow-sm"><nav className="container mx-auto px-4 py-4 flex justify-between items-center"><Link to="/" className="text-xl font-bold text-primary">TTISA NTUT</Link><div className="space-x-4 flex items-center"><Link to="/events" className="text-neutral-800 hover:text-primary">Events</Link><Link to="/posts" className="text-neutral-800 hover:text-primary">Posts</Link><Link to="/teams" className="text-neutral-800 hover:text-primary">Teams</Link>{user && <Link to="/profile" className="text-neutral-800 hover:text-primary">Profile</Link>}{user && <Link to="/cms" className="text-neutral-800 hover:text-primary">CMS</Link>}{user ? (<button onClick={signOut} className="bg-system-danger text-white px-4 py-2 rounded-md hover:bg-red-700">Logout</button>) : (<Link to="/login" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover">Login</Link>)}</div></nav></header>
      <main className="container mx-auto p-4"><Outlet /></main>
    </div>
  );
};
const BareLayout = () => <Outlet />;

function App() {
  return (
    <><Toaster position="bottom-right" /><BrowserRouter><Routes><Route element={<BareLayout />}><Route path="/cms/*" element={<ProtectedRoute><CmsLayout /></ProtectedRoute>}><Route index element={<CmsDashboardPage />} /><Route path="posts" element={<PostsManagementPage />} /><Route path="content" element={<ContentManagementPage />} /><Route path="events" element={<EventsManagementPage />} /><Route path="events/:id/registrations" element={<EventRegistrationsPage />} /><Route path="teams" element={<TeamsManagementPage />} /><Route path="teams/:id" element={<TeamEditPage />} /><Route path="users" element={<UsersManagementPage />} /></Route><Route path="/print/qr/:id" element={<ProtectedRoute><PrintQrPage /></ProtectedRoute>} /><Route path="/checkin/:token" element={<CheckInPage />} /><Route path="/*" element={<AppLayout />}><Route index element={<HomePage />} /><Route path="events" element={<EventsPage />} /><Route path="events/:slug" element={<EventDetailPage />} /><Route path="posts" element={<PostsPage />} /><Route path="posts/:slug" element={<PostDetailPage />} /><Route path="teams" element={<TeamsPage />} /><Route path="login" element={<AuthPage />} /><Route path="forgot-password" element={<ForgotPasswordPage />} /><Route path="update-password" element={<UpdatePasswordPage />} /><Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /><Route path="*" element={<NotFoundPage />} /></Route></Route></Routes></BrowserRouter></>
  );
}
export default App;