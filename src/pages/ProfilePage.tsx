// // // // // // // // // // // // // import { useForm, type SubmitHandler } from 'react-hook-form';
// // // // // // // // // // // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // // // // // // // // // // import { z } from 'zod';
// // // // // // // // // // // // // import { useEffect, useState } from 'react';
// // // // // // // // // // // // // import { useAuth, supabase } from '../contexts/AuthContext';
// // // // // // // // // // // // // import toast from 'react-hot-toast';
// // // // // // // // // // // // // import { useTranslation } from '../contexts/LanguageContext';
// // // // // // // // // // // // // import { motion } from 'framer-motion';
// // // // // // // // // // // // // import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
// // // // // // // // // // // // // import { Link } from 'react-router-dom';

// // // // // // // // // // // // // const ProfileSchema = z.object({ english_name: z.string().optional(), chinese_name: z.string().optional(), department: z.string().min(1, 'Department is required'), nationality: z.string().min(1, 'Nationality is required'), student_id: z.string().min(1, 'Student ID is required'), avatar_url: z.string().nullable(), });
// // // // // // // // // // // // // type ProfileFormInputs = z.infer<typeof ProfileSchema>;

// // // // // // // // // // // // // const Avatar = ({ url, onUpload, isEditing }: { url: string | null; onUpload: (filePath: string) => void; isEditing: boolean; }) => {
// // // // // // // // // // // // //     const { user } = useAuth(); const { t } = useTranslation();
// // // // // // // // // // // // //     const [uploading, setUploading] = useState(false);
// // // // // // // // // // // // //     const avatarUrl = url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`;

// // // // // // // // // // // // //     const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
// // // // // // // // // // // // //         if (!user || !isEditing) return;
// // // // // // // // // // // // //         try {
// // // // // // // // // // // // //             setUploading(true);
// // // // // // // // // // // // //             if (!event.target.files || event.target.files.length === 0) { throw new Error('You must select an image to upload.'); }
// // // // // // // // // // // // //             const file = event.target.files[0];
// // // // // // // // // // // // //             const fileExt = file.name.split('.').pop();
// // // // // // // // // // // // //             const filePath = `${user.id}/${Date.now()}.${fileExt}`;
// // // // // // // // // // // // //             const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
// // // // // // // // // // // // //             if (uploadError) { throw uploadError; }
// // // // // // // // // // // // //             onUpload(filePath);
// // // // // // // // // // // // //             toast.success('Avatar updated! Save changes to confirm.');
// // // // // // // // // // // // //         } catch (error: any) { toast.error(error.message); }
// // // // // // // // // // // // //         finally { setUploading(false); }
// // // // // // // // // // // // //     };
// // // // // // // // // // // // //     return (<div className="flex flex-col items-center space-y-4"><img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-md" />{isEditing && <div><label htmlFor="single" className="cursor-pointer bg-white/50 backdrop-blur-lg border border-white/20 text-text-secondary px-4 py-2 rounded-lg hover:bg-white/80 transition-colors text-sm">{uploading ? t('profile.uploadingButton') : t('profile.uploadButton')}</label><input type="file" id="single" accept="image/*" onChange={uploadAvatar} disabled={uploading} className="hidden" /></div>}</div>);
// // // // // // // // // // // // // };

// // // // // // // // // // // // // const ProfileView = ({ profile, onEditClick }: { profile: ProfileFormInputs; onEditClick: () => void; }) => {
// // // // // // // // // // // // //     const { t } = useTranslation();
// // // // // // // // // // // // //     return (<div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"><div><p className="text-sm font-medium text-text-secondary">{t('profile.englishNameLabel')}</p><p className="text-lg text-text-primary">{profile.english_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.chineseNameLabel')}</p><p className="text-lg text-text-primary">{profile.chinese_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.departmentLabel')}</p><p className="text-lg text-text-primary">{profile.department || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.nationalityLabel')}</p><p className="text-lg text-text-primary">{profile.nationality || '-'}</p></div><div className="md:col-span-2"><p className="text-sm font-medium text-text-secondary">{t('profile.studentIdLabel')}</p><p className="text-lg text-text-primary">{profile.student_id || '-'}</p></div></div><div className="pt-4 text-right"><button onClick={onEditClick} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover">{t('profile.editButton')}</button></div></div>);
// // // // // // // // // // // // // };

// // // // // // // // // // // // // const ProfileForm = ({ profile, onCancel }: { profile: ProfileFormInputs; onCancel: () => void; }) => {
// // // // // // // // // // // // //     const { user } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient();
// // // // // // // // // // // // //     const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormInputs>({ defaultValues: profile, resolver: zodResolver(ProfileSchema) });
// // // // // // // // // // // // //     const handleUpdateProfile: SubmitHandler<ProfileFormInputs> = async (formData) => {
// // // // // // // // // // // // //         try { const { error } = await supabase.from('profiles').update(formData).eq('user_id', user!.id); if (error) throw error; toast.success(t('profile.updateSuccess')); queryClient.invalidateQueries({ queryKey: ['profile', user!.id] }); onCancel(); } catch (error: any) { toast.error(`${t('profile.updateError')}: ${error.message}`); }
// // // // // // // // // // // // //     };
// // // // // // // // // // // // //     return (<form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.englishNameLabel')}</label><input {...register('english_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div><div><label className="text-sm font-medium">{t('profile.chineseNameLabel')}</label><input {...register('chinese_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div></div><div><label className="text-sm font-medium">{t('profile.departmentLabel')}</label><input {...register('department')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.department && <p className="mt-1 text-sm text-system-danger">{errors.department.message}</p>}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.nationalityLabel')}</label><input {...register('nationality')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.nationality && <p className="mt-1 text-sm text-system-danger">{errors.nationality.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.studentIdLabel')}</label><input {...register('student_id')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.student_id && <p className="mt-1 text-sm text-system-danger">{errors.student_id.message}</p>}</div></div><div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">{t('profile.cancelButton')}</button><button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isSubmitting ? t('profile.savingButton') : t('profile.saveButton')}</button></div></form>);
// // // // // // // // // // // // // };

// // // // // // // // // // // // // const MyEventsList = ({ userId }: { userId: string }) => {
// // // // // // // // // // // // //     const { t, language } = useTranslation();
// // // // // // // // // // // // //     const PAGE_SIZE = 3;

// // // // // // // // // // // // //     const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
// // // // // // // // // // // // //         queryKey: ['my_registrations', userId],
// // // // // // // // // // // // //         queryFn: async ({ pageParam = 0 }) => {
// // // // // // // // // // // // //             const from = pageParam * PAGE_SIZE;
// // // // // // // // // // // // //             const to = from + PAGE_SIZE - 1;
// // // // // // // // // // // // //             const { data, error } = await supabase
// // // // // // // // // // // // //                 .from('event_registrations')
// // // // // // // // // // // // //                 .select('id, status, created_at, events(slug, title_en, title_zh_hant)')
// // // // // // // // // // // // //                 .eq('user_id', userId)
// // // // // // // // // // // // //                 .order('created_at', { ascending: false })
// // // // // // // // // // // // //                 .range(from, to);
// // // // // // // // // // // // //             if (error) throw error;
// // // // // // // // // // // // //             return data;
// // // // // // // // // // // // //         },
// // // // // // // // // // // // //         initialPageParam: 0,
// // // // // // // // // // // // //         getNextPageParam: (lastPage, allPages) => {
// // // // // // // // // // // // //             return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
// // // // // // // // // // // // //         },
// // // // // // // // // // // // //     });

// // // // // // // // // // // // //     const registrations = data?.pages.flatMap(page => page) ?? [];

// // // // // // // // // // // // //     const statusClasses = { pending: 'bg-yellow-100 text-yellow-800', accepted: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', };

// // // // // // // // // // // // //     if (isLoading) return <p>Loading event history...</p>;
// // // // // // // // // // // // //     if (!registrations || registrations.length === 0) return <p className="text-text-secondary">{t('profile.events.noRegistrations')}</p>;

// // // // // // // // // // // // //     return (
// // // // // // // // // // // // //         <div className="overflow-x-auto">
// // // // // // // // // // // // //             <table className="min-w-full">
// // // // // // // // // // // // //                 <thead><tr><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.title')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.registrationDate')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.status')}</th></tr></thead>
// // // // // // // // // // // // //                 <tbody>
// // // // // // // // // // // // //                     {registrations.map(reg => {
// // // // // // // // // // // // //                         const title = language === 'zh-HANT' && reg.events?.title_zh_hant ? reg.events.title_zh_hant : reg.events?.title_en;
// // // // // // // // // // // // //                         return (
// // // // // // // // // // // // //                             <tr key={reg.id} className="border-t border-white/20"><td className="p-4 font-medium text-text-primary"><Link to={`/events/${reg.events?.slug}`} className="hover:underline">{title}</Link></td><td className="p-4 text-text-secondary">{new Date(reg.created_at).toLocaleDateString()}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[reg.status]}`}>{t(`profile.events.${reg.status}`)}</span></td></tr>
// // // // // // // // // // // // //                         )
// // // // // // // // // // // // //                     })}
// // // // // // // // // // // // //                 </tbody>
// // // // // // // // // // // // //             </table>
// // // // // // // // // // // // //             {hasNextPage && (
// // // // // // // // // // // // //                 <div className="mt-4 text-center">
// // // // // // // // // // // // //                     <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">
// // // // // // // // // // // // //                         {isFetchingNextPage ? 'Loading...' : 'Show More'}
// // // // // // // // // // // // //                     </button>
// // // // // // // // // // // // //                 </div>
// // // // // // // // // // // // //             )}
// // // // // // // // // // // // //         </div>
// // // // // // // // // // // // //     );
// // // // // // // // // // // // // };

// // // // // // // // // // // // // export const ProfilePage = () => {
// // // // // // // // // // // // //     const { user } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient();
// // // // // // // // // // // // //     const [isEditing, setIsEditing] = useState(false);
// // // // // // // // // // // // //     const [avatarPath, setAvatarPath] = useState<string | null>(null);

// // // // // // // // // // // // //     const { data: profile, isLoading } = useQuery({
// // // // // // // // // // // // //         queryKey: ['profile', user?.id],
// // // // // // // // // // // // //         queryFn: async (): Promise<ProfileFormInputs | null> => {
// // // // // // // // // // // // //             if (!user) return null;
// // // // // // // // // // // // //             const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
// // // // // // // // // // // // //             if (error && error.code !== 'PGRST116') throw error;
// // // // // // // // // // // // //             if (data) setAvatarPath(data.avatar_url);
// // // // // // // // // // // // //             return data;
// // // // // // // // // // // // //         },
// // // // // // // // // // // // //         enabled: !!user,
// // // // // // // // // // // // //     });

// // // // // // // // // // // // //     const handleAvatarUpload = async (filePath: string) => {
// // // // // // // // // // // // //         if (!user) return;
// // // // // // // // // // // // //         setAvatarPath(filePath);
// // // // // // // // // // // // //         const { error } = await supabase.from('profiles').update({ avatar_url: filePath }).eq('user_id', user.id);
// // // // // // // // // // // // //         if (error) toast.error(error.message);
// // // // // // // // // // // // //         else queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     if (isLoading) return <div className="text-center py-40">Loading profile...</div>;
// // // // // // // // // // // // //     if (!profile && !isLoading) return <div className="text-center py-40">Could not load profile. Please try again.</div>

// // // // // // // // // // // // //     return (
// // // // // // // // // // // // //         <div className="relative min-h-screen pt-24 pb-12 p-4">
// // // // // // // // // // // // //             <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
// // // // // // // // // // // // //             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
// // // // // // // // // // // // //                 <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
// // // // // // // // // // // // //                 <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button onClick={() => setIsEditing(false)} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${!isEditing ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setIsEditing(true)} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${isEditing ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>
// // // // // // // // // // // // //                 {isEditing ? (
// // // // // // // // // // // // //                     <MyEventsList userId={user!.id} />
// // // // // // // // // // // // //                 ) : (
// // // // // // // // // // // // //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// // // // // // // // // // // // //                         <div className="md:col-span-1"><Avatar url={avatarPath} onUpload={handleAvatarUpload} isEditing={isEditing} /></div>
// // // // // // // // // // // // //                         <div className="md:col-span-2"><ProfileView profile={profile} onEditClick={() => setIsEditing(true)} /></div>
// // // // // // // // // // // // //                     </div>
// // // // // // // // // // // // //                 )}
// // // // // // // // // // // // //             </motion.div>
// // // // // // // // // // // // //         </div>
// // // // // // // // // // // // //     );
// // // // // // // // // // // // // };

// // // // // // // // // // // // import { useForm, type SubmitHandler } from 'react-hook-form';
// // // // // // // // // // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // // // // // // // // // import { z } from 'zod';
// // // // // // // // // // // // import { useEffect, useState } from 'react';
// // // // // // // // // // // // import { useAuth, supabase } from '../contexts/AuthContext';
// // // // // // // // // // // // import toast from 'react-hot-toast';
// // // // // // // // // // // // import { useTranslation } from '../contexts/LanguageContext';
// // // // // // // // // // // // import { motion } from 'framer-motion';
// // // // // // // // // // // // import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
// // // // // // // // // // // // import { Link } from 'react-router-dom';

// // // // // // // // // // // // const ProfileSchema = z.object({ english_name: z.string().optional(), chinese_name: z.string().optional(), department: z.string().min(1, 'Department is required'), nationality: z.string().min(1, 'Nationality is required'), student_id: z.string().min(1, 'Student ID is required'), avatar_url: z.string().nullable(), });
// // // // // // // // // // // // type ProfileFormInputs = z.infer<typeof ProfileSchema>;

// // // // // // // // // // // // const Avatar = ({ url, onUpload, isEditing }: { url: string | null; onUpload: (filePath: string) => void; isEditing: boolean; }) => {
// // // // // // // // // // // //     const { user } = useAuth(); const { t } = useTranslation();
// // // // // // // // // // // //     const [uploading, setUploading] = useState(false);
// // // // // // // // // // // //     const avatarUrl = url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`;
// // // // // // // // // // // //     const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => { if (!user || !isEditing) return; try { setUploading(true); if (!event.target.files || event.target.files.length === 0) { throw new Error('You must select an image to upload.'); } const file = event.target.files[0]; const fileExt = file.name.split('.').pop(); const filePath = `${user.id}/${Date.now()}.${fileExt}`; const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file); if (uploadError) { throw uploadError; } onUpload(filePath); toast.success('Avatar updated! Save changes to confirm.'); } catch (error: any) { toast.error(error.message); } finally { setUploading(false); } };
// // // // // // // // // // // //     return (<div className="flex flex-col items-center space-y-4"><img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-md" />{isEditing && <div><label htmlFor="single" className="cursor-pointer bg-white/50 backdrop-blur-lg border border-white/20 text-text-secondary px-4 py-2 rounded-lg hover:bg-white/80 transition-colors text-sm">{uploading ? t('profile.uploadingButton') : t('profile.uploadButton')}</label><input type="file" id="single" accept="image/*" onChange={uploadAvatar} disabled={uploading} className="hidden" /></div>}</div>);
// // // // // // // // // // // // };
// // // // // // // // // // // // const ProfileView = ({ profile, onEditClick }: { profile: ProfileFormInputs; onEditClick: () => void; }) => {
// // // // // // // // // // // //     const { t } = useTranslation();
// // // // // // // // // // // //     return (<div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"><div><p className="text-sm font-medium text-text-secondary">{t('profile.englishNameLabel')}</p><p className="text-lg text-text-primary">{profile.english_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.chineseNameLabel')}</p><p className="text-lg text-text-primary">{profile.chinese_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.departmentLabel')}</p><p className="text-lg text-text-primary">{profile.department || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.nationalityLabel')}</p><p className="text-lg text-text-primary">{profile.nationality || '-'}</p></div><div className="md:col-span-2"><p className="text-sm font-medium text-text-secondary">{t('profile.studentIdLabel')}</p><p className="text-lg text-text-primary">{profile.student_id || '-'}</p></div></div><div className="pt-4 text-right"><button onClick={onEditClick} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover">{t('profile.editButton')}</button></div></div>);
// // // // // // // // // // // // };
// // // // // // // // // // // // const ProfileForm = ({ profile, onCancel }: { profile: ProfileFormInputs; onCancel: () => void; }) => {
// // // // // // // // // // // //     const { user } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient();
// // // // // // // // // // // //     const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormInputs>({ defaultValues: profile, resolver: zodResolver(ProfileSchema) });
// // // // // // // // // // // //     const handleUpdateProfile: SubmitHandler<ProfileFormInputs> = async (formData) => { try { const { error } = await supabase.from('profiles').update(formData).eq('user_id', user!.id); if (error) throw error; toast.success(t('profile.updateSuccess')); queryClient.invalidateQueries({ queryKey: ['profile', user!.id] }); onCancel(); } catch (error: any) { toast.error(`${t('profile.updateError')}: ${error.message}`); } };
// // // // // // // // // // // //     return (<form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.englishNameLabel')}</label><input {...register('english_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div><div><label className="text-sm font-medium">{t('profile.chineseNameLabel')}</label><input {...register('chinese_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div></div><div><label className="text-sm font-medium">{t('profile.departmentLabel')}</label><input {...register('department')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.department && <p className="mt-1 text-sm text-system-danger">{errors.department.message}</p>}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.nationalityLabel')}</label><input {...register('nationality')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.nationality && <p className="mt-1 text-sm text-system-danger">{errors.nationality.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.studentIdLabel')}</label><input {...register('student_id')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.student_id && <p className="mt-1 text-sm text-system-danger">{errors.student_id.message}</p>}</div></div><div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">{t('profile.cancelButton')}</button><button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isSubmitting ? t('profile.savingButton') : t('profile.saveButton')}</button></div></form>);
// // // // // // // // // // // // };

// // // // // // // // // // // // const MyEventsList = ({ userId }: { userId: string }) => {
// // // // // // // // // // // //     const { t, language } = useTranslation();
// // // // // // // // // // // //     const PAGE_SIZE = 3;
// // // // // // // // // // // //     const queryClient = useQueryClient();

// // // // // // // // // // // //     const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
// // // // // // // // // // // //         queryKey: ['my_registrations', userId],
// // // // // // // // // // // //         queryFn: async ({ pageParam = 0 }) => {
// // // // // // // // // // // //             const from = pageParam * PAGE_SIZE;
// // // // // // // // // // // //             const to = from + PAGE_SIZE - 1;
// // // // // // // // // // // //             const { data, error } = await supabase.from('event_registrations').select('id, status, created_at, events(slug, title_en, title_zh_hant)').eq('user_id', userId).order('created_at', { ascending: false }).range(from, to);
// // // // // // // // // // // //             if (error) throw error;
// // // // // // // // // // // //             return data;
// // // // // // // // // // // //         },
// // // // // // // // // // // //         initialPageParam: 0,
// // // // // // // // // // // //         getNextPageParam: (lastPage, allPages) => {
// // // // // // // // // // // //             return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
// // // // // // // // // // // //         },
// // // // // // // // // // // //     });

// // // // // // // // // // // //     const registrations = data?.pages.flatMap(page => page) ?? [];
// // // // // // // // // // // //     const handleShowLess = () => {
// // // // // // // // // // // //         queryClient.setQueryData(['my_registrations', userId], (data: any) => ({
// // // // // // // // // // // //             pages: data.pages.slice(0, 1),
// // // // // // // // // // // //             pageParams: data.pageParams.slice(0, 1),
// // // // // // // // // // // //         }));
// // // // // // // // // // // //     };
// // // // // // // // // // // //     const statusClasses = { pending: 'bg-yellow-100 text-yellow-800', accepted: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', };

// // // // // // // // // // // //     if (isLoading) return <p>Loading event history...</p>;
// // // // // // // // // // // //     if (registrations.length === 0) return <p className="text-text-secondary">{t('profile.events.noRegistrations')}</p>;

// // // // // // // // // // // //     return (
// // // // // // // // // // // //         <div className="overflow-x-auto">
// // // // // // // // // // // //             <table className="min-w-full">
// // // // // // // // // // // //                 <thead><tr><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.title')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.registrationDate')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.status')}</th></tr></thead>
// // // // // // // // // // // //                 <tbody>
// // // // // // // // // // // //                     {registrations.map(reg => {
// // // // // // // // // // // //                         const title = language === 'zh-HANT' && reg.events?.title_zh_hant ? reg.events.title_zh_hant : reg.events?.title_en;
// // // // // // // // // // // //                         return (<tr key={reg.id} className="border-t border-white/20"><td className="p-4 font-medium text-text-primary"><Link to={`/events/${reg.events?.slug}`} className="hover:underline">{title}</Link></td><td className="p-4 text-text-secondary">{new Date(reg.created_at).toLocaleDateString()}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[reg.status]}`}>{t(`profile.events.${reg.status}`)}</span></td></tr>)
// // // // // // // // // // // //                     })}
// // // // // // // // // // // //                 </tbody>
// // // // // // // // // // // //             </table>
// // // // // // // // // // // //             <div className="mt-6 flex justify-center gap-4">
// // // // // // // // // // // //                 {hasNextPage && (<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isFetchingNextPage ? 'Loading...' : 'Show More'}</button>)}
// // // // // // // // // // // //                 {(data?.pages.length ?? 0) > 1 && (<button onClick={handleShowLess} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">Show Less</button>)}
// // // // // // // // // // // //             </div>
// // // // // // // // // // // //         </div>
// // // // // // // // // // // //     );
// // // // // // // // // // // // };

// // // // // // // // // // // // export const ProfilePage = () => {
// // // // // // // // // // // //     const { user } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient();
// // // // // // // // // // // //     const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
// // // // // // // // // // // //     const [isEditingProfile, setIsEditingProfile] = useState(false);
// // // // // // // // // // // //     const [avatarPath, setAvatarPath] = useState<string | null>(null);

// // // // // // // // // // // //     const { data: profile, isLoading } = useQuery({
// // // // // // // // // // // //         queryKey: ['profile', user?.id],
// // // // // // // // // // // //         queryFn: async (): Promise<ProfileFormInputs | null> => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') throw error; if (data) setAvatarPath(data.avatar_url); return data; },
// // // // // // // // // // // //         enabled: !!user,
// // // // // // // // // // // //     });

// // // // // // // // // // // //     const handleAvatarUpload = async (filePath: string) => { if (!user) return; setAvatarPath(filePath); const { error } = await supabase.from('profiles').update({ avatar_url: filePath }).eq('user_id', user.id); if (error) toast.error(error.message); else queryClient.invalidateQueries({ queryKey: ['profile', user.id] }); };

// // // // // // // // // // // //     if (isLoading) return <div className="text-center py-40">Loading profile...</div>;
// // // // // // // // // // // //     if (!profile && !isLoading) return <div className="text-center py-40">Could not load profile. Please try again.</div>

// // // // // // // // // // // //     return (
// // // // // // // // // // // //         <div className="relative min-h-screen pt-24 pb-12 p-4">
// // // // // // // // // // // //             <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
// // // // // // // // // // // //             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
// // // // // // // // // // // //                 <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
// // // // // // // // // // // //                 <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setActiveTab('events')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>

// // // // // // // // // // // //                 {activeTab === 'details' && (
// // // // // // // // // // // //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// // // // // // // // // // // //                         <div className="md:col-span-1"><Avatar url={avatarPath} onUpload={handleAvatarUpload} isEditing={isEditingProfile} /></div>
// // // // // // // // // // // //                         <div className="md:col-span-2">{isEditingProfile ? (<ProfileForm profile={profile} onCancel={() => setIsEditingProfile(false)} />) : (<ProfileView profile={profile} onEditClick={() => setIsEditingProfile(true)} />)}</div>
// // // // // // // // // // // //                     </div>
// // // // // // // // // // // //                 )}

// // // // // // // // // // // //                 {activeTab === 'events' && user && (<MyEventsList userId={user.id} />)}
// // // // // // // // // // // //             </motion.div>
// // // // // // // // // // // //         </div>
// // // // // // // // // // // //     );
// // // // // // // // // // // // };

// // // // // // // // // // // import { useForm, type SubmitHandler } from 'react-hook-form';
// // // // // // // // // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // // // // // // // // import { z } from 'zod';
// // // // // // // // // // // import { useEffect, useState } from 'react';
// // // // // // // // // // // import { useAuth, supabase } from '../contexts/AuthContext';
// // // // // // // // // // // import toast from 'react-hot-toast';
// // // // // // // // // // // import { useTranslation } from '../contexts/LanguageContext';
// // // // // // // // // // // import { motion } from 'framer-motion';
// // // // // // // // // // // import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
// // // // // // // // // // // import { Link } from 'react-router-dom';

// // // // // // // // // // // const currentYear = new Date().getFullYear();
// // // // // // // // // // // const ProfileSchema = z.object({
// // // // // // // // // // //     english_name: z.string().optional(),
// // // // // // // // // // //     chinese_name: z.string().optional(),
// // // // // // // // // // //     department: z.string().min(1, 'Department is required'),
// // // // // // // // // // //     nationality: z.string().min(1, 'Nationality is required'),
// // // // // // // // // // //     student_id: z.string().min(1, 'Student ID is required'),
// // // // // // // // // // //     avatar_url: z.string().nullable(),
// // // // // // // // // // //     birth_year: z.coerce.number().min(1920, 'Invalid year').max(currentYear, 'Invalid year').optional().nullable(),
// // // // // // // // // // //     gender: z.enum(['male', 'female', 'rather_not_say']).optional().nullable(),
// // // // // // // // // // // });
// // // // // // // // // // // type ProfileFormInputs = z.infer<typeof ProfileSchema>;

// // // // // // // // // // // const Avatar = ({ url, onUpload, isEditing }: { url: string | null; onUpload: (filePath: string) => void; isEditing: boolean; }) => {
// // // // // // // // // // //     const { user } = useAuth(); const { t } = useTranslation();
// // // // // // // // // // //     const [uploading, setUploading] = useState(false);
// // // // // // // // // // //     const avatarUrl = url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`;
// // // // // // // // // // //     const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
// // // // // // // // // // //         if (!user || !isEditing) return;
// // // // // // // // // // //         try {
// // // // // // // // // // //             setUploading(true);
// // // // // // // // // // //             if (!event.target.files || event.target.files.length === 0) { throw new Error('You must select an image to upload.'); }
// // // // // // // // // // //             const file = event.target.files[0];
// // // // // // // // // // //             const fileExt = file.name.split('.').pop();
// // // // // // // // // // //             const filePath = `${user.id}/${Date.now()}.${fileExt}`;
// // // // // // // // // // //             const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
// // // // // // // // // // //             if (uploadError) { throw uploadError; }
// // // // // // // // // // //             onUpload(filePath);
// // // // // // // // // // //         } catch (error: any) { toast.error(error.message); }
// // // // // // // // // // //         finally { setUploading(false); }
// // // // // // // // // // //     };
// // // // // // // // // // //     return (<div className="flex flex-col items-center space-y-4"><img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-md" />{isEditing && <div><label htmlFor="single" className="cursor-pointer bg-white/50 backdrop-blur-lg border border-white/20 text-text-secondary px-4 py-2 rounded-lg hover:bg-white/80 transition-colors text-sm">{uploading ? t('profile.uploadingButton') : t('profile.uploadButton')}</label><input type="file" id="single" accept="image/*" onChange={uploadAvatar} disabled={uploading} className="hidden" /></div>}</div>);
// // // // // // // // // // // };

// // // // // // // // // // // const ProfileView = ({ profile, onEditClick }: { profile: ProfileFormInputs; onEditClick: () => void; }) => {
// // // // // // // // // // //     const { t } = useTranslation();
// // // // // // // // // // //     return (
// // // // // // // // // // //         <div className="space-y-4">
// // // // // // // // // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
// // // // // // // // // // //                 <div><p className="text-sm font-medium text-text-secondary">{t('profile.englishNameLabel')}</p><p className="text-lg text-text-primary">{profile.english_name || '-'}</p></div>
// // // // // // // // // // //                 <div><p className="text-sm font-medium text-text-secondary">{t('profile.chineseNameLabel')}</p><p className="text-lg text-text-primary">{profile.chinese_name || '-'}</p></div>
// // // // // // // // // // //                 <div><p className="text-sm font-medium text-text-secondary">{t('profile.departmentLabel')}</p><p className="text-lg text-text-primary">{profile.department || '-'}</p></div>
// // // // // // // // // // //                 <div><p className="text-sm font-medium text-text-secondary">{t('profile.nationalityLabel')}</p><p className="text-lg text-text-primary">{profile.nationality || '-'}</p></div>
// // // // // // // // // // //                 <div><p className="text-sm font-medium text-text-secondary">{t('profile.birthYearLabel')}</p><p className="text-lg text-text-primary">{profile.birth_year || '-'}</p></div>
// // // // // // // // // // //                 <div><p className="text-sm font-medium text-text-secondary">{t('profile.genderLabel')}</p><p className="text-lg text-text-primary capitalize">{profile.gender?.replace('_', ' ') || '-'}</p></div>
// // // // // // // // // // //                 <div className="md:col-span-2"><p className="text-sm font-medium text-text-secondary">{t('profile.studentIdLabel')}</p><p className="text-lg text-text-primary">{profile.student_id || '-'}</p></div>
// // // // // // // // // // //             </div>
// // // // // // // // // // //             <div className="pt-4 text-right"><button onClick={onEditClick} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover">{t('profile.editButton')}</button></div>
// // // // // // // // // // //         </div>
// // // // // // // // // // //     );
// // // // // // // // // // // };

// // // // // // // // // // // const ProfileForm = ({ profile, onCancel }: { profile: ProfileFormInputs; onCancel: () => void; }) => {
// // // // // // // // // // //     const { user } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient();
// // // // // // // // // // //     const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormInputs>({ defaultValues: profile, resolver: zodResolver(ProfileSchema) });
// // // // // // // // // // //     const handleUpdateProfile: SubmitHandler<ProfileFormInputs> = async (formData) => {
// // // // // // // // // // //         try { const { error } = await supabase.from('profiles').update({ ...formData, birth_year: formData.birth_year || null }).eq('user_id', user!.id); if (error) throw error; toast.success(t('profile.updateSuccess')); queryClient.invalidateQueries({ queryKey: ['profile', user!.id] }); onCancel(); } catch (error: any) { toast.error(`${t('profile.updateError')}: ${error.message}`); }
// // // // // // // // // // //     };
// // // // // // // // // // //     return (
// // // // // // // // // // //         <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4">
// // // // // // // // // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // // // // // // // //                 <div><label className="text-sm font-medium">{t('profile.englishNameLabel')}</label><input {...register('english_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div>
// // // // // // // // // // //                 <div><label className="text-sm font-medium">{t('profile.chineseNameLabel')}</label><input {...register('chinese_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div>
// // // // // // // // // // //             </div>
// // // // // // // // // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // // // // // // // //                 <div><label className="text-sm font-medium">{t('profile.birthYearLabel')}</label><input type="number" placeholder={String(currentYear - 20)} {...register('birth_year')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.birth_year && <p className="mt-1 text-sm text-system-danger">{errors.birth_year.message}</p>}</div>
// // // // // // // // // // //                 <div><label className="text-sm font-medium">{t('profile.genderLabel')}</label><select {...register('gender')} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white"><option value="">{t('profile.selectGender')}</option><option value="male">{t('profile.genderMale')}</option><option value="female">{t('profile.genderFemale')}</option><option value="rather_not_say">{t('profile.genderRatherNotSay')}</option></select></div>
// // // // // // // // // // //             </div>
// // // // // // // // // // //             <div><label className="text-sm font-medium">{t('profile.departmentLabel')}</label><input {...register('department')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.department && <p className="mt-1 text-sm text-system-danger">{errors.department.message}</p>}</div>
// // // // // // // // // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // // // // // // // //                 <div><label className="text-sm font-medium">{t('profile.nationalityLabel')}</label><input {...register('nationality')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.nationality && <p className="mt-1 text-sm text-system-danger">{errors.nationality.message}</p>}</div>
// // // // // // // // // // //                 <div><label className="text-sm font-medium">{t('profile.studentIdLabel')}</label><input {...register('student_id')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.student_id && <p className="mt-1 text-sm text-system-danger">{errors.student_id.message}</p>}</div>
// // // // // // // // // // //             </div>
// // // // // // // // // // //             <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">{t('profile.cancelButton')}</button><button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isSubmitting ? t('profile.savingButton') : t('profile.saveButton')}</button></div>
// // // // // // // // // // //         </form>
// // // // // // // // // // //     );
// // // // // // // // // // // };

// // // // // // // // // // // const MyEventsList = ({ userId }: { userId: string }) => {
// // // // // // // // // // //     const { t, language } = useTranslation();
// // // // // // // // // // //     const PAGE_SIZE = 3;
// // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // //     const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
// // // // // // // // // // //         queryKey: ['my_registrations', userId],
// // // // // // // // // // //         queryFn: async ({ pageParam = 0 }) => {
// // // // // // // // // // //             const from = pageParam * PAGE_SIZE;
// // // // // // // // // // //             const to = from + PAGE_SIZE - 1;
// // // // // // // // // // //             const { data, error } = await supabase.from('event_registrations').select('id, status, created_at, events(slug, title_en, title_zh_hant)').eq('user_id', userId).order('created_at', { ascending: false }).range(from, to);
// // // // // // // // // // //             if (error) throw error;
// // // // // // // // // // //             return data;
// // // // // // // // // // //         },
// // // // // // // // // // //         initialPageParam: 0,
// // // // // // // // // // //         getNextPageParam: (lastPage, allPages) => { return lastPage.length === PAGE_SIZE ? allPages.length : undefined; },
// // // // // // // // // // //     });
// // // // // // // // // // //     const registrations = data?.pages.flatMap(page => page) ?? [];
// // // // // // // // // // //     const handleShowLess = () => {
// // // // // // // // // // //         queryClient.setQueryData(['my_registrations', userId], (data: any) => ({ pages: data.pages.slice(0, 1), pageParams: data.pageParams.slice(0, 1) }));
// // // // // // // // // // //     };
// // // // // // // // // // //     const statusClasses = { pending: 'bg-yellow-100 text-yellow-800', accepted: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' };
// // // // // // // // // // //     if (isLoading) return <p>Loading event history...</p>;
// // // // // // // // // // //     if (registrations.length === 0) return <p className="text-text-secondary">{t('profile.events.noRegistrations')}</p>;
// // // // // // // // // // //     return (
// // // // // // // // // // //         <div className="overflow-x-auto">
// // // // // // // // // // //             <table className="min-w-full">
// // // // // // // // // // //                 <thead><tr><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.title')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.registrationDate')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.status')}</th></tr></thead>
// // // // // // // // // // //                 <tbody>
// // // // // // // // // // //                     {registrations.map(reg => {
// // // // // // // // // // //                         const title = language === 'zh-HANT' && reg.events?.title_zh_hant ? reg.events.title_zh_hant : reg.events?.title_en;
// // // // // // // // // // //                         return (<tr key={reg.id} className="border-t border-white/20"><td className="p-4 font-medium text-text-primary"><Link to={`/events/${reg.events?.slug}`} className="hover:underline">{title}</Link></td><td className="p-4 text-text-secondary">{new Date(reg.created_at).toLocaleDateString()}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[reg.status]}`}>{t(`profile.events.${reg.status}`)}</span></td></tr>)
// // // // // // // // // // //                     })}
// // // // // // // // // // //                 </tbody>
// // // // // // // // // // //             </table>
// // // // // // // // // // //             <div className="mt-6 flex justify-center gap-4">
// // // // // // // // // // //                 {hasNextPage && (<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isFetchingNextPage ? 'Loading...' : 'Show More'}</button>)}
// // // // // // // // // // //                 {(data?.pages.length ?? 0) > 1 && (<button onClick={handleShowLess} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">Show Less</button>)}
// // // // // // // // // // //             </div>
// // // // // // // // // // //         </div>
// // // // // // // // // // //     );
// // // // // // // // // // // };

// // // // // // // // // // // export const ProfilePage = () => {
// // // // // // // // // // //     const { user } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient();
// // // // // // // // // // //     const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
// // // // // // // // // // //     const [isEditingProfile, setIsEditingProfile] = useState(false);
// // // // // // // // // // //     const [avatarPath, setAvatarPath] = useState<string | null>(null);

// // // // // // // // // // //     const { data: profile, isLoading } = useQuery({
// // // // // // // // // // //         queryKey: ['profile', user?.id],
// // // // // // // // // // //         queryFn: async (): Promise<ProfileFormInputs | null> => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') throw error; if (data) setAvatarPath(data.avatar_url); return data; },
// // // // // // // // // // //         enabled: !!user,
// // // // // // // // // // //     });

// // // // // // // // // // //     const handleAvatarUpload = async (filePath: string) => { if (!user) return; setAvatarPath(filePath); const { error } = await supabase.from('profiles').update({ avatar_url: filePath }).eq('user_id', user.id); if (error) toast.error(error.message); else queryClient.invalidateQueries({ queryKey: ['profile', user.id] }); };

// // // // // // // // // // //     if (isLoading) return <div className="text-center py-40">Loading profile...</div>;
// // // // // // // // // // //     if (!profile && !isLoading) return <div className="text-center py-40">Could not load profile. Please try again.</div>

// // // // // // // // // // //     return (
// // // // // // // // // // //         <div className="relative min-h-screen pt-24 pb-12 p-4">
// // // // // // // // // // //             <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
// // // // // // // // // // //             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
// // // // // // // // // // //                 <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
// // // // // // // // // // //                 <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setActiveTab('events')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>

// // // // // // // // // // //                 {activeTab === 'details' && (
// // // // // // // // // // //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// // // // // // // // // // //                         <div className="md:col-span-1"><Avatar url={avatarPath} onUpload={handleAvatarUpload} isEditing={isEditingProfile} /></div>
// // // // // // // // // // //                         <div className="md:col-span-2">{isEditingProfile ? (<ProfileForm profile={profile} onCancel={() => setIsEditingProfile(false)} />) : (<ProfileView profile={profile} onEditClick={() => setIsEditingProfile(true)} />)}</div>
// // // // // // // // // // //                     </div>
// // // // // // // // // // //                 )}
// // // // // // // // // // //                 {activeTab === 'events' && user && (<MyEventsList userId={user.id} />)}
// // // // // // // // // // //             </motion.div>
// // // // // // // // // // //         </div>
// // // // // // // // // // //     );
// // // // // // // // // // // };

// // // // // // // // // // import { useForm, type SubmitHandler } from 'react-hook-form';
// // // // // // // // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // // // // // // // import { z } from 'zod';
// // // // // // // // // // import { useEffect, useState } from 'react';
// // // // // // // // // // import { useAuth, supabase } from '../contexts/AuthContext';
// // // // // // // // // // import toast from 'react-hot-toast';
// // // // // // // // // // import { useTranslation } from '../contexts/LanguageContext';
// // // // // // // // // // import { motion } from 'framer-motion';
// // // // // // // // // // import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
// // // // // // // // // // import { Link, useNavigate } from 'react-router-dom';

// // // // // // // // // // // ... (Kode untuk Tipe Data & Sub-komponen tidak berubah)
// // // // // // // // // // const ProfileSchema = z.object({ /* ... */ });
// // // // // // // // // // type ProfileFormInputs = z.infer<typeof ProfileSchema>;
// // // // // // // // // // const Avatar = ({ url, onUpload, isEditing }: { url: string | null; onUpload: (filePath: string) => void; isEditing: boolean; }) => { /* ... */ };
// // // // // // // // // // const ProfileView = ({ profile, onEditClick }: { profile: ProfileFormInputs; onEditClick: () => void; }) => { /* ... */ };
// // // // // // // // // // const ProfileForm = ({ profile, onCancel }: { profile: ProfileFormInputs; onCancel: () => void; }) => { /* ... */ };
// // // // // // // // // // const MyEventsList = ({ userId }: { userId: string }) => { /* ... */ };


// // // // // // // // // // export const ProfilePage = () => {
// // // // // // // // // //     const { user, profile: currentUserProfile } = useAuth();
// // // // // // // // // //     const { t } = useTranslation();
// // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // //     const navigate = useNavigate();
// // // // // // // // // //     const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
// // // // // // // // // //     const [isEditingProfile, setIsEditingProfile] = useState(false);
// // // // // // // // // //     const [avatarPath, setAvatarPath] = useState<string | null>(null);

// // // // // // // // // //     const { data: profile, isLoading } = useQuery({
// // // // // // // // // //         queryKey: ['profile', user?.id],
// // // // // // // // // //         queryFn: async (): Promise<ProfileFormInputs | null> => { /* ... (kode tidak berubah) */ },
// // // // // // // // // //         enabled: !!user,
// // // // // // // // // //     });

// // // // // // // // // //     const handleAvatarUpload = async (filePath: string) => { /* ... (kode tidak berubah) */ };

// // // // // // // // // //     const demoteMutation = useMutation({
// // // // // // // // // //         mutationFn: async () => {
// // // // // // // // // //             const { error } = await supabase.functions.invoke('demote-self');
// // // // // // // // // //             if (error) throw new Error(error.message);
// // // // // // // // // //         },
// // // // // // // // // //         onSuccess: () => {
// // // // // // // // // //             toast.success(t('profile.demote.success'));
// // // // // // // // // //             queryClient.invalidateQueries({ queryKey: ['layout_profile', user?.id] });
// // // // // // // // // //             navigate('/');
// // // // // // // // // //         },
// // // // // // // // // //         onError: (error) => toast.error(error.message),
// // // // // // // // // //     });

// // // // // // // // // //     const handleDemote = () => {
// // // // // // // // // //         if (window.confirm(t('profile.demote.confirm'))) {
// // // // // // // // // //             demoteMutation.mutate();
// // // // // // // // // //         }
// // // // // // // // // //     };

// // // // // // // // // //     if (isLoading) return <div className="text-center py-40">Loading profile...</div>;
// // // // // // // // // //     if (!profile && !isLoading) return <div className="text-center py-40">Could not load profile. Please try again.</div>

// // // // // // // // // //     const isPrivilegedUser = currentUserProfile?.roles?.name === 'admin' || currentUserProfile?.roles?.name === 'developer' || currentUserProfile?.roles?.name === 'organizer';

// // // // // // // // // //     return (
// // // // // // // // // //         <div className="relative min-h-screen pt-24 pb-12 p-4">
// // // // // // // // // //             <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
// // // // // // // // // //             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
// // // // // // // // // //                 <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
// // // // // // // // // //                 <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setActiveTab('events')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>

// // // // // // // // // //                 {activeTab === 'details' && (
// // // // // // // // // //                     <>
// // // // // // // // // //                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// // // // // // // // // //                             <div className="md:col-span-1"><Avatar url={avatarPath} onUpload={handleAvatarUpload} isEditing={isEditingProfile} /></div>
// // // // // // // // // //                             <div className="md:col-span-2">{isEditingProfile ? (<ProfileForm profile={profile} onCancel={() => setIsEditingProfile(false)} />) : (<ProfileView profile={profile} onEditClick={() => setIsEditingProfile(true)} />)}</div>
// // // // // // // // // //                         </div>

// // // // // // // // // //                         {isPrivilegedUser && (
// // // // // // // // // //                             <div className="mt-8 pt-6 border-t border-red-500/30">
// // // // // // // // // //                                 <h3 className="text-xl font-bold text-system-danger">{t('profile.demote.title')}</h3>
// // // // // // // // // //                                 <p className="text-text-secondary text-sm mt-2">{t('profile.demote.description')}</p>
// // // // // // // // // //                                 <button onClick={handleDemote} disabled={demoteMutation.isPending} className="mt-4 px-4 py-2 border border-system-danger text-system-danger font-semibold rounded-lg hover:bg-system-danger hover:text-white transition-colors disabled:opacity-50">
// // // // // // // // // //                                     {demoteMutation.isPending ? 'Processing...' : t('profile.demote.button')}
// // // // // // // // // //                                 </button>
// // // // // // // // // //                             </div>
// // // // // // // // // //                         )}
// // // // // // // // // //                     </>
// // // // // // // // // //                 )}

// // // // // // // // // //                 {activeTab === 'events' && user && (<MyEventsList userId={user.id} />)}
// // // // // // // // // //             </motion.div>
// // // // // // // // // //         </div>
// // // // // // // // // //     );
// // // // // // // // // // };

// // // // // // // // // import { useForm, type SubmitHandler } from 'react-hook-form';
// // // // // // // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // // // // // // import { z } from 'zod';
// // // // // // // // // import { useEffect, useState } from 'react';
// // // // // // // // // import { useAuth, supabase } from '../contexts/AuthContext';
// // // // // // // // // import toast from 'react-hot-toast';
// // // // // // // // // import { useTranslation } from '../contexts/LanguageContext';
// // // // // // // // // import { motion } from 'framer-motion';
// // // // // // // // // import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
// // // // // // // // // import { Link, useNavigate } from 'react-router-dom';

// // // // // // // // // const currentYear = new Date().getFullYear();
// // // // // // // // // const ProfileSchema = z.object({ english_name: z.string().optional(), chinese_name: z.string().optional(), department: z.string().min(1, 'Department is required'), nationality: z.string().min(1, 'Nationality is required'), student_id: z.string().min(1, 'Student ID is required'), avatar_url: z.string().nullable(), birth_year: z.coerce.number().min(1920).max(currentYear).optional().nullable(), gender: z.enum(['male', 'female', 'rather_not_say']).optional().nullable(), });
// // // // // // // // // type ProfileFormInputs = z.infer<typeof ProfileSchema>;

// // // // // // // // // const Avatar = ({ url, onUpload, isEditing }: { url: string | null; onUpload: (filePath: string) => void; isEditing: boolean; }) => { /* ... */ };
// // // // // // // // // const ProfileView = ({ profile, onEditClick }: { profile: ProfileFormInputs; onEditClick: () => void; }) => { /* ... */ };
// // // // // // // // // const ProfileForm = ({ profile, onCancel }: { profile: ProfileFormInputs; onCancel: () => void; }) => { /* ... */ };
// // // // // // // // // const MyEventsList = ({ userId }: { userId: string }) => { /* ... */ };


// // // // // // // // // export const ProfilePage = () => {
// // // // // // // // //     const { user, profile: currentUserProfile } = useAuth();
// // // // // // // // //     const { t } = useTranslation();
// // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // //     const navigate = useNavigate();
// // // // // // // // //     const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
// // // // // // // // //     const [isEditingProfile, setIsEditingProfile] = useState(false);
// // // // // // // // //     const [avatarPath, setAvatarPath] = useState<string | null>(null);

// // // // // // // // //     const { data: profile, isLoading } = useQuery({ queryKey: ['profile', user?.id], queryFn: async (): Promise<ProfileFormInputs | null> => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') throw error; if (data) setAvatarPath(data.avatar_url); return data; }, enabled: !!user, });
// // // // // // // // //     const handleAvatarUpload = async (filePath: string) => { if (!user) return; setAvatarPath(filePath); const { error } = await supabase.from('profiles').update({ avatar_url: filePath }).eq('user_id', user.id); if (error) toast.error(error.message); else queryClient.invalidateQueries({ queryKey: ['profile', user.id] }); };

// // // // // // // // //     const demoteMutation = useMutation({
// // // // // // // // //         mutationFn: async () => {
// // // // // // // // //             const { error } = await supabase.functions.invoke('demote-self');
// // // // // // // // //             if (error) throw new Error(error.message);
// // // // // // // // //         },
// // // // // // // // //         onSuccess: () => {
// // // // // // // // //             toast.success(t('profile.demote.success'));
// // // // // // // // //             queryClient.invalidateQueries({ queryKey: ['layout_profile', user?.id] });
// // // // // // // // //             queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
// // // // // // // // //             navigate('/');
// // // // // // // // //         },
// // // // // // // // //         onError: (error) => toast.error(error.message),
// // // // // // // // //     });

// // // // // // // // //     const handleDemote = () => {
// // // // // // // // //         if (window.confirm(t('profile.demote.confirm'))) {
// // // // // // // // //             demoteMutation.mutate();
// // // // // // // // //         }
// // // // // // // // //     };

// // // // // // // // //     if (isLoading) return <div className="text-center py-40">Loading profile...</div>;
// // // // // // // // //     if (!profile && !isLoading) return <div className="text-center py-40">Could not load profile. Please try again.</div>

// // // // // // // // //     const userRole = currentUserProfile?.roles?.name;
// // // // // // // // //     const isPrivilegedUser = userRole === 'admin' || userRole === 'developer' || userRole === 'organizer';

// // // // // // // // //     return (
// // // // // // // // //         <div className="relative min-h-screen pt-24 pb-12 p-4">
// // // // // // // // //             <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
// // // // // // // // //             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
// // // // // // // // //                 <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
// // // // // // // // //                 <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8"><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setActiveTab('events')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>

// // // // // // // // //                 {activeTab === 'details' && (
// // // // // // // // //                     <>
// // // // // // // // //                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// // // // // // // // //                             <div className="md:col-span-1"><Avatar url={avatarPath} onUpload={handleAvatarUpload} isEditing={isEditingProfile} /></div>
// // // // // // // // //                             <div className="md:col-span-2">{isEditingProfile ? (<ProfileForm profile={profile} onCancel={() => setIsEditingProfile(false)} />) : (<ProfileView profile={profile} onEditClick={() => setIsEditingProfile(true)} />)}</div>
// // // // // // // // //                         </div>
// // // // // // // // //                         {isPrivilegedUser && !isEditingProfile && (
// // // // // // // // //                             <div className="mt-8 pt-6 border-t border-red-500/30">
// // // // // // // // //                                 <h3 className="text-xl font-bold text-system-danger">{t('profile.demote.title')}</h3>
// // // // // // // // //                                 <p className="text-text-secondary text-sm mt-2">{t('profile.demote.description')}</p>
// // // // // // // // //                                 <button onClick={handleDemote} disabled={demoteMutation.isPending} className="mt-4 px-4 py-2 border border-system-danger text-system-danger font-semibold rounded-lg hover:bg-system-danger hover:text-white transition-colors disabled:opacity-50">
// // // // // // // // //                                     {demoteMutation.isPending ? 'Processing...' : t('profile.demote.button')}
// // // // // // // // //                                 </button>
// // // // // // // // //                             </div>
// // // // // // // // //                         )}
// // // // // // // // //                     </>
// // // // // // // // //                 )}
// // // // // // // // //                 {activeTab === 'events' && user && (<MyEventsList userId={user.id} />)}
// // // // // // // // //             </motion.div>
// // // // // // // // //         </div>
// // // // // // // // //     );
// // // // // // // // // };

// // // // // // // // import { useForm, type SubmitHandler } from 'react-hook-form';
// // // // // // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // // // // // import { z } from 'zod';
// // // // // // // // import { useEffect, useState } from 'react';
// // // // // // // // import { useAuth, supabase } from '../contexts/AuthContext';
// // // // // // // // import toast from 'react-hot-toast';
// // // // // // // // import { useTranslation } from '../contexts/LanguageContext';
// // // // // // // // import { motion } from 'framer-motion';
// // // // // // // // import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
// // // // // // // // import { Link, useNavigate } from 'react-router-dom';

// // // // // // // // const currentYear = new Date().getFullYear();
// // // // // // // // const ProfileSchema = z.object({
// // // // // // // //     english_name: z.string().optional(),
// // // // // // // //     chinese_name: z.string().optional(),
// // // // // // // //     department: z.string().min(1, 'Department is required'),
// // // // // // // //     nationality: z.string().min(1, 'Nationality is required'),
// // // // // // // //     student_id: z.string().min(1, 'Student ID is required'),
// // // // // // // //     avatar_url: z.string().nullable(),
// // // // // // // //     birth_year: z.coerce.number().min(1920, 'Invalid year').max(currentYear, 'Invalid year').optional().nullable(),
// // // // // // // //     gender: z.enum(['male', 'female', 'rather_not_say']).optional().nullable(),
// // // // // // // // });
// // // // // // // // type ProfileFormInputs = z.infer<typeof ProfileSchema>;

// // // // // // // // // Fungsi helper baru untuk upload ke Cloudinary
// // // // // // // // const uploadToCloudinary = async (file: File): Promise<string> => {
// // // // // // // //     const formData = new FormData();
// // // // // // // //     formData.append('file', file);
// // // // // // // //     formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
// // // // // // // //     const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
// // // // // // // //         method: 'POST',
// // // // // // // //         body: formData,
// // // // // // // //     });
// // // // // // // //     const data = await response.json();
// // // // // // // //     if (!response.ok) {
// // // // // // // //         throw new Error(data.error.message || 'Image upload to Cloudinary failed');
// // // // // // // //     }
// // // // // // // //     return data.secure_url;
// // // // // // // // };

// // // // // // // // const Avatar = ({ url, onUpload, isEditing }: { url: string | null; onUpload: (newUrl: string) => void; isEditing: boolean; }) => {
// // // // // // // //     const { user } = useAuth(); const { t } = useTranslation();
// // // // // // // //     const [uploading, setUploading] = useState(false);
// // // // // // // //     const avatarUrl = url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`;

// // // // // // // //     const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
// // // // // // // //         if (!user || !isEditing || !event.target.files || event.target.files.length === 0) return;

// // // // // // // //         const file = event.target.files[0];
// // // // // // // //         setUploading(true);
// // // // // // // //         toast.loading('Uploading avatar...');

// // // // // // // //         try {
// // // // // // // //             const newUrl = await uploadToCloudinary(file);
// // // // // // // //             onUpload(newUrl);
// // // // // // // //             toast.dismiss();
// // // // // // // //             toast.success('Avatar updated! Save changes to confirm.');
// // // // // // // //         } catch (error: any) {
// // // // // // // //             toast.dismiss();
// // // // // // // //             toast.error(error.message);
// // // // // // // //         } finally {
// // // // // // // //             setUploading(false);
// // // // // // // //         }
// // // // // // // //     };
// // // // // // // //     return (<div className="flex flex-col items-center space-y-4"><img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-md" />{isEditing && <div><label htmlFor="single" className="cursor-pointer bg-white/50 backdrop-blur-lg border border-white/20 text-text-secondary px-4 py-2 rounded-lg hover:bg-white/80 transition-colors text-sm">{uploading ? t('profile.uploadingButton') : t('profile.uploadButton')}</label><input type="file" id="single" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" /></div>}</div>);
// // // // // // // // };

// // // // // // // // // ... (Komponen ProfileView, ProfileForm, MyEventsList tidak berubah dari summon sebelumnya)
// // // // // // // // const ProfileView = ({ profile, onEditClick }: { profile: ProfileFormInputs; onEditClick: () => void; }) => { /* ... */ };
// // // // // // // // const ProfileForm = ({ profile, onCancel }: { profile: ProfileFormInputs; onCancel: () => void; }) => { /* ... */ };
// // // // // // // // const MyEventsList = ({ userId }: { userId: string }) => { /* ... */ };


// // // // // // // // export const ProfilePage = () => {
// // // // // // // //     const { user, profile: currentUserProfile } = useAuth();
// // // // // // // //     const { t } = useTranslation();
// // // // // // // //     const queryClient = useQueryClient();
// // // // // // // //     const navigate = useNavigate();
// // // // // // // //     const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
// // // // // // // //     const [isEditingProfile, setIsEditingProfile] = useState(false);

// // // // // // // //     const { data: profile, isLoading } = useQuery({
// // // // // // // //         queryKey: ['profile', user?.id],
// // // // // // // //         queryFn: async (): Promise<ProfileFormInputs | null> => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') throw error; return data; },
// // // // // // // //         enabled: !!user,
// // // // // // // //     });

// // // // // // // //     const updateAvatarMutation = useMutation({
// // // // // // // //         mutationFn: async (newUrl: string) => {
// // // // // // // //             if (!user) throw new Error("User not found");
// // // // // // // //             const { error } = await supabase.from('profiles').update({ avatar_url: newUrl }).eq('user_id', user.id);
// // // // // // // //             if (error) throw error;
// // // // // // // //         },
// // // // // // // //         onSuccess: () => {
// // // // // // // //             queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
// // // // // // // //             queryClient.invalidateQueries({ queryKey: ['layout_profile', user?.id] });
// // // // // // // //         },
// // // // // // // //         onError: (error: any) => toast.error(error.message)
// // // // // // // //     });

// // // // // // // //     const demoteMutation = useMutation({
// // // // // // // //         mutationFn: async () => { const { error } = await supabase.functions.invoke('demote-self'); if (error) throw new Error(error.message); },
// // // // // // // //         onSuccess: () => { toast.success(t('profile.demote.success')); queryClient.invalidateQueries({ queryKey: ['layout_profile', user?.id] }); navigate('/'); },
// // // // // // // //         onError: (error) => toast.error(error.message),
// // // // // // // //     });

// // // // // // // //     const handleDemote = () => { if (window.confirm(t('profile.demote.confirm'))) { demoteMutation.mutate(); } };
// // // // // // // //     if (isLoading) return <div className="text-center py-40">Loading profile...</div>;
// // // // // // // //     if (!profile && !isLoading) return <div className="text-center py-40">Could not load profile. Please try again.</div>

// // // // // // // //     const isPrivilegedUser = currentUserProfile?.roles?.name === 'admin' || currentUserProfile?.roles?.name === 'developer' || currentUserProfile?.roles?.name === 'organizer';

// // // // // // // //     return (
// // // // // // // //         <div className="relative min-h-screen pt-24 pb-12 p-4">
// // // // // // // //             <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
// // // // // // // //             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
// // // // // // // //                 <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
// // // // // // // //                 <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8"><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setActiveTab('events')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>

// // // // // // // //                 {activeTab === 'details' && (
// // // // // // // //                     <>
// // // // // // // //                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// // // // // // // //                             <div className="md:col-span-1"><Avatar url={profile.avatar_url} onUpload={(newUrl) => updateAvatarMutation.mutate(newUrl)} isEditing={isEditingProfile} /></div>
// // // // // // // //                             <div className="md:col-span-2">{isEditingProfile ? (<ProfileForm profile={profile} onCancel={() => setIsEditingProfile(false)} />) : (<ProfileView profile={profile} onEditClick={() => setIsEditingProfile(true)} />)}</div>
// // // // // // // //                         </div>
// // // // // // // //                         {isPrivilegedUser && !isEditingProfile && (
// // // // // // // //                             <div className="mt-8 pt-6 border-t border-red-500/30">
// // // // // // // //                                 <h3 className="text-xl font-bold text-system-danger">{t('profile.demote.title')}</h3>
// // // // // // // //                                 <p className="text-text-secondary text-sm mt-2">{t('profile.demote.description')}</p>
// // // // // // // //                                 <button onClick={handleDemote} disabled={demoteMutation.isPending} className="mt-4 px-4 py-2 border border-system-danger text-system-danger font-semibold rounded-lg hover:bg-system-danger hover:text-white transition-colors disabled:opacity-50">{demoteMutation.isPending ? 'Processing...' : t('profile.demote.button')}</button>
// // // // // // // //                             </div>
// // // // // // // //                         )}
// // // // // // // //                     </>
// // // // // // // //                 )}
// // // // // // // //                 {activeTab === 'events' && user && (<MyEventsList userId={user.id} />)}
// // // // // // // //             </motion.div>
// // // // // // // //         </div>
// // // // // // // //     );
// // // // // // // // };

// // // // // // // import { useForm, type SubmitHandler } from 'react-hook-form';
// // // // // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // // // // import { z } from 'zod';
// // // // // // // import { useEffect, useState } from 'react';
// // // // // // // import { useAuth, supabase } from '../contexts/AuthContext';
// // // // // // // import toast from 'react-hot-toast';
// // // // // // // import { useTranslation } from '../contexts/LanguageContext';
// // // // // // // import { motion } from 'framer-motion';
// // // // // // // import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
// // // // // // // import { Link } from 'react-router-dom';

// // // // // // // const currentYear = new Date().getFullYear();
// // // // // // // const ProfileSchema = z.object({ english_name: z.string().optional(), chinese_name: z.string().optional(), department: z.string().min(1, 'Department is required'), nationality: z.string().min(1, 'Nationality is required'), student_id: z.string().min(1, 'Student ID is required'), avatar_url: z.string().nullable(), birth_year: z.coerce.number().min(1920, 'Invalid year').max(currentYear, 'Invalid year').optional().nullable(), gender: z.enum(['male', 'female', 'rather_not_say']).optional().nullable(), });
// // // // // // // type ProfileFormInputs = z.infer<typeof ProfileSchema>;

// // // // // // // const Avatar = ({ url, onUpload, isEditing }: { url: string | null; onUpload: (filePath: string) => void; isEditing: boolean; }) => {
// // // // // // //     const { user } = useAuth(); const { t } = useTranslation();
// // // // // // //     const [uploading, setUploading] = useState(false);
// // // // // // //     const avatarUrl = url ? url : `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`;
// // // // // // //     const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => { if (!user || !isEditing || !event.target.files || event.target.files.length === 0) return; setLoading(true); toast.loading('Uploading avatar...'); try { const newUrl = await uploadToCloudinary(event.target.files[0]); onUpload(newUrl); toast.dismiss(); toast.success('Avatar updated! Save changes to confirm.'); } catch (error: any) { toast.dismiss(); toast.error(error.message); } finally { setLoading(false); } };
// // // // // // //     return (<div className="flex flex-col items-center space-y-4"><img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-md" />{isEditing && <div><label htmlFor="single" className="cursor-pointer bg-white/50 backdrop-blur-lg border border-white/20 text-text-secondary px-4 py-2 rounded-lg hover:bg-white/80 transition-colors text-sm">{uploading ? t('profile.uploadingButton') : t('profile.uploadButton')}</label><input type="file" id="single" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" /></div>}</div>);
// // // // // // // };
// // // // // // // const ProfileView = ({ profile, onEditClick }: { profile: ProfileFormInputs; onEditClick: () => void; }) => {
// // // // // // //     const { t } = useTranslation();
// // // // // // //     return (<div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"><div><p className="text-sm font-medium text-text-secondary">{t('profile.englishNameLabel')}</p><p className="text-lg text-text-primary">{profile.english_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.chineseNameLabel')}</p><p className="text-lg text-text-primary">{profile.chinese_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.departmentLabel')}</p><p className="text-lg text-text-primary">{profile.department || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.nationalityLabel')}</p><p className="text-lg text-text-primary">{profile.nationality || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.birthYearLabel')}</p><p className="text-lg text-text-primary">{profile.birth_year || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.genderLabel')}</p><p className="text-lg text-text-primary capitalize">{profile.gender?.replace('_', ' ') || '-'}</p></div><div className="md:col-span-2"><p className="text-sm font-medium text-text-secondary">{t('profile.studentIdLabel')}</p><p className="text-lg text-text-primary">{profile.student_id || '-'}</p></div></div><div className="pt-4 text-right"><button onClick={onEditClick} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover">{t('profile.editButton')}</button></div></div>);
// // // // // // // };
// // // // // // // const ProfileForm = ({ profile, onCancel, onSaveSuccess }: { profile: ProfileFormInputs | null; onCancel: () => void; onSaveSuccess: () => void; }) => {
// // // // // // //     const { user } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient();
// // // // // // //     const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormInputs>({ defaultValues: profile || {}, resolver: zodResolver(ProfileSchema) });
// // // // // // //     const handleUpdateProfile: SubmitHandler<ProfileFormInputs> = async (formData) => {
// // // // // // //         try { const { error } = await supabase.from('profiles').upsert({ ...formData, user_id: user!.id, birth_year: formData.birth_year || null }); if (error) throw error; toast.success(t('profile.updateSuccess')); queryClient.invalidateQueries({ queryKey: ['profile', user!.id] }); onSaveSuccess(); } catch (error: any) { toast.error(`${t('profile.updateError')}: ${error.message}`); }
// // // // // // //     };
// // // // // // //     return (<form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.englishNameLabel')}</label><input {...register('english_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div><div><label className="text-sm font-medium">{t('profile.chineseNameLabel')}</label><input {...register('chinese_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.birthYearLabel')}</label><input type="number" placeholder={String(currentYear - 20)} {...register('birth_year')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.birth_year && <p className="mt-1 text-sm text-system-danger">{errors.birth_year.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.genderLabel')}</label><select {...register('gender')} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white"><option value="">{t('profile.selectGender')}</option><option value="male">{t('profile.genderMale')}</option><option value="female">{t('profile.genderFemale')}</option><option value="rather_not_say">{t('profile.genderRatherNotSay')}</option></select></div></div><div><label className="text-sm font-medium">{t('profile.departmentLabel')}</label><input {...register('department')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.department && <p className="mt-1 text-sm text-system-danger">{errors.department.message}</p>}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.nationalityLabel')}</label><input {...register('nationality')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.nationality && <p className="mt-1 text-sm text-system-danger">{errors.nationality.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.studentIdLabel')}</label><input {...register('student_id')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.student_id && <p className="mt-1 text-sm text-system-danger">{errors.student_id.message}</p>}</div></div><div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">{t('profile.cancelButton')}</button><button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isSubmitting ? t('profile.savingButton') : t('profile.saveButton')}</button></div></form>);
// // // // // // // };
// // // // // // // const MyEventsList = ({ userId }: { userId: string }) => { /* ... */ };

// // // // // // // export const ProfilePage = () => {
// // // // // // //     const { user, profile: currentUserProfile } = useAuth();
// // // // // // //     const { t } = useTranslation();
// // // // // // //     const queryClient = useQueryClient();
// // // // // // //     const navigate = useNavigate();
// // // // // // //     const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
// // // // // // //     const [isEditingProfile, setIsEditingProfile] = useState(false);

// // // // // // //     const { data: profile, isLoading } = useQuery({
// // // // // // //         queryKey: ['profile', user?.id],
// // // // // // //         queryFn: async (): Promise<ProfileFormInputs | null> => {
// // // // // // //             if (!user) return null;
// // // // // // //             const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
// // // // // // //             if (error && error.code !== 'PGRST116') throw error;
// // // // // // //             // Jika tidak ada data (user baru), otomatis masuk ke mode edit
// // // // // // //             if (!data) {
// // // // // // //                 setIsEditingProfile(true);
// // // // // // //             }
// // // // // // //             return data;
// // // // // // //         },
// // // // // // //         enabled: !!user,
// // // // // // //     });

// // // // // // //     const demoteMutation = useMutation({ /* ... */ });
// // // // // // //     const handleDemote = () => { /* ... */ };

// // // // // // //     if (isLoading) return <div className="text-center py-40">Loading profile...</div>;

// // // // // // //     const isPrivilegedUser = currentUserProfile?.roles?.name === 'admin' || currentUserProfile?.roles?.name === 'developer' || currentUserProfile?.roles?.name === 'organizer';

// // // // // // //     return (
// // // // // // //         <div className="relative min-h-screen pt-24 pb-12 p-4">
// // // // // // //             <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
// // // // // // //             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
// // // // // // //                 <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
// // // // // // //                 <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8"><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setActiveTab('events')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>

// // // // // // //                 {activeTab === 'details' && (
// // // // // // //                     <>
// // // // // // //                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// // // // // // //                             <div className="md:col-span-1">
// // // // // // //                                 <Avatar url={profile?.avatar_url ?? null} onUpload={(newUrl) => { if (!user) return; queryClient.setQueryData(['profile', user.id], (old: any) => ({ ...old, avatar_url: newUrl })); }} isEditing={isEditingProfile} />
// // // // // // //                             </div>
// // // // // // //                             <div className="md:col-span-2">
// // // // // // //                                 {isEditingProfile ? (
// // // // // // //                                     <ProfileForm profile={profile} onCancel={() => setIsEditingProfile(false)} onSaveSuccess={() => setIsEditingProfile(false)} />
// // // // // // //                                 ) : (
// // // // // // //                                     profile && <ProfileView profile={profile} onEditClick={() => setIsEditingProfile(true)} />
// // // // // // //                                 )}
// // // // // // //                             </div>
// // // // // // //                         </div>
// // // // // // //                         {isPrivilegedUser && !isEditingProfile && (
// // // // // // //                             <div className="mt-8 pt-6 border-t border-red-500/30">
// // // // // // //                                 <h3 className="text-xl font-bold text-system-danger">{t('profile.demote.title')}</h3>
// // // // // // //                                 <p className="text-text-secondary text-sm mt-2">{t('profile.demote.description')}</p>
// // // // // // //                                 <button onClick={handleDemote} disabled={demoteMutation.isPending} className="mt-4 px-4 py-2 border border-system-danger text-system-danger font-semibold rounded-lg hover:bg-system-danger hover:text-white transition-colors disabled:opacity-50">{demoteMutation.isPending ? 'Processing...' : t('profile.demote.button')}</button>
// // // // // // //                             </div>
// // // // // // //                         )}
// // // // // // //                     </>
// // // // // // //                 )}
// // // // // // //                 {activeTab === 'events' && user && (<MyEventsList userId={user.id} />)}
// // // // // // //             </motion.div>
// // // // // // //         </div>
// // // // // // //     );
// // // // // // // };

// // // // // // import { useForm, type SubmitHandler } from 'react-hook-form';
// // // // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // // // import { z } from 'zod';
// // // // // // import { useEffect, useState } from 'react';
// // // // // // import { useAuth, supabase } from '../contexts/AuthContext';
// // // // // // import toast from 'react-hot-toast';
// // // // // // import { useTranslation } from '../contexts/LanguageContext';
// // // // // // import { motion } from 'framer-motion';
// // // // // // import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
// // // // // // import { Link, useNavigate } from 'react-router-dom'; // FIX IS HERE

// // // // // // const currentYear = new Date().getFullYear();
// // // // // // const ProfileSchema = z.object({
// // // // // //     english_name: z.string().optional(),
// // // // // //     chinese_name: z.string().optional(),
// // // // // //     department: z.string().min(1, 'Department is required'),
// // // // // //     nationality: z.string().min(1, 'Nationality is required'),
// // // // // //     student_id: z.string().min(1, 'Student ID is required'),
// // // // // //     avatar_url: z.string().nullable(),
// // // // // //     birth_year: z.coerce.number().min(1920, 'Invalid year').max(currentYear, 'Invalid year').optional().nullable(),
// // // // // //     gender: z.enum(['male', 'female', 'rather_not_say']).optional().nullable(),
// // // // // // });
// // // // // // type ProfileFormInputs = z.infer<typeof ProfileSchema>;

// // // // // // const Avatar = ({ url, onUpload, isEditing }: { url: string | null; onUpload: (newUrl: string) => void; isEditing: boolean; }) => {
// // // // // //     const { user } = useAuth(); const { t } = useTranslation();
// // // // // //     const [uploading, setUploading] = useState(false);
// // // // // //     const avatarUrl = url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`;
// // // // // //     const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => { if (!user || !isEditing || !event.target.files || !event.target.files.length === 0) return; setUploading(true); toast.loading('Uploading avatar...'); try { const newUrl = await uploadToCloudinary(event.target.files[0]); onUpload(newUrl); toast.dismiss(); toast.success('Avatar updated! Save changes to confirm.'); } catch (error: any) { toast.dismiss(); toast.error(error.message); } finally { setUploading(false); } };
// // // // // //     return (<div className="flex flex-col items-center space-y-4"><img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-md" />{isEditing && <div><label htmlFor="single" className="cursor-pointer bg-white/50 backdrop-blur-lg border border-white/20 text-text-secondary px-4 py-2 rounded-lg hover:bg-white/80 transition-colors text-sm">{uploading ? t('profile.uploadingButton') : t('profile.uploadButton')}</label><input type="file" id="single" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" /></div>}</div>);
// // // // // // };
// // // // // // const ProfileView = ({ profile, onEditClick }: { profile: ProfileFormInputs; onEditClick: () => void; }) => {
// // // // // //     const { t } = useTranslation();
// // // // // //     return (<div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"><div><p className="text-sm font-medium text-text-secondary">{t('profile.englishNameLabel')}</p><p className="text-lg text-text-primary">{profile.english_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.chineseNameLabel')}</p><p className="text-lg text-text-primary">{profile.chinese_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.departmentLabel')}</p><p className="text-lg text-text-primary">{profile.department || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.nationalityLabel')}</p><p className="text-lg text-text-primary">{profile.nationality || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.birthYearLabel')}</p><p className="text-lg text-text-primary">{profile.birth_year || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.genderLabel')}</p><p className="text-lg text-text-primary capitalize">{profile.gender?.replace('_', ' ') || '-'}</p></div><div className="md:col-span-2"><p className="text-sm font-medium text-text-secondary">{t('profile.studentIdLabel')}</p><p className="text-lg text-text-primary">{profile.student_id || '-'}</p></div></div><div className="pt-4 text-right"><button onClick={onEditClick} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover">{t('profile.editButton')}</button></div></div>);
// // // // // // };
// // // // // // const ProfileForm = ({ profile, onCancel, onSaveSuccess }: { profile: ProfileFormInputs | null; onCancel: () => void; onSaveSuccess: () => void; }) => {
// // // // // //     const { user } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient();
// // // // // //     const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormInputs>({ defaultValues: profile || {}, resolver: zodResolver(ProfileSchema) });
// // // // // //     const handleUpdateProfile: SubmitHandler<ProfileFormInputs> = async (formData) => {
// // // // // //         try { const { error } = await supabase.from('profiles').upsert({ ...formData, user_id: user!.id, birth_year: formData.birth_year || null }); if (error) throw error; toast.success(t('profile.updateSuccess')); queryClient.invalidateQueries({ queryKey: ['profile', user!.id] }); onSaveSuccess(); } catch (error: any) { toast.error(`${t('profile.updateError')}: ${error.message}`); }
// // // // // //     };
// // // // // //     return (<form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.englishNameLabel')}</label><input {...register('english_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div><div><label className="text-sm font-medium">{t('profile.chineseNameLabel')}</label><input {...register('chinese_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.birthYearLabel')}</label><input type="number" placeholder={String(currentYear - 20)} {...register('birth_year')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.birth_year && <p className="mt-1 text-sm text-system-danger">{errors.birth_year.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.genderLabel')}</label><select {...register('gender')} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white"><option value="">{t('profile.selectGender')}</option><option value="male">{t('profile.genderMale')}</option><option value="female">{t('profile.genderFemale')}</option><option value="rather_not_say">{t('profile.genderRatherNotSay')}</option></select></div></div><div><label className="text-sm font-medium">{t('profile.departmentLabel')}</label><input {...register('department')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.department && <p className="mt-1 text-sm text-system-danger">{errors.department.message}</p>}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.nationalityLabel')}</label><input {...register('nationality')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.nationality && <p className="mt-1 text-sm text-system-danger">{errors.nationality.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.studentIdLabel')}</label><input {...register('student_id')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.student_id && <p className="mt-1 text-sm text-system-danger">{errors.student_id.message}</p>}</div></div><div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">{t('profile.cancelButton')}</button><button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isSubmitting ? t('profile.savingButton') : t('profile.saveButton')}</button></div></form>);
// // // // // // };
// // // // // // const MyEventsList = ({ userId }: { userId: string }) => { /* ... */ };


// // // // // // export const ProfilePage = () => {
// // // // // //     const { user, profile: currentUserProfile } = useAuth();
// // // // // //     const { t } = useTranslation();
// // // // // //     const queryClient = useQueryClient();
// // // // // //     const navigate = useNavigate();
// // // // // //     const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
// // // // // //     const [isEditingProfile, setIsEditingProfile] = useState(false);

// // // // // //     const { data: profile, isLoading } = useQuery({
// // // // // //         queryKey: ['profile', user?.id],
// // // // // //         queryFn: async (): Promise<ProfileFormInputs | null> => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') throw error; if (!data) { setIsEditingProfile(true); } return data; },
// // // // // //         enabled: !!user,
// // // // // //     });

// // // // // //     const updateAvatarMutation = useMutation({
// // // // // //         mutationFn: async (newUrl: string) => { if (!user) throw new Error("User not found"); const { error } = await supabase.from('profiles').update({ avatar_url: newUrl }).eq('user_id', user.id); if (error) throw error; },
// // // // // //         onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['profile', user?.id] }); queryClient.invalidateQueries({ queryKey: ['layout_profile', user?.id] }); },
// // // // // //         onError: (error: any) => toast.error(error.message)
// // // // // //     });

// // // // // //     const demoteMutation = useMutation({
// // // // // //         mutationFn: async () => { const { error } = await supabase.functions.invoke('demote-self'); if (error) throw new Error(error.message); },
// // // // // //         onSuccess: () => { toast.success(t('profile.demote.success')); queryClient.invalidateQueries({ queryKey: ['layout_profile', user?.id] }); navigate('/'); },
// // // // // //         onError: (error) => toast.error(error.message),
// // // // // //     });

// // // // // //     const handleDemote = () => { if (window.confirm(t('profile.demote.confirm'))) { demoteMutation.mutate(); } };

// // // // // //     if (isLoading) return <div className="text-center py-40">Loading profile...</div>;

// // // // // //     const isPrivilegedUser = currentUserProfile?.roles?.name === 'admin' || currentUserProfile?.roles?.name === 'developer' || currentUserProfile?.roles?.name === 'organizer';

// // // // // //     return (
// // // // // //         <div className="relative min-h-screen pt-24 pb-12 p-4">
// // // // // //             <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
// // // // // //             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
// // // // // //                 <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
// // // // // //                 <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setActiveTab('events')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>

// // // // // //                 {activeTab === 'details' && (
// // // // // //                     <>
// // // // // //                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// // // // // //                             <div className="md:col-span-1"><Avatar url={profile?.avatar_url ?? null} onUpload={(newUrl) => updateAvatarMutation.mutate(newUrl)} isEditing={isEditingProfile} /></div>
// // // // // //                             <div className="md:col-span-2">{isEditingProfile ? (<ProfileForm profile={profile} onCancel={() => setIsEditingProfile(false)} onSaveSuccess={() => setIsEditingProfile(false)} />) : (profile && <ProfileView profile={profile} onEditClick={() => setIsEditingProfile(true)} />)}</div>
// // // // // //                         </div>
// // // // // //                         {isPrivilegedUser && !isEditingProfile && (
// // // // // //                             <div className="mt-8 pt-6 border-t border-red-500/30">
// // // // // //                                 <h3 className="text-xl font-bold text-system-danger">{t('profile.demote.title')}</h3>
// // // // // //                                 <p className="text-text-secondary text-sm mt-2">{t('profile.demote.description')}</p>
// // // // // //                                 <button onClick={handleDemote} disabled={demoteMutation.isPending} className="mt-4 px-4 py-2 border border-system-danger text-system-danger font-semibold rounded-lg hover:bg-system-danger hover:text-white transition-colors disabled:opacity-50">{demoteMutation.isPending ? 'Processing...' : t('profile.demote.button')}</button>
// // // // // //                             </div>
// // // // // //                         )}
// // // // // //                     </>
// // // // // //                 )}
// // // // // //                 {activeTab === 'events' && user && (<MyEventsList userId={user.id} />)}
// // // // // //             </motion.div>
// // // // // //         </div>
// // // // // //     );
// // // // // // };

// // // // // import { useForm, type SubmitHandler } from 'react-hook-form';
// // // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // // import { z } from 'zod';
// // // // // import { useEffect, useState } from 'react';
// // // // // import { useAuth, supabase } from '../contexts/AuthContext';
// // // // // import toast from 'react-hot-toast';
// // // // // import { useTranslation } from '../contexts/LanguageContext';
// // // // // import { motion } from 'framer-motion';
// // // // // import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
// // // // // import { Link, useNavigate } from 'react-router-dom';

// // // // // const currentYear = new Date().getFullYear();
// // // // // const ProfileSchema = z.object({
// // // // //     english_name: z.string().optional(),
// // // // //     chinese_name: z.string().optional(),
// // // // //     department: z.string().min(1, 'Department is required'),
// // // // //     nationality: z.string().min(1, 'Nationality is required'),
// // // // //     student_id: z.string().min(1, 'Student ID is required'),
// // // // //     avatar_url: z.string().nullable(),
// // // // //     birth_year: z.coerce.number().min(1920, 'Invalid year').max(currentYear, 'Invalid year').optional().nullable(),
// // // // //     gender: z.enum(['male', 'female', 'rather_not_say']).optional().nullable(),
// // // // // });
// // // // // type ProfileFormInputs = z.infer<typeof ProfileSchema>;

// // // // // const uploadToCloudinary = async (file: File): Promise<string> => {
// // // // //     const formData = new FormData();
// // // // //     formData.append('file', file);
// // // // //     formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
// // // // //     const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
// // // // //         method: 'POST',
// // // // //         body: formData,
// // // // //     });
// // // // //     const data = await response.json();
// // // // //     if (!response.ok) throw new Error(data.error.message || 'Image upload to Cloudinary failed');
// // // // //     return data.secure_url;
// // // // // };

// // // // // const Avatar = ({ url, onUpload, isEditing }: { url: string | null; onUpload: (newUrl: string) => void; isEditing: boolean; }) => {
// // // // //     const { user } = useAuth(); const { t } = useTranslation();
// // // // //     const [uploading, setUploading] = useState(false);
// // // // //     const avatarUrl = url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`;

// // // // //     const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
// // // // //         if (!user || !isEditing || !event.target.files || !event.target.files.length === 0) return;
// // // // //         const file = event.target.files[0];
// // // // //         setUploading(true);
// // // // //         toast.loading('Uploading avatar...');
// // // // //         try {
// // // // //             const newUrl = await uploadToCloudinary(file);
// // // // //             onUpload(newUrl);
// // // // //             toast.dismiss();
// // // // //             toast.success('Avatar updated! Save changes to confirm.');
// // // // //         } catch (error: any) {
// // // // //             toast.dismiss();
// // // // //             toast.error(error.message);
// // // // //         } finally {
// // // // //             setUploading(false);
// // // // //         }
// // // // //     };
// // // // //     return (<div className="flex flex-col items-center space-y-4"><img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-md" />{isEditing && <div><label htmlFor="single" className="cursor-pointer bg-white/50 backdrop-blur-lg border border-white/20 text-text-secondary px-4 py-2 rounded-lg hover:bg-white/80 transition-colors text-sm">{uploading ? t('profile.uploadingButton') : t('profile.uploadButton')}</label><input type="file" id="single" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" /></div>}</div>);
// // // // // };
// // // // // const ProfileView = ({ profile, onEditClick }: { profile: ProfileFormInputs; onEditClick: () => void; }) => {
// // // // //     const { t } = useTranslation();
// // // // //     return (<div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"><div><p className="text-sm font-medium text-text-secondary">{t('profile.englishNameLabel')}</p><p className="text-lg text-text-primary">{profile.english_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.chineseNameLabel')}</p><p className="text-lg text-text-primary">{profile.chinese_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.departmentLabel')}</p><p className="text-lg text-text-primary">{profile.department || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.nationalityLabel')}</p><p className="text-lg text-text-primary">{profile.nationality || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.birthYearLabel')}</p><p className="text-lg text-text-primary">{profile.birth_year || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.genderLabel')}</p><p className="text-lg text-text-primary capitalize">{profile.gender?.replace('_', ' ') || '-'}</p></div><div className="md:col-span-2"><p className="text-sm font-medium text-text-secondary">{t('profile.studentIdLabel')}</p><p className="text-lg text-text-primary">{profile.student_id || '-'}</p></div></div><div className="pt-4 text-right"><button onClick={onEditClick} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover">{t('profile.editButton')}</button></div></div>);
// // // // // };
// // // // // const ProfileForm = ({ profile, onCancel, onSaveSuccess }: { profile: ProfileFormInputs | null; onCancel: () => void; onSaveSuccess: () => void; }) => {
// // // // //     const { user } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient();
// // // // //     const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormInputs>({ defaultValues: profile || {}, resolver: zodResolver(ProfileSchema) });
// // // // //     const handleUpdateProfile: SubmitHandler<ProfileFormInputs> = async (formData) => {
// // // // //         try { const { error } = await supabase.from('profiles').upsert({ ...formData, user_id: user!.id, birth_year: formData.birth_year || null }); if (error) throw error; toast.success(t('profile.updateSuccess')); queryClient.invalidateQueries({ queryKey: ['profile', user!.id] }); onSaveSuccess(); } catch (error: any) { toast.error(`${t('profile.updateError')}: ${error.message}`); }
// // // // //     };
// // // // //     return (<form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.englishNameLabel')}</label><input {...register('english_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div><div><label className="text-sm font-medium">{t('profile.chineseNameLabel')}</label><input {...register('chinese_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.birthYearLabel')}</label><input type="number" placeholder={String(currentYear - 20)} {...register('birth_year')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.birth_year && <p className="mt-1 text-sm text-system-danger">{errors.birth_year.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.genderLabel')}</label><select {...register('gender')} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white"><option value="">{t('profile.selectGender')}</option><option value="male">{t('profile.genderMale')}</option><option value="female">{t('profile.genderFemale')}</option><option value="rather_not_say">{t('profile.genderRatherNotSay')}</option></select></div></div><div><label className="text-sm font-medium">{t('profile.departmentLabel')}</label><input {...register('department')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.department && <p className="mt-1 text-sm text-system-danger">{errors.department.message}</p>}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.nationalityLabel')}</label><input {...register('nationality')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.nationality && <p className="mt-1 text-sm text-system-danger">{errors.nationality.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.studentIdLabel')}</label><input {...register('student_id')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.student_id && <p className="mt-1 text-sm text-system-danger">{errors.student_id.message}</p>}</div></div><div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">{t('profile.cancelButton')}</button><button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isSubmitting ? t('profile.savingButton') : t('profile.saveButton')}</button></div></form>);
// // // // // };
// // // // // const MyEventsList = ({ userId }: { userId: string }) => {
// // // // //     const { t, language } = useTranslation(); const PAGE_SIZE = 3; const queryClient = useQueryClient();
// // // // //     const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({ queryKey: ['my_registrations', userId], queryFn: async ({ pageParam = 0 }) => { const from = pageParam * PAGE_SIZE; const to = from + PAGE_SIZE - 1; const { data, error } = await supabase.from('event_registrations').select('id, status, created_at, events(slug, title_en, title_zh_hant)').eq('user_id', userId).order('created_at', { ascending: false }).range(from, to); if (error) throw error; return data; }, initialPageParam: 0, getNextPageParam: (lastPage, allPages) => { return lastPage.length === PAGE_SIZE ? allPages.length : undefined; }, });
// // // // //     const registrations = data?.pages.flatMap(page => page) ?? [];
// // // // //     const handleShowLess = () => { queryClient.setQueryData(['my_registrations', userId], (data: any) => ({ pages: data.pages.slice(0, 1), pageParams: data.pageParams.slice(0, 1), })); };
// // // // //     const statusClasses = { pending: 'bg-yellow-100 text-yellow-800', accepted: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', };
// // // // //     if (isLoading) return <p>Loading event history...</p>;
// // // // //     if (registrations.length === 0) return <p className="text-text-secondary">{t('profile.events.noRegistrations')}</p>;
// // // // //     return (<div className="overflow-x-auto"><table className="min-w-full"><thead><tr><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.title')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.registrationDate')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.status')}</th></tr></thead><tbody>{registrations.map(reg => { const title = language === 'zh-HANT' && reg.events?.title_zh_hant ? reg.events.title_zh_hant : reg.events?.title_en; return (<tr key={reg.id} className="border-t border-white/20"><td className="p-4 font-medium text-text-primary"><Link to={`/events/${reg.events?.slug}`} className="hover:underline">{title}</Link></td><td className="p-4 text-text-secondary">{new Date(reg.created_at).toLocaleDateString()}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[reg.status]}`}>{t(`profile.events.${reg.status}`)}</span></td></tr>) })}</tbody></table><div className="mt-6 flex justify-center gap-4">{hasNextPage && (<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isFetchingNextPage ? 'Loading...' : 'Show More'}</button>)} {(data?.pages.length ?? 0) > 1 && (<button onClick={handleShowLess} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">Show Less</button>)}</div></div>);
// // // // // };

// // // // // export const ProfilePage = () => {
// // // // //     const { user, profile: currentUserProfile } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient(); const navigate = useNavigate();
// // // // //     const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
// // // // //     const [isEditingProfile, setIsEditingProfile] = useState(false);

// // // // //     const { data: profile, isLoading } = useQuery({
// // // // //         queryKey: ['profile', user?.id],
// // // // //         queryFn: async (): Promise<ProfileFormInputs | null> => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') throw error; if (!data) { setIsEditingProfile(true); } return data; },
// // // // //         enabled: !!user,
// // // // //     });

// // // // //     const updateAvatarMutation = useMutation({
// // // // //         mutationFn: async (newUrl: string) => { if (!user) throw new Error("User not found"); const { error } = await supabase.from('profiles').update({ avatar_url: newUrl }).eq('user_id', user.id); if (error) throw error; },
// // // // //         onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['profile', user?.id] }); queryClient.invalidateQueries({ queryKey: ['layout_profile', user?.id] }); },
// // // // //         onError: (error: any) => toast.error(error.message)
// // // // //     });

// // // // //     const demoteMutation = useMutation({ mutationFn: async () => { const { error } = await supabase.functions.invoke('demote-self'); if (error) throw new Error(error.message); }, onSuccess: () => { toast.success(t('profile.demote.success')); queryClient.invalidateQueries({ queryKey: ['layout_profile', user?.id] }); navigate('/'); }, onError: (error) => toast.error(error.message), });
// // // // //     const handleDemote = () => { if (window.confirm(t('profile.demote.confirm'))) { demoteMutation.mutate(); } };

// // // // //     if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div></div>;
// // // // //     const isPrivilegedUser = currentUserProfile?.roles?.name === 'admin' || currentUserProfile?.roles?.name === 'developer' || currentUserProfile?.roles?.name === 'organizer';

// // // // //     return (
// // // // //         <div className="relative min-h-screen pt-24 pb-12 p-4">
// // // // //             <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
// // // // //             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
// // // // //                 <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
// // // // //                 <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setActiveTab('events')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>

// // // // //                 {activeTab === 'details' && (
// // // // //                     <>
// // // // //                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// // // // //                             <div className="md:col-span-1"><Avatar url={profile?.avatar_url ?? null} onUpload={(newUrl) => updateAvatarMutation.mutate(newUrl)} isEditing={isEditingProfile} /></div>
// // // // //                             <div className="md:col-span-2">{isEditingProfile ? (<ProfileForm profile={profile} onCancel={() => { if (profile) setIsEditingProfile(false) }} onSaveSuccess={() => setIsEditingProfile(false)} />) : (profile && <ProfileView profile={profile} onEditClick={() => setIsEditingProfile(true)} />)}</div>
// // // // //                         </div>
// // // // //                         {isPrivilegedUser && !isEditingProfile && profile && (
// // // // //                             <div className="mt-8 pt-6 border-t border-red-500/30">
// // // // //                                 <h3 className="text-xl font-bold text-system-danger">{t('profile.demote.title')}</h3><p className="text-text-secondary text-sm mt-2">{t('profile.demote.description')}</p>
// // // // //                                 <button onClick={handleDemote} disabled={demoteMutation.isPending} className="mt-4 px-4 py-2 border border-system-danger text-system-danger font-semibold rounded-lg hover:bg-system-danger hover:text-white transition-colors disabled:opacity-50">{demoteMutation.isPending ? 'Processing...' : t('profile.demote.button')}</button>
// // // // //                             </div>
// // // // //                         )}
// // // // //                     </>
// // // // //                 )}
// // // // //                 {activeTab === 'events' && user && (<MyEventsList userId={user.id} />)}
// // // // //             </motion.div>
// // // // //         </div>
// // // // //     );
// // // // // };

// // // // import { useForm, type SubmitHandler } from 'react-hook-form';
// // // // import { zodResolver } from '@hookform/resolvers/zod';
// // // // import { z } from 'zod';
// // // // import { useEffect, useState } from 'react';
// // // // import { useAuth, supabase } from '../contexts/AuthContext';
// // // // import toast from 'react-hot-toast';
// // // // import { useTranslation } from '../contexts/LanguageContext';
// // // // import { motion } from 'framer-motion';
// // // // import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
// // // // import { Link, useNavigate } from 'react-router-dom';

// // // // const currentYear = new Date().getFullYear();
// // // // const ProfileSchema = z.object({
// // // //     english_name: z.string().optional(),
// // // //     chinese_name: z.string().optional(),
// // // //     department: z.string().min(1, 'Department is required'),
// // // //     nationality: z.string().min(1, 'Nationality is required'),
// // // //     student_id: z.string().min(1, 'Student ID is required'),
// // // //     avatar_url: z.string().nullable(),
// // // //     birth_year: z.coerce.number().min(1920, 'Invalid year').max(currentYear, 'Invalid year').optional().nullable(),
// // // //     gender: z.enum(['male', 'female', 'rather_not_say']).optional().nullable(),
// // // // });
// // // // type ProfileFormInputs = z.infer<typeof ProfileSchema>;

// // // // const uploadToCloudinary = async (file: File): Promise<string> => {
// // // //     const formData = new FormData();
// // // //     formData.append('file', file);
// // // //     formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
// // // //     const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
// // // //         method: 'POST',
// // // //         body: formData,
// // // //     });
// // // //     const data = await response.json();
// // // //     if (!response.ok) throw new Error(data.error.message || 'Image upload to Cloudinary failed');
// // // //     return data.secure_url;
// // // // };

// // // // const Avatar = ({ url, onUpload, isEditing }: { url: string | null; onUpload: (newUrl: string) => void; isEditing: boolean; }) => {
// // // //     const { user } = useAuth(); const { t } = useTranslation();
// // // //     const [uploading, setUploading] = useState(false);
// // // //     const avatarUrl = url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`;

// // // //     const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
// // // //         if (!user || !isEditing || !event.target.files || !event.target.files.length === 0) return;
// // // //         const file = event.target.files[0];
// // // //         setUploading(true);
// // // //         toast.loading('Uploading avatar...');
// // // //         try {
// // // //             const newUrl = await uploadToCloudinary(file);
// // // //             onUpload(newUrl);
// // // //             toast.dismiss();
// // // //             toast.success('Avatar updated! Save changes to confirm.');
// // // //         } catch (error: any) {
// // // //             toast.dismiss();
// // // //             toast.error(error.message);
// // // //         } finally {
// // // //             setUploading(false);
// // // //         }
// // // //     };
// // // //     return (<div className="flex flex-col items-center space-y-4"><img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-md" />{isEditing && <div><label htmlFor="single" className="cursor-pointer bg-white/50 backdrop-blur-lg border border-white/20 text-text-secondary px-4 py-2 rounded-lg hover:bg-white/80 transition-colors text-sm">{uploading ? t('profile.uploadingButton') : t('profile.uploadButton')}</label><input type="file" id="single" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" /></div>}</div>);
// // // // };

// // // // const ProfileView = ({ profile, onEditClick }: { profile: ProfileFormInputs; onEditClick: () => void; }) => {
// // // //     const { t } = useTranslation();
// // // //     return (<div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"><div><p className="text-sm font-medium text-text-secondary">{t('profile.englishNameLabel')}</p><p className="text-lg text-text-primary">{profile.english_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.chineseNameLabel')}</p><p className="text-lg text-text-primary">{profile.chinese_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.departmentLabel')}</p><p className="text-lg text-text-primary">{profile.department || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.nationalityLabel')}</p><p className="text-lg text-text-primary">{profile.nationality || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.birthYearLabel')}</p><p className="text-lg text-text-primary">{profile.birth_year || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.genderLabel')}</p><p className="text-lg text-text-primary capitalize">{profile.gender?.replace('_', ' ') || '-'}</p></div><div className="md:col-span-2"><p className="text-sm font-medium text-text-secondary">{t('profile.studentIdLabel')}</p><p className="text-lg text-text-primary">{profile.student_id || '-'}</p></div></div><div className="pt-4 text-right"><button onClick={onEditClick} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover">{t('profile.editButton')}</button></div></div>);
// // // // };

// // // // const ProfileForm = ({ profile, onCancel, onSaveSuccess }: { profile: ProfileFormInputs | null; onCancel: () => void; onSaveSuccess: () => void; }) => {
// // // //     const { user } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient();
// // // //     const [avatarUrlToSave, setAvatarUrlToSave] = useState(profile?.avatar_url || null);

// // // //     const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormInputs>({ defaultValues: profile || {}, resolver: zodResolver(ProfileSchema) });

// // // //     const handleUpdateProfile: SubmitHandler<ProfileFormInputs> = async (formData) => {
// // // //         try {
// // // //             const dataToSave = { ...formData, user_id: user!.id, avatar_url: avatarUrlToSave, birth_year: formData.birth_year || null };
// // // //             const { error } = await supabase.from('profiles').upsert(dataToSave);
// // // //             if (error) throw error;
// // // //             toast.success(t('profile.updateSuccess'));
// // // //             await queryClient.invalidateQueries({ queryKey: ['profile', user!.id] });
// // // //             await queryClient.invalidateQueries({ queryKey: ['layout_profile', user!.id] });
// // // //             onSaveSuccess();
// // // //         } catch (error: any) {
// // // //             toast.error(`${t('profile.updateError')}: ${error.message}`);
// // // //         }
// // // //     };

// // // //     return (
// // // //         <div className="space-y-6">
// // // //             <Avatar url={avatarUrlToSave} onUpload={(url) => setAvatarUrlToSave(url)} isEditing={true} />
// // // //             <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4">
// // // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.englishNameLabel')}</label><input {...register('english_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div><div><label className="text-sm font-medium">{t('profile.chineseNameLabel')}</label><input {...register('chinese_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div></div>
// // // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.birthYearLabel')}</label><input type="number" placeholder={String(currentYear - 20)} {...register('birth_year')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.birth_year && <p className="mt-1 text-sm text-system-danger">{errors.birth_year.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.genderLabel')}</label><select {...register('gender')} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white"><option value="">{t('profile.selectGender')}</option><option value="male">{t('profile.genderMale')}</option><option value="female">{t('profile.genderFemale')}</option><option value="rather_not_say">{t('profile.genderRatherNotSay')}</option></select></div></div>
// // // //                 <div><label className="text-sm font-medium">{t('profile.departmentLabel')}</label><input {...register('department')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.department && <p className="mt-1 text-sm text-system-danger">{errors.department.message}</p>}</div>
// // // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.nationalityLabel')}</label><input {...register('nationality')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.nationality && <p className="mt-1 text-sm text-system-danger">{errors.nationality.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.studentIdLabel')}</label><input {...register('student_id')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.student_id && <p className="mt-1 text-sm text-system-danger">{errors.student_id.message}</p>}</div></div>
// // // //                 <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">{t('profile.cancelButton')}</button><button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isSubmitting ? t('profile.savingButton') : t('profile.saveButton')}</button></div>
// // // //             </form>
// // // //         </div>
// // // //     );
// // // // };

// // // // const MyEventsList = ({ userId }: { userId: string }) => {
// // // //     const { t, language } = useTranslation(); const PAGE_SIZE = 3; const queryClient = useQueryClient();
// // // //     const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({ queryKey: ['my_registrations', userId], queryFn: async ({ pageParam = 0 }) => { const from = pageParam * PAGE_SIZE; const to = from + PAGE_SIZE - 1; const { data, error } = await supabase.from('event_registrations').select('id, status, created_at, events(slug, title_en, title_zh_hant)').eq('user_id', userId).order('created_at', { ascending: false }).range(from, to); if (error) throw error; return data; }, initialPageParam: 0, getNextPageParam: (lastPage, allPages) => { return lastPage.length === PAGE_SIZE ? allPages.length : undefined; }, });
// // // //     const registrations = data?.pages.flatMap(page => page) ?? [];
// // // //     const handleShowLess = () => { queryClient.setQueryData(['my_registrations', userId], (data: any) => ({ pages: data.pages.slice(0, 1), pageParams: data.pageParams.slice(0, 1), })); };
// // // //     const statusClasses = { pending: 'bg-yellow-100 text-yellow-800', accepted: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', };
// // // //     if (isLoading) return <p>Loading event history...</p>;
// // // //     if (registrations.length === 0) return <p className="text-text-secondary">{t('profile.events.noRegistrations')}</p>;
// // // //     return (<div className="overflow-x-auto"><table className="min-w-full"><thead><tr><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.title')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.registrationDate')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.status')}</th></tr></thead><tbody>{registrations.map(reg => { const title = language === 'zh-HANT' && reg.events?.title_zh_hant ? reg.events.title_zh_hant : reg.events?.title_en; return (<tr key={reg.id} className="border-t border-white/20"><td className="p-4 font-medium text-text-primary"><Link to={`/events/${reg.events?.slug}`} className="hover:underline">{title}</Link></td><td className="p-4 text-text-secondary">{new Date(reg.created_at).toLocaleDateString()}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[reg.status]}`}>{t(`profile.events.${reg.status}`)}</span></td></tr>) })}</tbody></table><div className="mt-6 flex justify-center gap-4">{hasNextPage && (<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isFetchingNextPage ? 'Loading...' : 'Show More'}</button>)} {(data?.pages.length ?? 0) > 1 && (<button onClick={handleShowLess} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">Show Less</button>)}</div></div>);
// // // // };

// // // // export const ProfilePage = () => {
// // // //     const { user, profile: currentUserProfile } = useAuth();
// // // //     const { t } = useTranslation();
// // // //     const navigate = useNavigate();
// // // //     const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
// // // //     const [isEditingProfile, setIsEditingProfile] = useState(false);

// // // //     const { data: profile, isLoading } = useQuery({
// // // //         queryKey: ['profile', user?.id],
// // // //         queryFn: async (): Promise<ProfileFormInputs | null> => {
// // // //             if (!user) return null;
// // // //             const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
// // // //             if (error && error.code !== 'PGRST116') throw error;
// // // //             if (!data) {
// // // //                 setIsEditingProfile(true);
// // // //             }
// // // //             return data;
// // // //         },
// // // //         enabled: !!user,
// // // //     });

// // // //     const demoteMutation = useMutation({ mutationFn: async () => { const { error } = await supabase.functions.invoke('demote-self'); if (error) throw new Error(error.message); }, onSuccess: () => { toast.success(t('profile.demote.success')); queryClient.invalidateQueries({ queryKey: ['layout_profile', user?.id] }); navigate('/'); }, onError: (error) => toast.error(error.message), });
// // // //     const handleDemote = () => { if (window.confirm(t('profile.demote.confirm'))) { demoteMutation.mutate(); } };

// // // //     if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div></div>;

// // // //     const isPrivilegedUser = currentUserProfile?.roles?.name === 'admin' || currentUserProfile?.roles?.name === 'developer' || currentUserProfile?.roles?.name === 'organizer';

// // // //     return (
// // // //         <div className="relative min-h-screen pt-24 pb-12 p-4">
// // // //             <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
// // // //             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
// // // //                 <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
// // // //                 <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8"><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setActiveTab('events')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>

// // // //                 {activeTab === 'details' && (
// // // //                     <>
// // // //                         {isEditingProfile ? (
// // // //                             <ProfileForm profile={profile} onCancel={() => { if (profile) setIsEditingProfile(false) }} onSaveSuccess={() => setIsEditingProfile(false)} />
// // // //                         ) : (
// // // //                             profile &&
// // // //                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// // // //                                 <div className="md:col-span-1"><Avatar url={profile.avatar_url} onUpload={() => { }} isEditing={false} /></div>
// // // //                                 <div className="md:col-span-2"><ProfileView profile={profile} onEditClick={() => setIsEditingProfile(true)} /></div>
// // // //                             </div>
// // // //                         )}
// // // //                         {isPrivilegedUser && !isEditingProfile && profile && (
// // // //                             <div className="mt-8 pt-6 border-t border-red-500/30">
// // // //                                 <h3 className="text-xl font-bold text-system-danger">{t('profile.demote.title')}</h3><p className="text-text-secondary text-sm mt-2">{t('profile.demote.description')}</p>
// // // //                                 <button onClick={handleDemote} disabled={demoteMutation.isPending} className="mt-4 px-4 py-2 border border-system-danger text-system-danger font-semibold rounded-lg hover:bg-system-danger hover:text-white transition-colors disabled:opacity-50">{demoteMutation.isPending ? 'Processing...' : t('profile.demote.button')}</button>
// // // //                             </div>
// // // //                         )}
// // // //                     </>
// // // //                 )}
// // // //                 {activeTab === 'events' && user && (<MyEventsList userId={user.id} />)}
// // // //             </motion.div>
// // // //         </div>
// // // //     );
// // // // };

// // // import { useForm, type SubmitHandler } from 'react-hook-form';
// // // import { zodResolver } from '@hookform/resolvers/zod';
// // // import { z } from 'zod';
// // // import { useEffect, useState } from 'react';
// // // import { useAuth, supabase } from '../contexts/AuthContext';
// // // import toast from 'react-hot-toast';
// // // import { useTranslation } from '../contexts/LanguageContext';
// // // import { motion } from 'framer-motion';
// // // import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
// // // import { Link, useNavigate } from 'react-router-dom';

// // // const currentYear = new Date().getFullYear();
// // // const ProfileSchema = z.object({
// // //     english_name: z.string().optional(),
// // //     chinese_name: z.string().optional(),
// // //     department: z.string().min(1, 'Department is required'),
// // //     nationality: z.string().min(1, 'Nationality is required'),
// // //     student_id: z.string().min(1, 'Student ID is required'),
// // //     avatar_url: z.string().nullable(),
// // //     birth_year: z.coerce.number().min(1920, 'Invalid year').max(currentYear, 'Invalid year').optional().nullable(),
// // //     gender: z.enum(['male', 'female', 'rather_not_say']).optional().nullable(),
// // // });
// // // type ProfileFormInputs = z.infer<typeof ProfileSchema>;

// // // const uploadToCloudinary = async (file: File): Promise<string> => {
// // //     const formData = new FormData();
// // //     formData.append('file', file);
// // //     formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
// // //     const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
// // //     const data = await response.json();
// // //     if (!response.ok) throw new Error(data.error.message || 'Image upload to Cloudinary failed');
// // //     return data.secure_url;
// // // };

// // // const Avatar = ({ url, onUpload, isEditing }: { url: string | null; onUpload: (newUrl: string) => void; isEditing: boolean; }) => {
// // //     const { user } = useAuth(); const { t } = useTranslation();
// // //     const [uploading, setUploading] = useState(false);
// // //     const avatarUrl = url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`;

// // //     const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
// // //         if (!user || !isEditing || !event.target.files || event.target.files.length === 0) return;
// // //         const file = event.target.files[0];
// // //         setUploading(true);
// // //         toast.loading('Uploading avatar...');
// // //         try {
// // //             const newUrl = await uploadToCloudinary(file);
// // //             onUpload(newUrl);
// // //             toast.dismiss();
// // //             toast.success('Avatar updated! Save changes to confirm.');
// // //         } catch (error: any) {
// // //             toast.dismiss();
// // //             toast.error(error.message);
// // //         } finally {
// // //             setUploading(false);
// // //         }
// // //     };
// // //     return (<div className="flex flex-col items-center space-y-4"><img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-md" />{isEditing && <div><label htmlFor="single" className="cursor-pointer bg-white/50 backdrop-blur-lg border border-white/20 text-text-secondary px-4 py-2 rounded-lg hover:bg-white/80 transition-colors text-sm">{uploading ? t('profile.uploadingButton') : t('profile.uploadButton')}</label><input type="file" id="single" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" /></div>}</div>);
// // // };

// // // const ProfileView = ({ profile, onEditClick }: { profile: ProfileFormInputs; onEditClick: () => void; }) => {
// // //     const { t } = useTranslation();
// // //     return (<div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"><div><p className="text-sm font-medium text-text-secondary">{t('profile.englishNameLabel')}</p><p className="text-lg text-text-primary">{profile.english_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.chineseNameLabel')}</p><p className="text-lg text-text-primary">{profile.chinese_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.departmentLabel')}</p><p className="text-lg text-text-primary">{profile.department || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.nationalityLabel')}</p><p className="text-lg text-text-primary">{profile.nationality || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.birthYearLabel')}</p><p className="text-lg text-text-primary">{profile.birth_year || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.genderLabel')}</p><p className="text-lg text-text-primary capitalize">{profile.gender?.replace('_', ' ') || '-'}</p></div><div className="md:col-span-2"><p className="text-sm font-medium text-text-secondary">{t('profile.studentIdLabel')}</p><p className="text-lg text-text-primary">{profile.student_id || '-'}</p></div></div><div className="pt-4 text-right"><button onClick={onEditClick} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover">{t('profile.editButton')}</button></div></div>);
// // // };

// // // const ProfileForm = ({ profile, onCancel, onSaveSuccess }: { profile: ProfileFormInputs | null; onCancel: () => void; onSaveSuccess: () => void; }) => {
// // //     const { user } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient();
// // //     const [avatarUrlToSave, setAvatarUrlToSave] = useState(profile?.avatar_url || null);
// // //     const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormInputs>({ defaultValues: profile || {}, resolver: zodResolver(ProfileSchema) });
// // //     const handleUpdateProfile: SubmitHandler<ProfileFormInputs> = async (formData) => {
// // //         try { const dataToSave = { ...formData, user_id: user!.id, avatar_url: avatarUrlToSave, birth_year: formData.birth_year || null }; const { error } = await supabase.from('profiles').upsert(dataToSave); if (error) throw error; toast.success(t('profile.updateSuccess')); await queryClient.invalidateQueries({ queryKey: ['profile', user!.id] }); await queryClient.invalidateQueries({ queryKey: ['layout_profile', user!.id] }); onSaveSuccess(); } catch (error: any) { toast.error(`${t('profile.updateError')}: ${error.message}`); }
// // //     };
// // //     return (<div className="space-y-6"><Avatar url={avatarUrlToSave} onUpload={(url) => setAvatarUrlToSave(url)} isEditing={true} /><form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.englishNameLabel')}</label><input {...register('english_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div><div><label className="text-sm font-medium">{t('profile.chineseNameLabel')}</label><input {...register('chinese_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.birthYearLabel')}</label><input type="number" placeholder={String(currentYear - 20)} {...register('birth_year')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.birth_year && <p className="mt-1 text-sm text-system-danger">{errors.birth_year.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.genderLabel')}</label><select {...register('gender')} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white"><option value="">{t('profile.selectGender')}</option><option value="male">{t('profile.genderMale')}</option><option value="female">{t('profile.genderFemale')}</option><option value="rather_not_say">{t('profile.genderRatherNotSay')}</option></select></div></div><div><label className="text-sm font-medium">{t('profile.departmentLabel')}</label><input {...register('department')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.department && <p className="mt-1 text-sm text-system-danger">{errors.department.message}</p>}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.nationalityLabel')}</label><input {...register('nationality')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.nationality && <p className="mt-1 text-sm text-system-danger">{errors.nationality.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.studentIdLabel')}</label><input {...register('student_id')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.student_id && <p className="mt-1 text-sm text-system-danger">{errors.student_id.message}</p>}</div></div><div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">{t('profile.cancelButton')}</button><button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isSubmitting ? t('profile.savingButton') : t('profile.saveButton')}</button></div></form></div>);
// // // };

// // // const MyEventsList = ({ userId }: { userId: string }) => {
// // //     const { t, language } = useTranslation(); const PAGE_SIZE = 3; const queryClient = useQueryClient();
// // //     const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({ queryKey: ['my_registrations', userId], queryFn: async ({ pageParam = 0 }) => { const from = pageParam * PAGE_SIZE; const to = from + PAGE_SIZE - 1; const { data, error } = await supabase.from('event_registrations').select('id, status, created_at, events(slug, title_en, title_zh_hant)').eq('user_id', userId).order('created_at', { ascending: false }).range(from, to); if (error) throw error; return data; }, initialPageParam: 0, getNextPageParam: (lastPage, allPages) => { return lastPage.length === PAGE_SIZE ? allPages.length : undefined; }, });
// // //     const registrations = data?.pages.flatMap(page => page) ?? [];
// // //     const handleShowLess = () => { queryClient.setQueryData(['my_registrations', userId], (data: any) => ({ pages: data.pages.slice(0, 1), pageParams: data.pageParams.slice(0, 1), })); };
// // //     const statusClasses = { pending: 'bg-yellow-100 text-yellow-800', accepted: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', };
// // //     if (isLoading) return <p>Loading event history...</p>;
// // //     if (registrations.length === 0) return <p className="text-text-secondary">{t('profile.events.noRegistrations')}</p>;
// // //     return (<div className="overflow-x-auto"><table className="min-w-full"><thead><tr><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.title')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.registrationDate')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.status')}</th></tr></thead><tbody>{registrations.map(reg => { const title = language === 'zh-HANT' && reg.events?.title_zh_hant ? reg.events.title_zh_hant : reg.events?.title_en; return (<tr key={reg.id} className="border-t border-white/20"><td className="p-4 font-medium text-text-primary"><Link to={`/events/${reg.events?.slug}`} className="hover:underline">{title}</Link></td><td className="p-4 text-text-secondary">{new Date(reg.created_at).toLocaleDateString()}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[reg.status]}`}>{t(`profile.events.${reg.status}`)}</span></td></tr>) })}</tbody></table><div className="mt-6 flex justify-center gap-4">{hasNextPage && (<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isFetchingNextPage ? 'Loading...' : 'Show More'}</button>)} {(data?.pages.length ?? 0) > 1 && (<button onClick={handleShowLess} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">Show Less</button>)}</div></div>);
// // // };

// // // export const ProfilePage = () => {
// // //     const { user, profile: currentUserProfile } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient(); const navigate = useNavigate();
// // //     const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
// // //     const [isEditingProfile, setIsEditingProfile] = useState(false);

// // //     const { data: profile, isLoading } = useQuery({
// // //         queryKey: ['profile', user?.id],
// // //         queryFn: async (): Promise<ProfileFormInputs | null> => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') throw error; if (!data) { setIsEditingProfile(true); } return data; },
// // //         enabled: !!user,
// // //     });

// // //     const demoteMutation = useMutation({ mutationFn: async () => { const { error } = await supabase.functions.invoke('demote-self'); if (error) throw new Error(error.message); }, onSuccess: () => { toast.success(t('profile.demote.success')); queryClient.invalidateQueries({ queryKey: ['layout_profile', user?.id] }); navigate('/'); }, onError: (error) => toast.error(error.message), });
// // //     const handleDemote = () => { if (window.confirm(t('profile.demote.confirm'))) { demoteMutation.mutate(); } };

// // //     if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div></div>;

// // //     const isPrivilegedUser = currentUserProfile?.roles?.name === 'admin' || currentUserProfile?.roles?.name === 'developer' || currentUserProfile?.roles?.name === 'organizer';

// // //     return (
// // //         <div className="relative min-h-screen pt-24 pb-12 p-4">
// // //             <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
// // //             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
// // //                 <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
// // //                 <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setActiveTab('events')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>

// // //                 {activeTab === 'details' && (
// // //                     <>
// // //                         {isEditingProfile ? (
// // //                             <ProfileForm profile={profile} onCancel={() => { if (profile) setIsEditingProfile(false) }} onSaveSuccess={() => setIsEditingProfile(false)} />
// // //                         ) : (
// // //                             profile &&
// // //                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// // //                                 <div className="md:col-span-1"><Avatar url={profile.avatar_url} onUpload={() => { }} isEditing={false} /></div>
// // //                                 <div className="md:col-span-2"><ProfileView profile={profile} onEditClick={() => setIsEditingProfile(true)} /></div>
// // //                             </div>
// // //                         )}
// // //                         {isPrivilegedUser && !isEditingProfile && profile && (
// // //                             <div className="mt-8 pt-6 border-t border-red-500/30">
// // //                                 <h3 className="text-xl font-bold text-system-danger">{t('profile.demote.title')}</h3><p className="text-text-secondary text-sm mt-2">{t('profile.demote.description')}</p>
// // //                                 <button onClick={handleDemote} disabled={demoteMutation.isPending} className="mt-4 px-4 py-2 border border-system-danger text-system-danger font-semibold rounded-lg hover:bg-system-danger hover:text-white transition-colors disabled:opacity-50">{demoteMutation.isPending ? 'Processing...' : t('profile.demote.button')}</button>
// // //                             </div>
// // //                         )}
// // //                     </>
// // //                 )}
// // //                 {activeTab === 'events' && user && (<MyEventsList userId={user.id} />)}
// // //             </motion.div>
// // //         </div>
// // //     );
// // // };

// // import { useForm, type SubmitHandler } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { z } from 'zod';
// // import { useEffect, useState } from 'react';
// // import { useAuth, supabase } from '../contexts/AuthContext';
// // import toast from 'react-hot-toast';
// // import { useTranslation } from '../contexts/LanguageContext';
// // import { motion } from 'framer-motion';
// // import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
// // import { Link, useNavigate } from 'react-router-dom';
// // import clsx from 'clsx';

// // const currentYear = new Date().getFullYear();
// // const ProfileSchema = z.object({
// //     english_name: z.string().min(1, 'English name is required'),
// //     chinese_name: z.string().optional(),
// //     department: z.string().min(1, 'Department is required'),
// //     nationality: z.string().min(1, 'Nationality is required'),
// //     student_id: z.string().min(1, 'Student ID is required'),
// //     avatar_url: z.string().nullable(),
// //     birth_year: z.coerce.number().min(1920, 'Invalid year').max(currentYear, 'Invalid year').optional().nullable(),
// //     gender: z.enum(['male', 'female', 'rather_not_say']).optional().nullable(),
// // });
// // type ProfileFormInputs = z.infer<typeof ProfileSchema>;

// // const uploadToCloudinary = async (file: File): Promise<string> => {
// //     const formData = new FormData();
// //     formData.append('file', file);
// //     formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
// //     const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
// //     const data = await response.json();
// //     if (!response.ok) throw new Error(data.error.message || 'Image upload failed');
// //     return data.secure_url;
// // };

// // const AvatarDisplay = ({ url, isEditing, onFileSelect }: { url: string | null; isEditing: boolean; onFileSelect: (file: File) => void; }) => {
// //     const { user } = useAuth(); const { t } = useTranslation();
// //     const avatarUrl = url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`;

// //     return (
// //         <div className="flex flex-col items-center space-y-4">
// //             <img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-md" />
// //             {isEditing && <div><label htmlFor="avatar-upload" className="cursor-pointer bg-white/50 backdrop-blur-lg border border-white/20 text-text-secondary px-4 py-2 rounded-lg hover:bg-white/80 transition-colors text-sm">{t('profile.uploadButton')}</label><input type="file" id="avatar-upload" accept="image/*" onChange={(e) => e.target.files && onFileSelect(e.target.files[0])} className="hidden" /></div>}
// //         </div>
// //     );
// // };

// // const ProfileView = ({ profile, onEditClick }: { profile: ProfileFormInputs; onEditClick: () => void; }) => {
// //     const { t } = useTranslation();
// //     return (<div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"><div><p className="text-sm font-medium text-text-secondary">{t('profile.englishNameLabel')}</p><p className="text-lg text-text-primary">{profile.english_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.chineseNameLabel')}</p><p className="text-lg text-text-primary">{profile.chinese_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.departmentLabel')}</p><p className="text-lg text-text-primary">{profile.department || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.nationalityLabel')}</p><p className="text-lg text-text-primary">{profile.nationality || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.birthYearLabel')}</p><p className="text-lg text-text-primary">{profile.birth_year || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.genderLabel')}</p><p className="text-lg text-text-primary capitalize">{profile.gender?.replace('_', ' ') || '-'}</p></div><div className="md:col-span-2"><p className="text-sm font-medium text-text-secondary">{t('profile.studentIdLabel')}</p><p className="text-lg text-text-primary">{profile.student_id || '-'}</p></div></div><div className="pt-4 text-right"><button onClick={onEditClick} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover">{t('profile.editButton')}</button></div></div>);
// // };

// // const ProfileForm = ({ profile, onCancel, onSaveSuccess }: { profile: ProfileFormInputs | null; onCancel: () => void; onSaveSuccess: () => void; }) => {
// //     const { user } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient();
// //     const [avatarFile, setAvatarFile] = useState<File | null>(null);
// //     const [isUploading, setIsUploading] = useState(false);
// //     const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormInputs>({ defaultValues: profile || {}, resolver: zodResolver(ProfileSchema) });

// //     const handleUpdateProfile: SubmitHandler<ProfileFormInputs> = async (formData) => {
// //         let avatarUrl = profile?.avatar_url;
// //         if (avatarFile) {
// //             setIsUploading(true);
// //             toast.loading('Uploading avatar...');
// //             try {
// //                 avatarUrl = await uploadToCloudinary(avatarFile);
// //             } catch (error: any) {
// //                 toast.dismiss(); toast.error(error.message); setIsUploading(false); return;
// //             }
// //             toast.dismiss();
// //         }
// //         try {
// //             const dataToSave = { ...formData, user_id: user!.id, avatar_url: avatarUrl, birth_year: formData.birth_year || null };
// //             const { error } = await supabase.from('profiles').upsert(dataToSave);
// //             if (error) throw error;
// //             toast.success(t('profile.updateSuccess'));
// //             await queryClient.invalidateQueries({ queryKey: ['profile', user!.id] });
// //             await queryClient.invalidateQueries({ queryKey: ['layout_profile', user!.id] });
// //             onSaveSuccess();
// //         } catch (error: any) { toast.error(`${t('profile.updateError')}: ${error.message}`); }
// //         finally { setIsUploading(false); }
// //     };
// //     return (
// //         <div className="space-y-6">
// //             <AvatarDisplay url={profile?.avatar_url ?? null} isEditing={true} onFileSelect={setAvatarFile} />
// //             <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4">
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.englishNameLabel')}</label><input {...register('english_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.english_name && <p className="mt-1 text-sm text-system-danger">{errors.english_name.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.chineseNameLabel')}</label><input {...register('chinese_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div></div>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.birthYearLabel')}</label><input type="number" placeholder={String(currentYear - 20)} {...register('birth_year')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.birth_year && <p className="mt-1 text-sm text-system-danger">{errors.birth_year.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.genderLabel')}</label><select {...register('gender')} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white"><option value="">{t('profile.selectGender')}</option><option value="male">{t('profile.genderMale')}</option><option value="female">{t('profile.genderFemale')}</option><option value="rather_not_say">{t('profile.genderRatherNotSay')}</option></select></div></div>
// //                 <div><label className="text-sm font-medium">{t('profile.departmentLabel')}</label><input {...register('department')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.department && <p className="mt-1 text-sm text-system-danger">{errors.department.message}</p>}</div>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.nationalityLabel')}</label><input {...register('nationality')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.nationality && <p className="mt-1 text-sm text-system-danger">{errors.nationality.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.studentIdLabel')}</label><input {...register('student_id')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.student_id && <p className="mt-1 text-sm text-system-danger">{errors.student_id.message}</p>}</div></div>
// //                 <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">{t('profile.cancelButton')}</button><button type="submit" disabled={isSubmitting || isUploading} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isSubmitting || isUploading ? t('profile.savingButton') : t('profile.saveButton')}</button></div>
// //             </form>
// //         </div>
// //     );
// // };
// // const MyEventsList = ({ userId }: { userId: string }) => { /* ... */ };

// // export const ProfilePage = () => {
// //     const { user, profile: currentUserProfile } = useAuth();
// //     const { t } = useTranslation();
// //     const navigate = useNavigate();
// //     const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
// //     const [isEditingProfile, setIsEditingProfile] = useState(false);

// //     const { data: profile, isLoading, isError } = useQuery({
// //         queryKey: ['profile', user?.id],
// //         queryFn: async (): Promise<ProfileFormInputs | null> => {
// //             if (!user) return null;
// //             const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
// //             if (error && error.code !== 'PGRST116') throw error;
// //             return data;
// //         },
// //         enabled: !!user,
// //     });

// //     useEffect(() => {
// //         if (!isLoading && !profile) {
// //             setIsEditingProfile(true);
// //         }
// //     }, [isLoading, profile]);

// //     const demoteMutation = useMutation({ mutationFn: async () => { /* ... */ }, onSuccess: () => { /* ... */ }, onError: (error) => toast.error(error.message), });
// //     const handleDemote = () => { if (window.confirm(t('profile.demote.confirm'))) { demoteMutation.mutate(); } };

// //     if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div></div>;
// //     if (isError) return <div className="text-center py-40">Could not load profile. Please try again.</div>;

// //     const isPrivilegedUser = currentUserProfile?.roles?.name === 'admin' || currentUserProfile?.roles?.name === 'developer' || currentUserProfile?.roles?.name === 'organizer';

// //     return (
// //         <div className="relative min-h-screen pt-24 pb-12 p-4">
// //             <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
// //             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
// //                 <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
// //                 <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setActiveTab('events')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>

// //                 {activeTab === 'details' && (
// //                     <>
// //                         {isEditingProfile ? (
// //                             <ProfileForm profile={profile} onCancel={() => { if (profile) setIsEditingProfile(false) }} onSaveSuccess={() => setIsEditingProfile(false)} />
// //                         ) : (
// //                             profile &&
// //                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //                                 <div className="md:col-span-1"><AvatarDisplay url={profile.avatar_url} isEditing={false} onFileSelect={() => { }} /></div>
// //                                 <div className="md:col-span-2"><ProfileView profile={profile} onEditClick={() => setIsEditingProfile(true)} /></div>
// //                             </div>
// //                         )}
// //                         {isPrivilegedUser && !isEditingProfile && profile && (
// //                             <div className="mt-8 pt-6 border-t border-red-500/30">
// //                                 <h3 className="text-xl font-bold text-system-danger">{t('profile.demote.title')}</h3><p className="text-text-secondary text-sm mt-2">{t('profile.demote.description')}</p>
// //                                 <button onClick={handleDemote} disabled={demoteMutation.isPending} className="mt-4 px-4 py-2 border border-system-danger text-system-danger font-semibold rounded-lg hover:bg-system-danger hover:text-white transition-colors disabled:opacity-50">{demoteMutation.isPending ? 'Processing...' : t('profile.demote.button')}</button>
// //                             </div>
// //                         )}
// //                     </>
// //                 )}
// //                 {activeTab === 'events' && user && (<MyEventsList userId={user.id} />)}
// //             </motion.div>
// //         </div>
// //     );
// // };
// import { useForm, type SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useEffect, useState } from 'react';
// import { useAuth, supabase } from '../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import { useTranslation } from '../contexts/LanguageContext';
// import { motion } from 'framer-motion';
// import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
// import { Link, useNavigate } from 'react-router-dom';

// const currentYear = new Date().getFullYear();
// const ProfileSchema = z.object({ english_name: z.string().optional(), chinese_name: z.string().optional(), department: z.string().min(1, 'Department is required'), nationality: z.string().min(1, 'Nationality is required'), student_id: z.string().min(1, 'Student ID is required'), avatar_url: z.string().nullable(), birth_year: z.coerce.number().min(1920, 'Invalid year').max(currentYear, 'Invalid year').optional().nullable(), gender: z.enum(['male', 'female', 'rather_not_say']).optional().nullable(), });
// type ProfileFormInputs = z.infer<typeof ProfileSchema>;

// const uploadToCloudinary = async (file: File): Promise<string> => { const formData = new FormData(); formData.append('file', file); formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData }); const data = await response.json(); if (!response.ok) throw new Error(data.error.message || 'Image upload failed'); return data.secure_url; };
// const Avatar = ({ url, onUpload, isEditing }: { url: string | null; onUpload: (newUrl: string) => void; isEditing: boolean; }) => { /* ... */ };
// const ProfileView = ({ profile, onEditClick }: { profile: ProfileFormInputs; onEditClick: () => void; }) => { /* ... */ };
// const ProfileForm = ({ profile, onCancel, onSaveSuccess }: { profile: ProfileFormInputs | null; onCancel: () => void; onSaveSuccess: () => void; }) => { /* ... */ };

// const MyEventsList = ({ userId }: { userId: string }) => {
//     const { t, language } = useTranslation();
//     const PAGE_SIZE = 3;
//     const queryClient = useQueryClient();

//     const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
//         queryKey: ['my_registrations', userId],
//         queryFn: async ({ pageParam = 0 }) => {
//             const from = pageParam * PAGE_SIZE;
//             const to = from + PAGE_SIZE - 1;
//             const { data, error } = await supabase
//                 .from('registration_details') // Using the reliable VIEW now
//                 .select('*')
//                 .eq('user_id', userId)
//                 .order('created_at', { ascending: false })
//                 .range(from, to);
//             if (error) throw error;
//             return data;
//         },
//         initialPageParam: 0,
//         getNextPageParam: (lastPage, allPages) => {
//             return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
//         },
//     });

//     const registrations = data?.pages.flatMap(page => page) ?? [];
//     const handleShowLess = () => { queryClient.setQueryData(['my_registrations', userId], (data: any) => ({ pages: data.pages.slice(0, 1), pageParams: data.pageParams.slice(0, 1), })); };
//     const statusClasses = { pending: 'bg-yellow-100 text-yellow-800', accepted: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', };

//     if (isLoading) return <p>Loading event history...</p>;
//     if (registrations.length === 0) return <p className="text-text-secondary">{t('profile.events.noRegistrations')}</p>;

//     return (
//         <div className="overflow-x-auto">
//             <table className="min-w-full">
//                 <thead><tr><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.title')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.registrationDate')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.status')}</th></tr></thead>
//                 <tbody>
//                     {registrations.map(reg => {
//                         const title = language === 'zh-HANT' && reg.title_zh_hant ? reg.title_zh_hant : reg.title_en;
//                         return (<tr key={reg.id} className="border-t border-white/20"><td className="p-4 font-medium text-text-primary"><Link to={`/events/${reg.slug}`} className="hover:underline">{title}</Link></td><td className="p-4 text-text-secondary">{new Date(reg.created_at).toLocaleDateString()}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[reg.status]}`}>{t(`profile.events.${reg.status}`)}</span></td></tr>)
//                     })}
//                 </tbody>
//             </table>
//             <div className="mt-6 flex justify-center gap-4">
//                 {hasNextPage && (<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isFetchingNextPage ? 'Loading...' : 'Show More'}</button>)}
//                 {(data?.pages.length ?? 0) > 1 && (<button onClick={handleShowLess} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">Show Less</button>)}
//             </div>
//         </div>
//     );
// };

// export const ProfilePage = () => {
//     const { user, profile: currentUserProfile } = useAuth(); const { t } = useTranslation(); const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
//     const [isEditingProfile, setIsEditingProfile] = useState(false);

//     const { data: profile, isLoading } = useQuery({
//         queryKey: ['profile', user?.id],
//         queryFn: async (): Promise<ProfileFormInputs | null> => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') throw error; if (!data) { setIsEditingProfile(true); } return data; },
//         enabled: !!user,
//     });

//     const demoteMutation = useMutation({ mutationFn: async () => { const { error } = await supabase.functions.invoke('demote-self'); if (error) throw new Error(error.message); }, onSuccess: () => { toast.success(t('profile.demote.success')); queryClient.invalidateQueries({ queryKey: ['layout_profile', user?.id] }); navigate('/'); }, onError: (error) => toast.error(error.message), });
//     const handleDemote = () => { if (window.confirm(t('profile.demote.confirm'))) { demoteMutation.mutate(); } };

//     if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div></div>;
//     if (!profile && !isEditingProfile) return <div className="text-center py-40">Could not load profile. Please try again later.</div>;

//     const isPrivilegedUser = currentUserProfile?.roles?.name === 'admin' || currentUserProfile?.roles?.name === 'developer' || currentUserProfile?.roles?.name === 'organizer';

//     return (
//         <div className="relative min-h-screen pt-24 pb-12 p-4">
//             <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
//             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
//                 <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
//                 <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setActiveTab('events')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>

//                 {activeTab === 'details' && (
//                     <>
//                         {isEditingProfile ? (
//                             <ProfileForm profile={profile} onCancel={() => { if (profile) setIsEditingProfile(false) }} onSaveSuccess={() => setIsEditingProfile(false)} />
//                         ) : (
//                             profile &&
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                                 <div className="md:col-span-1"><Avatar url={profile.avatar_url} isEditing={false} onUpload={() => { }} /></div>
//                                 <div className="md:col-span-2"><ProfileView profile={profile} onEditClick={() => setIsEditingProfile(true)} /></div>
//                             </div>
//                         )}
//                         {isPrivilegedUser && !isEditingProfile && profile && (
//                             <div className="mt-8 pt-6 border-t border-red-500/30">
//                                 <h3 className="text-xl font-bold text-system-danger">{t('profile.demote.title')}</h3><p className="text-text-secondary text-sm mt-2">{t('profile.demote.description')}</p>
//                                 <button onClick={handleDemote} disabled={demoteMutation.isPending} className="mt-4 px-4 py-2 border border-system-danger text-system-danger font-semibold rounded-lg hover:bg-system-danger hover:text-white transition-colors disabled:opacity-50">{demoteMutation.isPending ? 'Processing...' : t('profile.demote.button')}</button>
//                             </div>
//                         )}
//                     </>
//                 )}
//                 {activeTab === 'events' && user && (<MyEventsList userId={user.id} />)}
//             </motion.div>
//         </div>
//     );
// };

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useAuth, supabase } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useTranslation } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { CmsActionButton } from '../components/cms/CmsActionButton';

const currentYear = new Date().getFullYear();
const ProfileSchema = z.object({
    english_name: z.string().min(1, 'English name is required'),
    chinese_name: z.string().optional(),
    department: z.string().min(1, 'Department is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    student_id: z.string().min(1, 'Student ID is required'),
    avatar_url: z.string().nullable(),
    birth_year: z.coerce.number().min(1920, 'Invalid year').max(currentYear, 'Invalid year').optional().nullable(),
    gender: z.enum(['male', 'female', 'rather_not_say']).optional().nullable(),
});
type ProfileFormInputs = z.infer<typeof ProfileSchema>;

const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message || 'Image upload failed');
    return data.secure_url;
};

const MyEventsList = ({ userId }: { userId: string }) => {
    const { t, language } = useTranslation();
    const PAGE_SIZE = 3;
    const queryClient = useQueryClient();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['my_registrations', userId],
        queryFn: async ({ pageParam = 0 }) => {
            const from = pageParam * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;
            const { data, error } = await supabase.from('registration_details').select('*').eq('user_id', userId).order('created_at', { ascending: false }).range(from, to);
            if (error) throw error;
            return data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
        },
    });
    const registrations = data?.pages.flatMap(page => page) ?? [];
    const handleShowLess = () => { queryClient.setQueryData(['my_registrations', userId], (data: any) => ({ pages: data.pages.slice(0, 1), pageParams: data.pageParams.slice(0, 1), })); };
    const statusClasses = { pending: 'bg-yellow-100 text-yellow-800', accepted: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', };
    if (isLoading) return <p>Loading event history...</p>;
    if (registrations.length === 0) return <p className="text-text-secondary">{t('profile.events.noRegistrations')}</p>;
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead><tr><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.title')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.registrationDate')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.status')}</th></tr></thead>
                <tbody>
                    {registrations.map(reg => {
                        const title = language === 'zh-HANT' && reg.title_zh_hant ? reg.title_zh_hant : reg.title_en;
                        return (<tr key={reg.id} className="border-t border-white/20"><td className="p-4 font-medium text-text-primary"><Link to={`/events/${reg.slug}`} className="hover:underline">{title}</Link></td><td className="p-4 text-text-secondary">{new Date(reg.created_at).toLocaleDateString()}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[reg.status]}`}>{t(`profile.events.${reg.status}`)}</span></td></tr>)
                    })}
                </tbody>
            </table>
            <div className="mt-6 flex justify-center gap-4">
                {hasNextPage && (<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isFetchingNextPage ? 'Loading...' : 'Show More'}</button>)}
                {(data?.pages.length ?? 0) > 1 && (<button onClick={handleShowLess} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">Show Less</button>)}
            </div>
        </div>
    );
};

const ProfileDetails = ({ profileData }: { profileData: ProfileFormInputs | null }) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(!profileData);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty }, reset } = useForm<ProfileFormInputs>({ defaultValues: profileData || {}, resolver: zodResolver(ProfileSchema) });

    useEffect(() => {
        reset(profileData || {});
        if (!profileData) {
            setIsEditing(true);
        }
    }, [profileData, reset]);

    const handleUpdateProfile: SubmitHandler<ProfileFormInputs> = async (formData) => {
        let avatarUrl = profileData?.avatar_url;
        if (avatarFile) {
            setIsUploading(true);
            toast.loading('Uploading avatar...');
            try {
                avatarUrl = await uploadToCloudinary(avatarFile);
            } catch (error: any) {
                toast.dismiss(); toast.error(error.message); setIsUploading(false); return;
            }
            toast.dismiss();
        }
        try {
            const dataToSave = { ...formData, user_id: user!.id, avatar_url: avatarUrl, birth_year: formData.birth_year || null };
            const { error } = await supabase.from('profiles').upsert(dataToSave);
            if (error) throw error;
            toast.success(t('profile.updateSuccess'));
            await queryClient.invalidateQueries({ queryKey: ['profile', user!.id] });
            await queryClient.invalidateQueries({ queryKey: ['layout_profile', user!.id] });
            setIsEditing(false);
        } catch (error: any) { toast.error(`${t('profile.updateError')}: ${error.message}`); }
        finally { setIsUploading(false); }
    };

    const avatarDisplayUrl = profileData?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col items-center space-y-4">
                <img src={avatarDisplayUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-md" />
                {isEditing && <div><label htmlFor="avatar-upload" className="cursor-pointer bg-white/50 backdrop-blur-lg border border-white/20 text-text-secondary px-4 py-2 rounded-lg hover:bg-white/80 transition-colors text-sm">{isUploading ? t('profile.uploadingButton') : t('profile.uploadButton')}</label><input type="file" id="avatar-upload" accept="image/*" onChange={(e) => e.target.files && setAvatarFile(e.target.files[0])} disabled={isUploading} className="hidden" /></div>}
            </div>
            <div className="md:col-span-2">
                <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-sm font-medium">{t('profile.englishNameLabel')}</label><input {...register('english_name')} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white/50 disabled:bg-neutral-100 disabled:opacity-70" />{errors.english_name && <p className="mt-1 text-sm text-system-danger">{errors.english_name.message}</p>}</div>
                        <div><label className="text-sm font-medium">{t('profile.chineseNameLabel')}</label><input {...register('chinese_name')} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white/50 disabled:bg-neutral-100 disabled:opacity-70" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-sm font-medium">{t('profile.birthYearLabel')}</label><input type="number" placeholder={String(currentYear - 20)} {...register('birth_year')} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white/50 disabled:bg-neutral-100 disabled:opacity-70" />{errors.birth_year && <p className="mt-1 text-sm text-system-danger">{errors.birth_year.message}</p>}</div>
                        <div><label className="text-sm font-medium">{t('profile.genderLabel')}</label><select {...register('gender')} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white disabled:bg-neutral-100 disabled:opacity-70"><option value="">{t('profile.selectGender')}</option><option value="male">{t('profile.genderMale')}</option><option value="female">{t('profile.genderFemale')}</option><option value="rather_not_say">{t('profile.genderRatherNotSay')}</option></select></div>
                    </div>
                    <div><label className="text-sm font-medium">{t('profile.departmentLabel')}</label><input {...register('department')} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white/50 disabled:bg-neutral-100 disabled:opacity-70" />{errors.department && <p className="mt-1 text-sm text-system-danger">{errors.department.message}</p>}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-sm font-medium">{t('profile.nationalityLabel')}</label><input {...register('nationality')} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white/50 disabled:bg-neutral-100 disabled:opacity-70" />{errors.nationality && <p className="mt-1 text-sm text-system-danger">{errors.nationality.message}</p>}</div>
                        <div><label className="text-sm font-medium">{t('profile.studentIdLabel')}</label><input {...register('student_id')} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white/50 disabled:bg-neutral-100 disabled:opacity-70" />{errors.student_id && <p className="mt-1 text-sm text-system-danger">{errors.student_id.message}</p>}</div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        {isEditing ? (<> <button type="button" onClick={() => { if (profileData) { setIsEditing(false); reset(profileData); } }} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">{t('profile.cancelButton')}</button> <button type="submit" disabled={isSubmitting || isUploading} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isSubmitting || isUploading ? t('profile.savingButton') : t('profile.saveButton')}</button> </>
                        ) : (<CmsActionButton type="button" variant="primary" onClick={() => setIsEditing(true)}>{t('profile.editButton')}</CmsActionButton>)}
                    </div>
                </form>
            </div>
        </div>
    );
};

export const ProfilePage = () => {
    const { user, profile: currentUserProfile } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');

    const { data: profile, isLoading, isError } = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: async (): Promise<ProfileFormInputs | null> => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') throw error; return data; },
        enabled: !!user,
    });

    const demoteMutation = useMutation({ mutationFn: async () => { const { error } = await supabase.functions.invoke('demote-self'); if (error) throw new Error(error.message); }, onSuccess: () => { toast.success(t('profile.demote.success')); queryClient.invalidateQueries({ queryKey: ['layout_profile', user?.id] }); navigate('/'); }, onError: (error) => toast.error(error.message), });
    const handleDemote = () => { if (window.confirm(t('profile.demote.confirm'))) { demoteMutation.mutate(); } };

    if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div></div>;
    if (isError) return <div className="text-center py-40">Could not load profile. Please try again.</div>;

    const isPrivilegedUser = currentUserProfile?.roles?.name === 'admin' || currentUserProfile?.roles?.name === 'developer' || currentUserProfile?.roles?.name === 'organizer';

    return (
        <div className="relative min-h-screen pt-24 pb-12 p-4">
            <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
                <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
                <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8"><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setActiveTab('events')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>

                {activeTab === 'details' && (
                    <>
                        <ProfileDetails profileData={profile} />
                        {isPrivilegedUser && profile && (
                            <div className="mt-8 pt-6 border-t border-red-500/30">
                                <h3 className="text-xl font-bold text-system-danger">{t('profile.demote.title')}</h3><p className="text-text-secondary text-sm mt-2">{t('profile.demote.description')}</p>
                                <button onClick={handleDemote} disabled={demoteMutation.isPending} className="mt-4 px-4 py-2 border border-system-danger text-system-danger font-semibold rounded-lg hover:bg-system-danger hover:text-white transition-colors disabled:opacity-50">{demoteMutation.isPending ? 'Processing...' : t('profile.demote.button')}</button>
                            </div>
                        )}
                    </>
                )}
                {activeTab === 'events' && user && (<MyEventsList userId={user.id} />)}
            </motion.div>
        </div>
    );
};