import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }

  try {
    const { record } = await req.json() // Trigger mengirim data di dalam 'record'
    const registration_id = record.id;
    const new_status = record.status;

    if (!registration_id) throw new Error("Registration ID not found in trigger payload.")

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: registration, error: regError } = await adminClient
      .from('registration_details')
      .select('email, status, title_en')
      .eq('id', registration_id)
      .single()

    if (regError || !registration) throw new Error(`Registration not found: ${regError?.message}`)
    if (registration.status !== new_status) throw new Error(`Status mismatch. DB is ${registration.status}, trigger sent ${new_status}`);

    const { email, status, title_en } = registration;
    const eventTitle = title_en || 'our event';

    let subject = ''; let htmlBody = '';
    if (status === 'accepted') {
      subject = `✅ Your Registration for ${eventTitle} is Confirmed!`;
      htmlBody = `<strong>Congratulations!</strong><p>Your registration for the event "${eventTitle}" has been accepted. We look forward to seeing you there!</p>`;
    } else if (status === 'rejected') {
      subject = `❌ Update on Your Registration for ${eventTitle}`;
      htmlBody = `<strong>Registration Status Update</strong><p>We're sorry to inform you that your registration for the event "${eventTitle}" could not be accepted. We hope to see you at future events!</p>`;
    } else {
      return new Response(JSON.stringify({ message: "No notification needed." }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${resendApiKey}` },
      body: JSON.stringify({ from: 'TTISA NTUT <onboarding@resend.dev>', to: [email], subject: subject, html: htmlBody }),
    })

    if (!resendResponse.ok) { throw new Error(`Failed to send email: ${await resendResponse.text()}`); }

    return new Response(JSON.stringify({ message: `Notification sent to ${email}` }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
  }
})