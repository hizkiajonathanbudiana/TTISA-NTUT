// import { useQuery } from '@tanstack/react-query';
// import { Link, useParams } from 'react-router-dom';
// import { supabase } from '../contexts/AuthContext';
// import { useTranslation } from '../contexts/LanguageContext';
// import { motion } from 'framer-motion';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// type Post = {
//     id: string;
//     title_en: string | null;
//     title_zh_hant: string | null;
//     content_en: string | null;
//     content_zh_hant: string | null;
//     image_url: string; // Gambar utama
//     images: string[] | null; // Galeri gambar
//     created_at: string;
//     profiles: { english_name: string | null; avatar_url: string | null; } | null;
// };

// export const PostDetailPage = () => {
//     const { slug: postId } = useParams<{ slug: string }>();
//     const { language, t } = useTranslation();

//     const { data: post, isLoading, error } = useQuery<Post>({
//         queryKey: ['post', postId],
//         queryFn: async () => {
//             const { data, error } = await supabase.from('posts').select('*, profiles(english_name, avatar_url)').eq('id', postId!).single();
//             if (error) throw new Error(error.message);
//             return data;
//         },
//         enabled: !!postId,
//     });

//     const title = language === 'zh-HANT' && post?.title_zh_hant ? post.title_zh_hant : post?.title_en;
//     const content = language === 'zh-HANT' && post?.content_zh_hant ? post.content_zh_hant : post?.content_en;
//     const galleryImages = post?.images && post.images.length > 0 ? post.images : (post?.image_url ? [post.image_url] : []);

//     if (isLoading) return <div className="text-center py-40">Loading post...</div>;
//     if (error) return <div className="text-center py-40 text-system-danger">Error: {error.message}</div>;
//     if (!post) return <div className="text-center py-40">Post not found.</div>;

//     const authorName = post.profiles?.english_name || 'TTISA Admin';
//     const authorAvatar = post.profiles?.avatar_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${post.profiles.avatar_url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${authorName}`;
//     const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

//     return (
//         <div className="bg-background">
//             {/* add a gap for size navbar here  */}
//             <section className="relative h-[70vh] min-h-[500px] flex flex-col justify-center items-center text-white p-4 overflow-hidden">
//                 <div className="absolute inset-0 z-0"><img src={post.image_url} alt="Post Background" className="w-full h-full object-cover filter blur-lg scale-110" /><div className="absolute inset-0 bg-black/50"></div></div>
//                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 container mx-auto text-center">
//                     <div className="max-w-2xl mx-auto">
//                         <Swiper modules={[Navigation, Pagination]} spaceBetween={50} slidesPerView={1} navigation pagination={{ clickable: true }} className="w-full aspect-square rounded-2xl shadow-2xl mb-8">
//                             {galleryImages.map((imgUrl: string, index: number) => (<SwiperSlide key={index}><img src={imgUrl} alt={`Post gallery image ${index + 1}`} className="w-full h-full object-cover" /></SwiperSlide>))}
//                         </Swiper>
//                     </div>
//                     <Link to="/posts" className="text-white/80 hover:text-white mb-4 inline-block">&larr; {t('posts.backToPosts')}</Link>
//                     <h1 className="text-4xl md:text-6xl font-bold">{title}</h1>
//                 </motion.div>
//             </section>

//             <div className="container mx-auto py-12 px-4 -mt-24">
//                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg">
//                     <div className="flex items-center text-sm text-text-secondary mb-6">
//                         <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full mr-3 object-cover" />
//                         <div><p className="font-semibold text-text-primary">{t('posts.by')} {authorName}</p><p>{formattedDate}</p></div>
//                     </div>
//                     <div className="prose max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap"><p>{content || 'No additional content available.'}</p></div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };

import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Post = {
    id: string;
    title_en: string | null;
    title_zh_hant: string | null;
    content_en: string | null;
    content_zh_hant: string | null;
    image_url: string;
    images: string[] | null;
    created_at: string;
    profiles: { english_name: string | null; avatar_url: string | null; } | null;
};

export const PostDetailPage = () => {
    const { slug: postId } = useParams<{ slug: string }>();
    const { language, t } = useTranslation();

    const { data: post, isLoading, error } = useQuery<Post>({
        queryKey: ['post', postId],
        queryFn: async () => { const { data, error } = await supabase.from('posts').select('*, profiles(english_name, avatar_url)').eq('id', postId!).single(); if (error) throw new Error(error.message); return data; },
        enabled: !!postId,
    });

    const title = language === 'zh-HANT' && post?.title_zh_hant ? post.title_zh_hant : post?.title_en;
    const content = language === 'zh-HANT' && post?.content_zh_hant ? post.content_zh_hant : post?.content_en;
    const galleryImages = post?.images && post.images.length > 0 ? post.images : (post?.image_url ? [post.image_url] : []);

    if (isLoading) return <div className="text-center py-40">Loading post...</div>;
    if (error) return <div className="text-center py-40 text-system-danger">Error: {error.message}</div>;
    if (!post) return <div className="text-center py-40">Post not found.</div>;

    const authorName = post.profiles?.english_name || 'TTISA Admin';
    const authorAvatar = post.profiles?.avatar_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${post.profiles.avatar_url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${authorName}`;
    const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="bg-background">
            <div className="h-20 bg-card-bg" /> {/* Ini adalah GAP untuk navbar */}
            <section className="relative h-[70vh] min-h-[500px] flex flex-col justify-center items-center text-white p-4 overflow-hidden">
                <div className="absolute inset-0 z-0"><img src={post.image_url} alt="Post Background" className="w-full h-full object-cover filter blur-lg scale-110" /><div className="absolute inset-0 bg-black/50"></div></div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 container mx-auto text-center">
                    <div className="max-w-2xl mx-auto">
                        <Swiper modules={[Navigation, Pagination]} spaceBetween={50} slidesPerView={1} navigation pagination={{ clickable: true }} className="w-full aspect-square rounded-2xl shadow-2xl mb-8">
                            {galleryImages.map((imgUrl: string, index: number) => (<SwiperSlide key={index}><img src={imgUrl} alt={`Post gallery image ${index + 1}`} className="w-full h-full object-cover" /></SwiperSlide>))}
                        </Swiper>
                    </div>
                    <Link to="/posts" className="text-white/80 hover:text-white mb-4 inline-block">&larr; {t('posts.backToPosts')}</Link>
                    <h1 className="text-4xl md:text-6xl font-bold">{title}</h1>
                </motion.div>
            </section>

            <div className="container mx-auto py-12 px-4 -mt-16 md:-mt-24 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-4xl mx-auto bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg">
                    <div className="flex items-center text-sm text-text-secondary mb-6">
                        <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full mr-3 object-cover" />
                        <div><p className="font-semibold text-text-primary">{t('posts.by')} {authorName}</p><p>{formattedDate}</p></div>
                    </div>
                    <div className="prose max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap"><p>{content || 'No additional content available.'}</p></div>
                </motion.div>
            </div>
        </div>
    );
};