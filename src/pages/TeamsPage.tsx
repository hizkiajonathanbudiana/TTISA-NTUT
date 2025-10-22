import { useQuery } from '@tanstack/react-query';
import { supabase } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { getFullUrl } from '../utils/url';

type Member = { position_en: string | null; position_zh_hant: string | null; profiles: { english_name: string | null; avatar_url: string | null; } | null; };
type Team = { id: string; name_en: string | null; name_zh_hant: string | null; description_en: string | null; description_zh_hant: string | null; team_members: Member[]; };
const AnimatedSection = ({ children, className }: { children: React.ReactNode, className?: string }) => (<motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: 'easeOut' }} className={className}>{children}</motion.section>);

export const TeamsPage = () => {
  const { t, language } = useTranslation();
  const { data: teams, isLoading, error } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name_en, name_zh_hant, description_en, description_zh_hant, team_members(position_en, position_zh_hant, profiles!inner(english_name, avatar_url))')
        .eq('is_active', true)
        .order('display_order', { ascending: true }) // Sorting by the new column
        .order('name_en', { ascending: true }); // Secondary sort alphabetically
      if (error) throw new Error(error.message);
      return data as unknown as Team[];
    },
  } as any);

  if (error) return <div className="text-center py-40 text-system-danger">Error: {error.message}</div>;

  return (
    <div className="bg-background">
      <SEO
        title="Our Team - TTISA NTUT"
        description="Meet the dedicated team members of TTISA at National Taiwan University of Science and Technology. Learn about our leadership and the passionate individuals who make our community thrive."
        keywords="TTISA team, NTUT leadership, international student leaders, Taiwan Tech student association team, TTISA members"
        url={getFullUrl('/teams')}
      />
      <section className="relative pt-40 pb-20 flex items-center justify-center text-center p-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50"><div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-purple rounded-full filter blur-3xl animate-pulse"></div><div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div></div>
        <div className="relative z-10 max-w-3xl"><motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold text-text-primary">{t('teams.pageTitle')}</motion.h1><motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-4 text-lg md:text-xl text-text-secondary">{t('teams.pageSubtitle')}</motion.p></div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {isLoading ? (<div className="text-center text-text-secondary">Loading teams...</div>)
          : teams && teams.length > 0 ? (
            teams.map((team: Team) => {
              const teamName = language === 'zh-HANT' && team.name_zh_hant ? team.name_zh_hant : team.name_en;
              const teamDescription = language === 'zh-HANT' && team.description_zh_hant ? team.description_zh_hant : team.description_en;
              return (
                <AnimatedSection key={team.id}>
                  <div className="text-center"><h2 className="text-3xl font-bold text-primary">{teamName}</h2><p className="text-text-secondary mt-2 max-w-2xl mx-auto">{teamDescription}</p></div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mt-12">
                    {team.team_members.map((member: Member, i: number) => {
                      const position = language === 'zh-HANT' && member.position_zh_hant ? member.position_zh_hant : member.position_en;
                      return (
                        <motion.div key={`${team.id}-${member.profiles?.english_name}`} className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                          <img src={member.profiles?.avatar_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${member.profiles.avatar_url}` : `https://api.dicebear.com/8.x/initials/svg?seed=${member.profiles?.english_name}`} alt={member.profiles?.english_name || 'Member'} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white/50 shadow-lg" />
                          <h3 className="font-bold mt-3 text-text-primary">{member.profiles?.english_name}</h3>
                          <p className="text-sm text-secondary font-semibold">{position}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </AnimatedSection>
              );
            })
          ) : (<p className="text-center text-text-secondary">No active teams found.</p>)}
      </div>
    </div>
  );
};