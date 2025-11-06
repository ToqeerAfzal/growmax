
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

    console.log('Starting monthly reward processing...')

    // Get all confirmed deposits
    const { data: deposits, error: depositsError } = await supabase
      .from('deposits')
      .select(`
        *,
        staking_packages (reward_percentage),
        users (id, available_rewards)
      `)
      .eq('status', 'confirmed')

    if (depositsError) {
      throw new Error(`Error fetching deposits: ${depositsError.message}`)
    }

    let totalRewardsProcessed = 0
    let usersProcessed = 0

    for (const deposit of deposits || []) {
      try {
        // Calculate monthly staking reward
        const monthlyReward = (deposit.amount * deposit.staking_packages.reward_percentage) / 100 / 12

        // Add reward transaction
        await supabase.from('reward_transactions').insert({
          user_id: deposit.user_id,
          deposit_id: deposit.id,
          reward_type: 'staking',
          amount: monthlyReward,
          description: `Monthly staking reward for ${deposit.staking_packages.name || 'deposit'}`
        })

        // Update user's available rewards
        const newAvailableRewards = (deposit.users.available_rewards || 0) + monthlyReward
        await supabase
          .from('users')
          .update({ 
            available_rewards: newAvailableRewards,
            total_rewards: supabase.rpc('COALESCE', [supabase.sql`total_rewards`, 0]) + monthlyReward
          })
          .eq('id', deposit.user_id)

        // Process referral rewards
        await processReferralRewards(supabase, deposit.user_id, monthlyReward, deposit.id)

        totalRewardsProcessed += monthlyReward
        usersProcessed++

      } catch (error) {
        console.error(`Error processing deposit ${deposit.id}:`, error)
      }
    }

    // Check and update ranks
    await updateUserRanks(supabase)

    console.log(`Reward processing completed. Total rewards: $${totalRewardsProcessed}, Users: ${usersProcessed}`)

    return new Response(
      JSON.stringify({
        message: 'Reward processing completed successfully',
        totalRewards: totalRewardsProcessed,
        usersProcessed
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Reward processing error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function processReferralRewards(supabase: any, userId: string, baseReward: number, depositId: string) {
  // Get reward levels
  const { data: rewardLevels } = await supabase
    .from('reward_levels')
    .select('*')
    .eq('is_active', true)
    .order('level')

  if (!rewardLevels) return

  // Get referral tree for this user
  const { data: referralTree } = await supabase
    .from('referral_tree')
    .select('ancestor_id, level')
    .eq('user_id', userId)
    .order('level')

  if (!referralTree) return

  for (const referral of referralTree) {
    const rewardLevel = rewardLevels.find(rl => rl.level === referral.level)
    if (!rewardLevel) continue

    const referralReward = (baseReward * rewardLevel.percentage) / 100

    // Add referral reward transaction
    await supabase.from('reward_transactions').insert({
      user_id: referral.ancestor_id,
      deposit_id: depositId,
      reward_type: 'referral',
      amount: referralReward,
      level: referral.level,
      from_user_id: userId,
      description: `Level ${referral.level} referral reward`
    })

    // Update ancestor's available rewards
    await supabase.rpc('update_user_rewards', {
      user_id: referral.ancestor_id,
      amount: referralReward
    })
  }
}

async function updateUserRanks(supabase: any) {
  // Get all users
  const { data: users } = await supabase
    .from('users')
    .select('id, rank_id')

  if (!users) return

  for (const user of users) {
    // Check rank eligibility
    const { data: eligibleRank } = await supabase.rpc('check_rank_eligibility', {
      user_uuid: user.id
    })

    if (eligibleRank && eligibleRank > user.rank_id) {
      // Get rank details
      const { data: rank } = await supabase
        .from('ranks')
        .select('*')
        .eq('rank_number', eligibleRank)
        .single()

      if (rank) {
        // Update user rank
        await supabase
          .from('users')
          .update({ rank_id: eligibleRank })
          .eq('id', user.id)

        // Add rank reward
        if (rank.rank_reward > 0) {
          await supabase.from('reward_transactions').insert({
            user_id: user.id,
            reward_type: 'rank',
            amount: rank.rank_reward,
            description: `Rank promotion reward: ${rank.name}`
          })

          await supabase.rpc('update_user_rewards', {
            user_id: user.id,
            amount: rank.rank_reward
          })
        }
      }
    }
  }
}
