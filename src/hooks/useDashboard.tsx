
import { useState, useEffect } from 'react';

interface DashboardData {
  user: {
    id: string;
    email: string;
    mobile: string;
    referral_code: string;
    rank_id: number;
    rankName: string;
    kyc_status: string;
  };
  stats: {
    totalStaked: number;
    availableRewards: number;
    totalRewards: number;
    totalWithdrawn: number;
    directReferrals: number;
    teamMembers: number;
    businessVolume: number;
  };
  deposits: Array<{
    id: string;
    amount: number;
    package_name: string;
    status: string;
    created_at: string;
    reward_percentage: number;
  }>;
  recentRewards: Array<{
    id: string;
    reward_type: string;
    amount: number;
    created_at: string;
    description: string;
  }>;
  pendingWithdrawals: Array<{
    id: string;
    type: string;
    amount: number;
    status: string;
    created_at: string;
  }>;
}

// Mock dashboard data for demo
const mockDashboardData: DashboardData = {
  user: {
    id: 'demo-user-1',
    email: 'demo@example.com',
    mobile: '+1234567890',
    referral_code: 'DEMO123',
    rank_id: 3,
    rankName: 'Gold',
    kyc_status: 'verified'
  },
  stats: {
    totalStaked: 5000,
    availableRewards: 750,
    totalRewards: 2500,
    totalWithdrawn: 1750,
    directReferrals: 12,
    teamMembers: 45,
    businessVolume: 25000
  },
  deposits: [
    {
      id: '1',
      amount: 1000,
      package_name: 'Gold Package',
      status: 'confirmed',
      created_at: '2024-01-15',
      reward_percentage: 15
    },
    {
      id: '2',
      amount: 2000,
      package_name: 'Platinum Package',
      status: 'confirmed',
      created_at: '2024-02-10',
      reward_percentage: 20
    }
  ],
  recentRewards: [
    {
      id: '1',
      reward_type: 'staking',
      amount: 150,
      created_at: '2024-03-01',
      description: 'Daily staking reward'
    },
    {
      id: '2',
      reward_type: 'referral',
      amount: 100,
      created_at: '2024-03-05',
      description: 'Level 1 referral bonus'
    }
  ],
  pendingWithdrawals: [
    {
      id: '1',
      type: 'rewards',
      amount: 500,
      status: 'pending',
      created_at: '2024-03-10'
    }
  ]
};

// Simple in-memory cache
const dashboardCache = new Map<string, { data: DashboardData; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    const cacheKey = 'dashboard-data';
    const cached = dashboardCache.get(cacheKey);
    
    // Check if we have valid cached data
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      // Simulate faster API response (reduced from 1000ms to 300ms)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Cache the data
      dashboardCache.set(cacheKey, { 
        data: mockDashboardData, 
        timestamp: Date.now() 
      });
      
      setData(mockDashboardData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData
  };
}
