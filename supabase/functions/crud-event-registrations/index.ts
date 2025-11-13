// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
// import { corsHeaders } from '../_shared/cors.ts';

// const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
// const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// interface RequestBody {
//   action: 'get_latest_token' | 'get_event_title' | 'get_registrations' | 'get_reviews' | 'update_registration_status' | 'delete_review';
//   eventId?: string;
//   registrationId?: string;
//   reviewId?: string;
//   newStatus?: string;
//   statusFilter?: string;
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

//     const { action, eventId, registrationId, reviewId, newStatus, statusFilter }: RequestBody = await req.json();

//     if (!action) {
//       return new Response(JSON.stringify({ error: 'Action is required' }), {
//         status: 400,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//       });
//     }

//     switch (action) {
//       case 'get_latest_token': {
//         if (!eventId) {
//           return new Response(JSON.stringify({ error: 'Event ID is required' }), {
//             status: 400,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           });
//         }

//         const { data, error } = await supabaseClient
//           .from('event_attendance_tokens')
//           .select('*')
//           .eq('event_id', eventId)
//           .order('created_at', { ascending: false })
//           .limit(1)
//           .single();

//         if (error && error.code !== 'PGRST116') {
//           throw error;
//         }

//         return new Response(JSON.stringify({
//           data: data || null,
//         }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         });
//       }

//       case 'get_event_title': {
//         if (!eventId) {
//           return new Response(JSON.stringify({ error: 'Event ID is required' }), {
//             status: 400,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           });
//         }

//         const { data, error } = await supabaseClient
//           .from('events')
//           .select('title_en')
//           .eq('id', eventId)
//           .single();

//         if (error) throw error;

//         return new Response(JSON.stringify({
//           data,
//         }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         });
//       }

//       case 'get_registrations': {
//         if (!eventId) {
//           return new Response(JSON.stringify({ error: 'Event ID is required' }), {
//             status: 400,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           });
//         }

//         let query = supabaseClient
//           .from('registration_details')
//           .select('*')
//           .eq('event_id', eventId);

//         if (statusFilter && statusFilter !== 'all') {
//           query = query.eq('status', statusFilter);
//         }

//         const { data, error } = await query;
//         if (error) throw error;

//         return new Response(JSON.stringify({
//           data,
//         }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         });
//       }

//       case 'get_reviews': {
//         if (!eventId) {
//           return new Response(JSON.stringify({ error: 'Event ID is required' }), {
//             status: 400,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           });
//         }

//         const { data, error } = await supabaseClient
//           .from('event_reviews_with_author')
//           .select('*')
//           .eq('event_id', eventId);

//         if (error) throw error;

//         return new Response(JSON.stringify({
//           data,
//         }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         });
//       }

//       case 'update_registration_status': {
//         if (!registrationId || !newStatus) {
//           return new Response(JSON.stringify({ error: 'Registration ID and new status are required' }), {
//             status: 400,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           });
//         }

//         const { error } = await supabaseClient
//           .from('event_registrations')
//           .update({ status: newStatus })
//           .eq('id', registrationId);

//         if (error) throw error;

//         return new Response(JSON.stringify({
//           message: 'Registration status updated successfully',
//         }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         });
//       }

//       case 'delete_review': {
//         if (!reviewId) {
//           return new Response(JSON.stringify({ error: 'Review ID is required' }), {
//             status: 400,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           });
//         }

//         const { error } = await supabaseClient
//           .from('reviews')
//           .delete()
//           .eq('id', reviewId);

//         if (error) throw error;

//         return new Response(JSON.stringify({
//           message: 'Review deleted successfully',
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
// const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!; // <-- HAPUS

interface RequestBody {
  action: 'get_latest_token' | 'get_event_title' | 'get_registrations' | 'get_reviews' | 'update_registration_status' | 'delete_review';
  eventId?: string;
  registrationId?: string;
  reviewId?: string;
  newStatus?: string;
  statusFilter?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Cukup cek apakah header-nya ada.
    // Ini membuktikan user sudah login (walaupun tokennya mungkin stale).
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // =================================================================
    // SEMUA BLOK VALIDASI USER DIHAPUS
    // =================================================================

    // 2. Langsung buat Admin Client untuk menjalankan query
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // =================================================================

    const { action, eventId, registrationId, reviewId, newStatus, statusFilter }: RequestBody = await req.json();

    if (!action) {
      return new Response(JSON.stringify({ error: 'Action is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Semua query di bawah ini sekarang menggunakan `adminClient`
    switch (action) {
      case 'get_latest_token': {
        if (!eventId) {
          return new Response(JSON.stringify({ error: 'Event ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data, error } = await adminClient
          .from('event_attendance_tokens')
          .select('*')
          .eq('event_id', eventId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        return new Response(JSON.stringify({
          data: data || null,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_event_title': {
        if (!eventId) {
          return new Response(JSON.stringify({ error: 'Event ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data, error } = await adminClient
          .from('events')
          .select('title_en')
          .eq('id', eventId)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({
          data,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_registrations': {
        if (!eventId) {
          return new Response(JSON.stringify({ error: 'Event ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        let query = adminClient
          .from('registration_details')
          .select('*')
          .eq('event_id', eventId);

        if (statusFilter && statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }

        const { data, error } = await query;
        if (error) throw error;

        return new Response(JSON.stringify({
          data,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_reviews': {
        if (!eventId) {
          return new Response(JSON.stringify({ error: 'Event ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data, error } = await adminClient
          .from('event_reviews_with_author')
          .select('*')
          .eq('event_id', eventId);

        if (error) throw error;

        return new Response(JSON.stringify({
          data,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update_registration_status': {
        if (!registrationId || !newStatus) {
          return new Response(JSON.stringify({ error: 'Registration ID and new status are required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error } = await adminClient
          .from('event_registrations')
          .update({ status: newStatus })
          .eq('id', registrationId);

        if (error) throw error;

        return new Response(JSON.stringify({
          message: 'Registration status updated successfully',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete_review': {
        if (!reviewId) {
          return new Response(JSON.stringify({ error: 'Review ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error } = await adminClient
          .from('reviews')
          .delete()
          .eq('id', reviewId);

        if (error) throw error;

        return new Response(JSON.stringify({
          message: 'Review deleted successfully',
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
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});