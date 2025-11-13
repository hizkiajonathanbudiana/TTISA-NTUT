import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }
  try {
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    const now = new Date().toISOString()
    
    const eventsQuery = adminClient.from('events').select('id, slug, title_en, title_zh_hant, start_at, location').gte('start_at', now).order('start_at', { ascending: true }).limit(3)
    const postsQuery = adminClient.from('posts').select('id, title_en, title_zh_hant, image_url').order('created_at', { ascending: false }).limit(3)
    const testimonialsQuery = adminClient.from('homepage_testimonials').select('*')
      
    const [eventsRes, postsRes, testimonialsRes] = await Promise.all([
      eventsQuery, postsQuery, testimonialsQuery
    ])

    if (eventsRes.error) throw eventsRes.error
    if (postsRes.error) throw postsRes.error
    if (testimonialsRes.error) throw testimonialsRes.error

    const data = { events: eventsRes.data, posts: postsRes.data, testimonials: testimonialsRes.data }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})