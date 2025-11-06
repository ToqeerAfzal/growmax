
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

    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact' })

    // Get active users (logged in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .gte('updated_at', thirtyDaysAgo.toISOString())

    // Get total deposits sum
    const { data: totalDepositsData } = await supabase
      .from('deposits')
      .select('amount')
      .eq('status', 'confirmed')

    const totalDeposits = totalDepositsData?.reduce((sum, d) => sum + parseFloat(d.amount), 0) || 0

    // Get total withdrawals sum
    const { data: totalWithdrawalsData } = await supabase
      .from('withdrawals')
      .select('net_amount')
      .eq('status', 'completed')

    const totalWithdrawals = totalWithdrawalsData?.reduce((sum, w) => sum + parseFloat(w.net_amount), 0) || 0

    // Get pending withdrawals
    const { count: pendingWithdrawals } = await supabase
      .from('withdrawals')
      .select('*', { count: 'exact' })
      .eq('status', 'pending')

    // Get package distribution
    const { data: packageStats } = await supabase
      .from('deposits')
      .select(`
        staking_packages (name),
        amount
      `)
      .eq('status', 'confirmed')

    const packageDistribution = packageStats?.reduce((acc, deposit) => {
      const packageName = deposit.staking_packages?.name || 'Unknown'
      if (!acc[packageName]) {
        acc[packageName] = { count: 0, volume: 0 }
      }
      acc[packageName].count++
      acc[packageName].volume += parseFloat(deposit.amount)
      return acc
    }, {} as Record<string, { count: number; volume: number }>) || {}

    // Get monthly business volume for last 6 months
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const { data: monthDeposits } = await supabase
        .from('deposits')
        .select('amount')
        .eq('status', 'confirmed')
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString())

      const monthVolume = monthDeposits?.reduce((sum, d) => sum + parseFloat(d.amount), 0) || 0

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        volume: monthVolume
      })
    }

    // Get recent activities
    const { data: recentDeposits } = await supabase
      .from('deposits')
      .select(`
        *,
        users (email),
        staking_packages (name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    const { data: recentWithdrawals } = await supabase
      .from('withdrawals')
      .select(`
        *,
        users (email)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    return new Response(
      JSON.stringify({
        stats: {
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          totalDeposits,
          totalWithdrawals,
          pendingWithdrawals: pendingWithdrawals || 0,
          platformBalance: totalDeposits - totalWithdrawals
        },
        packageDistribution,
        monthlyData,
        recentActivities: {
          deposits: recentDeposits || [],
          withdrawals: recentWithdrawals || []
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Admin dashboard error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
