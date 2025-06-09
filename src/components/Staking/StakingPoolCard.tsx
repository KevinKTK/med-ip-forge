import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StakingPool, Project } from '@/utils/supabase';
import { useStaking } from '@/hooks/useStaking';
import { useState } from 'react';
import { StakingModal } from './StakingModal';
import { TrendingUp, Users, Coins } from 'lucide-react';

interface StakingPoolCardProps {
  pool: StakingPool;
  project?: Project;
  artistName: string;
}

export const StakingPoolCard = ({ pool, project, artistName }: StakingPoolCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleStake, isStaking } = useStaking(pool.contract_address);

  const getRiskColor = (risk?: string) => {
    if (!risk) return 'bg-gray-500/20 text-gray-400';
    
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

  const completionPercentage = pool.current_completion || 
    (project ? (project.completed_milestones / project.milestones) * 100 : 0);

  const availablePercentage = pool.available_capacity && pool.total_pool_size ? 
    (pool.available_capacity / pool.total_pool_size) * 100 : 0;

  return (
    <>
      <Card className="glass-card hover:shadow-neon transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-white mb-1">{pool.name || 'Unnamed Pool'}</CardTitle>
              <p className="text-sm text-gray-400">{pool.description || 'No description available'}</p>
            </div>
            <Badge className={getRiskColor(pool.risk_level)}>
              {pool.risk_level || 'Unknown'} Risk
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">APY</p>
                <p className="text-2xl font-bold text-white">{pool.apy || 0}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Pool Size</p>
                <p className="text-2xl font-bold text-white">{pool.total_pool_size || 0} IP</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Pool Completion</span>
                  <span className="text-white">{completionPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Available Capacity</span>
                  <span className="text-white">{availablePercentage.toFixed(1)}%</span>
                </div>
                <Progress value={availablePercentage} className="h-2" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Lock-up Period</p>
                <p className="text-white">{pool.lockup_periods?.[0] || 30} days</p>
              </div>
              <div>
                <p className="text-gray-400">Total Stakers</p>
                <p className="text-white">{pool.total_stakers || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Badge variant="outline" className="neon-border">
                {pool.asset_type || 'Unknown'}
              </Badge>
              <span>•</span>
              <span>by {artistName}</span>
            </div>
            
            <Button
              className="w-full bg-neon-gradient hover:opacity-90"
              onClick={() => setIsModalOpen(true)}
              disabled={isStaking || !pool.is_active}
            >
              {isStaking ? 'Processing...' : 'Stake Now'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <StakingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pool={pool}
        project={project}
        onStake={handleStake}
      />
    </>
  );
};
