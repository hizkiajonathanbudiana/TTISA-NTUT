// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import { supabase } from '../../contexts/AuthContext';
// // import toast from 'react-hot-toast';
// // import { useState } from 'react';
// // import { useForm, type SubmitHandler } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { z } from 'zod';
// // import { Link } from 'react-router-dom';

// // const TeamSchema = z.object({
// //     name_en: z.string().min(1, 'English name is required'),
// //     name_zh_hant: z.string().min(1, 'Chinese name is required'),
// //     description_en: z.string().optional(),
// //     description_zh_hant: z.string().optional(),
// // });
// // type TeamFormInputs = z.infer<typeof TeamSchema>;
// // type Team = { id: string; name_en: string; is_active: boolean; };

// // export const TeamsManagementPage = () => {
// //     const [isFormOpen, setIsFormOpen] = useState(false);
// //     const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
// //     const queryClient = useQueryClient();
// //     const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TeamFormInputs>({ resolver: zodResolver(TeamSchema) });

// //     const { data: teams, isLoading } = useQuery<Team[]>({
// //         queryKey: ['cms_teams'],
// //         queryFn: async () => {
// //             const { data, error } = await supabase.from('teams').select('id, name_en, is_active').order('name_en');
// //             if (error) throw new Error(error.message);
// //             return data;
// //         },
// //     });

// //     const createMutation = useMutation({
// //         mutationFn: async (formData: TeamFormInputs) => {
// //             const { error } = await supabase.from('teams').insert({ ...formData, is_active: true });
// //             if (error) throw error;
// //         },
// //         onSuccess: () => {
// //             toast.success('Team created successfully!');
// //             queryClient.invalidateQueries({ queryKey: ['cms_teams'] });
// //             setIsFormOpen(false);
// //             reset();
// //         },
// //         onError: (error) => toast.error(error.message),
// //     });

// //     const onSubmit: SubmitHandler<TeamFormInputs> = (data) => createMutation.mutate(data);

// //     return (
// //         <div>
// //             <div className="flex justify-between items-center mb-6">
// //                 <h1 className="text-3xl font-bold">Manage Teams</h1>
// //                 <button onClick={() => setIsFormOpen(true)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover">Create New Team</button>
// //             </div>

// //             {isFormOpen && (
// //                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
// //                     <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
// //                         <h2 className="text-2xl font-bold mb-4">Create New Team</h2>
// //                         <div className="border-b border-gray-200 mb-4"><nav className="-mb-px flex space-x-8"><button type="button" onClick={() => setActiveTab('en')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'en' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>English</button><button type="button" onClick={() => setActiveTab('zh')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'zh' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>Chinese</button></nav></div>
// //                         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
// //                             <div className={activeTab === 'en' ? 'block' : 'hidden'}><div className="space-y-4"><div><label className="block text-sm">Name (English)</label><input {...register('name_en')} className="mt-1 w-full p-2 border rounded-md" />{errors.name_en && <p className="text-sm text-system-danger">{errors.name_en.message}</p>}</div><div><label className="block text-sm">Description (English)</label><textarea {...register('description_en')} rows={3} className="mt-1 w-full p-2 border rounded-md" /></div></div></div>
// //                             <div className={activeTab === 'zh' ? 'block' : 'hidden'}><div className="space-y-4"><div><label className="block text-sm">Name (Chinese)</label><input {...register('name_zh_hant')} className="mt-1 w-full p-2 border rounded-md" />{errors.name_zh_hant && <p className="text-sm text-system-danger">{errors.name_zh_hant.message}</p>}</div><div><label className="block text-sm">Description (Chinese)</label><textarea {...register('description_zh_hant')} rows={3} className="mt-1 w-full p-2 border rounded-md" /></div></div></div>
// //                             <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 bg-neutral-200 rounded-md">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50">{isSubmitting ? 'Creating...' : 'Create Team'}</button></div>
// //                         </form>
// //                     </div>
// //                 </div>
// //             )}

// //             {isLoading ? <p>Loading teams...</p> : (
// //                 <div className="bg-white shadow-md rounded-lg overflow-x-auto">
// //                     <table className="min-w-full">
// //                         <thead className="bg-neutral-100"><tr><th className="p-4 text-left">Name (English)</th><th className="p-4 text-left">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
// //                         <tbody>
// //                             {teams?.map(team => (
// //                                 <tr key={team.id} className="border-b">
// //                                     <td className="p-4 font-semibold">{team.name_en}</td>
// //                                     <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${team.is_active ? 'bg-green-100 text-green-800' : 'bg-neutral-200 text-neutral-800'}`}>{team.is_active ? 'Active' : 'Inactive'}</span></td>
// //                                     <td className="p-4 text-right"><Link to={`/cms/teams/${team.id}`} className="px-3 py-1 bg-secondary text-white rounded-md text-sm">Edit Members & Details</Link></td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase } from '../../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import { useState } from 'react';
// import { useForm, type SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Link } from 'react-router-dom';

// const TeamSchema = z.object({ name_en: z.string().min(1, 'English name is required'), name_zh_hant: z.string().min(1, 'Chinese name is required'), description_en: z.string().optional(), description_zh_hant: z.string().optional(), });
// type TeamFormInputs = z.infer<typeof TeamSchema>;
// type Team = { id: string; name_en: string; is_active: boolean; };

// export const TeamsManagementPage = () => {
//     const [isFormOpen, setIsFormOpen] = useState(false);
//     const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
//     const queryClient = useQueryClient();
//     const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TeamFormInputs>({ resolver: zodResolver(TeamSchema) });

//     const { data: teams, isLoading } = useQuery<Team[]>({ queryKey: ['cms_teams'], queryFn: async () => { const { data, error } = await supabase.from('teams').select('id, name_en, is_active').order('name_en'); if (error) throw new Error(error.message); return data; }, });
//     const createMutation = useMutation({ mutationFn: async (formData: TeamFormInputs) => { const { error } = await supabase.from('teams').insert({ ...formData, is_active: true }); if (error) throw error; }, onSuccess: () => { toast.success('Team created successfully!'); queryClient.invalidateQueries({ queryKey: ['cms_teams'] }); setIsFormOpen(false); reset(); }, onError: (error) => toast.error(error.message), });
//     const onSubmit: SubmitHandler<TeamFormInputs> = (data) => createMutation.mutate(data);

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold">Manage Teams</h1>
//                 <button onClick={() => setIsFormOpen(true)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Create New Team</button>
//             </div>

//             {isFormOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"><div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl"><h2 className="text-2xl font-bold mb-4">Create New Team</h2><div className="border-b border-gray-200 mb-4"><nav className="-mb-px flex space-x-8"><button type="button" onClick={() => setActiveTab('en')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'en' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>English</button><button type="button" onClick={() => setActiveTab('zh')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'zh' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>Chinese</button></nav></div><form onSubmit={handleSubmit(onSubmit)} className="space-y-4"><div className={activeTab === 'en' ? 'block' : 'hidden'}><div className="space-y-4"><div><label className="block text-sm">Name (English)</label><input {...register('name_en')} className="mt-1 w-full p-2 border rounded-md" />{errors.name_en && <p className="text-sm text-system-danger">{errors.name_en.message}</p>}</div><div><label className="block text-sm">Description (English)</label><textarea {...register('description_en')} rows={3} className="mt-1 w-full p-2 border rounded-md" /></div></div></div><div className={activeTab === 'zh' ? 'block' : 'hidden'}><div className="space-y-4"><div><label className="block text-sm">Name (Chinese)</label><input {...register('name_zh_hant')} className="mt-1 w-full p-2 border rounded-md" />{errors.name_zh_hant && <p className="text-sm text-system-danger">{errors.name_zh_hant.message}</p>}</div><div><label className="block text-sm">Description (Chinese)</label><textarea {...register('description_zh_hant')} rows={3} className="mt-1 w-full p-2 border rounded-md" /></div></div></div><div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">{isSubmitting ? 'Creating...' : 'Create Team'}</button></div></form></div></div>
//             )}

//             <div className="bg-white shadow-md rounded-lg overflow-x-auto">
//                 <table className="min-w-full">
//                     <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Name (English)</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
//                     <tbody>
//                         {isLoading && <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr>}
//                         {teams?.map(team => (
//                             <tr key={team.id} className="border-b hover:bg-neutral-50"><td className="p-4 font-medium">{team.name_en}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${team.is_active ? 'bg-green-100 text-green-800' : 'bg-neutral-200 text-neutral-800'}`}>{team.is_active ? 'Active' : 'Inactive'}</span></td><td className="p-4 text-right"><Link to={`/cms/teams/${team.id}`} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover">Edit Members & Details</Link></td></tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';

const TeamSchema = z.object({ name_en: z.string().min(1, 'English name is required'), name_zh_hant: z.string().min(1, 'Chinese name is required'), description_en: z.string().optional(), description_zh_hant: z.string().optional(), });
type TeamFormInputs = z.infer<typeof TeamSchema>;
type Team = { id: string; name_en: string; is_active: boolean; };

export const TeamsManagementPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TeamFormInputs>({ resolver: zodResolver(TeamSchema) });

    const { data: teams, isLoading } = useQuery<Team[]>({ queryKey: ['cms_teams'], queryFn: async () => { const { data, error } = await supabase.from('teams').select('id, name_en, is_active').order('name_en'); if (error) throw new Error(error.message); return data; }, });
    const createMutation = useMutation({ mutationFn: async (formData: TeamFormInputs) => { const { error } = await supabase.from('teams').insert({ ...formData, is_active: true }); if (error) throw error; }, onSuccess: () => { toast.success('Team created successfully!'); queryClient.invalidateQueries({ queryKey: ['cms_teams'] }); setIsFormOpen(false); reset(); }, onError: (error) => toast.error(error.message), });
    const onSubmit: SubmitHandler<TeamFormInputs> = (data) => createMutation.mutate(data);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Manage Teams</h1><button onClick={() => setIsFormOpen(true)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Create New Team</button></div>
            {isFormOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"><div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl"><h2 className="text-2xl font-bold mb-4">Create New Team</h2><div className="border-b border-gray-200 mb-4"><nav className="-mb-px flex space-x-8"><button type="button" onClick={() => setActiveTab('en')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'en' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>English</button><button type="button" onClick={() => setActiveTab('zh')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'zh' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>Chinese</button></nav></div><form onSubmit={handleSubmit(onSubmit)} className="space-y-4"><div className={activeTab === 'en' ? 'block' : 'hidden'}><div className="space-y-4"><div><label className="block text-sm">Name (English)</label><input {...register('name_en')} className="mt-1 w-full p-2 border rounded-md" />{errors.name_en && <p className="text-sm text-system-danger">{errors.name_en.message}</p>}</div><div><label className="block text-sm">Description (English)</label><textarea {...register('description_en')} rows={3} className="mt-1 w-full p-2 border rounded-md" /></div></div></div><div className={activeTab === 'zh' ? 'block' : 'hidden'}><div className="space-y-4"><div><label className="block text-sm">Name (Chinese)</label><input {...register('name_zh_hant')} className="mt-1 w-full p-2 border rounded-md" />{errors.name_zh_hant && <p className="text-sm text-system-danger">{errors.name_zh_hant.message}</p>}</div><div><label className="block text-sm">Description (Chinese)</label><textarea {...register('description_zh_hant')} rows={3} className="mt-1 w-full p-2 border rounded-md" /></div></div></div><div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">{isSubmitting ? 'Creating...' : 'Create Team'}</button></div></form></div></div>)}
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full responsive-table">
                    <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Name (English)</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
                    <tbody>
                        {isLoading && <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr>}
                        {teams?.map(team => (
                            <tr key={team.id}><td data-label="Name">{team.name_en}</td><td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${team.is_active ? 'bg-green-100 text-green-800' : 'bg-neutral-200 text-neutral-800'}`}>{team.is_active ? 'Active' : 'Inactive'}</span></td><td data-label="Actions" className="text-right"><Link to={`/cms/teams/${team.id}`} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover">Edit Members & Details</Link></td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};