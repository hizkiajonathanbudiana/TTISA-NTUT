import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type PostDetails = { id: string; title_en: string | null; title_zh_hant: string | null; content_en: string | null; content_zh_hant: string | null; image_url: string; images: string[] | null; created_at: string; author_name: string | null; author_avatar_url: string | null; cta_event_id: string | null; cta_external_link: string | null; cta_text_en: string | null; cta_text_zh_hant: string | null; event_slug: string | null; };

const CallToAction = ({ link, text, title }: { link: string, text: string, title: string }) => {
    const [showQr, setShowQr] = useState(false);
    const isExternal = link.startsWith('http');
    const fullLink = isExternal ? link : `${window.location.origin}${link}`;

    return ( <div className="mt-8 pt-6 border-t border-white/20 text-center"> <h3 className="text-xl font-bold text-text-primary mb-4">{title}</h3> <div className="flex justify-center items-center gap-4 flex-wrap"> <a href={fullLink} target={isExternal ? '_blank' : '_self'} rel="noopener noreferrer" className="bg-secondary text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-secondary-hover transition-colors shadow-lg">{text}</a> <button onClick={() => setShowQr(!showQr)} title="Show QR Code" className="p-3 bg-white/50 rounded-full hover:bg-white/80 transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 20v-1m0-10a5 5 0 015 5h-1a4 4 0 00-4-4V9z" /></svg> </button> </div> {showQr && <div className="mt-4 bg-white p-4 inline-block rounded-lg shadow-lg"><QRCodeSVG value={fullLink} /></div>} </div> );
};

export const PostDetailPage = () => {
  const { slug: postId } = useParams<{ slug: string }>();
  const { language, t } = useTranslation();

  const { data: post, isLoading, error } = useQuery<PostDetails>({
    queryKey: ['post_details', postId],
    queryFn: async () => {
      const { data, error } = await supabase.from('post_details').select('*').eq('id', postId!).single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!postId,
  });

  const title = language === 'zh-HANT' && post?.title_zh_hant ? post.title_zh_hant : post?.title_en;
  const content = language === 'zh-HANT' && post?.content_zh_hant ? post.content_zh_hant : post?.content_en;
  const ctaText = language === 'zh-HANT' && post?.cta_text_zh_hant ? post.cta_text_zh_hant : (post?.cta_text_en || "Learn More");
  const galleryImages = post?.images && post.images.length > 0 ? post.images : (post?.image_url ? [post.image_url] : []);
  const ctaLink = post?.cta_event_id ? `/events/${post.event_slug}` : post?.cta_external_link;

  if (isLoading) return <div className="text-center py-40">Loading post...</div>;
  if (error) return <div className="text-center py-40 text-system-danger">Error: {error.message}</div>;
  if (!post) return <div className="text-center py-40">Post not found.</div>;

  const authorName = post.author_name || 'TTISA Admin';
  const authorAvatar = post.author_avatar_url ? post.author_avatar_url : `https://api.dicebear.com/8.x/initials/svg?seed=${authorName}`;
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-background">
      <div className="h-20 bg-card-bg" />
      <section className="relative min-h-screen flex flex-col justify-center items-center text-white p-4 overflow-hidden">
        <div className="absolute inset-0 z-0"><img src={post.image_url} alt="Post Background" className="w-full h-full object-cover filter blur-lg scale-110" /><div className="absolute inset-0 bg-black/50"></div></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <Swiper modules={[Navigation, Pagination]} spaceBetween={50} slidesPerView={1} navigation pagination={{ clickable: true }} className="w-full aspect-square rounded-2xl shadow-2xl mb-8">
              {galleryImages.map((imgUrl: string, index: number) => ( <SwiperSlide key={index}><img src={imgUrl} alt={`Post gallery image ${index + 1}`} className="w-full h-full object-cover" /></SwiperSlide> ))}
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
          {ctaLink && ( <CallToAction link={ctaLink} text={ctaText} title={post.cta_event_id ? "Related Event" : "More Info"} /> )}
        </motion.div>
      </div>
    </div>
  );
};