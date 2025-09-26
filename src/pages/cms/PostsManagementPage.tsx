// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase, useAuth } from '../../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import { useState, useEffect } from 'react';
// import { useForm, type SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Icon } from '../../components/Icon';

// const PostSchema = z.object({ title_en: z.string().min(3, 'English title is required'), title_zh_hant: z.string().min(1, 'Chinese title is required'), content_en: z.string().optional(), content_zh_hant: z.string().optional(), });
// type PostFormInputs = z.infer<typeof PostSchema>;
// type Post = { id: string; created_at: string; image_url: string; images: string[] | null; } & PostFormInputs;

// const uploadToCloudinary = async (file: File): Promise<string> => {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
//     const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
//     const data = await response.json();
//     if (!response.ok) throw new Error(data.error.message || 'Image upload failed');
//     return data.secure_url;
// };

// const PostForm = ({ post, onFormSubmit, onCancel }: { post?: Post | null, onFormSubmit: (data: PostFormInputs, coverImageFile?: File, galleryFiles?: File[]) => void, onCancel: () => void }) => {
//     const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
//     const [coverImageFile, setCoverImageFile] = useState<File>();
//     const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
//     const [existingGallery, setExistingGallery] = useState<string[]>(post?.images || []);

//     const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PostFormInputs>({ defaultValues: post || {}, resolver: zodResolver(PostSchema) });

//     const onSubmit: SubmitHandler<PostFormInputs> = (data) => {
//         onFormSubmit(data, coverImageFile, galleryFiles);
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
//             <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-full overflow-y-auto">
//                 <h2 className="text-2xl font-bold mb-4">{post ? 'Edit Post' : 'Create New Post'}</h2>
//                 <div className="border-b border-gray-200 mb-4"><nav className="-mb-px flex space-x-8"><button type="button" onClick={() => setActiveTab('en')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'en' ? 'border-primary text-primary' : 'border-transparent'}`}>English</button><button type="button" onClick={() => setActiveTab('zh')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'zh' ? 'border-primary text-primary' : 'border-transparent'}`}>Chinese</button></nav></div>
//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                     {/* Language Tabs */}
//                     <div className={activeTab === 'en' ? 'block' : 'hidden'}><div className="space-y-4"><div><label>Title (English)</label><input {...register('title_en')} className="mt-1 w-full p-2 border rounded-md" />{errors.title_en && <p className="text-sm text-system-danger">{errors.title_en.message}</p>}</div><div><label>Content (English)</label><textarea {...register('content_en')} rows={5} className="mt-1 w-full p-2 border rounded-md" /></div></div></div>
//                     <div className={activeTab === 'zh' ? 'block' : 'hidden'}><div className="space-y-4"><div><label>Title (Chinese)</label><input {...register('title_zh_hant')} className="mt-1 w-full p-2 border rounded-md" />{errors.title_zh_hant && <p className="text-sm text-system-danger">{errors.title_zh_hant.message}</p>}</div><div><label>Content (Chinese)</label><textarea {...register('content_zh_hant')} rows={5} className="mt-1 w-full p-2 border rounded-md" /></div></div></div>
//                     <hr />
//                     {/* Image Uploaders */}
//                     <div><label className="block text-sm font-medium">Cover Image</label><input type="file" accept="image/*" onChange={(e) => e.target.files && setCoverImageFile(e.target.files[0])} className="mt-1 w-full text-sm" />{post?.image_url && <img src={post.image_url} alt="Current cover" className="w-24 h-24 object-cover mt-2 rounded-md border" />}</div>
//                     <div><label className="block text-sm font-medium">Gallery Images</label><input type="file" accept="image/*" multiple onChange={(e) => e.target.files && setGalleryFiles(Array.from(e.target.files))} className="mt-1 w-full text-sm" />
//                         <div className="mt-2 flex flex-wrap gap-2">
//                             {existingGallery.map(url => <div key={url} className="relative w-24 h-24"><img src={url} className="w-full h-full object-cover rounded-md border" /><button type="button" onClick={() => setExistingGallery(g => g.filter(item => item !== url))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center text-xs">&times;</button></div>)}
//                             {galleryFiles.map(file => <div key={file.name} className="relative w-24 h-24"><img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-md border" /></div>)}
//                         </div>
//                     </div>
//                     <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Post'}</button></div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export const PostsManagementPage = () => {
//     const [isFormOpen, setIsFormOpen] = useState(false);
//     const [editingPost, setEditingPost] = useState<Post | null>(null);
//     const queryClient = useQueryClient();
//     const { user } = useAuth();

//     const { data: posts, isLoading } = useQuery<Post[]>({ queryKey: ['cms_posts'], queryFn: async () => { const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false }); if (error) throw new Error(error.message); return data; }, });
//     const mutation = useMutation({
//         mutationFn: async ({ postData, coverImageFile, galleryFiles }: { postData: PostFormInputs, coverImageFile?: File, galleryFiles?: File[] }) => {
//             let coverImageUrl = editingPost?.image_url;
//             if (coverImageFile) {
//                 toast.loading('Uploading cover image...');
//                 coverImageUrl = await uploadToCloudinary(coverImageFile);
//                 toast.dismiss();
//             }
//             if (!coverImageUrl) throw new Error("A cover image is required.");

//             let galleryImageUrls = editingPost?.images || [];
//             if (galleryFiles && galleryFiles.length > 0) {
//                 toast.loading(`Uploading ${galleryFiles.length} gallery images...`);
//                 const uploadPromises = galleryFiles.map(file => uploadToCloudinary(file));
//                 const newUrls = await Promise.all(uploadPromises);
//                 galleryImageUrls = [...galleryImageUrls, ...newUrls];
//                 toast.dismiss();
//             }

//             const dataToSubmit = { ...postData, image_url: coverImageUrl, images: galleryImageUrls, author_id: user!.id };
//             if (editingPost) {
//                 const { error } = await supabase.from('posts').update(dataToSubmit).eq('id', editingPost.id);
//                 if (error) throw error;
//             } else {
//                 const { error } = await supabase.from('posts').insert(dataToSubmit);
//                 if (error) throw error;
//             }
//         },
//         onSuccess: () => { toast.success(`Post ${editingPost ? 'updated' : 'created'} successfully!`); queryClient.invalidateQueries({ queryKey: ['cms_posts'] }); setIsFormOpen(false); setEditingPost(null); },
//         onError: (error) => { toast.dismiss(); toast.error(error.message); }
//     });

//     const deleteMutation = useMutation({ mutationFn: async (postId: string) => { const { error } = await supabase.from('posts').delete().eq('id', postId); if (error) throw error; }, onSuccess: () => { toast.success('Post deleted.'); queryClient.invalidateQueries({ queryKey: ['cms_posts'] }); }, onError: (error) => { toast.error(error.message); } });

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Manage Posts</h1><button onClick={() => { setEditingPost(null); setIsFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Create New Post</button></div>
//             {isFormOpen && <PostForm post={editingPost} onFormSubmit={(data, cover, gallery) => mutation.mutate({ postData: data, coverImageFile: cover, galleryFiles: gallery })} onCancel={() => { setIsFormOpen(false); setEditingPost(null); }} />}
//             <div className="bg-white shadow-md rounded-lg"><table className="min-w-full responsive-table"><thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Title (English)</th><th className="p-4 text-left font-semibold">Created At</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead><tbody>{isLoading ? <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr> : posts?.map(post => (<tr key={post.id}><td data-label="Title">{post.title_en}</td><td data-label="Created At">{new Date(post.created_at).toLocaleDateString()}</td><td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2"><button onClick={() => { setEditingPost(post); setIsFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover w-full md:w-auto">Edit</button><button onClick={() => window.confirm('Are you sure?') && deleteMutation.mutate(post.id)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700 w-full md:w-auto">Delete</button></td></tr>))}</tbody></table></div>
//         </div>
//     );
// };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useState, useEffect, useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon } from '../../components/Icon';
import clsx from 'clsx';

const PostSchema = z.object({
    title_en: z.string().min(3, 'English title is required'),
    title_zh_hant: z.string().min(1, 'Chinese title is required'),
    content_en: z.string().optional(),
    content_zh_hant: z.string().optional(),
});
type PostFormInputs = z.infer<typeof PostSchema>;
type Post = {
    id: string;
    created_at: string;
    image_url: string;
    images: string[] | null;
} & PostFormInputs;

const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message || 'Image upload failed');
    return data.secure_url;
};

const ImageUploader = ({
    existingImages,
    onFilesChange,
}: {
    existingImages: string[];
    onFilesChange: (files: File[], remainingExisting: string[]) => void;
}) => {
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [existing, setExisting] = useState<string[]>(existingImages);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        onFilesChange(newFiles, existing);
    }, [newFiles, existing, onFilesChange]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setNewFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
            e.dataTransfer.clearData();
        }
    }, []);

    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium">Post Images</label>
            <p className="text-xs text-neutral-500">The first image will be the cover image. You can drag and drop files here.</p>
            <div onDrop={handleDrop} onDragOver={handleDragEvents} onDragEnter={handleDragEvents} onDragLeave={handleDragEvents} className={clsx('mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors', isDragging ? 'border-primary bg-blue-50' : 'border-border')}>
                <input id="gallery-upload" type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center justify-center">
                    <Icon path="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" className="w-10 h-10 text-neutral-400" />
                    <p className="text-sm text-text-secondary mt-2">Drag & drop files or <span className="text-primary font-semibold">click to browse</span></p>
                </label>
            </div>
            {(existing.length > 0 || newFiles.length > 0) ? (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {existing.map(url => (<div key={url} className="relative aspect-square"><img src={url} className="w-full h-full object-cover rounded-md border" /><button type="button" onClick={() => setExisting(g => g.filter(item => item !== url))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md">&times;</button></div>))}
                    {newFiles.map((file, index) => (<div key={`${file.name}-${index}`} className="relative aspect-square"><img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-md border" /><button type="button" onClick={() => setNewFiles(f => f.filter((_, i) => i !== index))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md">&times;</button></div>))}
                </div>
            ) : <p className="text-sm text-system-danger mt-2">At least one image is required.</p>}
        </div>
    );
};

const PostForm = ({ post, onFormSubmit, onCancel }: { post?: Post | null, onFormSubmit: (data: PostFormInputs, galleryFiles: File[], existingGallery: string[]) => void, onCancel: () => void }) => {
    const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [existingGallery, setExistingGallery] = useState<string[]>(post?.images || []);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PostFormInputs>({ defaultValues: post || {}, resolver: zodResolver(PostSchema) });
    const onSubmit: SubmitHandler<PostFormInputs> = (data) => { onFormSubmit(data, galleryFiles, existingGallery); };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">{post ? 'Edit Post' : 'Create New Post'}</h2>
                <div className="border-b border-gray-200 mb-4"><nav className="-mb-px flex space-x-8"><button type="button" onClick={() => setActiveTab('en')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'en' ? 'border-primary text-primary' : 'border-transparent'}`}>English</button><button type="button" onClick={() => setActiveTab('zh')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'zh' ? 'border-primary text-primary' : 'border-transparent'}`}>Chinese</button></nav></div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className={activeTab === 'en' ? 'block' : 'hidden'}><div className="space-y-4"><div><label>Title (English)</label><input {...register('title_en')} className="mt-1 w-full p-2 border rounded-md" />{errors.title_en && <p className="text-sm text-system-danger">{errors.title_en.message}</p>}</div><div><label>Content (English)</label><textarea {...register('content_en')} rows={5} className="mt-1 w-full p-2 border rounded-md" /></div></div></div>
                    <div className={activeTab === 'zh' ? 'block' : 'hidden'}><div className="space-y-4"><div><label>Title (Chinese)</label><input {...register('title_zh_hant')} className="mt-1 w-full p-2 border rounded-md" />{errors.title_zh_hant && <p className="text-sm text-system-danger">{errors.title_zh_hant.message}</p>}</div><div><label>Content (Chinese)</label><textarea {...register('content_zh_hant')} rows={5} className="mt-1 w-full p-2 border rounded-md" /></div></div></div>
                    <hr />
                    <ImageUploader existingImages={post?.images || []} onFilesChange={(files, remaining) => { setGalleryFiles(files); setExistingGallery(remaining); }} />
                    <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral-200 rounded-md font-semibold">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md font-semibold disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Post'}</button></div>
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

    const { data: posts, isLoading } = useQuery<Post[]>({ queryKey: ['cms_posts'], queryFn: async () => { const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false }); if (error) throw new Error(error.message); return data; }, });
    const mutation = useMutation({
        mutationFn: async ({ postData, galleryFiles, existingGallery }: { postData: PostFormInputs, galleryFiles: File[], existingGallery: string[] }) => {
            let finalGalleryUrls = [...existingGallery];
            if (galleryFiles && galleryFiles.length > 0) {
                toast.loading(`Uploading ${galleryFiles.length} new images...`);
                const uploadPromises = galleryFiles.map(file => uploadToCloudinary(file));
                const newUrls = await Promise.all(uploadPromises);
                finalGalleryUrls = [...finalGalleryUrls, ...newUrls];
                toast.dismiss();
            }
            if (finalGalleryUrls.length === 0) throw new Error("At least one image is required for the post.");
            const coverImageUrl = finalGalleryUrls[0];
            const dataToSubmit = { ...postData, image_url: coverImageUrl, images: finalGalleryUrls, author_id: user!.id };
            if (editingPost) {
                const { error } = await supabase.from('posts').update(dataToSubmit).eq('id', editingPost.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('posts').insert(dataToSubmit);
                if (error) throw error;
            }
        },
        onSuccess: () => { toast.success(`Post ${editingPost ? 'updated' : 'created'} successfully!`); queryClient.invalidateQueries({ queryKey: ['cms_posts'] }); setIsFormOpen(false); setEditingPost(null); },
        onError: (error) => { toast.dismiss(); toast.error(error.message); }
    });

    const deleteMutation = useMutation({ mutationFn: async (postId: string) => { const { error } = await supabase.from('posts').delete().eq('id', postId); if (error) throw error; }, onSuccess: () => { toast.success('Post deleted.'); queryClient.invalidateQueries({ queryKey: ['cms_posts'] }); }, onError: (error) => { toast.error(error.message); } });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Manage Posts</h1><button onClick={() => { setEditingPost(null); setIsFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Create New Post</button></div>
            {isFormOpen && <PostForm post={editingPost} onFormSubmit={(data, gallery, existing) => mutation.mutate({ postData: data, galleryFiles: gallery, existingGallery: existing })} onCancel={() => { setIsFormOpen(false); setEditingPost(null); }} />}
            <div className="bg-white shadow-md rounded-lg"><table className="min-w-full responsive-table"><thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Title (English)</th><th className="p-4 text-left font-semibold">Created At</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead><tbody>{isLoading ? <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr> : posts?.map(post => (<tr key={post.id}><td data-label="Title">{post.title_en}</td><td data-label="Created At">{new Date(post.created_at).toLocaleDateString()}</td><td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2"><button onClick={() => { setEditingPost(post); setIsFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover w-full md:w-auto">Edit</button><button onClick={() => window.confirm('Are you sure?') && deleteMutation.mutate(post.id)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700 w-full md:w-auto">Delete</button></td></tr>))}</tbody></table></div>
        </div>
    );
};