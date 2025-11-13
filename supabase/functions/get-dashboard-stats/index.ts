import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const today = new Date().toISOString();

    // Ambil data statistik
    const [
      usersCountResult, 
      pendingRegsResult,
      upcomingEventsResult // <-- TAMBAHKAN QUERY INI
    ] = await Promise.all([
      supabaseClient.from('users').select('*', { count: 'exact', head: true }),
      supabaseClient.from('event_registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      // <-- INI QUERY BARU UNTUK AMBIL 3 EVENT TERDEKAT
      supabaseClient
        .from('events') // Asumsi nama tabelnya 'events'
        .select('title_en, start_at')
        .gte('start_at', today) // Ambil event yang >= hari ini
        .order('start_at', { ascending: true }) // Urutkan dari yang paling dekat
        .limit(3) // Ambil 3 saja
    ]);

    if (usersCountResult.error) throw usersCountResult.error;
    if (pendingRegsResult.error) throw pendingRegsResult.error;
    if (upcomingEventsResult.error) throw upcomingEventsResult.error; // <-- Tambahkan error check

    const stats = {
      usersCount: usersCountResult.count || 0,
      pendingRegistrations: pendingRegsResult.count || 0,
      upcomingEvents: upcomingEventsResult.data || [], // <-- TAMBAHKAN HASILNYA DI SINI
    };

    return new Response(JSON.stringify({ data: stats }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});