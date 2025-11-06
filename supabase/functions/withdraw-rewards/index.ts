
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WithdrawRequest {
  userId: string
  amount: number
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

    const { userId, amount }: WithdrawRequest = await req.json()

    if (!userId || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Valid user ID and amount are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get system settings
    const { data: settings } = await supabase
      .from('system_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['min_withdrawal_limit', 'withdrawal_fee_percentage', 'kyc_threshold'])

    const settingsMap = settings?.reduce((acc, setting) => {
      acc[setting.setting_key] = parseFloat(setting.setting_value)
      return acc
    }, {} as Record<string, number>) || {}

    const minWithdrawal = settingsMap.min_withdrawal_limit || 10
    const feePercentage = settingsMap.withdrawal_fee_percentage || 5
    const kycThreshold = settingsMap.kyc_threshold || 10000

    // Validate minimum withdrawal
    if (amount < minWithdrawal) {
      return new Response(
        JSON.stringify({ error: `Minimum withdrawal amount is $${minWithdrawal}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('available_rewards, kyc_status')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check available balance
    if (amount > user.available_rewards) {
      return new Response(
        JSON.stringify({ 
          error: `Insufficient rewards balance. Available: $${user.available_rewards}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check KYC requirement
    if (amount > kycThreshold && user.kyc_status !== 'approved') {
      return new Response(
        JSON.stringify({ 
          error: `KYC verification required for withdrawals above $${kycThreshold}` 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate fees
    const fee = (amount * feePercentage) / 100
    const netAmount = amount - fee

    // Create withdrawal record
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .insert({
        user_id: userId,
        type: 'rewards',
        amount,
        fee,
        penalty: 0,
        net_amount: netAmount,
        status: 'pending'
      })
      .select()
      .single()

    if (withdrawalError) {
      console.error('Error creating withdrawal:', withdrawalError)
      return new Response(
        JSON.stringify({ error: 'Failed to create withdrawal request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update user's available rewards
    await supabase
      .from('users')
      .update({ 
        available_rewards: user.available_rewards - amount,
        total_withdrawn: supabase.rpc('COALESCE', [supabase.sql`total_withdrawn`, 0]) + netAmount
      })
      .eq('id', userId)

    return new Response(
      JSON.stringify({
        message: 'Withdrawal request submitted successfully',
        withdrawalId: withdrawal.id,
        amount,
        fee,
        netAmount,
        status: 'pending'
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Withdraw rewards error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
