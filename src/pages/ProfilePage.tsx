
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useAuth, supabase } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useTranslation } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';

const currentYear = new Date().getFullYear();
const ProfileSchema = z.object({
    english_name: z.string().optional(),
    chinese_name: z.string().optional(),
    department: z.string().min(1, 'Department is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    student_id: z.string().min(1, 'Student ID is required'),
    avatar_url: z.string().nullable(),
    birth_year: z.number().min(1920, 'Invalid year').max(currentYear, 'Invalid year').optional().nullable(),
    gender: z.enum(['male', 'female', 'rather_not_say']).optional().nullable(),
});
type ProfileFormInputs = z.infer<typeof ProfileSchema>;

const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message || 'Image upload to Cloudinary failed');
    return data.secure_url;
};

const Avatar = ({ url, onUpload, isEditing }: { url: string | null; onUpload: (newUrl: string) => void; isEditing: boolean; }) => {
    const { user } = useAuth(); const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);
    const avatarUrl = url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`;

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || !isEditing || !event.target.files || event.target.files.length === 0) return;
        const file = event.target.files[0];
        setUploading(true);
        toast.loading('Uploading avatar...');
        try {
            const newUrl = await uploadToCloudinary(file);
            onUpload(newUrl);
            toast.dismiss();
            toast.success('Avatar updated! Save changes to confirm.');
        } catch (error: any) {
            toast.dismiss();
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };
    return (<div className="flex flex-col items-center space-y-4"><img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-md" />{isEditing && <div><label htmlFor="single" className="cursor-pointer bg-white/50 backdrop-blur-lg border border-white/20 text-text-secondary px-4 py-2 rounded-lg hover:bg-white/80 transition-colors text-sm">{uploading ? t('profile.uploadingButton') : t('profile.uploadButton')}</label><input type="file" id="single" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" /></div>}</div>);
};

const ProfileView = ({ profile, onEditClick }: { profile: ProfileFormInputs; onEditClick: () => void; }) => {
    const { t } = useTranslation();
    return (<div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"><div><p className="text-sm font-medium text-text-secondary">{t('profile.englishNameLabel')}</p><p className="text-lg text-text-primary">{profile.english_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.chineseNameLabel')}</p><p className="text-lg text-text-primary">{profile.chinese_name || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.departmentLabel')}</p><p className="text-lg text-text-primary">{profile.department || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.nationalityLabel')}</p><p className="text-lg text-text-primary">{profile.nationality || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.birthYearLabel')}</p><p className="text-lg text-text-primary">{profile.birth_year || '-'}</p></div><div><p className="text-sm font-medium text-text-secondary">{t('profile.genderLabel')}</p><p className="text-lg text-text-primary capitalize">{profile.gender?.replace('_', ' ') || '-'}</p></div><div className="md:col-span-2"><p className="text-sm font-medium text-text-secondary">{t('profile.studentIdLabel')}</p><p className="text-lg text-text-primary">{profile.student_id || '-'}</p></div></div><div className="pt-4 text-right"><button onClick={onEditClick} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover">{t('profile.editButton')}</button></div></div>);
};

const ProfileForm = ({ profile, onCancel, onSaveSuccess }: { profile: ProfileFormInputs | null; onCancel: () => void; onSaveSuccess: () => void; }) => {
    const { user } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient();
    const [avatarUrlToSave, setAvatarUrlToSave] = useState(profile?.avatar_url || null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormInputs>({ defaultValues: profile || {}, resolver: zodResolver(ProfileSchema) as any });
    const handleUpdateProfile: SubmitHandler<ProfileFormInputs> = async (formData) => {
        try { const dataToSave = { ...formData, user_id: user!.id, avatar_url: avatarUrlToSave, birth_year: formData.birth_year || null }; const { error } = await supabase.from('profiles').upsert(dataToSave); if (error) throw error; toast.success(t('profile.updateSuccess')); await queryClient.invalidateQueries({ queryKey: ['profile', user!.id] }); await queryClient.invalidateQueries({ queryKey: ['layout_profile', user!.id] }); onSaveSuccess(); } catch (error: any) { toast.error(`${t('profile.updateError')}: ${error.message}`); }
    };
    return (<div className="space-y-6"><Avatar url={avatarUrlToSave} onUpload={(url) => setAvatarUrlToSave(url)} isEditing={true} /><form onSubmit={handleSubmit(handleUpdateProfile as any)} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.englishNameLabel')}</label><input {...register('english_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div><div><label className="text-sm font-medium">{t('profile.chineseNameLabel')}</label><input {...register('chinese_name')} className="mt-1 block w-full px-3 py-2 border rounded-lg" /></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.birthYearLabel')}</label><input type="number" placeholder={String(currentYear - 20)} {...register('birth_year', { valueAsNumber: true })} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.birth_year && <p className="mt-1 text-sm text-system-danger">{errors.birth_year.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.genderLabel')}</label><select {...register('gender')} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white"><option value="">{t('profile.selectGender')}</option><option value="male">{t('profile.genderMale')}</option><option value="female">{t('profile.genderFemale')}</option><option value="rather_not_say">{t('profile.genderRatherNotSay')}</option></select></div></div><div><label className="text-sm font-medium">{t('profile.departmentLabel')}</label><input {...register('department')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.department && <p className="mt-1 text-sm text-system-danger">{errors.department.message}</p>}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">{t('profile.nationalityLabel')}</label><input {...register('nationality')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.nationality && <p className="mt-1 text-sm text-system-danger">{errors.nationality.message}</p>}</div><div><label className="text-sm font-medium">{t('profile.studentIdLabel')}</label><input {...register('student_id')} className="mt-1 block w-full px-3 py-2 border rounded-lg" />{errors.student_id && <p className="mt-1 text-sm text-system-danger">{errors.student_id.message}</p>}</div></div><div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">{t('profile.cancelButton')}</button><button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isSubmitting ? t('profile.savingButton') : t('profile.saveButton')}</button></div></form></div>);
};

const MyEventsList = ({ userId }: { userId: string }) => {
    const { t, language } = useTranslation(); const PAGE_SIZE = 3; const queryClient = useQueryClient();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({ queryKey: ['my_registrations', userId], queryFn: async ({ pageParam = 0 }) => { const from = pageParam * PAGE_SIZE; const to = from + PAGE_SIZE - 1; const { data, error } = await supabase.from('event_registrations').select('id, status, created_at, events(slug, title_en, title_zh_hant)').eq('user_id', userId).order('created_at', { ascending: false }).range(from, to); if (error) throw error; return data as any; }, initialPageParam: 0, getNextPageParam: (lastPage, allPages) => { return lastPage.length === PAGE_SIZE ? allPages.length : undefined; }, });
    const registrations = data?.pages.flatMap(page => page) ?? [];
    const handleShowLess = () => { queryClient.setQueryData(['my_registrations', userId], (data: any) => ({ pages: data.pages.slice(0, 1), pageParams: data.pageParams.slice(0, 1), })); };
    const statusClasses = { pending: 'bg-yellow-100 text-yellow-800', accepted: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', };
    if (isLoading) return <p>Loading event history...</p>;
    if (registrations.length === 0) return <p className="text-text-secondary">{t('profile.events.noRegistrations')}</p>;
    return (<div className="overflow-x-auto"><table className="min-w-full"><thead><tr><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.title')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.registrationDate')}</th><th className="p-4 text-left text-sm font-semibold text-text-secondary">{t('profile.events.status')}</th></tr></thead><tbody>{registrations.map((reg: any) => { const title = language === 'zh-HANT' && reg.events?.title_zh_hant ? reg.events.title_zh_hant : reg.events?.title_en; return (<tr key={reg.id} className="border-t border-white/20"><td className="p-4 font-medium text-text-primary"><Link to={`/events/${reg.events?.slug}`} className="hover:underline">{title}</Link></td><td className="p-4 text-text-secondary">{new Date(reg.created_at).toLocaleDateString()}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[reg.status as keyof typeof statusClasses]}`}>{t(`profile.events.${reg.status}`)}</span></td></tr>) })}</tbody></table><div className="mt-6 flex justify-center gap-4">{hasNextPage && (<button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50">{isFetchingNextPage ? 'Loading...' : 'Show More'}</button>)} {(data?.pages.length ?? 0) > 1 && (<button onClick={handleShowLess} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">Show Less</button>)}</div></div>);
};

export const ProfilePage = () => {
    const { user } = useAuth(); const { t } = useTranslation(); const queryClient = useQueryClient(); const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: async (): Promise<ProfileFormInputs | null> => { if (!user) return null; const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') throw error; if (!data) { setIsEditingProfile(true); } return data; },
        enabled: !!user,
    });

    const { data: currentUserProfile } = useQuery({
        queryKey: ['current_user_profile', user?.id],
        queryFn: async () => { if (!user) return null; const { data, error } = await supabase.from('users').select('roles(name)').eq('id', user.id).single(); if (error) throw error; return data as any; },
        enabled: !!user,
    });

    const demoteMutation = useMutation({ mutationFn: async () => { const { error } = await supabase.functions.invoke('demote-self'); if (error) throw new Error(error.message); }, onSuccess: () => { toast.success(t('profile.demote.success')); queryClient.invalidateQueries({ queryKey: ['layout_profile', user?.id] }); navigate('/'); }, onError: (error) => toast.error(error.message), });
    const handleDemote = () => { if (window.confirm(t('profile.demote.confirm'))) { demoteMutation.mutate(); } };

    if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div></div>;

    const isPrivilegedUser = currentUserProfile?.roles?.name === 'admin' || currentUserProfile?.roles?.name === 'developer' || currentUserProfile?.roles?.name === 'organizer';

    return (
        <div className="relative min-h-screen pt-24 pb-12 p-4">
            <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-30"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-30"></div></div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
                <h2 className="text-3xl font-bold text-center text-text-primary mb-8">{t('profile.pageTitle')}</h2>
                <div className="border-b border-white/30 mb-8"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button onClick={() => setActiveTab('details')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.details')}</button><button onClick={() => setActiveTab('events')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'}`}>{t('profile.tabs.events')}</button></nav></div>

                {activeTab === 'details' && (
                    <>
                        {isEditingProfile ? (
                            <ProfileForm profile={profile || null} onCancel={() => { if (profile) setIsEditingProfile(false) }} onSaveSuccess={() => setIsEditingProfile(false)} />
                        ) : (
                            profile &&
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1"><Avatar url={profile.avatar_url} onUpload={() => { }} isEditing={false} /></div>
                                <div className="md:col-span-2"><ProfileView profile={profile} onEditClick={() => setIsEditingProfile(true)} /></div>
                            </div>
                        )}
                        {isPrivilegedUser && !isEditingProfile && profile && (
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
