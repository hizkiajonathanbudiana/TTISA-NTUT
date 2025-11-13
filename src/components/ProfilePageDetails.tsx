import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useAuth, supabase } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useTranslation } from '../contexts/LanguageContext';
import { useQueryClient } from '@tanstack/react-query';
import { CmsActionButton } from './cms/CmsActionButton';

const currentYear = new Date().getFullYear();
const ProfileSchema = z.object({ english_name: z.string().min(1, 'English name is required'), chinese_name: z.string().optional(), department: z.string().min(1, 'Department is required'), nationality: z.string().min(1, 'Nationality is required'), student_id: z.string().min(1, 'Student ID is required'), avatar_url: z.string().nullable(), birth_year: z.number().min(1920).max(currentYear).optional().nullable(), gender: z.enum(['male', 'female', 'rather_not_say']).optional().nullable(), });
type ProfileFormInputs = z.infer<typeof ProfileSchema>;

export const ProfileDetails = ({ profileData }: { profileData: ProfileFormInputs | null }) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(!profileData);

    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty }, reset } = useForm<ProfileFormInputs>({ defaultValues: profileData || {}, resolver: zodResolver(ProfileSchema) as any });

    const handleUpdateProfile: SubmitHandler<ProfileFormInputs> = async (formData) => {
        try {
            const dataToSave = { ...formData, user_id: user!.id, birth_year: formData.birth_year || null };

            // Use Edge Function instead of direct Supabase call
            const { error } = await supabase.functions.invoke('update-my-profile', {
                body: dataToSave,
            });

            if (error) throw error;
            toast.success(t('profile.updateSuccess'));
            await queryClient.invalidateQueries({ queryKey: ['profile', user!.id] });
            setIsEditing(false);
        } catch (error: any) {
            toast.error(`${t('profile.updateError')}: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleUpdateProfile as any)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium">{t('profile.englishNameLabel')}</label><input {...register('english_name')} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white/50 disabled:bg-neutral-100 disabled:opacity-70" />{errors.english_name && <p className="mt-1 text-sm text-system-danger">{errors.english_name.message}</p>}</div>
                <div><label className="text-sm font-medium">{t('profile.chineseNameLabel')}</label><input {...register('chinese_name')} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white/50 disabled:bg-neutral-100 disabled:opacity-70" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium">{t('profile.birthYearLabel')}</label><input type="number" placeholder={String(currentYear - 20)} {...register('birth_year', { valueAsNumber: true })} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white/50 disabled:bg-neutral-100 disabled:opacity-70" />{errors.birth_year && <p className="mt-1 text-sm text-system-danger">{errors.birth_year.message}</p>}</div>
                <div><label className="text-sm font-medium">{t('profile.genderLabel')}</label><select {...register('gender')} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white disabled:bg-neutral-100 disabled:opacity-70"><option value="">{t('profile.selectGender')}</option><option value="male">{t('profile.genderMale')}</option><option value="female">{t('profile.genderFemale')}</option><option value="rather_not_say">{t('profile.genderRatherNotSay')}</option></select></div>
            </div>
            <div><label className="text-sm font-medium">{t('profile.departmentLabel')}</label><input {...register('department')} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white/50 disabled:bg-neutral-100 disabled:opacity-70" />{errors.department && <p className="mt-1 text-sm text-system-danger">{errors.department.message}</p>}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium">{t('profile.nationalityLabel')}</label><input {...register('nationality')} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white/50 disabled:bg-neutral-100 disabled:opacity-70" />{errors.nationality && <p className="mt-1 text-sm text-system-danger">{errors.nationality.message}</p>}</div>
                <div><label className="text-sm font-medium">{t('profile.studentIdLabel')}</label><input {...register('student_id')} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 border rounded-lg bg-white/50 disabled:bg-neutral-100 disabled:opacity-70" />{errors.student_id && <p className="mt-1 text-sm text-system-danger">{errors.student_id.message}</p>}</div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                {isEditing ? (
                    <>
                        <button type="button" onClick={() => { setIsEditing(false); reset(profileData || {}); }} className="px-6 py-2 bg-neutral-200 text-text-primary font-semibold rounded-lg hover:bg-neutral-300">{t('profile.cancelButton')}</button>
                        <CmsActionButton type="submit" variant="primary" disabled={isSubmitting || !isDirty}>{isSubmitting ? t('profile.savingButton') : t('profile.saveButton')}</CmsActionButton>
                    </>
                ) : (
                    <CmsActionButton type="button" variant="primary" onClick={() => setIsEditing(true)}>{t('profile.editButton')}</CmsActionButton>
                )}
            </div>
        </form>
    );
};