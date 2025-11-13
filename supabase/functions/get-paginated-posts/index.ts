import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const PAGE_SIZE = 9; // Ambil 9 post per halaman

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }
  try {
    const { pageParam = 0 } = await req.json()
    const from = pageParam * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const { data, error } = await adminClient
      .from('posts')
      .select('id, title_en, title_zh_hant, image_url, created_at, profiles(english_name)')
      .order('created_at', { ascending: false })
      .range(from, to)

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