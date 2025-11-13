// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// import { corsHeaders } from '../_shared/cors.ts'

// // Helper function to generate a random alphanumeric string
// function generateRandomString(length: number): string {
//   const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; // Excluded O, 0 for clarity
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// }

// Deno.serve(async (req) => {
//   if (req.method === 'OPTIONS') {
//     return new Response('ok', { headers: corsHeaders });
//   }

//   try {
//     const supabaseClient = createClient(
//       Deno.env.get('SUPABASE_URL') ?? '',
//       Deno.env.get('SUPABASE_ANON_KEY') ?? '',
//       { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
//     );

//     const { data: { user } } = await supabaseClient.auth.getUser();
//     if (!user) throw new Error("User not found");

//     const { event_id } = await req.json();
//     if (!event_id) throw new Error("Event ID is required.");

//     let token: string;
//     let isUnique = false;

//     // Loop to ensure the generated token is unique
//     do {
//       token = generateRandomString(6);
//       const { data, error } = await supabaseClient
//         .from('event_attendance_tokens')
//         .select('token')
//         .eq('token', token)
//         .single();

//       if (error && error.code === 'PGRST116') { // "PGRST116" means no rows found
//         isUnique = true;
//       } else if (error) {
//         throw error; // Rethrow other errors
//       }
//     } while (!isUnique);

//     const expiresAt = new Date();
//     expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

//     const { data: newTokenData, error: insertError } = await supabaseClient
//       .from('event_attendance_tokens')
//       .insert({
//         event_id: event_id,
//         token: token,
//         expires_at: expiresAt.toISOString(),
//       })
//       .select()
//       .single();

//     if (insertError) throw insertError;

//     return new Response(JSON.stringify(newTokenData), {
//       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//       status: 200,
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//       status: 400,
//     });
//   }
// });

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Helper function to generate a random alphanumeric string
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; // Excluded O, 0 for clarity
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Cek jika user mengirim header otentikasi
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Buat ADMIN CLIENT
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // <-- Ganti ke SERVICE_ROLE_KEY
    );

    // BLOK VALIDASI USER DIHAPUS

    const { event_id } = await req.json();
    if (!event_id) throw new Error("Event ID is required.");

    let token: string;
    let isUnique = false;

    // Loop to ensure the generated token is unique
    do {
      token = generateRandomString(6);
      const { data, error } = await adminClient // <-- Pakai adminClient
        .from('event_attendance_tokens')
        .select('token')
        .eq('token', token)
        .single();

      if (error && error.code === 'PGRST116') { // "PGRST116" means no rows found
        isUnique = true;
      } else if (error) {
        throw error; // Rethrow other errors
      }
    } while (!isUnique);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

    const { data: newTokenData, error: insertError } = await adminClient // <-- Pakai adminClient
      .from('event_attendance_tokens')
      .insert({
        event_id: event_id,
        token: token,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify(newTokenData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});