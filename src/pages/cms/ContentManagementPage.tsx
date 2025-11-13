import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../contexts/AuthContext';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

// API Functions for Edge Functions
const getCMSContent = async (slug: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await supabase.functions.invoke('get-cms-content', {
        body: { slug },
    });

    if (response.error) throw response.error;
    return response.data;
};

const crudContent = async (action: 'upsert', slug: string, data: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await supabase.functions.invoke('crud-content', {
        body: { action, slug, data },
    });

    if (response.error) throw response.error;
    return response.data;
};

const ContentSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().optional(),
});
type ContentFormInputs = z.infer<typeof ContentSchema>;

const PAGE_SLUG = 'about-ntut';

export const ContentManagementPage = () => {
    const queryClient = useQueryClient();

    const { data: contentData, isLoading } = useQuery({
        queryKey: ['cms_content', PAGE_SLUG],
        queryFn: async () => {
            const result = await getCMSContent(PAGE_SLUG);
            return result.data;
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContentFormInputs>({
        resolver: zodResolver(ContentSchema),
    });

    useEffect(() => {
        if (contentData) {
            reset(contentData);
        }
    }, [contentData, reset]);

    const mutation = useMutation({
        mutationFn: async (formData: ContentFormInputs) => {
            return crudContent('upsert', PAGE_SLUG, formData);
        },
        onSuccess: () => {
            toast.success(`'${contentData?.title || 'About NTUT'}' page updated successfully!`);
            queryClient.invalidateQueries({ queryKey: ['cms_content', PAGE_SLUG] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });

    const onSubmit: SubmitHandler<ContentFormInputs> = (data) => {
        mutation.mutate(data);
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6">Edit Page Content</h1>
            {isLoading ? (
                <p>Loading page content...</p>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-neutral-800">Page Title</label>
                        <input
                            id="title"
                            {...register('title')}
                            className="mt-1 block w-full p-2 border border-neutral-200 rounded-md shadow-sm"
                        />
                        {errors.title && <p className="mt-1 text-sm text-system-danger">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-neutral-800">Page Content</label>
                        <textarea
                            id="content"
                            {...register('content')}
                            rows={15}
                            className="mt-1 block w-full p-2 border border-neutral-200 rounded-md shadow-sm"
                            placeholder="Enter the main content for the page here. You can use Markdown for formatting."
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-primary-hover disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};