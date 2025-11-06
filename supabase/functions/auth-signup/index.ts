
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SignupRequest {
  email: string
  mobile: string
  password: string
  referralCode?: string
}

// Simple password hashing function using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return `$2b$10$${hashHex}` // Prefix to maintain compatibility
  } catch (error) {
    console.error('Password hashing error:', error)
    throw new Error('Failed to hash password')
  }
}

serve(async (req) => {
  console.log('Signup request received with method:', req.method)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let requestBody: SignupRequest
    try {
      requestBody = await req.json()
      console.log('Request body parsed:', { 
        email: requestBody.email, 
        mobile: requestBody.mobile,
        hasPassword: !!requestBody.password,
        referralCode: requestBody.referralCode 
      })
    } catch (error) {
      console.error('Failed to parse request body:', error)
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { email, mobile, password, referralCode } = requestBody

    // Validation
    if (!email || !mobile || !password) {
      console.log('Missing required fields')
      return new Response(
        JSON.stringify({ error: 'Email, mobile, and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email)
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mobile validation (more flexible)
    const cleanMobile = mobile.replace(/\s|-|\(|\)/g, '')
    const mobileRegex = /^\+?[1-9]\d{9,14}$/
    if (!mobileRegex.test(cleanMobile)) {
      console.log('Invalid mobile format:', mobile, 'cleaned:', cleanMobile)
      return new Response(
        JSON.stringify({ error: 'Invalid mobile number format. Please use a valid phone number with country code.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Password validation
    if (password.length < 8) {
      console.log('Password too short')
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Checking for existing user...')
    // Check if email or mobile already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email, mobile')
      .or(`email.eq.${email.toLowerCase()},mobile.eq.${cleanMobile}`)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user:', checkError)
      return new Response(
        JSON.stringify({ error: 'Database error occurred' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (existingUser) {
      console.log('User already exists:', existingUser)
      return new Response(
        JSON.stringify({ error: 'Email or mobile number already registered' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate referral code if provided
    let referredBy = null
    if (referralCode) {
      console.log('Validating referral code:', referralCode)
      const { data: referrer, error: referralError } = await supabase
        .from('users')
        .select('id')
        .eq('referral_code', referralCode.toUpperCase())
        .single()

      if (referralError) {
        console.log('Invalid referral code:', referralCode, referralError)
        return new Response(
          JSON.stringify({ error: 'Invalid referral code' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      referredBy = referrer.id
    }

    console.log('Generating referral code...')
    // Generate unique referral code
    const { data: newReferralCode, error: referralCodeError } = await supabase.rpc('generate_referral_code')
    
    if (referralCodeError) {
      console.error('Error generating referral code:', referralCodeError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate referral code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Hashing password...')
    // Hash password using our custom function
    const hashedPassword = await hashPassword(password)

    console.log('Creating user...')
    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        mobile: cleanMobile,
        password_hash: hashedPassword,
        referral_code: newReferralCode,
        referred_by: referredBy,
        email_verified: true, // Skip email verification for now
        mobile_verified: true, // Skip mobile verification for now
        is_active: true
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating user:', createError)
      return new Response(
        JSON.stringify({ error: 'Failed to create user account', details: createError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User created successfully:', newUser.id)

    return new Response(
      JSON.stringify({
        message: 'Account created successfully',
        userId: newUser.id,
        referralCode: newUser.referral_code
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Signup error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
