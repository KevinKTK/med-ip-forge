
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { Coins, TrendingUp, AlertTriangle, Target, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: number;
  title: string;
  artist: string;
  category: string;
  targetFunding: number;
  currentFunding: number;
  stakingApy: number;
  timeRemaining: string;
  description: string;
  riskLevel: string;
  milestones: number;
  completedMilestones: number;
}

interface StakeProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const StakeProjectModal = ({ isOpen, onClose, project }: StakeProjectModalProps) => {
  const [amount, setAmount] = useState('');
  const [selectedTier, setSelectedTier] = useState('basic');
  const [isStaking, setIsStaking] = useState(false);
  const { toast } = useToast();

  const stakingTiers = [
    { id: 'basic', name: 'Basic Supporter', min: 100, royaltyShare: 0.5, perks: ['Project updates', 'Digital certificate'] },
    { id: 'premium', name: 'Premium Backer', min: 1000, royaltyShare: 1.2, perks: ['All basic perks', 'Early access', 'Artist Q&A'] },
    { id: 'vip', name: 'VIP Investor', min: 5000, royaltyShare: 2.0, perks: ['All premium perks', 'Physical rewards', 'Co-creation input'] }
  ];

  const selectedTierData = stakingTiers.find(tier => tier.id === selectedTier);

  const calculateRewards = () => {
    const stakeAmount = parseFloat(amount) || 0;
    const estimatedRevenue = stakeAmount * 0.3; // 30% estimated annual revenue
    const royaltyReward = estimatedRevenue * (selectedTierData?.royaltyShare || 0.5) / 100;
    const stakingReward = stakeAmount * project.stakingApy / 100;
    return { royaltyReward, stakingReward, total: royaltyReward + stakingReward };
  };

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid staking amount.",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) < (selectedTierData?.min || 0)) {
      toast({
        title: "Minimum Amount Required",
        description: `This tier requires a minimum stake of ${selectedTierData?.min} $IP tokens.`,
        variant: "destructive",
      });
      return;
    }

    setIsStaking(true);
    
    setTimeout(() => {
      toast({
        title: "Staking Successful!",
        description: `Successfully staked ${amount} $IP tokens in "${project.title}" as a ${selectedTierData?.name}.`,
      });
      setIsStaking(false);
      onClose();
      setAmount('');
    }, 2000);
  };

  const rewards = calculateRewards();
  const fundingPercentage = (project.currentFunding / project.targetFunding) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl">Stake in {project.title}</DialogTitle>
          <p className="text-gray-400">by {project.artist}</p>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="p-4 bg-background/30 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Funding Progress</span>
              <span className="text-white font-medium">{fundingPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={fundingPercentage} className="h-2 mb-2" />
            <div className="flex justify-between text-sm">
              <span className="text-neon-blue">${project.currentFunding.toLocaleString()}</span>
              <span className="text-gray-400">${project.targetFunding.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-3 block">Select Staking Tier</label>
            <div className="grid grid-cols-1 gap-3">
              {stakingTiers.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedTier === tier.id
                      ? 'border-neon-blue bg-neon-blue/10'
                      : 'border-white/10 bg-background/30 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">{tier.name}</h4>
                    <Badge variant="outline" className="neon-border">
                      {tier.royaltyShare}% Revenue Share
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Minimum: {tier.min} $IP</p>
                  <div className="flex flex-wrap gap-1">
                    {tier.perks.map((perk, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {perk}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Stake Amount ($IP Tokens)</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none"
              />
              <span className="absolute right-3 top-3 text-gray-400">$IP</span>
            </div>
            <div className="flex gap-2 mt-2">
              {['25%', '50%', '75%', '100%'].map((percent) => (
                <Button
                  key={percent}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount((12450 * parseInt(percent) / 100).toString())}
                  className="text-xs"
                >
                  {percent}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="bg-background/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Base APY</span>
              <div className="flex items-center text-neon-blue">
                <TrendingUp className="w-4 h-4 mr-1" />
                {project.stakingApy}%
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Estimated Annual Staking Rewards</span>
              <span className="text-white font-medium">${rewards.stakingReward.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Estimated Annual Royalty Share</span>
              <span className="text-neon-blue font-medium">${rewards.royaltyReward.toFixed(2)}</span>
            </div>
            
            <hr className="border-white/10" />
            
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Total Annual Potential</span>
              <span className="text-neon-blue font-bold text-lg">${rewards.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-400 font-medium">Investment Risk Notice</p>
              <p className="text-gray-400">Creative projects carry inherent risks. Revenue sharing depends on project success and actual performance may vary.</p>
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
