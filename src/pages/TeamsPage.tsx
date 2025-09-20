import { useQuery } from '@tanstack/react-query';
import { supabase } from '../contexts/AuthContext';

type Member = {
    position: string;
    profiles: {
        english_name: string | null;
        avatar_url: string | null;
    } | null;
};
type Team = { id: string; name: string; description: string | null; team_members: Member[]; };

export const TeamsPage = () => {
    const { data: teams, isLoading, error } = useQuery<Team[]>({
        queryKey: ['teams'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('teams')
                .select('id, name, description, team_members(position, profiles(english_name, avatar_url))')
                .eq('is_active', true)
                .order('name', { ascending: true });
            if (error) throw new Error(error.message);
            return data;
        },
    });

    if (isLoading) return <div className="text-center py-12">Loading teams...</div>;
    if (error) return <div className="text-center py-12 text-system-danger">Error: {error.message}</div>;

    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold text-neutral-800">Our Teams</h1>
            {teams && teams.length > 0 ? (
                teams.map(team => (
                    <section key={team.id} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-primary">{team.name}</h2>
                        <p className="text-neutral-500 mt-2 mb-6">{team.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {team.team_members.map(member => (
                                <div key={`${team.id}-${member.profiles?.english_name}`} className="text-center">
                                    <img
                                        src={member.profiles?.avatar_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${member.profiles.avatar_url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${member.profiles?.english_name}`}
                                        alt={member.profiles?.english_name || 'Member'}
                                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-neutral-100"
                                    />
                                    <h3 className="font-bold mt-2 text-neutral-800">{member.profiles?.english_name}</h3>
                                    <p className="text-sm text-secondary font-semibold">{member.position}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                ))
            ) : (
                <p>No active teams found.</p>
            )}
        </div>
    );
};