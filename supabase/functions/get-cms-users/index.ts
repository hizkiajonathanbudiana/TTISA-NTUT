import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }
  
  try {
    const { page = 1, limit = 50, search = '', roleFilter = 'all' } = await req.json()
    
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
      .from('user_details')
      .select('*', { count: 'exact' })
      .range(offset, offset + limitNum - 1)
      .order('english_name', { ascending: true })

    // Add search filter if provided
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase()
      query = query.or(`english_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,student_id.ilike.%${searchTerm}%`)
    }

    // Add role filter if provided
    if (roleFilter && roleFilter !== 'all') {
      query = query.eq('role_name', roleFilter)
    }

    const { data: users, error: usersError, count } = await query

    if (usersError) throw usersError

    // Get roles separately (not paginated since it's a small dataset)
    const { data: roles, error: rolesError } = await supabaseClient
      .from('roles')
      .select('*')
      .order('name')

    if (rolesError) throw rolesError

    // Get current user profile for permissions
    const { data: { user } } = await supabaseClient.auth.getUser()
    let currentUserProfile = null
    
    if (user) {
      const { data: profile, error: profileError } = await supabaseClient
        .from('users')
        .select('roles(name)')
        .eq('id', user.id)
        .single()
      
      if (!profileError) {
        currentUserProfile = profile
      }
    }

    return new Response(JSON.stringify({
      users: users || [],
      roles: roles || [],
      currentUserProfile,
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
    console.error('Error in get-cms-users:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})