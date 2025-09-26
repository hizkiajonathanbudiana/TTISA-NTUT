// // // import { BrowserRouter, Routes, Route, Outlet, Navigate, Link } from 'react-router-dom';
// // // import { Toaster } from 'react-hot-toast';
// // // import { AuthPage } from './pages/AuthPage';
// // // import { useAuth } from './contexts/AuthContext';
// // // import { ProfilePage } from './pages/ProfilePage';
// // // import { PostsPage } from './pages/PostsPage';
// // // import { PostDetailPage } from './pages/PostDetailPage';
// // // import CmsLayout from './components/cms/CmsLayout';
// // // import { PostsManagementPage } from './pages/cms/PostsManagementPage';
// // // import { ContentManagementPage } from './pages/cms/ContentManagementPage';
// // // import { EventsPage } from './pages/EventsPage';
// // // import { EventDetailPage } from './pages/EventDetailPage';
// // // import { EventsManagementPage } from './pages/cms/EventsManagementPage';
// // // import { EventRegistrationsPage } from './pages/cms/EventRegistrationsPage';
// // // import { PrintQrPage } from './pages/PrintQrPage';
// // // import { CheckInPage } from './pages/CheckInPage';
// // // import { TeamsPage } from './pages/TeamsPage';
// // // import { TeamsManagementPage } from './pages/cms/TeamsManagementPage';
// // // import { TeamEditPage } from './pages/cms/TeamEditPage';
// // // import { UsersManagementPage } from './pages/cms/UsersManagementPage';
// // // import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
// // // import { UpdatePasswordPage } from './pages/UpdatePasswordPage';
// // // import { AppLayout } from './components/AppLayout';
// // // import { HomePage } from './pages/HomePage';

// // // const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
// // //   const { user, loading } = useAuth();
// // //   if (loading) {
// // //     return <div className="text-center py-12">Loading session...</div>;
// // //   }
// // //   if (!user) {
// // //     return <Navigate to="/login" replace />;
// // //   }
// // //   return <>{children}</>;
// // // };

// // // const CmsDashboardPage = () => <div>Welcome to the CMS Dashboard.</div>;
// // // const NotFoundPage = () => <div>404 - Page Not Found</div>;

// // // const BareLayout = () => <Outlet />;

// // // function App() {
// // //   return (
// // //     <>
// // //       <Toaster position="bottom-right" />
// // //       <BrowserRouter>
// // //         <Routes>
// // //           <Route element={<BareLayout />}>
// // //             <Route path="/cms/*" element={<ProtectedRoute><CmsLayout /></ProtectedRoute>}>
// // //               <Route index element={<CmsDashboardPage />} />
// // //               <Route path="posts" element={<PostsManagementPage />} />
// // //               <Route path="content" element={<ContentManagementPage />} />
// // //               <Route path="events" element={<EventsManagementPage />} />
// // //               <Route path="events/:id/registrations" element={<EventRegistrationsPage />} />
// // //               <Route path="teams" element={<TeamsManagementPage />} />
// // //               <Route path="teams/:id" element={<TeamEditPage />} />
// // //               <Route path="users" element={<UsersManagementPage />} />
// // //             </Route>

// // //             <Route path="/print/qr/:id" element={<ProtectedRoute><PrintQrPage /></ProtectedRoute>} />
// // //             <Route path="/checkin/:token" element={<CheckInPage />} />

// // //             <Route path="/*" element={<AppLayout />}>
// // //               <Route index element={<HomePage />} />
// // //               <Route path="events" element={<EventsPage />} />
// // //               <Route path="events/:slug" element={<EventDetailPage />} />
// // //               <Route path="posts" element={<PostsPage />} />
// // //               <Route path="posts/:slug" element={<PostDetailPage />} />
// // //               <Route path="teams" element={<TeamsPage />} />
// // //               <Route path="login" element={<AuthPage />} />
// // //               <Route path="forgot-password" element={<ForgotPasswordPage />} />
// // //               <Route path="update-password" element={<UpdatePasswordPage />} />
// // //               <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
// // //               <Route path="*" element={<NotFoundPage />} />
// // //             </Route>
// // //           </Route>
// // //         </Routes>
// // //       </BrowserRouter>
// // //     </>
// // //   );
// // // }

// // // export default App;

// // import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
// // import { Toaster } from 'react-hot-toast';
// // import { AuthPage } from './pages/AuthPage';
// // import { useAuth } from './contexts/AuthContext';
// // import { ProfilePage } from './pages/ProfilePage';
// // import { PostsPage } from './pages/PostsPage';
// // import { PostDetailPage } from './pages/PostDetailPage';
// // import CmsLayout from './components/cms/CmsLayout';
// // import { PostsManagementPage } from './pages/cms/PostsManagementPage';
// // import { ContentManagementPage } from './pages/cms/ContentManagementPage';
// // import { EventsPage } from './pages/EventsPage';
// // import { EventDetailPage } from './pages/EventDetailPage';
// // import { EventsManagementPage } from './pages/cms/EventsManagementPage';
// // import { EventRegistrationsPage } from './pages/cms/EventRegistrationsPage';
// // import { PrintQrPage } from './pages/PrintQrPage';
// // import { CheckInPage } from './pages/CheckInPage';
// // import { TeamsPage } from './pages/TeamsPage';
// // import { TeamsManagementPage } from './pages/cms/TeamsManagementPage';
// // import { TeamEditPage } from './pages/cms/TeamEditPage';
// // import { UsersManagementPage } from './pages/cms/UsersManagementPage';
// // import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
// // import { UpdatePasswordPage } from './pages/UpdatePasswordPage';
// // import { AppLayout } from './components/AppLayout';
// // import { HomePage } from './pages/HomePage';
// // import { CmsDashboardPage } from './pages/cms/CmsDashboardPage';
// // import { UserDetailPage } from './pages/cms/UserDetailPage';

// // const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
// //   const { user, loading } = useAuth(); if (loading) { return <div className="text-center py-12">Loading session...</div>; } if (!user) { return <Navigate to="/login" replace />; } return <>{children}</>;
// // };

// // const NotFoundPage = () => <div>404 - Page Not Found</div>;
// // const BareLayout = () => <Outlet />;

// // function App() {
// //   return (
// //     <><Toaster position="bottom-right" /><BrowserRouter><Routes><Route element={<BareLayout />}><Route path="/cms/*" element={<ProtectedRoute><CmsLayout /></ProtectedRoute>}><Route index element={<CmsDashboardPage />} /><Route path="posts" element={<PostsManagementPage />} /><Route path="content" element={<ContentManagementPage />} /><Route path="events" element={<EventsManagementPage />} /><Route path="events/:id/registrations" element={<EventRegistrationsPage />} /><Route path="teams" element={<TeamsManagementPage />} /><Route path="teams/:id" element={<TeamEditPage />} /><Route path="users" element={<UsersManagementPage />} /><Route path="users/:id" element={<UserDetailPage />} /></Route><Route path="/print/qr/:id" element={<ProtectedRoute><PrintQrPage /></ProtectedRoute>} /><Route path="/checkin/:token" element={<CheckInPage />} /><Route path="/*" element={<AppLayout />}><Route index element={<HomePage />} /><Route path="events" element={<EventsPage />} /><Route path="events/:slug" element={<EventDetailPage />} /><Route path="posts" element={<PostsPage />} /><Route path="posts/:slug" element={<PostDetailPage />} /><Route path="teams" element={<TeamsPage />} /><Route path="login" element={<AuthPage />} /><Route path="forgot-password" element={<ForgotPasswordPage />} /><Route path="update-password" element={<UpdatePasswordPage />} /><Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /><Route path="*" element={<NotFoundPage />} /></Route></Route></Routes></BrowserRouter></>
// //   );
// // }
// // export default App;

// import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthPage } from './pages/AuthPage';
// import { ProfilePage } from './pages/ProfilePage';
// import { PostsPage } from './pages/PostsPage';
// import { PostDetailPage } from './pages/PostDetailPage';
// import CmsLayout from './components/cms/CmsLayout';
// import { PostsManagementPage } from './pages/cms/PostsManagementPage';
// import { ContentManagementPage } from './pages/cms/ContentManagementPage';
// import { EventsPage } from './pages/EventsPage';
// import { EventDetailPage } from './pages/EventDetailPage';
// import { EventsManagementPage } from './pages/cms/EventsManagementPage';
// import { EventRegistrationsPage } from './pages/cms/EventRegistrationsPage';
// import { PrintQrPage } from './pages/PrintQrPage';
// import { CheckInPage } from './pages/CheckInPage';
// import { TeamsPage } from './pages/TeamsPage';
// import { TeamsManagementPage } from './pages/cms/TeamsManagementPage';
// import { TeamEditPage } from './pages/cms/TeamEditPage';
// import { UsersManagementPage } from './pages/cms/UsersManagementPage';
// import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
// import { UpdatePasswordPage } from './pages/UpdatePasswordPage';
// import { AppLayout } from './components/AppLayout';
// import { HomePage } from './pages/HomePage';
// import { CmsDashboardPage } from './pages/cms/CmsDashboardPage';
// import { UserDetailPage } from './pages/cms/UserDetailPage';
// import { AuthLayout } from './components/AuthLayout';
// import { RoleBasedRoute } from './components/RoleBasedRoute'; // Impor baru

// const NotFoundPage = () => <div>404 - Page Not Found</div>;
// const BareLayout = () => <Outlet />;

// function App() {
//   return (
//     <>
//       <Toaster position="bottom-right" />
//       <BrowserRouter>
//         <Routes>
//           <Route element={<BareLayout />}>
//             {/* Rute CMS dilindungi oleh role */}
//             <Route element={<RoleBasedRoute allowedRoles={['admin', 'organizer', 'developer']} />}>
//               <Route path="/cms/*" element={<CmsLayout />}>
//                 <Route index element={<CmsDashboardPage />} />
//                 <Route path="posts" element={<PostsManagementPage />} />
//                 <Route path="content" element={<ContentManagementPage />} />
//                 <Route path="events" element={<EventsManagementPage />} />
//                 <Route path="events/:id/registrations" element={<EventRegistrationsPage />} />
//                 <Route path="teams" element={<TeamsManagementPage />} />
//                 <Route path="teams/:id" element={<TeamEditPage />} />
//                 <Route path="users" element={<UsersManagementPage />} />
//                 <Route path="users/:id" element={<UserDetailPage />} />
//               </Route>
//             </Route>

//             {/* Rute yang hanya butuh login, semua role boleh akses */}
//             <Route element={<RoleBasedRoute allowedRoles={['admin', 'organizer', 'member', 'developer']} />}>
//               <Route path="/print/qr/:id" element={<PrintQrPage />} />
//             </Route>

//             {/* Rute otentikasi menggunakan AuthLayout */}
//             <Route element={<AuthLayout />}>
//               <Route path="/login" element={<AuthPage />} />
//               <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//               <Route path="/update-password" element={<UpdatePasswordPage />} />
//             </Route>

//             {/* Rute publik dan yang butuh login */}
//             <Route path="/*" element={<AppLayout />}>
//               <Route index element={<HomePage />} />
//               <Route path="events" element={<EventsPage />} />
//               <Route path="events/:slug" element={<EventDetailPage />} />
//               <Route path="posts" element={<PostsPage />} />
//               <Route path="posts/:slug" element={<PostDetailPage />} />
//               <Route path="teams" element={<TeamsPage />} />
//               <Route path="profile" element={<RoleBasedRoute allowedRoles={['admin', 'organizer', 'member', 'developer']}><ProfilePage /></RoleBasedRoute>} />
//               <Route path="*" element={<NotFoundPage />} />
//             </Route>

//             {/* Rute yang tidak memiliki layout sama sekali */}
//             <Route path="/checkin/:token" element={<CheckInPage />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }
// export default App;

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import { AppLayout } from './components/AppLayout';
import { AuthLayout } from './components/AuthLayout';
import CmsLayout from './components/cms/CmsLayout';
import { RoleBasedRoute } from './components/RoleBasedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { PostsPage } from './pages/PostsPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { TeamsPage } from './pages/TeamsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { UpdatePasswordPage } from './pages/UpdatePasswordPage';
import { CheckInPage } from './pages/CheckInPage';
import { PrintQrPage } from './pages/PrintQrPage';
import { NotFoundPage } from './pages/NotFoundPage';

// CMS Pages
import { CmsDashboardPage } from './pages/cms/CmsDashboardPage';
import { UsersManagementPage } from './pages/cms/UsersManagementPage';
import { UserDetailPage } from './pages/cms/UserDetailPage';
import { EventsManagementPage } from './pages/cms/EventsManagementPage';
import { EventRegistrationsPage } from './pages/cms/EventRegistrationsPage';
import { PostsManagementPage } from './pages/cms/PostsManagementPage';
import { TeamsManagementPage } from './pages/cms/TeamsManagementPage';
import { TeamEditPage } from './pages/cms/TeamEditPage';
import { ContentManagementPage } from './pages/cms/ContentManagementPage';

const BareLayout = () => <Outlet />;

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventDetailPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/posts/:slug" element={<PostDetailPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/profile" element={<RoleBasedRoute allowedRoles={['admin', 'developer', 'organizer', 'member']}><ProfilePage /></RoleBasedRoute>} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={['admin', 'developer', 'organizer']} />}>
            <Route path="/cms" element={<CmsLayout />}>
              <Route index element={<CmsDashboardPage />} />
              <Route path="users" element={<UsersManagementPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
              <Route path="events" element={<EventsManagementPage />} />
              <Route path="events/:id/registrations" element={<EventRegistrationsPage />} />
              <Route path="posts" element={<PostsManagementPage />} />
              <Route path="teams" element={<TeamsManagementPage />} />
              <Route path="teams/:id" element={<TeamEditPage />} />
              <Route path="content" element={<ContentManagementPage />} />
            </Route>
          </Route>

          <Route element={<Outlet />}>
            <Route path="/checkin/:token" element={<CheckInPage />} />
            <Route path="/print/qr/:id" element={<RoleBasedRoute allowedRoles={['admin', 'developer', 'organizer']}><PrintQrPage /></RoleBasedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;