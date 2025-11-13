// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// import { corsHeaders } from '../_shared/cors.ts'

// Deno.serve(async (req) => {
//   if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }
  
//   try {
//     const { page = 1, limit = 50, search = '' } = await req.json()
    
//     // Validate pagination parameters
//     const pageNum = Math.max(1, parseInt(page))
//     const limitNum = Math.min(100, Math.max(1, parseInt(limit))) // Max 100 per page
//     const offset = (pageNum - 1) * limitNum

//     const authHeader = req.headers.get('Authorization')
//     const supabaseClient = createClient(
//       Deno.env.get('SUPABASE_URL') ?? '',
//       Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
//       { global: { headers: { Authorization: authHeader } } }
//     )

//     // Build the query
//     let query = supabaseClient
//       .from('teams')
//       .select('*', { count: 'exact' })
//       .range(offset, offset + limitNum - 1)
//       .order('name_en', { ascending: true })

//     // Add search filter if provided
//     if (search && search.trim()) {
//       const searchTerm = search.trim().toLowerCase()
//       query = query.or(`name_en.ilike.%${searchTerm}%,name_zh_hant.ilike.%${searchTerm}%`)
//     }

//     const { data: teams, error: teamsError, count } = await query

//     if (teamsError) throw teamsError

//     return new Response(JSON.stringify({
//       teams: teams || [],
//       pagination: {
//         page: pageNum,
//         limit: limitNum,
//         total: count || 0,
//         totalPages: Math.ceil((count || 0) / limitNum),
//         hasNext: (count || 0) > offset + limitNum,
//         hasPrev: pageNum > 1
//       }
//     }), {
//       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//     })

//   } catch (error) {
//     console.error('Error in get-cms-teams:', error)
//     return new Response(JSON.stringify({ error: error.message }), {
//       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//       status: 400
//     })
//   }
// })

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
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Langsung buat admin client
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Build the query
    let query = adminClient
      .from('teams')
      .select('*', { count: 'exact' })
      .range(offset, offset + limitNum - 1)
      .order('name_en', { ascending: true })

    // Add search filter if provided
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase()
      query = query.or(`name_en.ilike.%${searchTerm}%,name_zh_hant.ilike.%${searchTerm}%`)
    }

    const { data: teams, error: teamsError, count } = await query

    if (teamsError) throw teamsError

    return new Response(JSON.stringify({
      teams: teams || [],
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
    console.error('Error in get-cms-teams:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})