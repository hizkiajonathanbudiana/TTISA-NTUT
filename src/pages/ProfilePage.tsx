import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useAuth, supabase } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfileSchema = z.object({
    english_name: z.string().optional(),
    chinese_name: z.string().optional(),
    department: z.string().min(1, 'Department is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    student_id: z.string().min(1, 'Student ID is required'),
});

type ProfileFormInputs = z.infer<typeof ProfileSchema>;

const Avatar = ({
    url,
    onUpload,
}: {
    url: string | null;
    onUpload: (filePath: string) => void;
}) => {
    const { user } = useAuth();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (url) {
            const fullUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${url}`;
            setAvatarUrl(fullUrl);
        }
    }, [url]);

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            // FIX: The file path now includes a folder named with the user's ID
            // to match the new security policy.
            const filePath = `${user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }
            onUpload(filePath);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <img
                src={avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div>
                <label htmlFor="single" className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover text-sm">
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                </label>
                <input
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="hidden"
                />
            </div>
        </div>
    );
};


export const ProfilePage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [avatarPath, setAvatarPath] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormInputs>({
        resolver: zodResolver(ProfileSchema),
    });

    const handleUpdateProfile: SubmitHandler<ProfileFormInputs> = async (formData) => {
        if (!user) return;

        try {
            const { data: currentProfile } = await supabase.from('profiles').select('avatar_url').eq('user_id', user.id).single();

            const profileData = {
                user_id: user.id,
                ...formData,
                avatar_url: avatarPath || currentProfile?.avatar_url,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(profileData);
            if (error) throw error;
            toast.success('Profile updated successfully!');
        } catch (error: any) {
            toast.error('Failed to update profile: ' + error.message);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    throw error;
                }

                if (data) {
                    reset(data);
                    setAvatarPath(data.avatar_url);
                }
            } catch (error: any) {
                toast.error('Failed to fetch profile: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, reset]);

    if (loading) {
        return <div className="text-center py-12">Loading profile...</div>;
    }

    return (
        <div className="flex justify-center items-center py-12">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-neutral-800">
                    Your Profile
                </h2>

                <Avatar
                    url={avatarPath}
                    onUpload={(filePath) => {
                        setAvatarPath(filePath);
                        toast.success('Avatar updated! Save your profile to confirm.');
                    }}
                />

                <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="english_name" className="text-sm font-medium text-neutral-800">English Name</label>
                            <input id="english_name" {...register('english_name')} className="mt-1 block w-full px-3 py-2 border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="chinese_name" className="text-sm font-medium text-neutral-800">Chinese Name</label>
                            <input id="chinese_name" {...register('chinese_name')} className="mt-1 block w-full px-3 py-2 border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="department" className="text-sm font-medium text-neutral-800">Department</label>
                        <input id="department" {...register('department')} className="mt-1 block w-full px-3 py-2 border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        {errors.department && <p className="mt-1 text-sm text-system-danger">{errors.department.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nationality" className="text-sm font-medium text-neutral-800">Nationality</label>
                            <input id="nationality" {...register('nationality')} className="mt-1 block w-full px-3 py-2 border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                            {errors.nationality && <p className="mt-1 text-sm text-system-danger">{errors.nationality.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="student_id" className="text-sm font-medium text-neutral-800">Student ID</label>
                            <input id="student_id" {...register('student_id')} className="mt-1 block w-full px-3 py-2 border border-neutral-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                            {errors.student_id && <p className="mt-1 text-sm text-system-danger">{errors.student_id.message}</p>}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-primary-hover disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};