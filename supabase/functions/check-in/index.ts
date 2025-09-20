import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()
    if (!token) throw new Error("Check-in token is required.")

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("You must be logged in to check in.")

    // Step 1: Validate the token and get the event ID
    const { data: tokenData, error: tokenError } = await supabase
      .from('event_attendance_tokens')
      .select('event_id, expires_at')
      .eq('token', token)
      .single()

    if (tokenError || !tokenData) throw new Error("Invalid or expired check-in token.")
    if (new Date(tokenData.expires_at) < new Date()) throw new Error("This check-in token has expired.")

    // Step 2: Verify the user has an accepted registration for this event
    const { data: regData, error: regError } = await supabase
      .from('event_registrations')
      .select('id, status')
      .eq('event_id', tokenData.event_id)
      .eq('user_id', user.id)
      .single()

    if (regError || !regData) throw new Error("Registration not found. Please register for the event first.")
    if (regData.status !== 'accepted') throw new Error(`Your registration status is '${regData.status}'. It must be 'accepted' to check in.`)

    // Step 3: Insert the attendance record
    const { error: insertError } = await supabase
      .from('event_attendances')
      .insert({ registration_id: regData.id, user_id: user.id })

    if (insertError) {
      // '23505' is the postgres code for unique_violation, meaning they're already checked in
      if (insertError.code === '23505') throw new Error("You have already checked in for this event.")
      throw insertError
    }

    return new Response(JSON.stringify({ message: "Welcome! You are now checked in." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})