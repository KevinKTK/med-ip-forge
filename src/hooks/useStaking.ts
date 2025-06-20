
import { useState, useEffect } from 'react';
import { useWriteContract, useTransaction, useAccount, useConfig, useReadContract } from 'wagmi';
import { toast } from 'sonner';
import { stakingABI } from '@/utils/contracts';
import { useStakingPool } from './useStakingPool';
import { supabase } from '@/integrations/supabase/client';
import { parseEther, formatEther } from 'viem';

export const useStaking = (projectId: number) => {
  const [amount, setAmount] = useState('');
  const [selectedLockup, setSelectedLockup] = useState(30); // Default to 30 days
  const { stakingPool, isLoading, refreshStakingPool } = useStakingPool(projectId);
  const { address } = useAccount();
  const config = useConfig();

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isStaking, isSuccess } = useTransaction({
    hash,
  });

  // Read total staked amount from the contract
  const { data: totalStakedOnChain } = useReadContract({
    address: stakingPool?.contract_address as `0x${string}`,
    abi: stakingABI,
    functionName: 'totalStaked',
  });

  useEffect(() => {
    if (isSuccess && stakingPool) {
      const updateSupabase = async () => {
        try {
          const parsedAmount = parseFloat(amount);
          if (isNaN(parsedAmount) || parsedAmount <= 0) {
            console.error("Invalid amount after successful transaction:", amount);
            return;
          }

          // Fetch current pool data to ensure we have the latest values
          const { data: currentPool, error: fetchError } = await supabase
            .from('staking_pools')
            .select('total_staked, total_stakers')
            .eq('id', stakingPool.id)
            .single();

          if (fetchError) throw fetchError;
          if (!currentPool) throw new Error("Staking pool not found in database.");

          // Get the on-chain total staked amount
          const onChainTotalStaked = totalStakedOnChain ? Number(formatEther(totalStakedOnChain)) : 0;

          // Calculate new totals combining on-chain and Supabase data
          const newTotalStaked = onChainTotalStaked;
          // For simplicity, increment stakers by 1. A more robust solution might check if the address is new.
          const newTotalStakers = (currentPool.total_stakers || 0) + 1;

          const { error: updateError } = await supabase
            .from('staking_pools')
            .update({
              total_staked: newTotalStaked,
              total_stakers: newTotalStakers,
            })
            .eq('id', stakingPool.id);

          if (updateError) throw updateError;

          // Project's current funding is now treated as a constant initial amount.
          // The UI will sum this constant with the on-chain staked amount.
          // Therefore, we no longer update current_funding in the database here.

          toast.success(`Successfully staked $IPP ${amount} in ${stakingPool.name}. Total staked: ${newTotalStaked.toFixed(2)} IP`);
          // Refresh the staking pool data in the hook to reflect changes immediately
          refreshStakingPool();
          setAmount(''); // Clear amount after successful stake and update
          setSelectedLockup(30); // Reset lockup period
        } catch (error) {
          console.error('Error updating Supabase after stake:', error);
          toast.error('Failed to update staking data in database.');
        }
      };
      updateSupabase();
    }
  }, [isSuccess, stakingPool, amount, refreshStakingPool, totalStakedOnChain, projectId]);

  const calculateRewards = (apy: number) => {
    if (!amount || !apy) return 0;
    const principal = parseFloat(amount);
    const timeInYears = selectedLockup / 365;
    return principal * (apy / 100) * timeInYears;
  };

  const handleStake = async (stakeAmount: string) => {
    if (!stakingPool?.contract_address) {
      toast.error('Staking pool not found');
      return;
    }

    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      writeContract({
        address: stakingPool.contract_address as `0x${string}`,
        abi: stakingABI,
        functionName: 'stake',
        chain: config.chains[0],
        account: address,
        value: parseEther(stakeAmount),
      });
    } catch (error) {
      console.error('Staking error:', error);
      toast.error('Failed to stake');
    }
  };

  return {
    amount,
    setAmount,
    selectedLockup,
    setSelectedLockup,
    isStaking,
    isSuccess,
    calculateRewards,
    handleStake,
    stakingPool,
    isLoading,
    totalStakedOnChain: totalStakedOnChain ? Number(formatEther(totalStakedOnChain)) : 0,
  };
};
