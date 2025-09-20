import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const PostSchema = z.object({
    title: z.string().min(3, 'Title is required'),
    content: z.string().optional(),
    image_url: z.string().optional(),
});
type PostFormInputs = z.infer<typeof PostSchema>;

type Post = {
    id: string;
    title: string;
    created_at: string;
    content: string | null;
    image_url: string;
};

const PostForm = ({ post, onFormSubmit, onCancel }: { post?: Post | null, onFormSubmit: (data: PostFormInputs, imageFile?: File) => void, onCancel: () => void }) => {
    const [imageFile, setImageFile] = useState<File>();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PostFormInputs>({
        defaultValues: post ? { title: post.title, content: post.content || '' } : {},
        resolver: zodResolver(PostSchema),
    });

    const onSubmit: SubmitHandler<PostFormInputs> = (data) => {
        onFormSubmit(data, imageFile);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">{post ? 'Edit Post' : 'Create New Post'}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium">Title</label>
                        <input id="title" {...register('title')} className="mt-1 w-full p-2 border rounded-md" />
                        {errors.title && <p className="text-sm text-system-danger">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium">Content</label>
                        <textarea id="content" {...register('content')} rows={5} className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium">Cover Image</label>
                        <input id="image" type="file" accept="image/*" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} className="mt-1 w-full" />
                        {!post && !imageFile && <p className="text-sm text-system-danger">A cover image is required for new posts.</p>}
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50">
                            {isSubmitting ? 'Saving...' : 'Save Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const PostsManagementPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const { data: posts, isLoading } = useQuery<Post[]>({
        queryKey: ['posts'],
        queryFn: async () => {
            const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        },
    });

    const mutation = useMutation({
        mutationFn: async ({ postData, imageFile, postId }: { postData: PostFormInputs, imageFile?: File, postId?: string }) => {
            let imageUrl = postData.image_url || (editingPost?.image_url);

            if (imageFile) {
                const filePath = `${user!.id}/${Date.now()}-${imageFile.name}`;
                const { error: uploadError } = await supabase.storage.from('posts').upload(filePath, imageFile);
                if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
                const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(filePath);
                imageUrl = publicUrl;
            }

            if (!imageUrl) throw new Error("A cover image is required.");

            const dataToSubmit = { ...postData, image_url: imageUrl, author_id: user!.id };

            if (postId) {
                const { error } = await supabase.from('posts').update(dataToSubmit).eq('id', postId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('posts').insert(dataToSubmit);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            toast.success(`Post ${editingPost ? 'updated' : 'created'} successfully!`);
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            setIsFormOpen(false);
            setEditingPost(null);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (postId: string) => {
            const { error } = await supabase.from('posts').delete().eq('id', postId);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Post deleted.');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Posts</h1>
                <button onClick={() => { setEditingPost(null); setIsFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover">Create New Post</button>
            </div>

            {isFormOpen && <PostForm post={editingPost} onFormSubmit={(data, img) => mutation.mutate({ postData: data, imageFile: img, postId: editingPost?.id })} onCancel={() => { setIsFormOpen(false); setEditingPost(null); }} />}

            {isLoading ? <p>Loading posts...</p> : (
                <div className="bg-white shadow-md rounded-lg">
                    <table className="min-w-full">
                        <thead className="bg-neutral-100">
                            <tr>
                                <th className="p-4 text-left">Title</th><th className="p-4 text-left">Created At</th><th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts?.map(post => (
                                <tr key={post.id} className="border-b">
                                    <td className="p-4">{post.title}</td>
                                    <td className="p-4">{new Date(post.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => { setEditingPost(post); setIsFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm">Edit</button>
                                        <button onClick={() => window.confirm('Are you sure?') && deleteMutation.mutate(post.id)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};