import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }
  try {
    const { registration_id, payment_proof_url } = await req.json()
    if (!registration_id || !payment_proof_url) {
      throw new Error("Registration ID and Payment Proof URL are required.")
    }

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) throw new Error("You must be logged in.")
    
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verifikasi bahwa user ini adalah pemilik registrasi
    const { data: regData, error: regError } = await adminClient
      .from('event_registrations')
      .select('user_id, status')
      .eq('id', registration_id)
      .single()
    
    if (regError || !regData) throw new Error("Registration not found.")
    if (regData.user_id !== user.id) throw new Error("You are not authorized to update this registration.")
    if (regData.status !== 'pending') throw new Error("Registration is no longer pending.")

    // Update URL
    const { data, error } = await adminClient
      .from('event_registrations')
      .update({ payment_proof_url: payment_proof_url })
      .eq('id', registration_id)
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, code: error.code }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})