// import { useQuery } from '@tanstack/react-query';
// import { Link } from 'react-router-dom';
// import { supabase } from '../contexts/AuthContext';
// import { useTranslation } from '../contexts/LanguageContext';
// import { motion } from 'framer-motion';

// type Post = {
//     id: string;
//     title_en: string | null;
//     title_zh_hant: string | null;
//     image_url: string;
//     created_at: string;
//     profiles: {
//         english_name: string | null;
//     } | null;
// };

// const PostCard = ({ post }: { post: Post }) => {
//     const { language } = useTranslation();
//     const title = language === 'zh-HANT' && post.title_zh_hant ? post.title_zh_hant : post.title_en;

//     return (
//         <Link to={`/posts/${post.id}`} className="block group bg-white/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
//             <div className="aspect-square w-full overflow-hidden">
//                 <img src={post.image_url} alt={title || 'Post image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
//             </div>
//             <div className="p-4">
//                 <h3 className="font-bold text-text-primary truncate">{title}</h3>
//             </div>
//         </Link>
//     );
// };

// export const PostsPage = () => {
//     const { t } = useTranslation();
//     const { data: posts, isLoading, error } = useQuery<Post[]>({
//         queryKey: ['posts'],
//         queryFn: async () => {
//             const { data, error } = await supabase.from('posts').select('id, title_en, title_zh_hant, image_url, created_at, profiles(english_name)').order('created_at', { ascending: false });
//             if (error) throw new Error(error.message);
//             return data as unknown as Post[];
//         },
//     });

//     if (error) return <div className="text-center py-40 text-system-danger">Error loading posts: {error.message}</div>;

//     return (
//         <div className="bg-background">
//             <section className="relative pt-40 pb-20 flex items-center justify-center text-center p-4 overflow-hidden">
//                 <div className="absolute inset-0 z-0 opacity-50">
//                     <div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl animate-pulse"></div>
//                     <div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
//                 </div>
//                 <div className="relative z-10 max-w-3xl">
//                     <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold text-text-primary">{t('posts.pageTitle')}</motion.h1>
//                     <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-4 text-lg md:text-xl text-text-secondary">{t('posts.pageSubtitle')}</motion.p>
//                 </div>
//             </section>

//             <section className="py-16 md:py-24 container mx-auto px-4">
//                 {isLoading ? (
//                     <div className="text-center text-text-secondary">Loading posts...</div>
//                 ) : posts && posts.length > 0 ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {posts.map((post, i) => (
//                             <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
//                                 <PostCard post={post} />
//                             </motion.div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-12 text-text-secondary bg-white/30 backdrop-blur-sm rounded-lg">
//                         <p>No posts yet. Check back soon!</p>
//                     </div>
//                 )}
//             </section>
//         </div>
//     );
// };

import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '../components/loading/Loading';

type Post = {
    id: string;
    title_en: string | null;
    title_zh_hant: string | null;
    image_url: string;
    created_at: string;
    profiles: {
        english_name: string | null;
    } | null;
};

const PostCard = ({ post }: { post: Post }) => {
    const { language } = useTranslation();
    const title = language === 'zh-HANT' && post.title_zh_hant ? post.title_zh_hant : post.title_en;

    return (
        <Link to={`/posts/${post.id}`} className="block group bg-white/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
            <div className="aspect-square w-full overflow-hidden">
                <img src={post.image_url} alt={title || 'Post image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4">
                <h3 className="font-bold text-text-primary truncate">{title}</h3>
            </div>
        </Link>
    );
};

const fetchPosts = async ({ pageParam = 0 }) => {
    const { data, error } = await supabase.functions.invoke('get-paginated-posts', {
        body: { pageParam }
    });
    if (error) {
        let specificMessage = "Error fetching posts.";
        if (error.context && error.context.data) {
            try {
                const errorJson = JSON.parse(error.context.data);
                if (errorJson.error) specificMessage = errorJson.error;
            } catch (e) { specificMessage = error.message; }
        } else {
            specificMessage = error.message;
        }
        throw new Error(specificMessage);
    }
    return data;
};

export const PostsPage = () => {
    const { t } = useTranslation();
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPageParam,
    });

    const posts = data?.pages.flatMap(page => page.data) ?? [];

    if (error) return <div className="text-center py-40 text-system-danger">Error loading posts: {error.message}</div>;

    return (
        <div className="bg-background">
            <section className="relative pt-40 pb-20 flex items-center justify-center text-center p-4 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-50">
                    <div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
                </div>
                <div className="relative z-10 max-w-3xl">
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold text-text-primary">{t('posts.pageTitle')}</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-4 text-lg md:text-xl text-text-secondary">{t('posts.pageSubtitle')}</motion.p>
                </div>
            </section>

            <section className="py-16 md:py-24 container mx-auto px-4">
                {isLoading ? (
                    <div className="py-20 text-center"><Loading /></div>
                ) : posts && posts.length > 0 ? (
                    <InfiniteScroll
                        dataLength={posts.length}
                        next={fetchNextPage}
                        hasMore={!!hasNextPage}
                        loader={<h4 className="text-center text-text-secondary py-8">Loading more posts...</h4>}
                        endMessage={<p className="text-center text-text-secondary py-8">You have seen all posts.</p>}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {posts.map((post: Post) => (
                            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <PostCard post={post} />
                            </motion.div>
                        ))}
                    </InfiniteScroll>
                ) : (
                    <div className="text-center py-12 text-text-secondary bg-white/30 backdrop-blur-sm rounded-lg">
                        <p>No posts yet. Check back soon!</p>
                    </div>
                )}
            </section>
        </div>
    );
};