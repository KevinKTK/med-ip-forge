import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Target, Star, Coins, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { StakeProjectModal } from './StakeProjectModal';
import { StakingModal } from '@/components/Staking/StakingModal';
import { supabase } from '@/integrations/supabase/client';
import { useStaking } from '@/hooks/useStaking';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';

interface Project {
  id: number;
  title: string;
  description: string;
  current_funding: number;
  target_funding: number;
  completed_milestones: number;
  milestones: number;
  staking_apy: number;
  time_remaining: string;
  category: string;
  risk_level: string;
}

interface StakingPool {
  id: number;
  contract_address: string;
  is_active: boolean;
}

interface Patent {
  id: number;
  title: string;
}

interface ProjectCardProps {
  project: Project;
  artistName: string;
  stakingPool?: StakingPool;
  patent?: Patent;
}

export const ProjectCard = ({ project, artistName, stakingPool, patent }: ProjectCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleStake, isStaking, totalStakedOnChain } = useStaking(project.id);
  const { isConnected } = useAccount();

  const { data: hash, sendTransaction, isPending: isSending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const completionPercentage = (project.completed_milestones / project.milestones) * 100;
  const fundingPercentage = ((project.current_funding + totalStakedOnChain) / project.target_funding) * 100;

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'bg-green-500/20 text-green-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'high':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatIP = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount) + ' IP';
  };

  const handleFundNow = async () => {
    if (!stakingPool?.contract_address) {
      console.error("Staking pool contract address is missing.");
      return;
    }

    try {
      sendTransaction({
        to: stakingPool.contract_address,
        value: parseEther('0.01'), // Example fixed amount for direct funding
      });
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      // Optionally refresh data or show success toast
      console.log('Transaction confirmed!', hash);
    }
  }, [isConfirmed, hash]);

  return (
    <>
      <Card className="glass-card hover:shadow-neon transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-white mb-1">{project.title}</CardTitle>
              <p className="text-sm text-gray-400">{project.description}</p>
            </div>
            <Badge className={getRiskColor(project.risk_level)}>
              {project.risk_level} Risk
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Funding Progress</span>
                <span className="text-white">{fundingPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={fundingPercentage} className="h-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Current Funding</span>
                <span className="text-2xl font-bold text-white">{formatIP(project.current_funding+ totalStakedOnChain)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Target Funding</span>
                <span className="text-2xl font-bold text-white">{formatIP(project.target_funding)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Project Progress</span>
                  <span className="text-white">{completionPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Staking APY</p>
                <p className="text-white">{project.staking_apy}%</p>
              </div>
              <div>
                <p className="text-gray-400">Time Remaining</p>
                <p className="text-white">{project.time_remaining}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Badge variant="outline" className="neon-border">
                {project.category}
              </Badge>
              <span>•</span>
              <span>by {artistName}</span>
            </div>

            {!isConnected ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <p className="text-gray-400">Connect your wallet to start funding</p>
                <ConnectButton />
              </div>
            ) : (
              <Button
                className="w-full bg-neon-gradient hover:opacity-90"
                onClick={handleFundNow}
                disabled={isSending || isConfirming || !stakingPool?.is_active}
              >
                {isSending || isConfirming ? 'Processing...' : 'Fund Now'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
