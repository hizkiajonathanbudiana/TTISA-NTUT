// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import { useParams, Link } from 'react-router-dom';
// // import { supabase } from '../../contexts/AuthContext';
// // import toast from 'react-hot-toast';
// // import { useState, useEffect } from 'react';
// // import { useForm } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { z } from 'zod';

// // const TeamDetailsSchema = z.object({
// //   name_en: z.string().min(1, 'English name is required'),
// //   name_zh_hant: z.string().min(1, 'Chinese name is required'),
// //   description_en: z.string().optional(),
// //   description_zh_hant: z.string().optional(),
// //   is_active: z.boolean(),
// //   display_order: z.number().optional(),
// // });
// // type TeamDetailsFormInputs = z.infer<typeof TeamDetailsSchema>;

// // type Member = { user_id: string, position_en: string | null, position_zh_hant: string | null, profiles: { english_name: string | null } };
// // type Team = { id: string, team_members: Member[] } & TeamDetailsFormInputs;
// // type UserProfile = { user_id: string; english_name: string | null; email: string };

// // export const TeamEditPage = () => {
// //   const { id: teamId } = useParams<{ id: string }>();
// //   const [search, setSearch] = useState('');
// //   const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
// //   const [positionEn, setPositionEn] = useState('Member');
// //   const [positionZh, setPositionZh] = useState('成員');
// //   const queryClient = useQueryClient();

// //   const { data: team, isLoading } = useQuery<Team>({
// //     queryKey: ['cms_team', teamId],
// //     queryFn: async () => {
// //       const { data, error } = await supabase.from('teams').select('*, team_members(user_id, position_en, position_zh_hant, profiles(english_name))').eq('id', teamId!).single();
// //       if (error) throw new Error(error.message);
// //       return data;
// //     },
// //     enabled: !!teamId,
// //   });

// //   const { register, handleSubmit, reset } = useForm<TeamDetailsFormInputs>({ resolver: zodResolver(TeamDetailsSchema) as any });
// //   useEffect(() => { if (team) reset(team); }, [team, reset]);

// //   const updateDetailsMutation = useMutation({ mutationFn: async (formData: TeamDetailsFormInputs) => { const { error } = await supabase.from('teams').update(formData).eq('id', teamId!); if (error) throw error; }, onSuccess: () => { toast.success('Team details updated!'); queryClient.invalidateQueries({ queryKey: ['cms_team', teamId] }); }, onError: (e: any) => toast.error(e.message), });
// //   const handleSearch = async (term: string) => {
// //     setSearch(term);
// //     if (term.length < 2) { setSearchResults([]); return; }
// //     const { data, error } = await supabase.rpc('search_users', { p_search_term: term });
// //     if (error) toast.error(error.message);
// //     else setSearchResults(data || []);
// //   };
// //   const addMutation = useMutation({
// //     mutationFn: async (user: UserProfile) => {
// //       const { error } = await supabase.from('team_members').insert({ team_id: teamId!, user_id: user.user_id, position_en: positionEn, position_zh_hant: positionZh });
// //       if (error) throw error;
// //     },
// //     onSuccess: () => { toast.success('Member added!'); queryClient.invalidateQueries({ queryKey: ['cms_team', teamId] }); setSearch(''); setSearchResults([]); setPositionEn('Member'); setPositionZh('成員'); },
// //     onError: (e: any) => toast.error(`Failed to add member: ${e.code === '23505' ? 'User is already in this team.' : e.message}`),
// //   });
// //   const removeMutation = useMutation({ mutationFn: async (userId: string) => { const { error } = await supabase.from('team_members').delete().eq('team_id', teamId!).eq('user_id', userId); if (error) throw error; }, onSuccess: () => { toast.success('Member removed.'); queryClient.invalidateQueries({ queryKey: ['cms_team', teamId] }); }, onError: (e: any) => toast.error(e.message), });

// //   if (isLoading) return <p>Loading team...</p>;

// //   return (
// //     <div>
// //       <Link to="/cms/teams" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all teams</Link>
// //       <h1 className="text-3xl font-bold">Edit Team: {team?.name_en}</h1>
// //       <form onSubmit={handleSubmit(data => updateDetailsMutation.mutate(data as any))} className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-4 mt-6">
// //         <h2 className="text-xl font-bold border-b pb-2 mb-4">Team Details</h2>
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           <div><label className="block text-sm font-medium">Name (English)</label><input {...register('name_en')} className="mt-1 w-full p-2 border rounded-md" /></div>
// //           <div><label className="block text-sm font-medium">Name (Chinese)</label><input {...register('name_zh_hant')} className="mt-1 w-full p-2 border rounded-md" /></div>
// //         </div>
// //         <div><label className="block text-sm font-medium">Description (English)</label><textarea {...register('description_en')} rows={3} className="mt-1 w-full p-2 border rounded-md" /></div>
// //         <div><label className="block text-sm font-medium">Description (Chinese)</label><textarea {...register('description_zh_hant')} rows={3} className="mt-1 w-full p-2 border rounded-md" /></div>
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           <div><label className="block text-sm font-medium">Display Order</label><input type="number" {...register('display_order', { valueAsNumber: true })} className="mt-1 w-full p-2 border rounded-md" /></div>
// //           <div className="flex items-end pb-2"><div className="flex items-center gap-2"><input type="checkbox" {...register('is_active')} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" /><label>Team is Active</label></div></div>
// //         </div>
// //         <div className="text-right"><button type="submit" disabled={updateDetailsMutation.isPending} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50">{updateDetailsMutation.isPending ? 'Saving...' : 'Save Details'}</button></div>
// //       </form>

// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
// //         <div className="bg-white p-6 rounded-lg shadow-md">
// //           <h2 className="text-xl font-bold mb-4">Add New Member</h2>
// //           <div className="space-y-4">
// //             <div><label className="block text-sm font-medium">Search by Name or Email</label><input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} className="mt-1 w-full p-2 border rounded-md" placeholder="Enter at least 2 characters" /></div>
// //             {searchResults.length > 0 && <div className="border rounded-md bg-neutral-100 max-h-40 overflow-y-auto">{searchResults.map(user => (<div key={user.user_id} className="p-2 border-b last:border-b-0 cursor-pointer hover:bg-neutral-200" onClick={() => addMutation.mutate(user)}>{user.english_name} ({user.email})</div>))}</div>}
// //             <div><label className="block text-sm font-medium">Position (English)</label><input type="text" value={positionEn} onChange={(e) => setPositionEn(e.target.value)} className="mt-1 w-full p-2 border rounded-md" /></div>
// //             <div><label className="block text-sm font-medium">Position (Chinese)</label><input type="text" value={positionZh} onChange={(e) => setPositionZh(e.target.value)} className="mt-1 w-full p-2 border rounded-md" /></div>
// //           </div>
// //         </div>
// //         <div className="bg-white p-6 rounded-lg shadow-md">
// //           <h2 className="text-xl font-bold mb-4">Current Members ({team?.team_members.length || 0})</h2>
// //           <ul className="space-y-2 max-h-60 overflow-y-auto">{team?.team_members.map(member => (<li key={member.user_id} className="flex justify-between items-center p-2 rounded-md hover:bg-neutral-100"><span><strong>{member.profiles?.english_name}</strong> ({member.position_en})</span><button onClick={() => removeMutation.mutate(member.user_id)} className="text-xs font-semibold text-red-500 hover:underline">Remove</button></li>))}</ul>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useParams, Link } from 'react-router-dom';
// import { supabase } from '../../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// const TeamDetailsSchema = z.object({
//   name_en: z.string().min(1, 'English name is required'),
//   name_zh_hant: z.string().min(1, 'Chinese name is required'),
//   description_en: z.string().optional(),
//   description_zh_hant: z.string().optional(),
//   is_active: z.boolean(),
//   display_order: z.number().optional(),
// });
// type TeamDetailsFormInputs = z.infer<typeof TeamDetailsSchema>;

// type Member = { user_id: string, position_en: string | null, position_zh_hant: string | null, profiles: { english_name: string | null } };
// type Team = { id: string, team_members: Member[] } & TeamDetailsFormInputs;
// type UserProfile = { user_id: string; english_name: string | null; email: string };

// export const TeamEditPage = () => {
//   const { id: teamId } = useParams<{ id: string }>();
//   const [search, setSearch] = useState('');
//   const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
//   const [positionEn, setPositionEn] = useState('Member');
//   const [positionZh, setPositionZh] = useState('成員');
//   const queryClient = useQueryClient();

//   const { data: team, isLoading } = useQuery<Team>({
//     queryKey: ['cms_team', teamId],
//     queryFn: async () => {
//       const { data, error } = await supabase.from('teams').select('*, team_members(user_id, position_en, position_zh_hant, profiles(english_name))').eq('id', teamId!).single();
//       if (error) throw new Error(error.message);
//       return data;
//     },
//     enabled: !!teamId,
//   });

//   const { register, handleSubmit, reset } = useForm<TeamDetailsFormInputs>({ resolver: zodResolver(TeamDetailsSchema) as any });
//   useEffect(() => { if (team) reset(team); }, [team, reset]);

//   const updateDetailsMutation = useMutation({ mutationFn: async (formData: TeamDetailsFormInputs) => { const { error } = await supabase.from('teams').update(formData).eq('id', teamId!); if (error) throw error; }, onSuccess: () => { toast.success('Team details updated!'); queryClient.invalidateQueries({ queryKey: ['cms_team', teamId] }); }, onError: (e: any) => toast.error(e.message), });
//   const handleSearch = async (term: string) => {
//     setSearch(term);
//     if (term.length < 2) { setSearchResults([]); return; }
//     const { data, error } = await supabase.rpc('search_users', { p_search_term: term });
//     if (error) toast.error(error.message);
//     else setSearchResults(data || []);
//   };
//   const addMutation = useMutation({
//     mutationFn: async (user: UserProfile) => {
//       const { error } = await supabase.from('team_members').insert({ team_id: teamId!, user_id: user.user_id, position_en: positionEn, position_zh_hant: positionZh });
//       if (error) throw error;
//     },
//     onSuccess: () => { toast.success('Member added!'); queryClient.invalidateQueries({ queryKey: ['cms_team', teamId] }); setSearch(''); setSearchResults([]); setPositionEn('Member'); setPositionZh('成員'); },
//     onError: (e: any) => toast.error(`Failed to add member: ${e.code === '23505' ? 'User is already in this team.' : e.message}`),
//   });
//   const removeMutation = useMutation({ mutationFn: async (userId: string) => { const { error } = await supabase.from('team_members').delete().eq('team_id', teamId!).eq('user_id', userId); if (error) throw error; }, onSuccess: () => { toast.success('Member removed.'); queryClient.invalidateQueries({ queryKey: ['cms_team', teamId] }); }, onError: (e: any) => toast.error(e.message), });

//   if (isLoading) return <p>Loading team...</p>;

//   return (
//     <div>
//       <Link to="/cms/teams" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all teams</Link>
//       <h1 className="text-3xl font-bold">Edit Team: {team?.name_en}</h1>
//       <form onSubmit={handleSubmit(data => updateDetailsMutation.mutate(data as any))} className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-4 mt-6">
//         <h2 className="text-xl font-bold border-b pb-2 mb-4">Team Details</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div><label className="block text-sm font-medium">Name (English)</label><input {...register('name_en')} className="mt-1 w-full p-2 border rounded-md" /></div>
//           <div><label className="block text-sm font-medium">Name (Chinese)</label><input {...register('name_zh_hant')} className="mt-1 w-full p-2 border rounded-md" /></div>
//         </div>
//         <div><label className="block text-sm font-medium">Description (English)</label><textarea {...register('description_en')} rows={3} className="mt-1 w-full p-2 border rounded-md" /></div>
//         <div><label className="block text-sm font-medium">Description (Chinese)</label><textarea {...register('description_zh_hant')} rows={3} className="mt-1 w-full p-2 border rounded-md" /></div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div><label className="block text-sm font-medium">Display Order</label><input type="number" {...register('display_order', { valueAsNumber: true })} className="mt-1 w-full p-2 border rounded-md" /></div>
//           <div className="flex items-end pb-2"><div className="flex items-center gap-2"><input type="checkbox" {...register('is_active')} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" /><label>Team is Active</label></div></div>
//         </div>
//         <div className="text-right"><button type="submit" disabled={updateDetailsMutation.isPending} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50">{updateDetailsMutation.isPending ? 'Saving...' : 'Save Details'}</button></div>
//       </form>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-bold mb-4">Add New Member</h2>
//           <div className="space-y-4">
//             <div><label className="block text-sm font-medium">Search by Name or Email</label><input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} className="mt-1 w-full p-2 border rounded-md" placeholder="Enter at least 2 characters" /></div>
//             {searchResults.length > 0 && <div className="border rounded-md bg-neutral-100 max-h-40 overflow-y-auto">{searchResults.map(user => (<div key={user.user_id} className="p-2 border-b last:border-b-0 cursor-pointer hover:bg-neutral-200" onClick={() => addMutation.mutate(user)}>{user.english_name} ({user.email})</div>))}</div>}
//             <div><label className="block text-sm font-medium">Position (English)</label><input type="text" value={positionEn} onChange={(e) => setPositionEn(e.target.value)} className="mt-1 w-full p-2 border rounded-md" /></div>
//             <div><label className="block text-sm font-medium">Position (Chinese)</label><input type="text" value={positionZh} onChange={(e) => setPositionZh(e.target.value)} className="mt-1 w-full p-2 border rounded-md" /></div>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-bold mb-4">Current Members ({team?.team_members.length || 0})</h2>
//           <ul className="space-y-2 max-h-60 overflow-y-auto">{team?.team_members.map(member => (<li key={member.user_id} className="flex justify-between items-center p-2 rounded-md hover:bg-neutral-100"><span><strong>{member.profiles?.english_name}</strong> ({member.position_en})</span><button onClick={() => removeMutation.mutate(member.user_id)} className="text-xs font-semibold text-red-500 hover:underline">Remove</button></li>))}</ul>
//         </div>
//       </div>
//     </div>
//   );
// };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { supabase, useAuth } from '../../contexts/AuthContext'; // <-- Impor useAuth
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const TeamDetailsSchema = z.object({
  name_en: z.string().min(1, 'English name is required'),
  name_zh_hant: z.string().min(1, 'Chinese name is required'),
  description_en: z.string().optional(),
  description_zh_hant: z.string().optional(),
  is_active: z.boolean(),
  display_order: z.number().optional(),
});
type TeamDetailsFormInputs = z.infer<typeof TeamDetailsSchema>;

type Member = { user_id: string, position_en: string | null, position_zh_hant: string | null, profiles: { english_name: string | null } };
type Team = { id: string, team_members: Member[] } & TeamDetailsFormInputs;
type UserProfile = { user_id: string; english_name: string | null; email: string };

export const TeamEditPage = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [positionEn, setPositionEn] = useState('Member');
  const [positionZh, setPositionZh] = useState('成員');
  const queryClient = useQueryClient();
  const { session } = useAuth(); // <-- Tambahkan ini

  const { data: team, isLoading } = useQuery<Team>({
    queryKey: ['cms_team', teamId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-team-details', {
        body: { teamId }
      });
      if (error) throw new Error(error.message);
      return data.data; // Function mengembalikan { data: ... }
    },
    enabled: !!session && !!teamId, // <-- Update ini
  });

  const { register, handleSubmit, reset } = useForm<TeamDetailsFormInputs>({ resolver: zodResolver(TeamDetailsSchema) as any });
  useEffect(() => { if (team) reset(team); }, [team, reset]);

  const updateDetailsMutation = useMutation({
    mutationFn: async (formData: TeamDetailsFormInputs) => {
      if (!session) throw new Error("Not authenticated");
      const { error } = await supabase.functions.invoke('crud-team-details', {
        body: {
          action: 'update_team',
          teamId: teamId!,
          data: formData
        }
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Team details updated!'); queryClient.invalidateQueries({ queryKey: ['cms_team', teamId] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const handleSearch = async (term: string) => {
    setSearch(term);
    if (term.length < 2) { setSearchResults([]); return; }
    // Panggilan RPC ini sudah benar, tidak perlu diubah
    const { data, error } = await supabase.rpc('search_users', { p_search_term: term });
    if (error) toast.error(error.message);
    else setSearchResults(data || []);
  };

  const addMutation = useMutation({
    mutationFn: async (user: UserProfile) => {
      if (!session) throw new Error("Not authenticated");
      const memberData = {
        user_id: user.user_id,
        position_en: positionEn,
        position_zh_hant: positionZh
      };
      const { error } = await supabase.functions.invoke('crud-team-details', {
        body: {
          action: 'add_member',
          teamId: teamId!,
          data: memberData
        }
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Member added!'); queryClient.invalidateQueries({ queryKey: ['cms_team', teamId] }); setSearch(''); setSearchResults([]); setPositionEn('Member'); setPositionZh('成員'); },
    onError: (e: any) => toast.error(`Failed to add member: ${e.code === '23505' ? 'User is already in this team.' : e.message}`),
  });

  const removeMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!session) throw new Error("Not authenticated");
      const { error } = await supabase.functions.invoke('crud-team-details', {
        body: {
          action: 'remove_member',
          teamId: teamId!,
          userId: userId
        }
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Member removed.'); queryClient.invalidateQueries({ queryKey: ['cms_team', teamId] }); },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <p>Loading team...</p>;

  return (
    <div>
      <Link to="/cms/teams" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all teams</Link>
      <h1 className="text-3xl font-bold">Edit Team: {team?.name_en}</h1>
      <form onSubmit={handleSubmit(data => updateDetailsMutation.mutate(data as any))} className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-4 mt-6">
        <h2 className="text-xl font-bold border-b pb-2 mb-4">Team Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium">Name (English)</label><input {...register('name_en')} className="mt-1 w-full p-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium">Name (Chinese)</label><input {...register('name_zh_hant')} className="mt-1 w-full p-2 border rounded-md" /></div>
        </div>
        <div><label className="block text-sm font-medium">Description (English)</label><textarea {...register('description_en')} rows={3} className="mt-1 w-full p-2 border rounded-md" /></div>
        <div><label className="block text-sm font-medium">Description (Chinese)</label><textarea {...register('description_zh_hant')} rows={3} className="mt-1 w-full p-2 border rounded-md" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium">Display Order</label><input type="number" {...register('display_order', { valueAsNumber: true })} className="mt-1 w-full p-2 border rounded-md" /></div>
          <div className="flex items-end pb-2"><div className="flex items-center gap-2"><input type="checkbox" {...register('is_active')} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" /><label>Team is Active</label></div></div>
        </div>
        <div className="text-right"><button type="submit" disabled={updateDetailsMutation.isPending} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50">{updateDetailsMutation.isPending ? 'Saving...' : 'Save Details'}</button></div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Add New Member</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium">Search by Name or Email</label><input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} className="mt-1 w-full p-2 border rounded-md" placeholder="Enter at least 2 characters" /></div>
            {searchResults.length > 0 && <div className="border rounded-md bg-neutral-100 max-h-40 overflow-y-auto">{searchResults.map(user => (<div key={user.user_id} className="p-2 border-b last:border-b-0 cursor-pointer hover:bg-neutral-200" onClick={() => addMutation.mutate(user)}>{user.english_name} ({user.email})</div>))}</div>}
            <div><label className="block text-sm font-medium">Position (English)</label><input type="text" value={positionEn} onChange={(e) => setPositionEn(e.target.value)} className="mt-1 w-full p-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium">Position (Chinese)</label><input type="text" value={positionZh} onChange={(e) => setPositionZh(e.target.value)} className="mt-1 w-full p-2 border rounded-md" /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Current Members ({team?.team_members.length || 0})</h2>
          <ul className="space-y-2 max-h-60 overflow-y-auto">{team?.team_members.map(member => (<li key={member.user_id} className="flex justify-between items-center p-2 rounded-md hover:bg-neutral-100"><span><strong>{member.profiles?.english_name}</strong> ({member.position_en})</span><button onClick={() => removeMutation.mutate(member.user_id)} className="text-xs font-semibold text-red-500 hover:underline">Remove</button></li>))}</ul>
        </div>
      </div>
    </div>
  );
};