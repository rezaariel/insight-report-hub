import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('user_roles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
      .single()

    if (existingAdmin) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Admin sudah ada. Login dengan email: admin@silapor.com' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create admin user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'admin@silapor.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: { name: 'Administrator' }
    })

    if (userError) {
      throw userError
    }

    // Update role to admin
    const { error: roleError } = await supabase
      .from('user_roles')
      .update({ role: 'admin' })
      .eq('user_id', userData.user.id)

    if (roleError) {
      throw roleError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin berhasil dibuat!',
        credentials: {
          email: 'admin@silapor.com',
          password: 'admin123'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
