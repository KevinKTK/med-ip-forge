import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStaking } from '@/hooks/useStaking';

interface StakingPool {
  id: number;
  name: string;
  assetType: string;
  apy: number;
  lockupPeriods: number[];
  currentCompletion: number;
  totalPoolSize: number;
  availableCapacity: number;
  riskLevel: string;
  description: string;
  contractAddress: string;
}

interface StakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: StakingPool;
}

export const StakingModal = ({ isOpen, onClose, pool }: StakingModalProps) => {
  const { toast } = useToast();
  const {
    amount,
    setAmount,
    selectedLockup,
    setSelectedLockup,
    isStaking,
    isSuccess,
    calculateRewards,
    handleStake,
  } = useStaking(pool.contractAddress);

  // Handle successful staking
  if (isSuccess) {
    toast({
      title: "Staking Successful!",
      description: `Successfully staked ${amount} ETH in ${pool.name}.`,
    });
    onClose();
    setAmount('');
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl">Stake in {pool.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Stake Amount (ETH)</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none"
                />
                <span className="absolute right-3 top-3 text-gray-400">ETH</span>
              </div>
              <div className="flex gap-2 mt-2">
                {['25%', '50%', '75%', '100%'].map((percent) => (
                  <Button
                    key={percent}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount((10000 * parseInt(percent) / 100).toString())}
                    className="text-xs"
                  >
                    {percent}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Lock-up Period</label>
              <div className="grid grid-cols-2 gap-2">
                {pool.lockupPeriods.map((period) => (
                  <Button
                    key={period}
                    variant={selectedLockup === period ? "default" : "outline"}
                    onClick={() => setSelectedLockup(period)}
                    className={selectedLockup === period ? "bg-neon-gradient" : "neon-border"}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    {period} days
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-background/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">APY</span>
              <div className="flex items-center text-neon-blue">
                <TrendingUp className="w-4 h-4 mr-1" />
                {pool.apy}%
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Estimated Rewards</span>
              <span className="text-white font-medium">{formatNumber(calculateRewards(pool.apy))}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Value at Maturity</span>
              <span className="text-neon-blue font-bold">
                {formatNumber((parseFloat(amount) || 0) + calculateRewards(pool.apy))}
              </span>
            </div>
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-400 font-medium">Early Withdrawal Penalty</p>
              <p className="text-gray-400">Withdrawing before the lock-up period ends may result in penalty fees.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 neon-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStake}
              disabled={isStaking}
              className="flex-1 bg-neon-gradient hover:opacity-90"
            >
              <Coins className="w-4 h-4 mr-2" />
              {isStaking ? 'Staking...' : 'Confirm Stake'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
