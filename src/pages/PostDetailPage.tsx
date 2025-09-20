import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../contexts/AuthContext';

type Post = {
    id: string;
    title: string;
    content: string | null;
    image_url: string;
    created_at: string;
    profiles: {
        english_name: string | null;
        avatar_url: string | null;
    } | null;
};

const fetchPostById = async (postId: string): Promise<Post> => {
    const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, image_url, created_at, profiles(english_name, avatar_url)')
        .eq('id', postId)
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
};

export const PostDetailPage = () => {
    const { slug: postId } = useParams<{ slug: string }>();

    const { data: post, isLoading, error } = useQuery<Post>({
        queryKey: ['post', postId],
        queryFn: () => fetchPostById(postId!),
        enabled: !!postId,
    });

    if (isLoading) {
        return <div className="text-center py-12">Loading post...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-system-danger">Error loading post: {error.message}</div>;
    }

    if (!post) {
        return <div className="text-center py-12">Post not found.</div>;
    }

    const authorName = post.profiles?.english_name || 'TTISA Admin';
    const authorAvatar = post.profiles?.avatar_url
        ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${post.profiles.avatar_url}`
        : `https://api.dicebear.com/8.x/initials/svg?seed=${authorName}`;

    const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <img src={post.image_url} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
            <div className="p-6 md:p-8">
                <Link to="/posts" className="text-primary hover:underline mb-4 inline-block">&larr; Back to all posts</Link>
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">{post.title}</h1>
                <div className="flex items-center text-sm text-neutral-500 mb-6">
                    <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full mr-3 object-cover" />
                    <div>
                        <p className="font-semibold text-neutral-800">{authorName}</p>
                        <p>{formattedDate}</p>
                    </div>
                </div>
                <div className="prose max-w-none text-neutral-800">
                    <p>{post.content || 'No additional content available.'}</p>
                </div>
            </div>
        </div>
    );
};