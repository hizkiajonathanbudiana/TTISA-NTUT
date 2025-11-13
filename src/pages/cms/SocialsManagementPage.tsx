import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const SocialLinkSchema = z.object({
    platform: z.enum(['email', 'instagram', 'line', 'facebook', 'linkedin', 'generic']),
    link_url: z.string().min(1, 'Link URL is required (e.g., https://... or mailto:...)'),
    display_text: z.string().min(1, 'Display text is required (e.g., @ttisa_ntut)'),
    display_order: z.number(),
    is_active: z.boolean(),
});
type SocialFormInputs = z.infer<typeof SocialLinkSchema>;
type SocialLink = SocialFormInputs & { id: string };

const SocialLinkForm = ({ link, onFormSubmit, onCancel }: { link?: SocialLink | null, onFormSubmit: (data: SocialFormInputs) => void, onCancel: () => void }) => {
    const { register, handleSubmit, control, setValue, getValues, formState: { errors, isSubmitting } } = useForm<SocialFormInputs>({
        defaultValues: link || {
            platform: 'instagram',
            link_url: 'https://instagram.com/',
            display_text: '',
            display_order: 99,
            is_active: true
        },
        resolver: zodResolver(SocialLinkSchema) as any
    });

    const platform = useWatch({ control, name: 'platform' });

    useEffect(() => {
        const currentUrl = getValues('link_url');
        const defaultTemplates = [
            'https://instagram.com/',
            'https://line.me/ti/p/~',
            'mailto:',
            'https://facebook.com/',
            'https://linkedin.com/in/',
            ''
        ];

        if (!currentUrl || defaultTemplates.includes(currentUrl) || (link && platform !== link.platform)) {
            switch (platform) {
                case 'instagram': setValue('link_url', 'https://instagram.com/'); break;
                case 'line': setValue('link_url', 'https://line.me/ti/p/~'); break;
                case 'email': setValue('link_url', 'mailto:'); break;
                case 'facebook': setValue('link_url', 'https://facebook.com/'); break;
                case 'linkedin': setValue('link_url', 'https://linkedin.com/in/'); break;
                default: setValue('link_url', '');
            }
        }
    }, [platform, setValue, getValues, link]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">{link ? 'Edit' : 'Create'} Social Link</h2>
                <form onSubmit={handleSubmit(onFormSubmit as any)} className="space-y-4">
                    <div><label className="block text-sm font-medium">Platform</label><select {...register('platform')} className="mt-1 w-full p-2 border rounded-md bg-white capitalize"><option value="instagram">Instagram</option><option value="line">Line</option><option value="email">Email</option><option value="facebook">Facebook</option><option value="linkedin">LinkedIn</option><option value="generic">Generic Link</option></select></div>
                    <div><label className="block text-sm font-medium">Display Text</label><input {...register('display_text')} placeholder="e.g., @ttisa_ntut" className="mt-1 w-full p-2 border rounded-md" />{errors.display_text && <p className="text-sm text-system-danger">{errors.display_text.message}</p>}</div>
                    <div><label className="block text-sm font-medium">Link URL</label><input {...register('link_url')} placeholder="e.g., https://instagram.com/ttisa_ntut" className="mt-1 w-full p-2 border rounded-md" />{errors.link_url && <p className="text-sm text-system-danger">{errors.link_url.message}</p>}</div>
                    <div><label className="block text-sm font-medium">Display Order</label><input type="number" {...register('display_order', { valueAsNumber: true })} className="mt-1 w-full p-2 border rounded-md" /></div>
                    <div className="flex items-center gap-2"><input type="checkbox" {...register('is_active')} className="h-4 w-4 rounded" /><label>Is Active</label></div>
                    <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Link'}</button></div>
                </form>
            </div>
        </div>
    );
};

export const SocialsManagementPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    // Direct database query instead of Edge Functions
    const { data: linksData, isLoading } = useQuery({
        queryKey: ['social_links', currentPage, searchTerm],
        queryFn: async () => {
            let query = supabase.from('social_links').select('*');

            if (searchTerm) {
                query = query.or(`platform.ilike.%${searchTerm}%,display_text.ilike.%${searchTerm}%,link_url.ilike.%${searchTerm}%`);
            }

            const { data, error, count } = await query
                .order('display_order', { ascending: true })
                .range((currentPage - 1) * 20, currentPage * 20 - 1);

            if (error) throw new Error(error.message);

            return {
                data,
                pagination: {
                    page: currentPage,
                    totalPages: Math.ceil((count || 0) / 20),
                    total: count || 0,
                    hasPrev: currentPage > 1,
                    hasNext: currentPage < Math.ceil((count || 0) / 20)
                }
            };
        },
    });

    const links = linksData?.data || [];
    const pagination = linksData?.pagination;

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // Direct database mutations instead of Edge Functions
    const mutation = useMutation({
        mutationFn: async (formData: SocialFormInputs) => {
            if (editingLink) {
                const { error } = await supabase.from('social_links').update(formData).eq('id', editingLink.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('social_links').insert([formData]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            toast.success(`Social link ${editingLink ? 'updated' : 'created'}.`);
            queryClient.invalidateQueries({ queryKey: ['social_links'] });
            setIsFormOpen(false);
            setEditingLink(null);
        },
        onError: (error: any) => toast.error(error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('social_links').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Link deleted.');
            queryClient.invalidateQueries({ queryKey: ['social_links'] });
        },
        onError: (error: any) => toast.error(error.message),
    });

    return (
        <div className="space-y-6">
            {isFormOpen && <SocialLinkForm link={editingLink} onFormSubmit={(data) => mutation.mutate(data)} onCancel={() => { setIsFormOpen(false); setEditingLink(null); }} />}

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Social Links</h1>
                <button onClick={() => { setEditingLink(null); setIsFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Add New Link</button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-4">
                <input
                    type="text"
                    placeholder="Search social links..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                />
                <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-hover font-semibold">
                    Search
                </button>
            </form>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full responsive-table">
                    <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Platform</th><th className="p-4 text-left font-semibold">Display Text</th><th className="p-4 text-left font-semibold">Link URL</th><th className="p-4 text-left font-semibold">Order</th><th className="p-4 text-left font-semibold">Status</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan={6}>Loading...</td></tr> : links?.map((link: any) => (
                            <tr key={link.id}>
                                <td data-label="Platform" className="capitalize">{link.platform}</td>
                                <td data-label="Display Text">{link.display_text}</td>
                                <td data-label="Link URL" className="text-sm truncate max-w-xs"><a href={link.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{link.link_url}</a></td>
                                <td data-label="Order">{link.display_order}</td>
                                <td data-label="Status"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${link.is_active ? 'bg-green-100 text-green-800' : 'bg-neutral-200'}`}>{link.is_active ? 'Active' : 'Inactive'}</span></td>
                                <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2"><button onClick={() => { setEditingLink(link); setIsFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover">Edit</button><button onClick={() => window.confirm('Are you sure?') && deleteMutation.mutate(link.id)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="px-4 py-2">
                        Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};