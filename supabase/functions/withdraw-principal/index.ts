
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WithdrawPrincipalRequest {
  userId: string
  depositId: string
  isEarlyWithdrawal?: boolean
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

    const { userId, depositId, isEarlyWithdrawal = false }: WithdrawPrincipalRequest = await req.json()

    if (!userId || !depositId) {
      return new Response(
        JSON.stringify({ error: 'User ID and deposit ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get system settings
    const { data: settings } = await supabase
      .from('system_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['withdrawal_fee_percentage', 'early_withdrawal_penalty', 'kyc_threshold'])

    const settingsMap = settings?.reduce((acc, setting) => {
      acc[setting.setting_key] = parseFloat(setting.setting_value)
      return acc
    }, {} as Record<string, number>) || {}

    const feePercentage = settingsMap.withdrawal_fee_percentage || 5
    const penaltyPercentage = settingsMap.early_withdrawal_penalty || 10
    const kycThreshold = settingsMap.kyc_threshold || 10000

    // Get deposit details
    const { data: deposit, error: depositError } = await supabase
      .from('deposits')
      .select('*, users!inner(kyc_status)')
      .eq('id', depositId)
      .eq('user_id', userId)
      .eq('status', 'confirmed')
      .eq('is_principal_withdrawn', false)
      .single()

    if (depositError || !deposit) {
      return new Response(
        JSON.stringify({ error: 'Deposit not found or already withdrawn' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const now = new Date()
    const lockUntil = new Date(deposit.locked_until)
    const isLocked = now < lockUntil

    // Check if early withdrawal is allowed
    if (isLocked && !isEarlyWithdrawal) {
      const daysRemaining = Math.ceil((lockUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return new Response(
        JSON.stringify({ 
          error: `Principal is locked for ${daysRemaining} more days. Early withdrawal incurs ${penaltyPercentage}% penalty.`,
          isLocked: true,
          lockedUntil: deposit.locked_until,
          penaltyPercentage
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check KYC requirement
    if (deposit.amount > kycThreshold && deposit.users.kyc_status !== 'approved') {
      return new Response(
        JSON.stringify({ 
          error: `KYC verification required for withdrawals above $${kycThreshold}` 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate fees and penalties
    const fee = (deposit.amount * feePercentage) / 100
    const penalty = isLocked ? (deposit.amount * penaltyPercentage) / 100 : 0
    const netAmount = deposit.amount - fee - penalty

    // Create withdrawal record
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .insert({
        user_id: userId,
        type: 'principal',
        amount: deposit.amount,
        fee,
        penalty,
        net_amount: netAmount,
        status: 'pending',
        deposit_id: depositId
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

    // Mark deposit as withdrawn
    await supabase
      .from('deposits')
      .update({ is_principal_withdrawn: true })
      .eq('id', depositId)

    // Update user's total withdrawn
    await supabase.rpc('update_user_withdrawn', {
      user_id: userId,
      amount: netAmount
    })

    return new Response(
      JSON.stringify({
        message: 'Principal withdrawal request submitted successfully',
        withdrawalId: withdrawal.id,
        amount: deposit.amount,
        fee,
        penalty,
        netAmount,
        isEarlyWithdrawal: isLocked,
        status: 'pending'
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Withdraw principal error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
