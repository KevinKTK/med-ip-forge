import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { StakingPool, Project } from '@/utils/supabase';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';

interface StakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: StakingPool;
  project?: Project;
  onStake: (amount: number, period: number) => Promise<void>;
}

const stakingABI = [
  {
    name: 'stake',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'period', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }]
  }
] as const;

export const StakingModal = ({ isOpen, onClose, pool, project, onStake }: StakingModalProps) => {
  const [amount, setAmount] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(0);
  const { isConnected, address } = useAccount();
  const config = useConfig();

  // Default lockup periods if not provided
  const lockupPeriods = pool.lockup_periods || [30, 60, 90];

  const { writeContract, data: hash } = useWriteContract({
    mutation: {
      onError: (error) => {
        console.error('Staking error:', error);
        toast.error('Failed to stake. Please try again.');
      }
    }
  });

  const { isLoading: isStaking, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const calculateRewards = (amount: number, period: number, apy: number) => {
    if (!amount || !period || !apy) return 0;
    return (amount * (apy / 100) * (period / 365));
  };

  const handleStake = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      writeContract({
        address: pool.contract_address as `0x${string}`,
        abi: stakingABI,
        functionName: 'stake',
        args: [parseEther(amount), BigInt(selectedPeriod)],
        value: parseEther(amount),
      });
    } catch (error) {
      console.error('Staking error:', error);
      toast.error('Failed to stake. Please try again.');
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(`Successfully staked ${amount} IP in ${pool.name}`);
      onClose();
      setAmount('');
    }
  }, [isSuccess, amount, pool.name, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-neon">
        <DialogHeader>
          <DialogTitle className="text-xl text-white mb-2">Stake in {pool.name}</DialogTitle>
          <p className="text-sm text-gray-400">{pool.description}</p>
        </DialogHeader>

        <div className="space-y-6">
          {!isConnected ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <p className="text-gray-400">Connect your wallet to start staking</p>
              <ConnectButton />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Stake Amount (IP)</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount to stake"
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">IP</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Lock-up Period</Label>
                <RadioGroup
                  value={selectedPeriod.toString()}
                  onValueChange={(value) => setSelectedPeriod(Number(value))}
                  className="grid grid-cols-3 gap-4"
                >
                  {lockupPeriods.map((period) => (
                    <div key={period} className="relative">
                      <RadioGroupItem
                        value={period.toString()}
                        id={`period-${period}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`period-${period}`}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <span className="text-lg font-bold">{period}</span>
                        <span className="text-sm text-muted-foreground">days</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Estimated Rewards</Label>
                <div className="p-4 rounded-lg bg-black/20 border border-neon">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">APY</span>
                    <span className="text-white font-bold">{pool.apy}%</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400">Rewards</span>
                    <span className="text-white font-bold">
                      {amount ? calculateRewards(Number(amount), selectedPeriod, pool.apy).toFixed(2) : '0'} IP
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-neon-gradient hover:opacity-90"
                onClick={handleStake}
                disabled={isStaking || !amount || Number(amount) <= 0}
              >
                {isStaking ? 'Processing...' : 'Stake Now'}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
