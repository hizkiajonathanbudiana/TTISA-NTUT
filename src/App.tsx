
// // import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
// // import { Toaster } from 'react-hot-toast';
// // // Layouts
// // import { AppLayout } from './components/AppLayout';
// // import { AuthLayout } from './components/AuthLayout';
// // import CmsLayout from './components/cms/CmsLayout';
// // import { RoleBasedRoute } from './components/RoleBasedRoute';
// // // Pages
// // import { HomePage } from './pages/HomePage';
// // import { EventsPage } from './pages/EventsPage';
// // import { EventDetailPage } from './pages/EventDetailPage';
// // import { PostsPage } from './pages/PostsPage';
// // import { PostDetailPage } from './pages/PostDetailPage';
// // import { TeamsPage } from './pages/TeamsPage';
// // import { ProfilePage } from './pages/ProfilePage';
// // import { AuthPage } from './pages/AuthPage';
// // import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
// // import { UpdatePasswordPage } from './pages/UpdatePasswordPage';
// // import { CheckInPage } from './pages/CheckInPage';
// // import { PrintQrPage } from './pages/PrintQrPage';
// // import { NotFoundPage } from './pages/NotFoundPage';
// // // CMS Pages
// // import { CmsDashboardPage } from './pages/cms/CmsDashboardPage';
// // import { UsersManagementPage } from './pages/cms/UsersManagementPage';
// // import { UserDetailPage } from './pages/cms/UserDetailPage';
// // import { EventsManagementPage } from './pages/cms/EventsManagementPage';
// // import { EventRegistrationsPage } from './pages/cms/EventRegistrationsPage';
// // import { PostsManagementPage } from './pages/cms/PostsManagementPage';
// // import { TeamsManagementPage } from './pages/cms/TeamsManagementPage';
// // import { TeamEditPage } from './pages/cms/TeamEditPage';
// // import { ContentManagementPage } from './pages/cms/ContentManagementPage';
// // import { PaymentInstructionsPage } from './pages/cms/PaymentInstructionsPage'; // Impor baru

// // const BareLayout = () => <Outlet />;

// // function App() {
// //   return (
// //     <>
// //       <Toaster position="bottom-right" />
// //       <BrowserRouter>
// //         <Routes>
// //           <Route element={<AppLayout />}>
// //             <Route path="/" element={<HomePage />} />
// //             <Route path="/events" element={<EventsPage />} />
// //             <Route path="/events/:slug" element={<EventDetailPage />} />
// //             <Route path="/posts" element={<PostsPage />} />
// //             <Route path="/posts/:slug" element={<PostDetailPage />} />
// //             <Route path="/teams" element={<TeamsPage />} />
// //             <Route path="/profile" element={<RoleBasedRoute allowedRoles={['admin', 'developer', 'member']}><ProfilePage /></RoleBasedRoute>} />
// //           </Route>
// //           <Route element={<AuthLayout />}>
// //             <Route path="/login" element={<AuthPage />} />
// //             <Route path="/forgot-password" element={<ForgotPasswordPage />} />
// //             <Route path="/update-password" element={<UpdatePasswordPage />} />
// //           </Route>
// //           <Route element={<RoleBasedRoute allowedRoles={['admin', 'developer']} />}>
// //             <Route path="/cms" element={<CmsLayout />}>
// //               <Route index element={<CmsDashboardPage />} />
// //               <Route path="users" element={<UsersManagementPage />} />
// //               <Route path="users/:id" element={<UserDetailPage />} />
// //               <Route path="events" element={<EventsManagementPage />} />
// //               <Route path="events/:id/registrations" element={<EventRegistrationsPage />} />
// //               <Route path="posts" element={<PostsManagementPage />} />
// //               <Route path="teams" element={<TeamsManagementPage />} />
// //               <Route path="teams/:id" element={<TeamEditPage />} />
// //               <Route path="content" element={<ContentManagementPage />} />
// //               <Route path="payments" element={<PaymentInstructionsPage />} /> {/* Rute baru */}
// //             </Route>
// //           </Route>
// //           <Route element={<Outlet/>}>
// //               <Route path="/checkin/:token" element={<CheckInPage />} />
// //               <Route path="/print/qr/:id" element={<RoleBasedRoute allowedRoles={['admin', 'developer']}><PrintQrPage /></RoleBasedRoute>} />
// //               <Route path="*" element={<NotFoundPage />} />
// //           </Route>
// //         </Routes>
// //       </BrowserRouter>
// //     </>
// //   );
// // }
// // export default App;


// import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';

// import { ScrollToTop } from './components/ScrollToTop';

// import { AppLayout } from './components/AppLayout';
// import { AuthLayout } from './components/AuthLayout';
// import CmsLayout from './components/cms/CmsLayout';
// import { RoleBasedRoute } from './components/RoleBasedRoute';

// import { HomePage } from './pages/HomePage';
// import { EventsPage } from './pages/EventsPage';
// import { EventDetailPage } from './pages/EventDetailPage';
// import { PostsPage } from './pages/PostsPage';
// import { PostDetailPage } from './pages/PostDetailPage';
// import { TeamsPage } from './pages/TeamsPage';
// import { ProfilePage } from './pages/ProfilePage';
// import { AuthPage } from './pages/AuthPage';
// import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
// import { UpdatePasswordPage } from './pages/UpdatePasswordPage';
// import { CheckInPage } from './pages/CheckInPage';
// import { PrintQrPage } from './pages/PrintQrPage';
// import { NotFoundPage } from './pages/NotFoundPage';

// import { CmsDashboardPage } from './pages/cms/CmsDashboardPage';
// import { UsersManagementPage } from './pages/cms/UsersManagementPage';
// import { UserDetailPage } from './pages/cms/UserDetailPage';
// import { EventsManagementPage } from './pages/cms/EventsManagementPage';
// import { EventRegistrationsPage } from './pages/cms/EventRegistrationsPage';
// import { PostsManagementPage } from './pages/cms/PostsManagementPage';
// import { TeamsManagementPage } from './pages/cms/TeamsManagementPage';
// import { TeamEditPage } from './pages/cms/TeamEditPage';
// import { ContentManagementPage } from './pages/cms/ContentManagementPage';
// import { PaymentInstructionsPage } from './pages/cms/PaymentInstructionsPage';

// function App() {
//   return (
//     <>
//       <Toaster position="bottom-right" />
//       <BrowserRouter>
//         <ScrollToTop />
//         <Routes>
//           <Route element={<AppLayout />}>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/events" element={<EventsPage />} />
//             <Route path="/events/:slug" element={<EventDetailPage />} />
//             <Route path="/posts" element={<PostsPage />} />
//             <Route path="/posts/:slug" element={<PostDetailPage />} />
//             <Route path="/teams" element={<TeamsPage />} />
//             <Route path="/profile" element={<RoleBasedRoute allowedRoles={['admin', 'member']}><ProfilePage /></RoleBasedRoute>} />
//           </Route>
//           <Route element={<AuthLayout />}>
//             <Route path="/login" element={<AuthPage />} />
//             <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//             <Route path="/update-password" element={<UpdatePasswordPage />} />
//           </Route>
//           <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
//             <Route path="/cms" element={<CmsLayout />}>
//               <Route index element={<CmsDashboardPage />} />
//               <Route path="users" element={<UsersManagementPage />} />
//               <Route path="users/:id" element={<UserDetailPage />} />
//               <Route path="events" element={<EventsManagementPage />} />
//               <Route path="events/:id/registrations" element={<EventRegistrationsPage />} />
//               <Route path="posts" element={<PostsManagementPage />} />
//               <Route path="teams" element={<TeamsManagementPage />} />
//               <Route path="teams/:id" element={<TeamEditPage />} />
//               <Route path="content" element={<ContentManagementPage />} />
//               <Route path="payments" element={<PaymentInstructionsPage />} />
//             </Route>
//           </Route>
//           <Route element={<Outlet />}>
//             <Route path="/checkin/:token" element={<CheckInPage />} />
//             <Route path="/print/qr/:id" element={<RoleBasedRoute allowedRoles={['admin']}><PrintQrPage /></RoleBasedRoute>} />
//             <Route path="*" element={<NotFoundPage />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }
// export default App;

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ScrollToTop } from './components/ScrollToTop';
import { AppLayout } from './components/AppLayout';
import { AuthLayout } from './components/AuthLayout';
import CmsLayout from './components/cms/CmsLayout';
import { RoleBasedRoute } from './components/RoleBasedRoute';
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
import { CmsDashboardPage } from './pages/cms/CmsDashboardPage';
import { UsersManagementPage } from './pages/cms/UsersManagementPage';
import { UserDetailPage } from './pages/cms/UserDetailPage';
import { EventsManagementPage } from './pages/cms/EventsManagementPage';
import { EventRegistrationsPage } from './pages/cms/EventRegistrationsPage';
import { PostsManagementPage } from './pages/cms/PostsManagementPage';
import { TeamsManagementPage } from './pages/cms/TeamsManagementPage';
import { TeamEditPage } from './pages/cms/TeamEditPage';
import { ContentManagementPage } from './pages/cms/ContentManagementPage';
import { PaymentInstructionsPage } from './pages/cms/PaymentsManagementPage';
import { SocialsManagementPage } from './pages/cms/SocialsManagementPage'; // Impor baru

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventDetailPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/posts/:slug" element={<PostDetailPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/profile" element={<RoleBasedRoute allowedRoles={['admin', 'member']}><ProfilePage /></RoleBasedRoute>} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
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
              <Route path="payments" element={<PaymentInstructionsPage />} />
              <Route path="socials" element={<SocialsManagementPage />} /> {/* Rute baru */}
            </Route>
          </Route>
          <Route element={<Outlet />}>
            <Route path="/checkin/:token" element={<CheckInPage />} />
            <Route path="/print/qr/:id" element={<RoleBasedRoute allowedRoles={['admin']}><PrintQrPage /></RoleBasedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;