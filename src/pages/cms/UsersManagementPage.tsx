import { useState, useMemo } from 'react';
import { supabase, useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CmsActionButton } from '../../components/cms/CmsActionButton';
import { Pagination } from '../../components/Pagination';

type Role = { id: string; name: string; };
type UserDetails = { user_id: string; email: string | null; english_name: string | null; student_id: string | null; avatar_url: string | null; role_id: string | null; role_name: string | null; };
type UserProfile = { roles: { name: string; } | null; };
type PaginatedUsersResponse = {
    users: UserDetails[];
    roles: Role[];
    currentUserProfile: UserProfile | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
};

const RoleEditModal = ({ user, roles, onSave, onCancel }: { user: UserDetails, roles: Role[], onSave: (userId: string, roleId: string) => void, onCancel: () => void }) => {
    const [selectedRoleId, setSelectedRoleId] = useState(user.role_id || '');
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"><div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"><h2 className="text-2xl font-bold mb-4">Edit Role for</h2><p className="mb-1 font-semibold">{user.english_name || user.email}</p><p className="text-sm text-neutral-500 mb-6">{user.email}</p><div><label htmlFor="role" className="block text-sm font-medium">Role</label><select id="role" value={selectedRoleId} onChange={(e) => setSelectedRoleId(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white">{roles.map(role => (<option key={role.id} value={role.id}>{role.name}</option>))}</select></div><div className="flex justify-end space-x-4 pt-6"><button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">Cancel</button><button type="button" onClick={() => onSave(user.user_id, selectedRoleId)} className="px-4 py-2 bg-primary text-white rounded-md font-semibold">Save Changes</button></div></div></div>);
};

export const UsersManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState<string>('all'); // New role filter state
    const [editingUser, setEditingUser] = useState<UserDetails | null>(null);
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();

    // Fetch users with pagination via Edge Function
    const { data: usersData, isLoading } = useQuery<PaginatedUsersResponse>({
        queryKey: ['cms_users_paginated', currentPage, searchTerm, roleFilter],
        queryFn: async () => {
            const { data, error } = await supabase.functions.invoke('get-cms-users', {
                body: { page: currentPage, limit: 50, search: searchTerm, roleFilter }
            });
            if (error) throw new Error(error.message);
            return data;
        },
    });

    const users = usersData?.users || [];
    const allRoles = usersData?.roles || [];
    const currentUserProfile = usersData?.currentUserProfile;
    const pagination = usersData?.pagination;

    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, roleId }: { userId: string, roleId: string }) => {
            const { error } = await supabase.functions.invoke('crud-user', {
                body: { action: 'update_role', data: { userId, roleId } }
            });
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            toast.success("User role updated successfully!");
            setEditingUser(null);
            queryClient.invalidateQueries({ queryKey: ['cms_users_paginated'] });
        },
        onError: (error) => toast.error(error.message),
    });

    // Handle search with debouncing effect
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const filteredUsers = users; // Already filtered on server-side

    const rolesForModal = useMemo(() => {
        if (!allRoles) return [];
        if (currentUserProfile?.roles?.name === 'admin') {
            return allRoles.filter(role => role.name !== 'developer');
        }
        return allRoles;
    }, [allRoles, currentUserProfile]);

    const canEditRoles = currentUserProfile?.roles?.name === 'admin' || currentUserProfile?.roles?.name === 'developer';

    return (
        <div className="space-y-6">
            {editingUser && rolesForModal && <RoleEditModal user={editingUser} roles={rolesForModal} onCancel={() => setEditingUser(null)} onSave={(userId, roleId) => updateRoleMutation.mutate({ userId, roleId })} />}
            <h1 className="text-3xl font-bold">Manage Users</h1>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 flex-1">
                    <div className="flex-1 max-w-sm">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Filter by name, email, or student ID..."
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    {/* Role Filter Dropdown */}
                    <div className="min-w-[140px]">
                        <select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setCurrentPage(1); // Reset to first page when filtering
                            }}
                            className="w-full p-2 border rounded-md bg-white"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin Only</option>
                            <option value="member">Member Only</option>
                            <option value="organizer">Organizer Only</option>
                        </select>
                    </div>
                </div>

                {pagination && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                        </span>
                    </div>
                )}
            </div>

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

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};