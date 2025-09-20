import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';

type Team = { id: string; name: string; is_active: boolean; description: string | null; };
type TeamFormInputs = { name: string; description: string | null; };

export const TeamsManagementPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm<TeamFormInputs>();

    const { data: teams, isLoading } = useQuery<Team[]>({
        queryKey: ['cms_teams'],
        queryFn: async () => {
            const { data, error } = await supabase.from('teams').select('*').order('name');
            if (error) throw new Error(error.message);
            return data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (formData: TeamFormInputs) => {
            const { error } = await supabase.from('teams').insert(formData);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Team created successfully!');
            queryClient.invalidateQueries({ queryKey: ['cms_teams'] });
            setIsFormOpen(false);
            reset();
        },
        onError: (error) => toast.error(error.message),
    });

    const onSubmit: SubmitHandler<TeamFormInputs> = (data) => createMutation.mutate(data);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Teams</h1>
                <button onClick={() => setIsFormOpen(true)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover">Create New Team</button>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Create New Team</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div><label className="block text-sm font-medium">Team Name</label><input {...register('name')} className="mt-1 w-full p-2 border rounded-md" /></div>
                            <div><label className="block text-sm font-medium">Description</label><textarea {...register('description')} rows={3} className="mt-1 w-full p-2 border rounded-md" /></div>
                            <div className="flex justify-end space-x-4"><button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 bg-neutral-200 rounded-md">Cancel</button><button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">Save Team</button></div>
                        </form>
                    </div>
                </div>
            )}

            {isLoading ? <p>Loading teams...</p> : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-neutral-100"><tr><th className="p-4 text-left">Name</th><th className="p-4 text-left">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
                        <tbody>
                            {teams?.map(team => (
                                <tr key={team.id} className="border-b">
                                    <td className="p-4 font-semibold">{team.name}</td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${team.is_active ? 'bg-green-100 text-green-800' : 'bg-neutral-200 text-neutral-800'}`}>{team.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td className="p-4 text-right"><Link to={`/cms/teams/${team.id}`} className="px-3 py-1 bg-secondary text-white rounded-md text-sm">Edit Members</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};