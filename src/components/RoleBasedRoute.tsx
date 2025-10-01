// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth, supabase } from '../contexts/AuthContext';
// import { useQuery } from '@tanstack/react-query';

// type Role = 'admin' | 'organizer' | 'member' | 'developer';
// type RoleBasedRouteProps = { allowedRoles: Role[]; children?: React.ReactNode; };
// type UserProfile = { roles: { name: Role } | null };

// export const RoleBasedRoute = ({ allowedRoles, children }: RoleBasedRouteProps) => {
//     const { user, loading: authLoading } = useAuth();

//     const { data: profile, isLoading: profileLoading } = useQuery<UserProfile | null>({
//         queryKey: ['user_role_check', user?.id],
//         queryFn: async () => {
//             if (!user) return null;
//             const { data, error } = await supabase
//                 .from('users')
//                 .select('roles(name)')
//                 .eq('id', user.id)
//                 .single();
//             if (error) throw error;
//             return data as UserProfile;
//         },
//         enabled: !authLoading && !!user,
//         retry: 1,
//     });

//     if (authLoading || (user && profileLoading)) {
//         return <div className="flex justify-center items-center h-screen">Verifying Access...</div>;
//     }

//     if (!user) {
//         return <Navigate to="/login" replace />;
//     }

//     const userRole = profile?.roles?.name;

//     if (userRole && allowedRoles.includes(userRole)) {
//         return children ? <>{children}</> : <Outlet />;
//     }

//     return <Navigate to="/" replace />;
// };

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, supabase } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

type Role = 'admin' | 'organizer' | 'member' | 'developer';
type RoleBasedRouteProps = { allowedRoles: Role[]; children?: React.ReactNode; };
type UserProfile = { roles: { name: Role } | null };

export const RoleBasedRoute = ({ allowedRoles, children }: RoleBasedRouteProps) => {
  const { user, loading: authLoading } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile | null>({
    queryKey: ['user_role_check', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('users')
        .select('roles(name)')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !authLoading && !!user,
    retry: 1,
  });
  
  if (authLoading || (user && profileLoading)) {
    return <div className="flex justify-center items-center h-screen">Verifying Access...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = profile?.roles?.name;

  if (userRole && allowedRoles.includes(userRole)) {
    return children ? <>{children}</> : <Outlet />;
  }
  
  return <Navigate to="/" replace />;
};