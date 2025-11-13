import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') { return new Response('ok', { headers: corsHeaders }) }
  
  try {
    const { action, data } = await req.json()
    
    const authHeader = req.headers.get('Authorization')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verify user permissions
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized: No user found')
    }

    const { data: userProfile } = await supabaseClient
      .from('users')
      .select('roles(name)')
      .eq('id', user.id)
      .single()

    const userRole = userProfile?.roles?.name
    if (userRole !== 'admin' && userRole !== 'developer') {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    switch (action) {
      case 'update_role':
        const { userId, roleId } = data
        
        if (!userId || !roleId) {
          throw new Error('Missing userId or roleId')
        }

        // Additional permission check: only developers can assign developer role
        if (userRole === 'admin') {
          const { data: targetRole } = await supabaseClient
            .from('roles')
            .select('name')
            .eq('id', roleId)
            .single()
          
          if (targetRole?.name === 'developer') {
            throw new Error('Unauthorized: Only developers can assign developer role')
          }
        }

        const { error: updateError } = await supabaseClient.rpc('update_user_role', {
          target_user_id: userId,
          target_role_id: roleId,
        })

        if (updateError) throw updateError

        return new Response(JSON.stringify({ success: true, message: 'User role updated successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'delete_user':
        const { targetUserId } = data
        
        if (!targetUserId) {
          throw new Error('Missing targetUserId')
        }

        // Prevent self-deletion
        if (targetUserId === user.id) {
          throw new Error('Cannot delete your own account')
        }

        // Only developers can delete users with developer role
        if (userRole === 'admin') {
          const { data: targetUser } = await supabaseClient
            .from('user_details')
            .select('role_name')
            .eq('user_id', targetUserId)
            .single()
          
          if (targetUser?.role_name === 'developer') {
            throw new Error('Unauthorized: Only developers can delete developer accounts')
          }
        }

        // Delete user (this will cascade to related tables)
        const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(targetUserId)
        
        if (deleteError) throw deleteError

        return new Response(JSON.stringify({ success: true, message: 'User deleted successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        throw new Error(`Unknown action: ${action}`)
    }

  } catch (error) {
    console.error('Error in crud-user:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})