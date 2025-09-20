import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';

type Member = { user_id: string, position: string, profiles: { english_name: string | null } };
type Team = { id: string, name: string, team_members: Member[] };
type UserProfile = { user_id: string; english_name: string | null; email: string };

export const TeamEditPage = () => {
    const { id: teamId } = useParams<{ id: string }>();
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [position, setPosition] = useState('Member');
    const queryClient = useQueryClient();

    const { data: team, isLoading } = useQuery<Team>({
        queryKey: ['cms_team', teamId],
        queryFn: async () => {
            const { data, error } = await supabase.from('teams').select('id, name, team_members(user_id, position, profiles(english_name))').eq('id', teamId!).single();
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!teamId,
    });

    const handleSearch = async (term: string) => {
        setSearch(term);
        if (term.length < 2) { setSearchResults([]); return; }
        const { data, error } = await supabase.from('profiles').select('user_id, english_name, users(email)').or(`english_name.ilike.%${term}%,users.email.ilike.%${term}%`).limit(5);
        if (error) toast.error(error.message);
        else setSearchResults(data as any);
    };

    const addMutation = useMutation({
        mutationFn: async (user: UserProfile) => {
            const { error } = await supabase.from('team_members').insert({ team_id: teamId!, user_id: user.user_id, position });
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Member added!'); queryClient.invalidateQueries({ queryKey: ['cms_team', teamId] }); setSearch(''); setSearchResults([]); setPosition('Member');
        },
        onError: (e: any) => toast.error(`Failed to add member: ${e.code === '23505' ? 'User is already in this team.' : e.message}`),
    });

    const removeMutation = useMutation({
        mutationFn: async (userId: string) => {
            const { error } = await supabase.from('team_members').delete().eq('team_id', teamId!).eq('user_id', userId);
            if (error) throw error;
        },
        onSuccess: () => { toast.success('Member removed.'); queryClient.invalidateQueries({ queryKey: ['cms_team', teamId] }); },
        onError: (e: any) => toast.error(e.message),
    });

    if (isLoading) return <p>Loading team...</p>;

    return (
        <div>
            <Link to="/cms/teams" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all teams</Link>
            <h1 className="text-3xl font-bold">Edit Team: {team?.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Add New Member</h2>
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium">Search by Name or Email</label><input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} className="mt-1 w-full p-2 border rounded-md" placeholder="Enter at least 2 characters" /></div>
                        {searchResults.length > 0 && <div className="border rounded-md bg-neutral-100">{searchResults.map(user => (<div key={user.user_id} className="p-2 border-b cursor-pointer hover:bg-neutral-200" onClick={() => addMutation.mutate(user)}>{user.english_name} ({user.email})</div>))}</div>}
                        <div><label className="block text-sm font-medium">Position</label><input type="text" value={position} onChange={(e) => setPosition(e.target.value)} className="mt-1 w-full p-2 border rounded-md" /></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Current Members ({team?.team_members.length || 0})</h2>
                    <ul className="space-y-2">{team?.team_members.map(member => (<li key={member.user_id} className="flex justify-between items-center p-2 rounded-md hover:bg-neutral-100"><span><strong>{member.profiles?.english_name}</strong> ({member.position})</span><button onClick={() => removeMutation.mutate(member.user_id)} className="text-xs text-red-500 hover:underline">Remove</button></li>))}</ul>
                </div>
            </div>
        </div>
    );
};