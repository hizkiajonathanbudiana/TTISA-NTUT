// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
// import { corsHeaders } from '../_shared/cors.ts';

// const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
// const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// interface RequestBody {
//   page?: number;
//   limit?: number;
//   search?: string;
// }

// Deno.serve(async (req) => {
//   if (req.method === 'OPTIONS') {
//     return new Response('ok', { headers: corsHeaders });
//   }

//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader) {
//       return new Response(JSON.stringify({ error: 'No authorization header' }), {
//         status: 401,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//       });
//     }

//     // Create client with user's token for authentication
//     const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
//       global: {
//         headers: { Authorization: authHeader },
//       },
//     });

//     // Verify user authentication
//     const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
//     if (authError || !user) {
//       return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
//         status: 401,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//       });
//     }

//     const { page = 1, limit = 50, search }: RequestBody = await req.json();
//     const offset = (page - 1) * limit;

//     let query = supabaseClient
//       .from('social_links')
//       .select('*')
//       .order('display_order', { ascending: true });
      
//     let countQuery = supabaseClient
//       .from('social_links')
//       .select('*', { count: 'exact', head: true });

//     if (search) {
//       const searchFilter = `platform.ilike.%${search}%,display_text.ilike.%${search}%,link_url.ilike.%${search}%`;
//       query = query.or(searchFilter);
//       countQuery = countQuery.or(searchFilter);
//     }

//     // Get total count
//     const { count: totalCount, error: countError } = await countQuery;
//     if (countError) {
//       throw countError;
//     }

//     // Get paginated data
//     const { data, error } = await query.range(offset, offset + limit - 1);
//     if (error) {
//       throw error;
//     }

//     const totalPages = Math.ceil((totalCount || 0) / limit);

//     return new Response(JSON.stringify({
//       data,
//       pagination: {
//         page,
//         limit,
//         total: totalCount || 0,
//         totalPages,
//         hasNext: page < totalPages,
//         hasPrev: page > 1,
//       },
//     }), {
//       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//     });

//   } catch (error) {
//     console.error('Error:', error);
//     return new Response(JSON.stringify({ 
//       error: error.message || 'An unexpected error occurred' 
//     }), {
//       status: 500,
//       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//     });
//   }
// });

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface RequestBody {
  page?: number;
  limit?: number;
  search?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Langsung buat Admin Client, hapus validasi getUser()
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { page = 1, limit = 50, search }: RequestBody = await req.json();
    const offset = (page - 1) * limit;

    let query = adminClient
      .from('social_links')
      .select('*')
      .order('display_order', { ascending: true });
      
    let countQuery = adminClient
      .from('social_links')
      .select('*', { count: 'exact', head: true });

    if (search) {
      const searchFilter = `platform.ilike.%${search}%,display_text.ilike.%${search}%,link_url.ilike.%${search}%`;
      query = query.or(searchFilter);
      countQuery = countQuery.or(searchFilter);
    }

    // Get total count
    const { count: totalCount, error: countError } = await countQuery;
    if (countError) {
      throw countError;
    }

    // Get paginated data
    const { data, error } = await query.range(offset, offset + limit - 1);
    if (error) {
      throw error;
    }

    const totalPages = Math.ceil((totalCount || 0) / limit);

    return new Response(JSON.stringify({
      data,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }), {
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