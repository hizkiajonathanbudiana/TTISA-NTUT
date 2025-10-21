import { useState, useMemo } from 'react';
import { supabase, useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CmsActionButton } from '../../components/cms/CmsActionButton';

type Role = { id: string; name: string; };
type UserDetails = { user_id: string; email: string | null; english_name: string | null; student_id: string | null; avatar_url: string | null; role_id: string | null; role_name: string | null; };
type UserProfile = { roles: { name: string; } | null; };

const RoleEditModal = ({ user, roles, onSave, onCancel }: { user: UserDetails, roles: Role[], onSave: (userId: string, roleId: string) => void, onCancel: () => void }) => {
    const [selectedRoleId, setSelectedRoleId] = useState(user.role_id || '');
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"><div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"><h2 className="text-2xl font-bold mb-4">Edit Role for</h2><p className="mb-1 font-semibold">{user.english_name || user.email}</p><p className="text-sm text-neutral-500 mb-6">{user.email}</p><div><label htmlFor="role" className="block text-sm font-medium">Role</label><select id="role" value={selectedRoleId} onChange={(e) => setSelectedRoleId(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white">{roles.map(role => (<option key={role.id} value={role.id}>{role.name}</option>))}</select></div><div className="flex justify-end space-x-4 pt-6"><button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">Cancel</button><button type="button" onClick={() => onSave(user.user_id, selectedRoleId)} className="px-4 py-2 bg-primary text-white rounded-md font-semibold">Save Changes</button></div></div></div>);
};

export const UsersManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<UserDetails | null>(null);
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();

    const { data: users, isLoading: isLoadingUsers } = useQuery<UserDetails[]>({ queryKey: ['cms_users'], queryFn: async () => { const { data, error } = await supabase.from('user_details').select('*'); if (error) throw new Error(error.message); return data; }, });
    const { data: allRoles, isLoading: isLoadingRoles } = useQuery<Role[]>({ queryKey: ['roles'], queryFn: async () => { const { data, error } = await supabase.from('roles').select('*'); if (error) throw new Error(error.message); return data; } });
    const { data: currentUserProfile } = useQuery<UserProfile | null>({ queryKey: ['current_user_profile', currentUser?.id], queryFn: async () => { if (!currentUser) return null; const { data, error } = await supabase.from('users').select('roles(name)').eq('id', currentUser.id).single(); if (error) throw new Error(error.message); return data as unknown as UserProfile; }, enabled: !!currentUser, });

    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, roleId }: { userId: string, roleId: string }) => {
            const { error } = await supabase.rpc('update_user_role', {
                target_user_id: userId,
                target_role_id: roleId,
            });
            if (error) throw error;
        },
        onSuccess: () => { toast.success("User role updated successfully!"); setEditingUser(null); queryClient.invalidateQueries({ queryKey: ['cms_users'] }); },
        onError: (error) => toast.error(error.message),
    });

    const filteredUsers = useMemo(() => { if (!users) return []; if (!searchTerm) return users; return users.filter(user => user.english_name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || user.student_id?.toLowerCase().includes(searchTerm.toLowerCase())); }, [users, searchTerm]);

    const rolesForModal = useMemo(() => {
        if (!allRoles) return [];
        if (currentUserProfile?.roles?.name === 'admin') {
            return allRoles.filter(role => role.name !== 'developer');
        }
        return allRoles;
    }, [allRoles, currentUserProfile]);

    const canEditRoles = currentUserProfile?.roles?.name === 'admin' || currentUserProfile?.roles?.name === 'developer';
    const isLoading = isLoadingUsers || isLoadingRoles;

    return (
        <div className="space-y-6">
            {editingUser && rolesForModal && <RoleEditModal user={editingUser} roles={rolesForModal} onCancel={() => setEditingUser(null)} onSave={(userId, roleId) => updateRoleMutation.mutate({ userId, roleId })} />}
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <div className="mb-6"><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Filter by name, email, or student ID..." className="w-full max-w-sm p-2 border rounded-md" /></div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full responsive-table">
                    <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Name</th><th className="p-4 text-left font-semibold">Student ID</th><th className="p-4 text-left font-semibold">Email</th><th className="p-4 text-left font-semibold">Role</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
                    <tbody>
                        {isLoading ? (<tr><td colSpan={5} className="p-4 text-center">Loading users...</td></tr>) :
                            filteredUsers.length > 0 ? (filteredUsers.map(user => {
                                const canBeEdited = (currentUserProfile?.roles?.name === 'developer') || (currentUserProfile?.roles?.name === 'admin' && user.role_name !== 'developer');
                                return (
                                    <tr key={user.user_id}>
                                        <td data-label="Name"><Link to={`/cms/users/${user.user_id}`} className="flex items-center gap-3 hover:underline text-primary"><img src={user.avatar_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${user.avatar_url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${user.english_name || user.email}`} alt="avatar" className="w-8 h-8 rounded-full" /><span>{user.english_name || 'N/A'}</span></Link></td>
                                        <td data-label="Student ID">{user.student_id || 'N/A'}</td>
                                        <td data-label="Email">{user.email}</td>
                                        <td data-label="Role" className="capitalize">{user.role_name || 'Member'}</td>
                                        <td data-label="Actions" className="text-right">{canEditRoles && user.user_id !== currentUser?.id && canBeEdited && (<CmsActionButton variant="secondary" onClick={() => setEditingUser(user)}>Edit Role</CmsActionButton>)}</td>
                                    </tr>
                                );
                            })) : (<tr><td colSpan={5} className="p-4 text-center text-neutral-500">No users found.</td></tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};