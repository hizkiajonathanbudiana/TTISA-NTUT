import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface SocialLinkData {
  platform: 'email' | 'instagram' | 'line' | 'facebook' | 'linkedin' | 'generic';
  link_url: string;
  display_text: string;
  display_order: number;
  is_active: boolean;
}

interface RequestBody {
  action: 'create' | 'update' | 'delete';
  id?: string;
  data?: SocialLinkData;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create client with user's token for authentication
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, id, data }: RequestBody = await req.json();

    if (!action) {
      return new Response(JSON.stringify({ error: 'Missing required field: action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    switch (action) {
      case 'create': {
        if (!data) {
          return new Response(JSON.stringify({ error: 'Data is required for create action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: insertData, error } = await supabaseClient
          .from('social_links')
          .insert(data)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ 
          message: 'Social link created successfully',
          data: insertData 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update': {
        if (!id || !data) {
          return new Response(JSON.stringify({ error: 'ID and data are required for update action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: updateData, error } = await supabaseClient
          .from('social_links')
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ 
          message: 'Social link updated successfully',
          data: updateData 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete': {
        if (!id) {
          return new Response(JSON.stringify({ error: 'ID is required for delete action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error } = await supabaseClient
          .from('social_links')
          .delete()
          .eq('id', id);

        if (error) throw error;

        return new Response(JSON.stringify({ 
          message: 'Social link deleted successfully' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});