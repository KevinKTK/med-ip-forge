
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Target, Star, Coins } from 'lucide-react';
import { useState } from 'react';
import { StakeProjectModal } from './StakeProjectModal';

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

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [showStakeModal, setShowStakeModal] = useState(false);
  
  const fundingPercentage = (project.currentFunding / project.targetFunding) * 100;
  
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <>
      <Card className="glass-card hover:neon-glow transition-all duration-300 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-white mb-1">{project.title}</CardTitle>
              <p className="text-sm text-gray-400 mb-2">by {project.artist}</p>
              <p className="text-sm text-gray-300 line-clamp-2">{project.description}</p>
            </div>
            <Badge className={getRiskColor(project.riskLevel)}>{project.riskLevel}</Badge>
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            <Badge variant="outline" className="neon-border">
              {project.category}
            </Badge>
            <div className="flex items-center text-neon-blue">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="font-bold">{project.stakingApy}% APY</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Funding Progress</span>
              <span className="text-white font-medium">{fundingPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={fundingPercentage} className="h-2" />
            <div className="flex justify-between text-sm mt-1">
              <span className="text-neon-blue font-medium">{formatNumber(project.currentFunding)}</span>
              <span className="text-gray-400">{formatNumber(project.targetFunding)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Milestones</p>
              <p className="text-white font-medium">{project.completedMilestones}/{project.milestones}</p>
            </div>
            <div>
              <p className="text-gray-400">Time Remaining</p>
              <p className="text-neon-blue font-medium">{project.timeRemaining}</p>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => setShowStakeModal(true)}
              className="flex-1 bg-neon-gradient hover:opacity-90"
            >
              <Coins className="w-4 h-4 mr-2" />
              Stake $IP
            </Button>
            <Button variant="outline" className="neon-border">
              <Star className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <StakeProjectModal 
        isOpen={showStakeModal}
        onClose={() => setShowStakeModal(false)}
        project={project}
      />
    </>
  );
};
