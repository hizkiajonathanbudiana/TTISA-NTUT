import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Buat sebuah secret token yang aman dan panjang.
// Kita akan memeriksanya untuk memastikan hanya Cron Job yang bisa menjalankan function ini.
const CRON_SECRET = Deno.env.get('CRON_SECRET')

Deno.serve(async (req) => {
  // 1. Pemeriksaan Keamanan
  const authHeader = req.headers.get('Authorization')!
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  try {
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Cari event yang akan dimulai dalam 24-48 jam dari sekarang
    const now = new Date()
    const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000))
    const dayAfterTomorrow = new Date(now.getTime() + (48 * 60 * 60 * 1000))

    const { data: events, error: eventsError } = await adminClient
      .from('events')
      .select('id, title_en, start_at')
      .eq('status', 'upcoming')
      .gte('start_at', tomorrow.toISOString())
      .lt('start_at', dayAfterTomorrow.toISOString())

    if (eventsError) throw eventsError
    if (!events || events.length === 0) {
      return new Response(JSON.stringify({ message: "No events to remind for today." }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    let totalRemindersSent = 0;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    // 3. Loop untuk setiap event yang ditemukan
    for (const event of events) {
      const { data: registrations, error: regsError } = await adminClient
        .from('registration_details') // Menggunakan view untuk mendapatkan email
        .select('email')
        .eq('event_id', event.id)
        .eq('status', 'accepted')

      if (regsError) {
        console.error(`Error fetching registrations for event ${event.id}:`, regsError);
        continue; // Lanjut ke event berikutnya jika ada error
      }
      if (!registrations || registrations.length === 0) continue;

      // 4. Kirim email ke setiap peserta yang diterima
      for (const reg of registrations) {
        const eventTime = new Date(event.start_at).toLocaleTimeString('en-US', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit' });

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'TTISA NTUT <onboarding@resend.dev>',
            to: [reg.email],
            subject: `🔔 Reminder: "${event.title_en}" is tomorrow!`,
            html: `<strong>Hi there!</strong><p>Just a friendly reminder that the event you registered for, <strong>"${event.title_en}"</strong>, is happening tomorrow at <strong>${eventTime} (Taipei Time)</strong>.</p><p>We look forward to seeing you!</p>`,
          }),
        })
        totalRemindersSent++;
      }
    }

    return new Response(JSON.stringify({ message: `Successfully sent ${totalRemindersSent} reminders.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})