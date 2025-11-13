// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
// import { corsHeaders } from '../_shared/cors.ts';

// const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
// const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// interface RequestBody {
//   teamId: string;
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

//     const { teamId }: RequestBody = await req.json();

//     if (!teamId) {
//       return new Response(JSON.stringify({ error: 'Team ID is required' }), {
//         status: 400,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//       });
//     }

//     // Get team details with members
//     const { data, error } = await supabaseClient
//       .from('teams')
//       .select('*, team_members(user_id, position_en, position_zh_hant, profiles(english_name))')
//       .eq('id', teamId)
//       .single();

//     if (error) {
//       throw error;
//     }

//     return new Response(JSON.stringify({
//       data,
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
  teamId: string;
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

    // Langsung buat Admin Client
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { teamId }: RequestBody = await req.json();

    if (!teamId) {
      return new Response(JSON.stringify({ error: 'Team ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get team details with members
    const { data, error } = await adminClient
      .from('teams')
      .select('*, team_members(user_id, position_en, position_zh_hant, profiles(english_name))')
      .eq('id', teamId)
      .single();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({
      data,
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