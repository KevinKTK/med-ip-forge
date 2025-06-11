
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StakingPool {
  id: number;
  project_id: number;
  contract_address: string;
  deployer_address: string;
  deployment_date: string;
  apy: number;
  lockup_periods: number[];
  total_staked: number;
  total_stakers: number;
  is_active: boolean;
  created_at: string;
  name: string;
  asset_type: string;
  current_completion: number;
  total_pool_size: number;
  available_capacity: number;
  risk_level: string;
  description: string;
}

export const useStakingPool = (projectId: number) => {
  const [stakingPool, setStakingPool] = useState<StakingPool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStakingPool = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('staking_pools')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) throw error;
      setStakingPool(data);
    } catch (err) {
      console.error('Error fetching staking pool:', err);
      setError(err instanceof Error ? err.message : "Failed to fetch staking pool.");
      setStakingPool(null);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchStakingPool();
  }, [fetchStakingPool]);

  const refreshStakingPool = () => {
    fetchStakingPool();
  };

  return { stakingPool, isLoading, error, refreshStakingPool };
}; 
