import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Target, Star, Coins, FileText } from 'lucide-react';
import { useState } from 'react';
import { StakeProjectModal } from './StakeProjectModal';
import { StakingModal } from '@/components/Staking/StakingModal';
import { Project, StakingPool, Patent } from '@/utils/supabase';

interface ProjectCardProps {
  project: Project;
  stakingPool?: StakingPool;
  patent?: Patent;
}

export const ProjectCard = ({ project, stakingPool, patent }: ProjectCardProps) => {
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showStakingModal, setShowStakingModal] = useState(false);
  
  const fundingPercentage = (project.current_funding / project.target_funding) * 100;
  
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-cyber-green text-black border-cyber-green';
      case 'medium': return 'bg-cyber-orange text-black border-cyber-orange';
      case 'high': return 'bg-cyber-pink text-black border-cyber-pink';
      default: return 'bg-cyber-purple text-black border-cyber-purple';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Card className="glass-card border-white/10">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
              <p className="text-gray-400 text-sm">by {project.artist}</p>
            </div>
            <Badge variant={project.risk_level === 'Low' ? 'default' : project.risk_level === 'High' ? 'destructive' : 'default'}>
              {project.risk_level} Risk
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Funding Progress</span>
                <span className="text-white">{formatCurrency(project.current_funding)} / {formatCurrency(project.target_funding)}</span>
              </div>
              <Progress value={fundingPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/30 rounded-lg p-3">
                <div className="flex items-center text-neon-blue mb-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">APY</span>
                </div>
                <p className="text-xl font-bold">{project.staking_apy}%</p>
              </div>
              
              <div className="bg-background/30 rounded-lg p-3">
                <div className="flex items-center text-gray-400 mb-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">Time Left</span>
                </div>
                <p className="text-xl font-bold">{project.time_remaining}</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
            
            {patent && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FileText className="w-4 h-4" />
                <span>Patent: {patent.patent_number} ({patent.status})</span>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 neon-border"
                onClick={() => {/* Handle project details */}}
              >
                View Details
              </Button>
              <Button
                className="flex-1 bg-neon-gradient hover:opacity-90"
                onClick={() => setShowStakingModal(true)}
                disabled={!stakingPool}
              >
                <Coins className="w-4 h-4 mr-2" />
                Stake IP
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {stakingPool && (
        <StakingModal
          isOpen={showStakingModal}
          onClose={() => setShowStakingModal(false)}
          pool={{
            id: project.id,
            name: project.title,
            assetType: "ETH",
            apy: stakingPool.apy,
            lockupPeriods: stakingPool.lockup_periods,
            currentCompletion: 0,
            totalPoolSize: project.target_funding,
            availableCapacity: project.target_funding - project.current_funding,
            riskLevel: project.risk_level,
            description: project.description,
            contractAddress: stakingPool.contract_address,
          }}
        />
      )}
    </>
  );
};
