import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }
  try {
    const { slug } = await req.json()
    if (!slug) throw new Error("Event slug is required.")

    // PERBAIKAN: Gunakan user token untuk autentikasi seperti original code
    const authHeader = req.headers.get('Authorization')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Ambil data event utama dengan user context (seperti original code)
    const { data: event, error: eventError } = await supabaseClient.rpc('get_event_details', { p_slug: slug }).single()
    if (eventError) throw new Error(`Event not found: ${eventError.message}`)

    // 2. Ambil data tambahan (reviews, payment info) secara paralel
    const reviewsQuery = adminClient.from('event_reviews_with_author').select('*').eq('event_id', event.id)
    
    const paymentInstructionsQuery = event.is_paid
      ? adminClient.from('payment_instructions').select('*').eq('is_active', true)
      : Promise.resolve({ data: [], error: null })
      
    const proofContactsQuery = event.is_paid
      ? adminClient.from('proof_contacts').select('*').eq('is_active', true).order('display_order')
      : Promise.resolve({ data: [], error: null })

    const [reviewsRes, paymentInstructionsRes, proofContactsRes] = await Promise.all([
      reviewsQuery,
      paymentInstructionsQuery,
      proofContactsQuery
    ])

    if (reviewsRes.error) throw reviewsRes.error
    if (paymentInstructionsRes.error) throw paymentInstructionsRes.error
    if (proofContactsRes.error) throw proofContactsRes.error
    
    // 3. Gabungkan semua data menjadi satu respons JSON
    const responseData = {
      event: event,
      reviews: reviewsRes.data,
      paymentInstructions: paymentInstructionsRes.data,
      proofContacts: proofContactsRes.data
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})