import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const PAGE_SIZE = 6; // Ambil 6 event per halaman

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }
  try {
    const { pageParam = 0, filter } = await req.json()
    if (!filter || (filter !== 'upcoming' && filter !== 'past')) {
      throw new Error("Filter 'upcoming' or 'past' is required.")
    }

    const from = pageParam * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    const now = new Date().toISOString()

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    let query = adminClient
      .from('events')
      .select('id, slug, title_en, title_zh_hant, start_at, location')

    if (filter === 'upcoming') {
      query = query.gte('start_at', now).order('start_at', { ascending: true })
    } else { // 'past'
      query = query.lt('start_at', now).order('start_at', { ascending: false })
    }

    const { data, error } = await query.range(from, to)
    if (error) throw error

    return new Response(JSON.stringify({
      data,
      nextPageParam: data.length === PAGE_SIZE ? pageParam + 1 : undefined,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})