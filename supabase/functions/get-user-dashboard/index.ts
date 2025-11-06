
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get token from Authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Decode the base64 token to get user info
    let tokenData
    try {
      tokenData = JSON.parse(atob(token))
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid token format' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = tokenData.userId
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID not found in token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Getting dashboard data for user:', userId)

    // Get user details with rank
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        ranks (name, rank_number)
      `)
      .eq('id', userId)
      .single()

    if (userError || !user) {
      console.error('User lookup error:', userError)
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User found:', { id: user.id, email: user.email })

    // Get active deposits
    const { data: deposits } = await supabase
      .from('deposits')
      .select(`
        *,
        staking_packages (name, reward_percentage)
      `)
      .eq('user_id', userId)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })

    // Get recent reward transactions
    const { data: recentRewards } = await supabase
      .from('reward_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get referral tree count
    const { count: teamCount } = await supabase
      .from('referral_tree')
      .select('*', { count: 'exact' })
      .eq('ancestor_id', userId)

    // Calculate business volume for current year
    const businessVolume = await supabase.rpc('calculate_business_volume', {
      user_uuid: userId
    })

    // Get pending withdrawals
    const { data: pendingWithdrawals } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')

    const responseData = {
      user: {
        ...user,
        rankName: user.ranks?.name || 'Starter'
      },
      stats: {
        totalStaked: user.total_staked || 0,
        availableRewards: user.available_rewards || 0,
        totalRewards: user.total_rewards || 0,
        totalWithdrawn: user.total_withdrawn || 0,
        directReferrals: user.direct_referrals || 0,
        teamMembers: teamCount || 0,
        businessVolume: businessVolume || 0
      },
      deposits: deposits || [],
      recentRewards: recentRewards || [],
      pendingWithdrawals: pendingWithdrawals || []
    }

    console.log('Returning dashboard data successfully')

    return new Response(
      JSON.stringify(responseData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Get user dashboard error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
