import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { StakingPool } from '@/utils/supabase';

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