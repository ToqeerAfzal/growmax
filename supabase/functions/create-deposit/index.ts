
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DepositRequest {
  userId: string
  packageId: number
  amount: number
  transactionHash: string
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

    const { userId, packageId, amount, transactionHash }: DepositRequest = await req.json()

    if (!userId || !packageId || !amount || !transactionHash) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get package details
    const { data: package_, error: packageError } = await supabase
      .from('staking_packages')
      .select('*')
      .eq('id', packageId)
      .eq('is_active', true)
      .single()

    if (packageError || !package_) {
      return new Response(
        JSON.stringify({ error: 'Invalid or inactive package' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate amount
    if (amount < package_.min_amount || amount > package_.max_amount) {
      return new Response(
        JSON.stringify({ 
          error: `Amount must be between $${package_.min_amount} and $${package_.max_amount} for ${package_.name} package` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's last deposit for multiplier validation
    const { data: lastDeposit } = await supabase
      .from('deposits')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (lastDeposit && package_.multiplier > 1) {
      const requiredAmount = lastDeposit.amount * package_.multiplier
      if (amount < requiredAmount) {
        return new Response(
          JSON.stringify({ 
            error: `New deposit must be at least ${package_.multiplier}x your last deposit: $${requiredAmount}` 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Check if transaction hash already exists
    const { data: existingTx } = await supabase
      .from('deposits')
      .select('id')
      .eq('transaction_hash', transactionHash)
      .single()

    if (existingTx) {
      return new Response(
        JSON.stringify({ error: 'Transaction hash already processed' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate lock period
    const lockUntil = new Date()
    lockUntil.setMonth(lockUntil.getMonth() + 12)

    // Create deposit record
    const { data: deposit, error: depositError } = await supabase
      .from('deposits')
      .insert({
        user_id: userId,
        package_id: packageId,
        amount,
        transaction_hash: transactionHash,
        status: 'pending',
        locked_until: lockUntil.toISOString()
      })
      .select()
      .single()

    if (depositError) {
      console.error('Error creating deposit:', depositError)
      return new Response(
        JSON.stringify({ error: 'Failed to create deposit record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        message: 'Deposit created successfully. Waiting for blockchain confirmation.',
        depositId: deposit.id,
        lockUntil: deposit.locked_until
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Create deposit error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
