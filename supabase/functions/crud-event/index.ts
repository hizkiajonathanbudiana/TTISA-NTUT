import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }
  
  try {
    const { method, eventData } = await req.json()
    
    const authHeader = req.headers.get('Authorization')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    switch (method) {
      case 'CREATE': {
        const { data, error } = await supabaseClient
          .from('events')
          .insert([eventData])
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'UPDATE': {
        const { id, ...updateData } = eventData
        const { data, error } = await supabaseClient
          .from('events')
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
        const { id } = eventData
        
        // Check if there are registrations for this event
        const { count: registrationCount } = await supabaseClient
          .from('event_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', id)

        if (registrationCount && registrationCount > 0) {
          return new Response(JSON.stringify({ 
            error: 'Cannot delete event with existing registrations' 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        const { error } = await supabaseClient
          .from('events')
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
    console.error('Error in crud-event:', error)
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})