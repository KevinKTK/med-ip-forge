
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
      case 'low': return 'bg-cyber-green text-black border-cyber-green';
      case 'medium': return 'bg-cyber-orange text-black border-cyber-orange';
      case 'high': return 'bg-cyber-pink text-black border-cyber-pink';
      default: return 'bg-cyber-purple text-black border-cyber-purple';
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
      <Card className="pixel-card hover:shadow-cyber transition-all duration-300 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-retro neon-text mb-1">{project.title}</CardTitle>
              <p className="text-sm text-cyber-green/70 mb-2 font-pixel">by {project.artist}</p>
              <p className="text-sm text-cyber-green/90 line-clamp-2 font-pixel">{project.description}</p>
            </div>
            <Badge className={`cyber-badge ${getRiskColor(project.riskLevel)}`}>{project.riskLevel}</Badge>
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            <Badge className="border-2 border-cyber-purple text-cyber-purple bg-transparent font-retro text-xs">
              {project.category}
            </Badge>
            <div className="flex items-center text-cyber-pink">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="font-retro">{project.stakingApy}% APY</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2 font-pixel">
              <span className="text-cyber-green/70">FUNDING PROGRESS</span>
              <span className="text-cyber-green font-medium">{fundingPercentage.toFixed(1)}%</span>
            </div>
            <div className="retro-progress">
              <div className="retro-progress-fill" style={{ width: `${fundingPercentage}%` }}></div>
            </div>
            <div className="flex justify-between text-sm mt-1 font-pixel">
              <span className="neon-text font-medium">{formatNumber(project.currentFunding)}</span>
              <span className="text-cyber-green/70">{formatNumber(project.targetFunding)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm font-pixel">
            <div>
              <p className="text-cyber-green/70">MILESTONES</p>
              <p className="text-cyber-green font-medium">{project.completedMilestones}/{project.milestones}</p>
            </div>
            <div>
              <p className="text-cyber-green/70">TIME LEFT</p>
              <p className="neon-text font-medium">{project.timeRemaining}</p>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => setShowStakeModal(true)}
              className="flex-1 pixel-button bg-cyber-gradient"
            >
              <Coins className="w-4 h-4 mr-2" />
              STAKE $IP
            </Button>
            <Button className="border-2 border-cyber-pink text-cyber-pink bg-transparent hover:bg-cyber-pink hover:text-black">
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
