import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, Calendar, TrendingUp, Lock, Calculator, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ReactDOM from 'react-dom';
import { useStaking } from '@/hooks/useStaking';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useToast } from '@/components/ui/use-toast';

interface StakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  stakingPool: {
    id: number;
    project_id: number;
    contract_address: string;
    apy: number;
    name: string;
    description: string;
    current_completion: number;
    total_stakers: number;
  };
  project: {
    id: number;
    title: string;
    description: string;
    target_funding: number;
    current_funding: number;
    category: string;
  };
}

export const StakingModal = ({ isOpen, onClose, stakingPool, project }: StakingModalProps) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [lockupPeriod, setLockupPeriod] = useState(30); // Default to 30 days
  const [estimatedRewards, setEstimatedRewards] = useState(0);
  const [sessionStakersCount, setSessionStakersCount] = useState(0); // For demo purposes
  const { address } = useAccount();
  const { toast } = useToast();
  const { handleStake, isStaking, calculateRewards, isSuccess } = useStaking(project.id);

  useEffect(() => {
    if (isSuccess) {
      setSessionStakersCount(prev => prev + 1);
      onClose();
    }
  }, [isSuccess, onClose]);

  if (!isOpen || !stakingPool || !project) return null;

  const handleStakeChange = (value: string) => {
    setStakeAmount(value);
    setEstimatedRewards(calculateRewards(stakingPool.apy));
  };

  const handleLockupChange = (days: number) => {
    setLockupPeriod(days);
    setEstimatedRewards(calculateRewards(stakingPool.apy));
  };

  const onStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid staking amount.",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to stake.",
        variant: "destructive",
      });
      return;
    }

    try {
      await handleStake(stakeAmount);
    } catch (error) {
      console.error('Staking error:', error);
      toast({
        title: "Staking Failed",
        description: "Failed to process your stake. Please try again.",
        variant: "destructive",
      });
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="glass-card max-w-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold gradient-text">Stake in Project</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4 flex flex-col max-h-[calc(90vh-150px)] overflow-y-auto">
          <div className="p-4 bg-black/30 rounded-lg">
            <h4 className="font-semibold text-white">{project.title}</h4>
            <p className="text-sm text-gray-400">{project.category}</p>
            <p className="text-sm text-gray-300 mt-2">{project.description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Current Progress</span>
              <span className="text-neon-blue">{stakingPool.current_completion}%</span>
            </div>
            <Progress value={stakingPool.current_completion} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-black/30 rounded">
              <p className="text-gray-400">APY</p>
              <p className="font-semibold text-white">{stakingPool.apy}%</p>
            </div>
            <div className="p-3 bg-black/30 rounded">
              <p className="text-gray-400">Total Stakers</p>
              <p className="font-semibold text-white">{stakingPool.total_stakers + sessionStakersCount}</p>
            </div>
            <div className="p-3 bg-black/30 rounded">
              <p className="text-gray-400">Contract</p>
              <a href={`https://aeneid.storyscan.xyz/address/${stakingPool.contract_address}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-neon-blue flex items-center">
                View <ExternalLink className="w-3 h-4 ml-1" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Stake Amount ($IP)
            </label>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => handleStakeChange(e.target.value)}
              placeholder="Enter amount to stake"
              className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Lockup Period
            </label>
            <div className="flex space-x-2">
              <Button
                variant={lockupPeriod === 30 ? 'default' : 'outline'}
                onClick={() => handleLockupChange(30)}
                className={lockupPeriod === 30 ? 'bg-neon-gradient hover:opacity-90' : 'neon-border'}
              >
                30 Days
              </Button>
              <Button
                variant={lockupPeriod === 90 ? 'default' : 'outline'}
                onClick={() => handleLockupChange(90)}
                className={lockupPeriod === 90 ? 'bg-neon-gradient hover:opacity-90' : 'neon-border'}
              >
                90 Days
              </Button>
              <Button
                variant={lockupPeriod === 180 ? 'default' : 'outline'}
                onClick={() => handleLockupChange(180)}
                className={lockupPeriod === 180 ? 'bg-neon-gradient hover:opacity-90' : 'neon-border'}
              >
                180 Days
              </Button>
            </div>
          </div>

          {estimatedRewards > 0 && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Estimated Rewards</span>
                <span className="font-semibold text-green-400 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {estimatedRewards.toFixed(2)} $IP
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 neon-border"
            >
              Cancel
            </Button>
            {!address ? (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button
                    onClick={openConnectModal}
                    className="flex-1 bg-neon-gradient hover:opacity-90"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
              </ConnectButton.Custom>
            ) : (
              <Button
                onClick={onStake}
                disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || isStaking}
                className="flex-1 bg-neon-gradient hover:opacity-90"
              >
                <Lock className="w-4 h-4 mr-2" />
                {isStaking ? 'Staking...' : 'Stake'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
