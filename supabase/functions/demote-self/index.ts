import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }

  try {
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) throw new Error("User not found.")

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: userRoleData, error: roleError } = await adminClient
      .from('users')
      .select('roles(name)')
      .eq('id', user.id)
      .single();

    if (roleError) throw roleError;

    const currentRole = userRoleData?.roles?.name;
    if (currentRole === 'member' || !currentRole) {
      throw new Error("You do not have a role that can be demoted.");
    }

    const { data: memberRole, error: memberRoleError } = await adminClient
      .from('roles')
      .select('id')
      .eq('name', 'member')
      .single();

    if (memberRoleError || !memberRole) throw new Error("Could not find 'member' role.");

    const { error: updateError } = await adminClient
      .from('users')
      .update({ role_id: memberRole.id })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ message: "Successfully demoted to member." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})