import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '../contexts/AuthContext';

type Post = {
    id: string;
    title: string;
    image_url: string;
    created_at: string;
    profiles: {
        english_name: string | null;
        avatar_url: string | null;
    } | null;
};

const fetchPosts = async (): Promise<Post[]> => {
    const { data, error } = await supabase
        .from('posts')
        .select('id, title, image_url, created_at, profiles(english_name, avatar_url)')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }
    return data;
};

const PostCard = ({ post }: { post: Post }) => {
    const authorName = post.profiles?.english_name || 'TTISA Admin';
    const authorAvatar = post.profiles?.avatar_url
        ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${post.profiles.avatar_url}`
        : `https://api.dicebear.com/8.x/initials/svg?seed=${authorName}`;

    return (
        <Link to={`/posts/${post.id}`} className="block group bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="aspect-square w-full overflow-hidden">
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-neutral-800 truncate group-hover:text-primary">{post.title}</h3>
                <div className="flex items-center mt-2">
                    <img src={authorAvatar} alt={authorName} className="w-6 h-6 rounded-full mr-2 object-cover" />
                    <span className="text-sm text-neutral-500">{authorName}</span>
                </div>
            </div>
        </Link>
    );
};

export const PostsPage = () => {
    const { data: posts, isLoading, error } = useQuery<Post[]>({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });

    if (isLoading) {
        return <div className="text-center py-12">Loading posts...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-system-danger">Error loading posts: {error.message}</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-neutral-800">Latest News & Updates</h1>
            {posts && posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-neutral-500">
                    <p>No posts yet. Check back soon!</p>
                </div>
            )}
        </div>
    );
};