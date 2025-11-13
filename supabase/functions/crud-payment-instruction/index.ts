// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
// import { corsHeaders } from '../_shared/cors.ts';

// const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
// const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// interface PaymentInstructionData {
//   method_name: string;
//   instructions_en: string;
//   instructions_zh_hant: string;
//   is_active: boolean;
// }

// interface ProofContactData {
//   platform: 'line' | 'instagram' | 'email';
//   contact_info: string;
//   display_order: number;
//   is_active: boolean;
// }

// interface RequestBody {
//   action: 'create' | 'update' | 'delete';
//   type: 'instruction' | 'contact';
//   id?: string;
//   data?: PaymentInstructionData | ProofContactData;
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

//     const { action, type, id, data }: RequestBody = await req.json();

//     if (!action || !type) {
//       return new Response(JSON.stringify({ error: 'Missing required fields: action, type' }), {
//         status: 400,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//       });
//     }

//     const tableName = type === 'instruction' ? 'payment_instructions' : 'proof_contacts';

//     switch (action) {
//       case 'create': {
//         if (!data) {
//           return new Response(JSON.stringify({ error: 'Data is required for create action' }), {
//             status: 400,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           });
//         }

//         const { data: insertData, error } = await supabaseClient
//           .from(tableName)
//           .insert(data)
//           .select()
//           .single();

//         if (error) throw error;

//         return new Response(JSON.stringify({ 
//           message: `${type} created successfully`,
//           data: insertData 
//         }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         });
//       }

//       case 'update': {
//         if (!id || !data) {
//           return new Response(JSON.stringify({ error: 'ID and data are required for update action' }), {
//             status: 400,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           });
//         }

//         const { data: updateData, error } = await supabaseClient
//           .from(tableName)
//           .update(data)
//           .eq('id', id)
//           .select()
//           .single();

//         if (error) throw error;

//         return new Response(JSON.stringify({ 
//           message: `${type} updated successfully`,
//           data: updateData 
//         }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         });
//       }

//       case 'delete': {
//         if (!id) {
//           return new Response(JSON.stringify({ error: 'ID is required for delete action' }), {
//             status: 400,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           });
//         }

//         const { error } = await supabaseClient
//           .from(tableName)
//           .delete()
//           .eq('id', id);

//         if (error) throw error;

//         return new Response(JSON.stringify({ 
//           message: `${type} deleted successfully` 
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
// const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!; // <-- Hapus

interface PaymentInstructionData {
  method_name: string;
  instructions_en: string;
  instructions_zh_hant: string;
  is_active: boolean;
}

interface ProofContactData {
  platform: 'line' | 'instagram' | 'email';
  contact_info: string;
  display_order: number;
  is_active: boolean;
}

interface RequestBody {
  action: 'create' | 'update' | 'delete';
  type: 'instruction' | 'contact';
  id?: string;
  data?: PaymentInstructionData | ProofContactData;
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

    // Hapus blok validasi userClient.auth.getUser()
    // Langsung buat Admin Client
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { action, type, id, data }: RequestBody = await req.json();

    if (!action || !type) {
      return new Response(JSON.stringify({ error: 'Missing required fields: action, type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const tableName = type === 'instruction' ? 'payment_instructions' : 'proof_contacts';

    switch (action) {
      case 'create': {
        if (!data) {
          return new Response(JSON.stringify({ error: 'Data is required for create action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: insertData, error } = await adminClient // <-- Pakai adminClient
          .from(tableName)
          .insert(data)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ 
          message: `${type} created successfully`,
          data: insertData 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update': {
        if (!id || !data) {
          return new Response(JSON.stringify({ error: 'ID and data are required for update action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: updateData, error } = await adminClient // <-- Pakai adminClient
          .from(tableName)
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ 
          message: `${type} updated successfully`,
          data: updateData 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete': {
        if (!id) {
          return new Response(JSON.stringify({ error: 'ID is required for delete action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error } = await adminClient // <-- Pakai adminClient
          .from(tableName)
          .delete()
          .eq('id', id);

        if (error) throw error;

        return new Response(JSON.stringify({ 
          message: `${type} deleted successfully` 
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