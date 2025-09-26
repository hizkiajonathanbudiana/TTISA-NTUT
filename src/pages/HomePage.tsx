import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { WaveSeparator } from '../components/WaveSeparator';
import { Icon } from '../components/Icon';
import HeroBackground from '../assets/hero-background.jpg';
import { useTranslation } from '../contexts/LanguageContext';

type Event = { id: string; slug: string; title_en: string | null; title_zh_hant: string | null; start_at: string; location: string | null; };
type Post = { id: string; title_en: string | null; title_zh_hant: string | null; image_url: string; };
type Testimonial = { id: string; comment: string | null; english_name: string | null; avatar_url: string | null; };

const EventCard = ({ event }: { event: Event }) => {
    const { language } = useTranslation();
    const eventDate = new Date(event.start_at);
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = eventDate.getDate();
    const title = language === 'zh-HANT' && event.title_zh_hant ? event.title_zh_hant : event.title_en;
    return (
        <Link to={`/events/${event.slug}`} className="block bg-white/50 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center h-full">
            <div className="flex-shrink-0 text-center w-16"><p className="text-sm font-bold text-secondary">{month}</p><p className="text-3xl font-bold text-text-primary">{day}</p></div>
            <div className="ml-4 border-l border-white/30 pl-4"><h3 className="font-bold text-text-primary leading-tight">{title}</h3><p className="text-xs text-text-secondary mt-1">{event.location || 'Location TBD'}</p></div>
        </Link>
    );
};
const PostCard = ({ post }: { post: Post }) => {
    const { language } = useTranslation();
    const title = language === 'zh-HANT' && post.title_zh_hant ? post.title_zh_hant : post.title_en;
    return (
        <Link to={`/posts/${post.id}`} className="block group bg-white/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
            <div className="aspect-video w-full overflow-hidden"><img src={post.image_url} alt={title || 'Post image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
            <div className="p-4"><h3 className="font-bold text-text-primary truncate">{title}</h3></div>
        </Link>
    );
};
const FeatureCard = ({ icon, title, children }) => (<div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg text-center h-full"><div className="flex items-center justify-center w-16 h-16 bg-white/70 rounded-full mb-4 mx-auto shadow-inner">{icon}</div><h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3><p className="text-text-secondary leading-relaxed">{children}</p></div>);
const AnimatedSection = ({ children, className = '' }) => (<motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: 'easeOut' }} className={className}>{children}</motion.section>);

export const HomePage = () => {
    const { t } = useTranslation();
    const { data: events } = useQuery<Event[]>({ queryKey: ['upcoming_events'], queryFn: async () => { const { data, error } = await supabase.from('events').select('id, slug, title_en, title_zh_hant, start_at, location').eq('status', 'upcoming').order('start_at', { ascending: true }).limit(3); if (error) throw new Error(error.message); return data; } });
    const { data: posts } = useQuery<Post[]>({ queryKey: ['latest_posts'], queryFn: async () => { const { data, error } = await supabase.from('posts').select('id, title_en, title_zh_hant, image_url').order('created_at', { ascending: false }).limit(3); if (error) throw new Error(error.message); return data; } });
    const { data: testimonials } = useQuery<Testimonial[]>({ queryKey: ['testimonials'], queryFn: async () => { const { data, error } = await supabase.from('homepage_testimonials').select('*'); if (error) throw new Error(error.message); return data; } });

    return (
        <div className="bg-background">
            <section className="relative min-h-screen flex items-center justify-center text-center p-4 overflow-hidden">
                <div className="absolute inset-0 z-0"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl" style={{ animation: `aura-pulse 8s infinite alternate` }}></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl" style={{ animation: `aura-pulse 10s infinite alternate-reverse` }}></div><div className="absolute top-[20%] right-[15%] w-64 h-64 lg:w-80 lg:h-80 bg-accent-purple rounded-full filter blur-3xl" style={{ animation: `aura-pulse 12s infinite alternate` }}></div></div>
                <div className="relative z-10 max-w-3xl"><motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold text-text-primary leading-tight tracking-tight mb-4">{t('homepage.heroTitle')}</motion.h1><motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8">{t('homepage.heroSubtitle')}</motion.p><motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}><Link to="/events" className="bg-text-primary text-background font-bold py-4 px-8 rounded-full text-lg hover:bg-neutral-700 transition-all duration-300 transform hover:scale-105 shadow-xl">{t('homepage.heroButton')}</Link></motion.div></div>
            </section>

            <AnimatedSection className="py-20 bg-white/30 backdrop-blur-sm"><div className="container mx-auto px-6 text-center"><h2 className="text-3xl font-bold mb-3 text-text-primary">{t('homepage.whatWeDoTitle')}</h2><p className="text-text-secondary mb-12 max-w-2xl mx-auto">{t('homepage.whatWeDoSubtitle')}</p><div className="grid md:grid-cols-3 gap-10"><FeatureCard title={t('homepage.featureCulturalTitle')} icon={<Icon path="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c1.356 0 2.673-.11 3.955-.322M12 21c-1.356 0-2.673-.11-3.955-.322m0 0A9.006 9.006 0 0112 3c1.356 0 2.673.11 3.955.322m0 0V3m0 18v-3.879a3.375 3.375 0 00-.94-2.356l-2.094-2.094a3.375 3.375 0 00-4.763 0l-2.094 2.094A3.375 3.375 0 003 15.121V18" className="w-8 h-8 text-secondary" />}>{t('homepage.featureCulturalText')}</FeatureCard><FeatureCard title={t('homepage.featureAcademicTitle')} icon={<Icon path="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" className="w-8 h-8 text-primary" />}>{t('homepage.featureAcademicText')}</FeatureCard><FeatureCard title={t('homepage.featureSocialTitle')} icon={<Icon path="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a3 3 0 00-4.682 2.72 9.094 9.094 0 003.741.479m7.5-13.447a3 3 0 00-4.682-2.72 9.094 9.094 0 00-3.741-.479m-4.682 2.72a3 3 0 000 5.441m8.364-5.441a3 3 0 000 5.441" className="w-8 h-8 text-accent-purple" />}>{t('homepage.featureSocialText')}</FeatureCard></div></div></AnimatedSection>

            {events && events.length > 0 && <><WaveSeparator /><AnimatedSection className="py-20"><div className="container mx-auto px-4"><div className="text-center"><h2 className="text-3xl font-bold text-text-primary">{t('homepage.eventsTitle')}</h2></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">{events.map((event, i) => <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}><EventCard event={event} /></motion.div>)}</div><div className="text-center mt-12"><Link to="/events" className="font-bold text-primary hover:underline">{t('homepage.eventsButton')} &rarr;</Link></div></div></AnimatedSection></>}
            {posts && posts.length > 0 && <AnimatedSection className="py-20 bg-white/30 backdrop-blur-sm"><div className="container mx-auto px-4"><div className="text-center"><h2 className="text-3xl font-bold text-text-primary">{t('homepage.postsTitle')}</h2></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">{posts.map((post, i) => <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}><PostCard post={post} /></motion.div>)}</div><div className="text-center mt-12"><Link to="/posts" className="font-bold text-primary hover:underline">{t('homepage.postsButton')} &rarr;</Link></div></div></AnimatedSection>}
            {testimonials && testimonials.length > 0 && (<AnimatedSection className="py-20"><div className="container mx-auto px-6 text-center"><h2 className="text-3xl font-bold mb-12 text-text-primary">From Our Members</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{testimonials.map(t => (<motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}><div className="bg-white/50 p-6 rounded-lg shadow-lg h-full"><p className="text-text-secondary italic">"{t.comment}"</p><div className="flex items-center justify-center mt-4"><img src={t.avatar_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${t.avatar_url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${t.english_name}`} alt={t.english_name || ''} className="w-10 h-10 rounded-full mr-3" /><p className="font-bold text-text-primary">{t.english_name}</p></div></div></motion.div>))}</div></div></AnimatedSection>)}
        </div>
    );
};