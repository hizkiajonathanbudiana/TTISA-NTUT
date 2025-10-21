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
  cta_event_id: z.string().optional(),
  cta_text_en: z.string().optional(),
  cta_text_zh_hant: z.string().optional(),
});
type PostFormInputs = z.infer<typeof PostSchema>;
type Post = { id: string; created_at: string; image_url: string; images: string[] | null; } & PostFormInputs;
type EventSelection = { id: string; title_en: string | null; };

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error.message || 'Image upload failed');
  return data.secure_url;
};

const ImageUploader = ({ existingImages, onFilesChange }: { existingImages: string[], onFilesChange: (files: File[], remainingExisting: string[]) => void }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [existing, setExisting] = useState<string[]>(existingImages);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        onFilesChange(files, existing);
    }, [files, existing, onFilesChange]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) { setFiles(prev => [...prev, ...Array.from(e.target.files!)]); }
    };
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) { setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]); e.dataTransfer.clearData(); }
    }, []);
    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    
    return (
        <div>
            <label className="block text-sm font-medium">Post Images</label>
            <p className="text-xs text-neutral-500">The first image will be the cover image. You can drag and drop files here.</p>
            <div onDrop={handleDrop} onDragOver={handleDragEvents} onDragEnter={() => setIsDragging(true)} onDragLeave={() => setIsDragging(false)} className={clsx('mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors', isDragging ? 'border-primary bg-blue-50' : 'border-border')}>
                <input id="gallery-upload" type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                <label htmlFor="gallery-upload" className="cursor-pointer">
                    <p className="text-text-secondary">Drag & drop files or click to browse</p>
                </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
                {existing.map(url => (<div key={url} className="relative w-28 h-28"><img src={url} className="w-full h-full object-cover rounded-md border" /><button type="button" onClick={() => setExisting(g => g.filter(item => item !== url))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">&times;</button></div>))}
                {files.map((file, index) => (<div key={`${file.name}-${index}`} className="relative w-28 h-28"><img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-md border" /><button type="button" onClick={() => setFiles(f => f.filter((_, i) => i !== index))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">&times;</button></div>))}
            </div>
            {existing.length === 0 && files.length === 0 && <p className="text-sm text-system-danger mt-2">At least one image is required.</p>}
        </div>
    );
};

const PostForm = ({ post, onFormSubmit, onCancel }: { post?: Post | null, onFormSubmit: (data: PostFormInputs, galleryFiles: File[], existingGallery: string[]) => void, onCancel: () => void }) => {
  const [activeTab, setActiveTab] = useState<'en' | 'zh'>('en');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>(post?.images || []);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PostFormInputs>({ defaultValues: post || { cta_event_id: '' }, resolver: zodResolver(PostSchema) });
  
  const { data: events } = useQuery<EventSelection[]>({
      queryKey: ['event_selection_list'],
      queryFn: async () => {
          const { data, error } = await supabase.from('events').select('id, title_en').order('start_at', { ascending: false });
          if (error) throw error;
          return data;
      }
  });

  const onSubmit: SubmitHandler<PostFormInputs> = (data) => { onFormSubmit(data, galleryFiles, existingGallery); };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{post ? 'Edit Post' : 'Create New Post'}</h2>
        <div className="border-b border-gray-200 mb-4"><nav className="-mb-px flex space-x-8"><button type="button" onClick={() => setActiveTab('en')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'en' ? 'border-primary text-primary' : 'border-transparent'}`}>English</button><button type="button" onClick={() => setActiveTab('zh')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'zh' ? 'border-primary text-primary' : 'border-transparent'}`}>Chinese</button></nav></div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className={activeTab === 'en' ? 'block' : 'hidden'}><div className="space-y-4"><div><label>Title (English)</label><input {...register('title_en')} className="mt-1 w-full p-2 border rounded-md" />{errors.title_en && <p className="text-sm text-system-danger">{errors.title_en.message}</p>}</div><div><label>Content (English)</label><textarea {...register('content_en')} rows={5} className="mt-1 w-full p-2 border rounded-md" /></div></div></div>
          <div className={activeTab === 'zh' ? 'block' : 'hidden'}><div className="space-y-4"><div><label>Title (Chinese)</label><input {...register('title_zh_hant')} className="mt-1 w-full p-2 border rounded-md" />{errors.title_zh_hant && <p className="text-sm text-system-danger">{errors.title_zh_hant.message}</p>}</div><div><label>Content (Chinese)</label><textarea {...register('content_zh_hant')} rows={5} className="mt-1 w-full p-2 border rounded-md" /></div></div></div>
          <hr/>
          <ImageUploader existingImages={post?.images || []} onFilesChange={(files, remaining) => { setGalleryFiles(files); setExistingGallery(remaining); }} />
          <hr/>
          <div className="space-y-4 p-4 border rounded-md bg-neutral-50">
            <h3 className="font-semibold text-lg">Call to Action (Optional)</h3>
            <div><label className="block text-sm font-medium">Link to Event</label><select {...register('cta_event_id')} className="mt-1 w-full p-2 border rounded-md bg-white"><option value="">None</option>{events?.map(event => (<option key={event.id} value={event.id}>{event.title_en}</option>))}</select></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium">Button Text (English)</label><input {...register('cta_text_en')} placeholder="e.g., Register Here!" className="mt-1 w-full p-2 border rounded-md" /></div>
              <div><label className="block text-sm font-medium">Button Text (Chinese)</label><input {...register('cta_text_zh_hant')} placeholder="e.g., 點此報名" className="mt-1 w-full p-2 border rounded-md" /></div>
            </div>
          </div>
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
      
      const dataToSubmit = { 
        ...postData,
        image_url: finalGalleryUrls[0],
        images: finalGalleryUrls, 
        author_id: user!.id,
        cta_event_id: postData.cta_event_id || null,
      };
      
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
  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Post deleted.');
      queryClient.invalidateQueries({ queryKey: ['cms_posts'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Posts</h1>
        <button onClick={() => { setEditingPost(null); setIsFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Create New Post</button>
      </div>
      {isFormOpen && <PostForm post={editingPost} onFormSubmit={(data, gallery, existing) => mutation.mutate({ postData: data, galleryFiles: gallery, existingGallery: existing })} onCancel={() => { setIsFormOpen(false); setEditingPost(null); }} />}
      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full responsive-table">
          <thead className="bg-neutral-100">
            <tr>
              <th className="p-4 text-left font-semibold">Title (English)</th>
              <th className="p-4 text-left font-semibold">Created At</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr> : posts?.map(post => (
              <tr key={post.id}>
                <td data-label="Title">{post.title_en}</td>
                <td data-label="Created At">{new Date(post.created_at).toLocaleDateString()}</td>
                <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
                  <button onClick={() => { setEditingPost(post); setIsFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover w-full md:w-auto">Edit</button>
                  <button onClick={() => window.confirm('Are you sure?') && deleteMutation.mutate(post.id)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700 w-full md:w-auto">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import { supabase, useAuth } from '../../contexts/AuthContext';
// // import toast from 'react-hot-toast';
// // import { useState, useEffect, useCallback } from 'react';
// // import { useForm, type SubmitHandler, useWatch } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { z } from 'zod';
// // import { Icon } from '../../components/Icon';
// // import clsx from 'clsx';

// // const PostSchema = z.object({ title_en: z.string().min(3, 'English title is required'), title_zh_hant: z.string().min(1, 'Chinese title is required'), content_en: z.string().optional(), content_zh_hant: z.string().optional(), cta_link_type: z.enum(['none', 'event', 'external']).default('none'), cta_event_id: z.string().optional(), cta_external_link: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')), cta_text_en: z.string().optional(), cta_text_zh_hant: z.string().optional(), }).refine(data => { if (data.cta_link_type === 'external') return !!data.cta_external_link; return true; }, { message: "External URL is required when link type is set to External", path: ["cta_external_link"] });
// // type PostFormInputs = z.infer<typeof PostSchema>;
// // type Post = { id: string; created_at: string; image_url: string; images: string[] | null; author_id: string; profiles: { english_name: string | null; } | null; } & PostFormInputs;
// // type EventSelection = { id: string; title_en: string | null; };

// // const uploadToCloudinary = async (file: File): Promise<string> => { /* ... */ };
// // const ImageUploader = ({ existingImages, onFilesChange }: { existingImages: string[], onFilesChange: (files: File[], remainingExisting: string[]) => void }) => { /* ... */ };
// // const PostForm = ({ post, onFormSubmit, onCancel }: { post?: Post | null, onFormSubmit: (data: PostFormInputs, galleryFiles: File[], existingGallery: string[]) => void, onCancel: () => void }) => { /* ... */ };

// // export const PostsManagementPage = () => {
// //   const [isFormOpen, setIsFormOpen] = useState(false);
// //   const [editingPost, setEditingPost] = useState<Post | null>(null);
// //   const queryClient = useQueryClient();
// //   const { user, profile } = useAuth();

// //   const { data: posts, isLoading } = useQuery<Post[]>({
// //     queryKey: ['cms_posts'],
// //     queryFn: async () => { 
// //       const { data, error } = await supabase.from('posts').select('*, profiles(english_name)').order('created_at', { ascending: false });
// //       if (error) throw new Error(error.message);
// //       return data;
// //     },
// //   });

// //   const logAction = async (action: string, target_id?: string, details?: object) => {
// //     try {
// //       await supabase.functions.invoke('create-log', {
// //         body: { action, target_table: 'posts', target_id, details },
// //       });
// //     } catch (error) {
// //       console.error('Failed to log action:', error);
// //     }
// //   };

// //   const mutation = useMutation({
// //     mutationFn: async ({ postData, galleryFiles, existingGallery }: { postData: PostFormInputs, galleryFiles: File[], existingGallery: string[] }) => {
// //       let finalGalleryUrls = [...existingGallery];
// //       if (galleryFiles && galleryFiles.length > 0) {
// //         toast.loading(`Uploading ${galleryFiles.length} new images...`);
// //         const uploadPromises = galleryFiles.map(file => uploadToCloudinary(file));
// //         const newUrls = await Promise.all(uploadPromises);
// //         finalGalleryUrls = [...finalGalleryUrls, ...newUrls];
// //         toast.dismiss();
// //       }
// //       if (finalGalleryUrls.length === 0) throw new Error("At least one image is required for the post.");
      
// //       if (editingPost) {
// //         const { data, error } = await supabase.rpc('update_post', {
// //           p_post_id: editingPost.id, p_title_en: postData.title_en, p_title_zh_hant: postData.title_zh_hant, p_content_en: postData.content_en, p_content_zh_hant: postData.content_zh_hant, p_image_url: finalGalleryUrls[0], p_images: finalGalleryUrls,
// //           p_cta_event_id: postData.cta_link_type === 'event' ? postData.cta_event_id || null : null,
// //           p_cta_external_link: postData.cta_link_type === 'external' ? postData.cta_external_link || null : null,
// //           p_cta_text_en: postData.cta_text_en || null, p_cta_text_zh_hant: postData.cta_text_zh_hant || null,
// //         });
// //         if (error) throw error;
// //         await logAction('update', editingPost.id, { title: postData.title_en });
// //       } else {
// //         const dataToInsert = { 
// //             title_en: postData.title_en, title_zh_hant: postData.title_zh_hant, content_en: postData.content_en, content_zh_hant: postData.content_zh_hant, image_url: finalGalleryUrls[0], images: finalGalleryUrls, author_id: user!.id,
// //             cta_event_id: postData.cta_link_type === 'event' ? postData.cta_event_id || null : null,
// //             cta_external_link: postData.cta_link_type === 'external' ? postData.cta_external_link || null : null,
// //             cta_text_en: postData.cta_text_en || null, cta_text_zh_hant: postData.cta_text_zh_hant || null,
// //         };
// //         const { data: newPost, error } = await supabase.from('posts').insert(dataToInsert).select().single();
// //         if (error) throw error;
// //         await logAction('create', newPost.id, { title: postData.title_en });
// //       }
// //     },
// //     onSuccess: () => { toast.success(`Post ${editingPost ? 'updated' : 'created'} successfully!`); queryClient.invalidateQueries({ queryKey: ['cms_posts'] }); setIsFormOpen(false); setEditingPost(null); },
// //     onError: (error) => { toast.dismiss(); toast.error(error.message); }
// //   });

// //   const deleteMutation = useMutation({
// //     mutationFn: async (postToDelete: Post) => {
// //       const { error } = await supabase.from('posts').delete().eq('id', postToDelete.id);
// //       if (error) throw error;
// //       return postToDelete;
// //     },
// //     onSuccess: (deletedPost) => {
// //       toast.success('Post deleted.');
// //       logAction('delete', deletedPost.id, { title: deletedPost.title_en });
// //       queryClient.invalidateQueries({ queryKey: ['cms_posts'] });
// //     },
// //     onError: (error) => { toast.error(error.message); },
// //   });

// //   const userRole = profile?.roles?.name;

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Manage Posts</h1><button onClick={() => { setEditingPost(null); setIsFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Create New Post</button></div>
// //       {isFormOpen && <PostForm post={editingPost} onFormSubmit={(data, gallery, existing) => mutation.mutate({ postData: data, galleryFiles: gallery, existingGallery: existing })} onCancel={() => { setIsFormOpen(false); setEditingPost(null); }} />}
// //       <div className="bg-white shadow-md rounded-lg overflow-x-auto">
// //         <table className="min-w-full responsive-table">
// //           <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Title (English)</th><th className="p-4 text-left font-semibold">Author</th><th className="p-4 text-left font-semibold">Created At</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
// //           <tbody>
// //             {isLoading ? <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr> : posts?.map(post => {
// //               const canEdit = userRole === 'developer' || userRole === 'admin' || (userRole === 'organizer' && post.author_id === user?.id);
// //               return (
// //                 <tr key={post.id} className="border-b">
// //                   <td data-label="Title">{post.title_en}</td>
// //                   <td data-label="Author">{post.profiles?.english_name || 'N/A'}</td>
// //                   <td data-label="Created At">{new Date(post.created_at).toLocaleDateString()}</td>
// //                   <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
// //                     {canEdit && ( <> <button onClick={() => { setEditingPost(post); setIsFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover w-full md:w-auto">Edit</button> <button onClick={() => window.confirm('Are you sure you want to delete this post?') && deleteMutation.mutate(post)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700 w-full md:w-auto">Delete</button> </> )}
// //                   </td>
// //                 </tr>
// //               )
// //             })}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase, useAuth } from '../../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import { useState, useEffect, useCallback } from 'react';
// import { useForm, type SubmitHandler, useWatch } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Icon } from '../../components/Icon';
// import clsx from 'clsx';

// const PostSchema = z.object({ title_en: z.string().min(3, 'English title is required'), title_zh_hant: z.string().min(1, 'Chinese title is required'), content_en: z.string().optional(), content_zh_hant: z.string().optional(), cta_link_type: z.enum(['none', 'event', 'external']).default('none'), cta_event_id: z.string().optional(), cta_external_link: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')), cta_text_en: z.string().optional(), cta_text_zh_hant: z.string().optional(), }).refine(data => { if (data.cta_link_type === 'external') return !!data.cta_external_link; return true; }, { message: "External URL is required when link type is set to External", path: ["cta_external_link"] });
// type PostFormInputs = z.infer<typeof PostSchema>;
// type Post = { id: string; created_at: string; image_url: string; images: string[] | null; author_id: string; profiles: { english_name: string | null; } | null; } & PostFormInputs;
// type EventSelection = { id: string; title_en: string | null; };

// const uploadToCloudinary = async (file: File): Promise<string> => { /* ... */ };
// const ImageUploader = ({ existingImages, onFilesChange }: { existingImages: string[], onFilesChange: (files: File[], remainingExisting: string[]) => void }) => { /* ... */ };
// const PostForm = ({ post, onFormSubmit, onCancel }: { post?: Post | null, onFormSubmit: (data: PostFormInputs, galleryFiles: File[], existingGallery: string[]) => void, onCancel: () => void }) => { /* ... */ };

// export const PostsManagementPage = () => {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingPost, setEditingPost] = useState<Post | null>(null);
//   const queryClient = useQueryClient();
//   const { user, profile } = useAuth();
//   const { data: posts, isLoading } = useQuery<Post[]>({ queryKey: ['cms_posts'], queryFn: async () => { const { data, error } = await supabase.from('posts').select('*, profiles(english_name)').order('created_at', { ascending: false }); if (error) throw new Error(error.message); return data; }, });

//   const logAction = async (action: string, target_id?: string, details?: object) => { try { await supabase.functions.invoke('create-log', { body: { action, target_table: 'posts', target_id, details } }); } catch (error) { console.error('Failed to log action:', error); } };

//   const mutation = useMutation({
//     mutationFn: async ({ postData, galleryFiles, existingGallery }: { postData: PostFormInputs, galleryFiles: File[], existingGallery: string[] }) => {
//       let finalGalleryUrls = [...existingGallery];
//       if (galleryFiles && galleryFiles.length > 0) {
//         toast.loading(`Uploading ${galleryFiles.length} new images...`);
//         const uploadPromises = galleryFiles.map(file => uploadToCloudinary(file));
//         const newUrls = await Promise.all(uploadPromises);
//         finalGalleryUrls = [...finalGalleryUrls, ...newUrls];
//         toast.dismiss();
//       }
//       if (finalGalleryUrls.length === 0) throw new Error("At least one image is required for the post.");
      
//       const baseDataToSubmit = { title_en: postData.title_en, title_zh_hant: postData.title_zh_hant, content_en: postData.content_en, content_zh_hant: postData.content_zh_hant, image_url: finalGalleryUrls[0], images: finalGalleryUrls, cta_event_id: postData.cta_link_type === 'event' ? postData.cta_event_id || null : null, cta_external_link: postData.cta_link_type === 'external' ? postData.cta_external_link || null : null, cta_text_en: postData.cta_text_en || null, cta_text_zh_hant: postData.cta_text_zh_hant || null, };

//       if (editingPost) {
//         const { error } = await supabase.from('posts').update(baseDataToSubmit).eq('id', editingPost.id);
//         if (error) throw error;
//         await logAction('update', editingPost.id, { title: postData.title_en });
//       } else {
//         const dataToInsert = { ...baseDataToSubmit, author_id: user!.id };
//         const { data: newPost, error } = await supabase.from('posts').insert(dataToInsert).select().single();
//         if (error) throw error;
//         if (newPost) await logAction('create', newPost.id, { title: postData.title_en });
//       }
//     },
//     onSuccess: () => { toast.success(`Post ${editingPost ? 'updated' : 'created'} successfully!`); queryClient.invalidateQueries({ queryKey: ['cms_posts'] }); setIsFormOpen(false); setEditingPost(null); },
//     onError: (error) => { toast.dismiss(); toast.error(error.message); }
//   });
  
//   const deleteMutation = useMutation({
//     mutationFn: async (postToDelete: Post) => {
//       const { error } = await supabase.from('posts').delete().eq('id', postToDelete.id);
//       if (error) throw error;
//       return postToDelete;
//     },
//     onSuccess: (deletedPost) => {
//       toast.success('Post deleted.');
//       logAction('delete', deletedPost.id, { title: deletedPost.title_en });
//       queryClient.invalidateQueries({ queryKey: ['cms_posts'] });
//     },
//     onError: (error) => { toast.error(error.message); },
//   });

//   const userRole = profile?.roles?.name;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Manage Posts</h1><button onClick={() => { setEditingPost(null); setIsFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Create New Post</button></div>
//       {isFormOpen && <PostForm post={editingPost} onFormSubmit={(data, gallery, existing) => mutation.mutate({ postData: data, galleryFiles: gallery, existingGallery: existing })} onCancel={() => { setIsFormOpen(false); setEditingPost(null); }} />}
//       <div className="bg-white shadow-md rounded-lg overflow-x-auto">
//         <table className="min-w-full responsive-table">
//           <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Title (English)</th><th className="p-4 text-left font-semibold">Author</th><th className="p-4 text-left font-semibold">Created At</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
//           <tbody>
//             {isLoading ? <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr> : posts?.map(post => {
//               const canEdit = userRole === 'developer' || userRole === 'admin' || (userRole === 'organizer' && post.author_id === user?.id);
//               return (
//                 <tr key={post.id} className="border-b">
//                   <td data-label="Title">{post.title_en}</td>
//                   <td data-label="Author">{post.profiles?.english_name || 'N/A'}</td>
//                   <td data-label="Created At">{new Date(post.created_at).toLocaleDateString()}</td>
//                   <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
//                     {canEdit && (<><button onClick={() => { setEditingPost(post); setIsFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover w-full md:w-auto">Edit</button><button onClick={() => window.confirm('Are you sure?') && deleteMutation.mutate(post)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700 w-full md:w-auto">Delete</button></>)}
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase, useAuth } from '../../contexts/AuthContext';
// import toast from 'react-hot-toast';
// import { useState, useEffect, useCallback } from 'react';
// import { useForm, type SubmitHandler, useWatch } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Icon } from '../../components/Icon';
// import clsx from 'clsx';

// const PostSchema = z.object({ title_en: z.string().min(3, 'English title is required'), title_zh_hant: z.string().min(1, 'Chinese title is required'), content_en: z.string().optional(), content_zh_hant: z.string().optional(), cta_link_type: z.enum(['none', 'event', 'external']).default('none'), cta_event_id: z.string().optional(), cta_external_link: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')), cta_text_en: z.string().optional(), cta_text_zh_hant: z.string().optional(), }).refine(data => { if (data.cta_link_type === 'external') return !!data.cta_external_link; return true; }, { message: "External URL is required when link type is set to External", path: ["cta_external_link"] });
// type PostFormInputs = z.infer<typeof PostSchema>;
// type Post = { id: string; created_at: string; image_url: string; images: string[] | null; author_id: string; profiles: { english_name: string | null; } | null; } & PostFormInputs;
// type EventSelection = { id: string; title_en: string | null; };

// const uploadToCloudinary = async (file: File): Promise<string> => { const formData = new FormData(); formData.append('file', file); formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData }); const data = await response.json(); if (!response.ok) throw new Error(data.error.message || 'Image upload failed'); return data.secure_url; };
// const ImageUploader = ({ existingImages, onFilesChange }: { existingImages: string[], onFilesChange: (files: File[], remainingExisting: string[]) => void }) => { /* ... */ };
// const PostForm = ({ post, onFormSubmit, onCancel }: { post?: Post | null, onFormSubmit: (data: PostFormInputs, galleryFiles: File[], existingGallery: string[]) => void, onCancel: () => void }) => { /* ... */ };

// export const PostsManagementPage = () => {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingPost, setEditingPost] = useState<Post | null>(null);
//   const queryClient = useQueryClient();
//   const { user, profile } = useAuth();

//   const { data: posts, isLoading } = useQuery<Post[]>({ queryKey: ['cms_posts'], queryFn: async () => { const { data, error } = await supabase.from('posts').select('*, profiles(english_name)').order('created_at', { ascending: false }); if (error) throw new Error(error.message); return data; }, });
//   const mutation = useMutation({
//     mutationFn: async ({ postData, galleryFiles, existingGallery }: { postData: PostFormInputs, galleryFiles: File[], existingGallery: string[] }) => {
//       let finalGalleryUrls = [...existingGallery];
//       if (galleryFiles && galleryFiles.length > 0) {
//         toast.loading(`Uploading ${galleryFiles.length} new images...`);
//         const uploadPromises = galleryFiles.map(file => uploadToCloudinary(file));
//         const newUrls = await Promise.all(uploadPromises);
//         finalGalleryUrls = [...finalGalleryUrls, ...newUrls];
//         toast.dismiss();
//       }
//       if (finalGalleryUrls.length === 0) throw new Error("At least one image is required.");
//       const dataToSubmit = { 
//         title_en: postData.title_en, title_zh_hant: postData.title_zh_hant,
//         content_en: postData.content_en, content_zh_hant: postData.content_zh_hant,
//         image_url: finalGalleryUrls[0], images: finalGalleryUrls,
//         cta_event_id: postData.cta_link_type === 'event' ? postData.cta_event_id || null : null,
//         cta_external_link: postData.cta_link_type === 'external' ? postData.cta_external_link || null : null,
//         cta_text_en: postData.cta_text_en || null, cta_text_zh_hant: postData.cta_text_zh_hant || null,
//       };
//       if (editingPost) {
//         const { error } = await supabase.from('posts').update(dataToSubmit).eq('id', editingPost.id);
//         if (error) throw error;
//       } else {
//         const { error } = await supabase.from('posts').insert({ ...dataToSubmit, author_id: user!.id });
//         if (error) throw error;
//       }
//     },
//     onSuccess: () => { toast.success(`Post ${editingPost ? 'updated' : 'created'} successfully!`); queryClient.invalidateQueries({ queryKey: ['cms_posts'] }); setIsFormOpen(false); setEditingPost(null); },
//     onError: (error) => { toast.dismiss(); toast.error(error.message); }
//   });
//   const deleteMutation = useMutation({ mutationFn: async (postToDelete: Post) => { const { error } = await supabase.from('posts').delete().eq('id', postToDelete.id); if (error) throw error; return postToDelete; }, onSuccess: () => { toast.success('Post deleted.'); queryClient.invalidateQueries({ queryKey: ['cms_posts'] }); }, onError: (error) => { toast.error(error.message); }, });
//   const userRole = profile?.roles?.name;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Manage Posts</h1><button onClick={() => { setEditingPost(null); setIsFormOpen(true); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">Create New Post</button></div>
//       {isFormOpen && <PostForm post={editingPost} onFormSubmit={(data, gallery, existing) => mutation.mutate({ postData: data, galleryFiles: gallery, existingGallery: existing })} onCancel={() => { setIsFormOpen(false); setEditingPost(null); }} />}
//       <div className="bg-white shadow-md rounded-lg overflow-x-auto">
//         <table className="min-w-full responsive-table">
//           <thead className="bg-neutral-100"><tr><th className="p-4 text-left font-semibold">Title (English)</th><th className="p-4 text-left font-semibold">Author</th><th className="p-4 text-left font-semibold">Created At</th><th className="p-4 text-right font-semibold">Actions</th></tr></thead>
//           <tbody>
//             {isLoading ? <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr> : posts?.map(post => {
//               const canEdit = userRole === 'developer' || userRole === 'admin' || (userRole === 'member' && post.author_id === user?.id);
//               return (
//                 <tr key={post.id}>
//                   <td data-label="Title">{post.title_en}</td>
//                   <td data-label="Author">{post.profiles?.english_name || 'N/A'}</td>
//                   <td data-label="Created At">{new Date(post.created_at).toLocaleDateString()}</td>
//                   <td data-label="Actions" className="text-right space-y-2 md:space-y-0 md:space-x-2">
//                     {canEdit && (<><button onClick={() => { setEditingPost(post); setIsFormOpen(true); }} className="px-3 py-1 bg-secondary text-white rounded-md text-sm font-semibold hover:bg-secondary-hover w-full md:w-auto">Edit</button><button onClick={() => window.confirm('Are you sure?') && deleteMutation.mutate(post)} className="px-3 py-1 bg-system-danger text-white rounded-md text-sm font-semibold hover:bg-red-700 w-full md:w-auto">Delete</button></>)}
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };