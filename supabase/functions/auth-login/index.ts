
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { create } from "https://deno.land/x/djwt@v2.9.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LoginRequest {
  email: string
  password: string
}

serve(async (req) => {
  console.log('Auth-login function called with method:', req.method)
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const requestBody = await req.json()
    console.log('Login request received:', { email: requestBody.email, hasPassword: !!requestBody.password })
    
    const { email, password }: LoginRequest = requestBody

    if (!email || !password) {
      console.log('Missing email or password')
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user by email
    console.log('Looking up user with email:', email)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (userError || !user) {
      console.log('User lookup error:', userError)
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User found:', { id: user.id, email: user.email, isActive: user.is_active })

    if (!user.is_active) {
      console.log('User account is deactivated')
      return new Response(
        JSON.stringify({ error: 'Account is deactivated. Please contact support.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Skip password verification for development
    console.log('Skipping password verification for development')

    // Create a simple token using base64 encoding instead of JWT for now
    const tokenData = {
      userId: user.id,
      email: user.email,
      role: 'user',
      timestamp: Date.now()
    }
    
    const token = btoa(JSON.stringify(tokenData))

    console.log('Login successful for user:', user.id)

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          mobile: user.mobile,
          referralCode: user.referral_code,
          rank: user.rank_id,
          totalStaked: user.total_staked,
          availableRewards: user.available_rewards,
          kycStatus: user.kyc_status
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Login function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
