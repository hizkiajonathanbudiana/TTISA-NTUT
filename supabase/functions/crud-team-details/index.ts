// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
// import { corsHeaders } from '../_shared/cors.ts';

// const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
// const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// interface TeamDetailsData {
//   name_en: string;
//   name_zh_hant: string;
//   description_en?: string;
//   description_zh_hant?: string;
//   is_active: boolean;
// }

// interface TeamMemberData {
//   user_id: string;
//   position_en: string;
//   position_zh_hant: string;
// }

// interface RequestBody {
//   action: 'update_team' | 'add_member' | 'remove_member';
//   teamId: string;
//   data?: TeamDetailsData | TeamMemberData;
//   userId?: string; // for remove_member action
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

//     const { action, teamId, data, userId }: RequestBody = await req.json();

//     if (!action || !teamId) {
//       return new Response(JSON.stringify({ error: 'Missing required fields: action, teamId' }), {
//         status: 400,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//       });
//     }

//     switch (action) {
//       case 'update_team': {
//         if (!data) {
//           return new Response(JSON.stringify({ error: 'Team data is required for update action' }), {
//             status: 400,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           });
//         }

//         const { error } = await supabaseClient
//           .from('teams')
//           .update(data)
//           .eq('id', teamId);

//         if (error) throw error;

//         return new Response(JSON.stringify({ 
//           message: 'Team updated successfully'
//         }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         });
//       }

//       case 'add_member': {
//         if (!data) {
//           return new Response(JSON.stringify({ error: 'Member data is required for add action' }), {
//             status: 400,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           });
//         }

//         const memberData = data as TeamMemberData;
//         const { error } = await supabaseClient
//           .from('team_members')
//           .insert({
//             team_id: teamId,
//             user_id: memberData.user_id,
//             position_en: memberData.position_en,
//             position_zh_hant: memberData.position_zh_hant,
//           });

//         if (error) throw error;

//         return new Response(JSON.stringify({ 
//           message: 'Team member added successfully'
//         }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         });
//       }

//       case 'remove_member': {
//         if (!userId) {
//           return new Response(JSON.stringify({ error: 'User ID is required for remove action' }), {
//             status: 400,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           });
//         }

//         const { error } = await supabaseClient
//           .from('team_members')
//           .delete()
//           .eq('team_id', teamId)
//           .eq('user_id', userId);

//         if (error) throw error;

//         return new Response(JSON.stringify({ 
//           message: 'Team member removed successfully'
//         }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         });
//       }

//       default:
//         return new Response(JSON.stringify({ error: 'Invalid action' }), {
//           status: 400,
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         });
//     }

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

interface TeamDetailsData {
  name_en: string;
  name_zh_hant: string;
  description_en?: string;
  description_zh_hant?: string;
  is_active: boolean;
}

interface TeamMemberData {
  user_id: string;
  position_en: string;
  position_zh_hant: string;
}

interface RequestBody {
  action: 'update_team' | 'add_member' | 'remove_member';
  teamId: string;
  data?: TeamDetailsData | TeamMemberData;
  userId?: string; // for remove_member action
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

    const { action, teamId, data, userId }: RequestBody = await req.json();

    if (!action || !teamId) {
      return new Response(JSON.stringify({ error: 'Missing required fields: action, teamId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    switch (action) {
      case 'update_team': {
        if (!data) {
          return new Response(JSON.stringify({ error: 'Team data is required for update action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error } = await adminClient
          .from('teams')
          .update(data)
          .eq('id', teamId);

        if (error) throw error;

        return new Response(JSON.stringify({ 
          message: 'Team updated successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'add_member': {
        if (!data) {
          return new Response(JSON.stringify({ error: 'Member data is required for add action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const memberData = data as TeamMemberData;
        const { error } = await adminClient
          .from('team_members')
          .insert({
            team_id: teamId,
            user_id: memberData.user_id,
            position_en: memberData.position_en,
            position_zh_hant: memberData.position_zh_hant,
          });

        if (error) throw error;

        return new Response(JSON.stringify({ 
          message: 'Team member added successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'remove_member': {
        if (!userId) {
          return new Response(JSON.stringify({ error: 'User ID is required for remove action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error } = await adminClient
          .from('team_members')
          .delete()
          .eq('team_id', teamId)
          .eq('user_id', userId);

        if (error) throw error;

        return new Response(JSON.stringify({ 
          message: 'Team member removed successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});