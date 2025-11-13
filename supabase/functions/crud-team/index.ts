// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// import { corsHeaders } from '../_shared/cors.ts'

// Deno.serve(async (req) => {
//   if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }
  
//   try {
//     const { method, teamData } = await req.json()
    
//     const authHeader = req.headers.get('Authorization')
//     const supabaseClient = createClient(
//       Deno.env.get('SUPABASE_URL') ?? '',
//       Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
//       { global: { headers: { Authorization: authHeader } } }
//     )

//     switch (method) {
//       case 'CREATE': {
//         const { data, error } = await supabaseClient
//           .from('teams')
//           .insert([{ ...teamData, is_active: true }])
//           .select()
//           .single()

//         if (error) throw error

//         return new Response(JSON.stringify({ data }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         })
//       }

//       case 'UPDATE': {
//         const { id, ...updateData } = teamData
//         const { data, error } = await supabaseClient
//           .from('teams')
//           .update(updateData)
//           .eq('id', id)
//           .select()
//           .single()

//         if (error) throw error

//         return new Response(JSON.stringify({ data }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         })
//       }

//       case 'DELETE': {
//         const { id } = teamData
        
//         // Check if there are team members
//         const { count: memberCount } = await supabaseClient
//           .from('team_members')
//           .select('*', { count: 'exact', head: true })
//           .eq('team_id', id)

//         if (memberCount && memberCount > 0) {
//           return new Response(JSON.stringify({ 
//             error: 'Cannot delete team with existing members' 
//           }), {
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//             status: 400
//           })
//         }

//         const { error } = await supabaseClient
//           .from('teams')
//           .delete()
//           .eq('id', id)

//         if (error) throw error

//         return new Response(JSON.stringify({ success: true }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         })
//       }

//       default:
//         return new Response(JSON.stringify({ error: 'Invalid method' }), {
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           status: 400
//         })
//     }

//   } catch (error) {
//     console.error('Error in crud-team:', error)
//     return new Response(JSON.stringify({ 
//       error: error instanceof Error ? error.message : 'Unknown error' 
//     }), {
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
    const { method, teamData } = await req.json()
    
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (method) {
      case 'CREATE': {
        const { data, error } = await adminClient
          .from('teams')
          .insert([{ ...teamData, is_active: true }])
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'UPDATE': {
        const { id, ...updateData } = teamData
        const { data, error } = await adminClient
          .from('teams')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'DELETE': {
        const { id } = teamData
        
        // Check if there are team members
        const { count: memberCount } = await adminClient
          .from('team_members')
          .select('*', { count: 'exact', head: true })
          .eq('team_id', id)

        if (memberCount && memberCount > 0) {
          return new Response(JSON.stringify({ 
            error: 'Cannot delete team with existing members' 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        const { error } = await adminClient
          .from('teams')
          .delete()
          .eq('id', id)

        if (error) throw error

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid method' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        })
    }

  } catch (error) {
    console.error('Error in crud-team:', error)
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})