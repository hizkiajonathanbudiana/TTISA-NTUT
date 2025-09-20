import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// This is a required header for web requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle preflight CORS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the email address from the request body
    const { email } = await req.json()
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    if (!email || !resendApiKey) {
      throw new Error('Email address and Resend API key are required.')
    }

    // Make the request to the Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'TTISA Club <onboarding@resend.dev>', // This is a default test address from Resend
        to: [email],
        subject: 'Hello from your TTISA App!',
        html: '<strong>This is a test email from your Supabase Edge Function!</strong>',
      }),
    })

    const data = await resendResponse.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})