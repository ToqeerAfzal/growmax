
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerifyOtpRequest {
  userId: string
  otpCode: string
  type: 'email' | 'mobile'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, otpCode, type }: VerifyOtpRequest = await req.json()

    if (!userId || !otpCode || !type) {
      return new Response(
        JSON.stringify({ error: 'User ID, OTP code, and type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Find valid OTP
    const { data: otpRecord } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('user_id', userId)
      .eq('otp_code', otpCode)
      .eq('type', type)
      .eq('purpose', 'verification')
      .eq('is_used', false)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (!otpRecord) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mark OTP as used
    await supabase
      .from('otp_verifications')
      .update({ is_used: true })
      .eq('id', otpRecord.id)

    // Update user verification status
    const updateField = type === 'email' ? 'email_verified' : 'mobile_verified'
    await supabase
      .from('users')
      .update({ [updateField]: true })
      .eq('id', userId)

    return new Response(
      JSON.stringify({
        message: `${type === 'email' ? 'Email' : 'Mobile number'} verified successfully`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('OTP verification error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
