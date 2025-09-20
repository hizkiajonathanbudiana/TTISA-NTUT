import { useState, useEffect } from 'react';
import { supabase, useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Role = { id: string; name: string; };
type UserSearchResult = {
    user_id: string;
    english_name: string | null;
    student_id: string | null;
    avatar_url: string | null;
    users: {
        email: string;
        roles: { id: string; name: string; } | null;
    } | null;
};

const RoleEditModal = ({ user, roles, onSave, onCancel }: { user: UserSearchResult, roles: Role[], onSave: (userId: string, roleId: string) => void, onCancel: () => void }) => {
    const [selectedRoleId, setSelectedRoleId] = useState(user.users?.roles?.id || '');

    const handleSave = () => {
        onSave(user.user_id, selectedRoleId);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Edit Role for</h2>
                <p className="mb-1 font-semibold">{user.english_name || user.users?.email}</p>
                <p className="text-sm text-neutral-500 mb-6">{user.users?.email}</p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium">Role</label>
                        <select id="role" value={selectedRoleId} onChange={(e) => setSelectedRoleId(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white">
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md">Save Changes</button>
                </div>
            </div>
        </div>
    );
};


export const UsersManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<UserSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [editingUser, setEditingUser] = useState<UserSearchResult | null>(null);

    const { user: currentUser } = useAuth();
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // Fetch all available roles for the dropdown
    const { data: roles } = useQuery<Role[]>({
        queryKey: ['roles'],
        queryFn: async () => {
            const { data, error } = await supabase.from('roles').select('*');
            if (error) throw new Error(error.message);
            return data;
        },
    });

    // Fetch the current user's role to determine if they are an admin
    useEffect(() => {
        const fetchUserRole = async () => {
            if (currentUser) {
                const { data } = await supabase.from('users').select('roles(name)').eq('id', currentUser.id).single();
                setCurrentUserRole(data?.roles?.name || null);
            }
        };
        fetchUserRole();
    }, [currentUser]);

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchTerm.length < 2) {
            if (hasSearched) toast.error('Please enter at least 2 characters to search.');
            return;
        }
        setIsLoading(true); setHasSearched(true);
        try {
            const { data, error } = await supabase.from('profiles').select('user_id, english_name, student_id, avatar_url, users(email, roles(id, name))').or(`english_name.ilike.%${searchTerm}%,student_id.ilike.%${searchTerm}%,users.email.ilike.%${searchTerm}%`);
            if (error) throw error;
            setResults(data);
        } catch (error: any) {
            toast.error(error.message); setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, roleId }: { userId: string, roleId: string }) => {
            const { error } = await supabase.from('users').update({ role_id: roleId }).eq('id', userId);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("User role updated successfully!");
            setEditingUser(null);
            handleSearch(); // Refresh search results
        },
        onError: (error) => toast.error(error.message),
    });

    const isAdmin = currentUserRole === 'admin';

    return (
        <div>
            {editingUser && roles && <RoleEditModal user={editingUser} roles={roles} onCancel={() => setEditingUser(null)} onSave={(userId, roleId) => updateRoleMutation.mutate({ userId, roleId })} />}
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name, email, or student ID..." className="flex-grow p-2 border rounded-md" />
                <button type="submit" disabled={isLoading} className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50">{isLoading ? 'Searching...' : 'Search'}</button>
            </form>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-neutral-100"><tr><th className="p-4 text-left">Name</th><th className="p-4 text-left">Student ID</th><th className="p-4 text-left">Email</th><th className="p-4 text-left">Role</th><th className="p-4 text-right">Actions</th></tr></thead>
                    <tbody>
                        {isLoading ? (<tr><td colSpan={5} className="p-4 text-center">Searching...</td></tr>) :
                            results.length > 0 ? (results.map(user => (
                                <tr key={user.user_id} className="border-b">
                                    <td className="p-4 flex items-center gap-3"><img src={user.avatar_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${user.avatar_url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${user.english_name || user.users?.email}`} alt="avatar" className="w-8 h-8 rounded-full" /><span>{user.english_name || 'N/A'}</span></td>
                                    <td className="p-4">{user.student_id || 'N/A'}</td>
                                    <td className="p-4">{user.users?.email}</td>
                                    <td className="p-4 capitalize">{user.users?.roles?.name || 'Member'}</td>
                                    <td className="p-4 text-right">
                                        {isAdmin && user.user_id !== currentUser?.id && (
                                            <button onClick={() => setEditingUser(user)} className="px-3 py-1 bg-secondary text-white rounded-md text-sm">Edit Role</button>
                                        )}
                                    </td>
                                </tr>
                            ))) : (<tr><td colSpan={5} className="p-4 text-center text-neutral-500">{hasSearched ? 'No users found.' : 'Enter a search term to begin.'}</td></tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};