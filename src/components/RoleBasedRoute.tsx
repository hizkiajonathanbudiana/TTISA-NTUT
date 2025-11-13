// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth, supabase } from '../contexts/AuthContext';
// import { useQuery } from '@tanstack/react-query';

// // PERBAIKAN 1: Sesuaikan dengan role yang ada (sesuai instruksi Anda)
// type Role = 'admin' | 'member';
// type RoleBasedRouteProps = { allowedRoles: Role[]; children?: React.ReactNode; };
// type UserProfile = { roles: { name: Role } | null };

// export const RoleBasedRoute = ({ allowedRoles, children }: RoleBasedRouteProps) => {
//   const { user, loading: authLoading } = useAuth();

//   const { data: profile, isLoading: profileLoading } = useQuery<UserProfile | null>({
//     queryKey: ['user_role_check', user?.id],
//     queryFn: async () => {
//       if (!user) return null;
//       const { data, error } = await supabase
//         .from('users')
//         .select('roles(name)')
//         .eq('id', user.id)
//         .single();
//       if (error) throw error;

//       // PERBAIKAN 2: Paksa TypeScript untuk menerima tipe ini, karena kita tahu ini benar
//       return data as unknown as UserProfile;
//     },
//     enabled: !authLoading && !!user,
//     retry: 1,
//   });

//   if (authLoading || (user && profileLoading)) {
//     return <div className="flex justify-center items-center h-screen">Verifying Access...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Logika asli Anda (yang sudah benar)
//   const userRole = profile?.roles?.name;

//   if (userRole && allowedRoles.includes(userRole)) {
//     return children ? <>{children}</> : <Outlet />;
//   }

//   return <Navigate to="/" replace />;
// };

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, supabase } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

type Role = 'admin' | 'member';
type RoleBasedRouteProps = { allowedRoles: Role[]; children?: React.ReactNode; };

// Tipe data yang dikembalikan oleh Edge Function 'get-my-profile'
type ProfileResponse = {
  roles: { name: 'admin' | 'member' } | null;
  profiles: { english_name: string | null; } | null;
}

export const RoleBasedRoute = ({ allowedRoles, children }: RoleBasedRouteProps) => {
  const { user, loading: authLoading } = useAuth();

  const { data: profileData, isLoading: profileLoading } = useQuery<ProfileResponse | null>({
    queryKey: ['my_profile', user?.id], // Kunci query terpadu
    queryFn: async () => {
      if (!user) return null;

      // Panggil Edge Function
      const { data, error } = await supabase.functions.invoke<ProfileResponse>('get-my-profile');

      if (error) {
        console.error("Error fetching role:", error);
        throw error;
      }
      return data;
    },
    enabled: !authLoading && !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache selama 5 menit
  });

  if (authLoading || (user && profileLoading)) {
    return <div className="flex justify-center items-center h-screen">Verifying Access...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = profileData?.roles?.name;

  if (userRole && allowedRoles.includes(userRole)) {
    return children ? <>{children}</> : <Outlet />;
  }

  return <Navigate to="/" replace />;
};