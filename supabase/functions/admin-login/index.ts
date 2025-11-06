
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"
import { create } from "https://deno.land/x/djwt@v2.9.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AdminLoginRequest {
  email: string
  password: string
  otpCode?: string
}

const JWT_SECRET = new TextEncoder().encode(Deno.env.get('JWT_SECRET') || 'your-secret-key')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, otpCode }: AdminLoginRequest = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get admin user by email
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (adminError || !admin) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!admin.is_active) {
      return new Response(
        JSON.stringify({ error: 'Account is deactivated' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, admin.password_hash)
    if (!passwordValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For first step or if no OTP provided, send OTP
    if (!otpCode) {
      const mobileOtp = Math.floor(100000 + Math.random() * 900000).toString()
      const otpExpiry = new Date()
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 5)

      await supabase.from('otp_verifications').insert({
        admin_id: admin.id,
        otp_code: mobileOtp,
        type: 'mobile',
        purpose: 'login',
        expires_at: otpExpiry.toISOString()
      })

      console.log(`Admin login OTP for ${admin.mobile}: ${mobileOtp}`)

      return new Response(
        JSON.stringify({ 
          message: 'OTP sent to your mobile number',
          requiresOtp: true,
          adminId: admin.id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify OTP
    const { data: otpRecord } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('admin_id', admin.id)
      .eq('otp_code', otpCode)
      .eq('type', 'mobile')
      .eq('purpose', 'login')
      .eq('is_used', false)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (!otpRecord) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mark OTP as used
    await supabase
      .from('otp_verifications')
      .update({ is_used: true })
      .eq('id', otpRecord.id)

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id)

    // Generate JWT token
    const payload = {
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
    }

    const token = await create({ alg: "HS256", typ: "JWT" }, payload, JWT_SECRET)

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          mobile: admin.mobile
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Admin login error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
