import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { StakingPool, Project } from '@/utils/supabase';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useStaking } from '@/hooks/useStaking';

interface StakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  stakingPool?: StakingPool;
  project?: Project;
}

export const StakingModal = ({ isOpen, onClose, stakingPool, project }: StakingModalProps) => {
  console.log("StakingModal: Received stakingPool prop:", stakingPool);
  const { isConnected } = useAccount();

  // Defensive check for stakingPool
  if (!stakingPool) {
    console.warn("StakingModal: stakingPool prop is undefined. Returning null.");
    return null; // Render nothing if stakingPool is undefined
  }

  const {
    amount,
    setAmount,
    selectedLockup,
    setSelectedLockup,
    isStaking,
    isSuccess,
    calculateRewards,
    handleStake,
  } = useStaking(stakingPool.project_id);

  const lockupPeriods = stakingPool.lockup_periods || [30, 60, 90];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleStake(amount);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(`Successfully staked ${amount} IP in ${stakingPool.name}`);
      onClose();
      setAmount('');
      setSelectedLockup(30);
    }
  }, [isSuccess, amount, stakingPool.name, onClose, setAmount, setSelectedLockup]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-neon">
        <DialogHeader>
          <DialogTitle className="text-xl text-white mb-2">Stake in {stakingPool.name}</DialogTitle>
          {stakingPool.description && <p className="text-sm text-gray-400">{stakingPool.description}</p>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                    step="0.01"
                    min="0"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">IP</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Lock-up Period (for rewards calculation)</Label>
                <RadioGroup
                  value={selectedLockup.toString()}
                  onValueChange={(value) => setSelectedLockup(Number(value))}
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
                    <span className="text-white font-bold">{stakingPool.apy}%</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400">Rewards</span>
                    <span className="text-white font-bold">
                      {amount && stakingPool.apy ? calculateRewards(stakingPool.apy).toFixed(2) : '0'} IP
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-neon-gradient hover:opacity-90"
                disabled={isStaking || !amount || Number(amount) <= 0 || !selectedLockup}
              >
                {isStaking ? 'Processing...' : 'Stake Now'}
              </Button>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
