import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }
  
  try {
    const { page = 1, limit = 50, search = '' } = await req.json()
    
    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))) // Max 100 per page
    const offset = (pageNum - 1) * limitNum

    const authHeader = req.headers.get('Authorization')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Build the query
    let query = supabaseClient
      .from('posts')
      .select('*', { count: 'exact' })
      .range(offset, offset + limitNum - 1)
      .order('created_at', { ascending: false })

    // Add search filter if provided
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase()
      query = query.or(`title_en.ilike.%${searchTerm}%,title_zh_hant.ilike.%${searchTerm}%`)
    }

    const { data: posts, error: postsError, count } = await query

    if (postsError) throw postsError

    // Get events for CTA dropdown (not paginated since it's for form selection)
    const { data: events, error: eventsError } = await supabaseClient
      .from('events')
      .select('id, title_en')
      .order('start_at', { ascending: false })

    if (eventsError) throw eventsError

    return new Response(JSON.stringify({
      posts: posts || [],
      events: events || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
        hasNext: (count || 0) > offset + limitNum,
        hasPrev: pageNum > 1
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in get-cms-posts:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})