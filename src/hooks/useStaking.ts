
import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useConfig } from 'wagmi';
import { parseEther } from 'viem';
import { useToast } from '@/hooks/use-toast';
import Staking from '@/contracts/Staking.json';

export function useStaking(contractAddress: string) {
  const [amount, setAmount] = useState('');
  const [selectedLockup, setSelectedLockup] = useState(30);
  const { toast } = useToast();
  const { address } = useAccount();
  const config = useConfig();

  const { writeContract, data: hash } = useWriteContract();

  const { isLoading: isStaking, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const calculateRewards = (apy: number) => {
    const stakeAmount = parseFloat(amount) || 0;
    const dailyRate = apy / 365 / 100;
    const totalReward = stakeAmount * dailyRate * selectedLockup;
    return totalReward;
  };

  const handleStake = async (amount: string, period: number) => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid staking amount.",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to stake.",
        variant: "destructive",
      });
      return;
    }

    try {
      writeContract({
        chain: config.chains[0],
        abi: Staking.abi,
        address: contractAddress as `0x${string}`,
        functionName: 'stake',
        args: [parseEther(amount), period],
        account: address,
      });
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: error instanceof Error ? error.message : "Failed to stake. Please try again.",
        variant: "destructive",
      });
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
  };
}
