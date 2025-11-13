// import { useQuery } from '@tanstack/react-query';
// import { useParams, Link } from 'react-router-dom';
// import { supabase } from '../../contexts/AuthContext';

// type UserDetails = {
//     user_id: string;
//     email: string | null;
//     english_name: string | null;
//     chinese_name: string | null;
//     student_id: string | null;
//     avatar_url: string | null;
//     role_name: string | null;
//     department: string | null;
//     nationality: string | null;
//     birth_year: number | null;
//     gender: string | null;
// };

// const DetailRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
//     <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
//         <dt className="text-sm font-medium text-text-secondary">{label}</dt>
//         <dd className="mt-1 text-sm text-text-primary sm:mt-0 sm:col-span-2">{value || '-'}</dd>
//     </div>
// );

// export const UserDetailPage = () => {
//     const { id: userId } = useParams<{ id: string }>();

//     const { data: user, isLoading, error } = useQuery({
//         queryKey: ['user_details', userId],
//         queryFn: async (): Promise<UserDetails | null> => {
//             if (!userId) return null;
//             const { data, error } = await supabase
//                 .from('profiles')
//                 .select('user_id, email, english_name, chinese_name, student_id, avatar_url, role_name, department, nationality, birth_year, gender')
//                 .eq('user_id', userId)
//                 .single();

//             if (error) throw new Error(error.message);
//             return data as UserDetails;
//         },
//         enabled: !!userId,
//     });

//     if (isLoading) return <p>Loading user details...</p>;
//     if (error) return <p className="text-system-danger">Error: {error.message}</p>;
//     if (!user) return <p>User not found.</p>;

//     const avatarUrl = user.avatar_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${user.avatar_url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${user.english_name || user.email}`;

//     return (
//         <div className="space-y-6">
//             <Link to="/cms/users" className="text-primary hover:underline">&larr; Back to All Users</Link>
//             <div className="bg-white shadow-md rounded-lg overflow-hidden">
//                 <div className="p-6">
//                     <div className="flex items-center space-x-5">
//                         <img className="h-24 w-24 rounded-full object-cover" src={avatarUrl} alt="Avatar" />
//                         <div>
//                             <h1 className="text-2xl font-bold text-text-primary">{user.english_name || 'No Name'}</h1>
//                             <p className="text-sm font-medium text-secondary">{user.role_name ? user.role_name.charAt(0).toUpperCase() + user.role_name.slice(1) : ''}</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="border-t border-border px-6 py-4">
//                     <dl className="divide-y divide-border">
//                         <DetailRow label="Email Address" value={user.email} />
//                         <DetailRow label="Chinese Name" value={user.chinese_name} />
//                         <DetailRow label="Student ID" value={user.student_id} />
//                         <DetailRow label="Department" value={user.department} />
//                         <DetailRow label="Nationality" value={user.nationality} />
//                         <DetailRow label="Birth Year" value={user.birth_year} />
//                         <DetailRow label="Gender" value={user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : ''} />
//                     </dl>
//                 </div>
//             </div>
//         </div>
//     );
// };

import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../contexts/AuthContext';

type UserDetails = {
    user_id: string;
    email: string | null;
    english_name: string | null;
    chinese_name: string | null;
    student_id: string | null;
    avatar_url: string | null;
    role_name: string | null;
    department: string | null;
    nationality: string | null;
    birth_year: number | null;
    gender: string | null;
};

const DetailRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-text-secondary">{label}</dt>
        <dd className="mt-1 text-sm text-text-primary sm:mt-0 sm:col-span-2">{value || '-'}</dd>
    </div>
);

export const UserDetailPage = () => {
    const { id: userId } = useParams<{ id: string }>();

    const { data: user, isLoading, error } = useQuery<UserDetails>({
        queryKey: ['user_details', userId],
        queryFn: async () => {
            if (!userId) return null;
            const { data, error } = await supabase.from('user_details').select('*').eq('user_id', userId).single();
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!userId,
    });

    if (isLoading) return <p>Loading user details...</p>;
    if (error) return <p className="text-system-danger">Error: {error.message}</p>;
    if (!user) return <p>User not found.</p>;

    const avatarUrl = user.avatar_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${user.avatar_url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${user.english_name || user.email}`;

    return (
        <div className="space-y-6">
            <Link to="/cms/users" className="text-primary hover:underline">&larr; Back to All Users</Link>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center space-x-5">
                        <img className="h-24 w-24 rounded-full object-cover" src={avatarUrl} alt="Avatar" />
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary">{user.english_name || 'No Name'}</h1>
                            <p className="text-sm font-medium text-secondary">{user.role_name ? user.role_name.charAt(0).toUpperCase() + user.role_name.slice(1) : ''}</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-border px-6 py-4">
                    <dl className="divide-y divide-border">
                        <DetailRow label="Email Address" value={user.email} />
                        <DetailRow label="Chinese Name" value={user.chinese_name} />
                        <DetailRow label="Student ID" value={user.student_id} />
                        <DetailRow label="Department" value={user.department} />
                        <DetailRow label="Nationality" value={user.nationality} />
                        <DetailRow label="Birth Year" value={user.birth_year} />
                        <DetailRow label="Gender" value={user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : ''} />
                    </dl>
                </div>
            </div>
        </div>
    );
};