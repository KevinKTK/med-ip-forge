
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Vote, TrendingUp, Users } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    ticker: string;
    marketCap: string;
    completion: number;
    compoundPercentage: number;
    controlPercentage: number;
    status: string;
    category: string;
    votes: number;
    description: string;
  };
  onVote: () => void;
}

export const ProjectCard = ({ project, onVote }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LAUNCHING': return 'bg-cyber-orange text-black border-cyber-orange';
      case 'LIVE': return 'bg-cyber-green text-black border-cyber-green';
      case 'ADVANCING': return 'bg-cyber-cyan text-black border-cyber-cyan';
      default: return 'bg-cyber-purple text-black border-cyber-purple';
    }
  };

  return (
    <div className="pixel-card p-6 space-y-4 hover:shadow-cyber transition-all duration-300 animate-pixel-pulse">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-retro text-lg neon-text">{project.name}</h3>
          <p className="text-sm text-cyber-green/70 font-pixel">{project.ticker}</p>
        </div>
        <Badge className={`cyber-badge ${getStatusColor(project.status)}`}>
          {project.status}
        </Badge>
      </div>

      <div className="molecular-icon text-cyber-pink mx-auto animate-pixel-pulse"></div>

      <p className="text-cyber-green/90 text-sm font-pixel">{project.description}</p>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-pixel">
          <span className="text-cyber-green/70">FUNDING PROGRESS</span>
          <span className="neon-text font-bold">{project.completion}%</span>
        </div>
        <div className="retro-progress">
          <div className="retro-progress-fill" style={{ width: `${project.completion}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm font-pixel">
        <div>
          <p className="text-cyber-green/70">MARKET CAP</p>
          <p className="font-bold text-cyber-green">{project.marketCap}</p>
        </div>
        <div>
          <p className="text-cyber-green/70">VOTES</p>
          <p className="font-bold neon-text">{project.votes.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-pixel">
        <div className="bg-black/50 p-2 border border-cyber-green/30">
          <p className="text-cyber-green/70">COMPOUND</p>
          <p className="font-bold text-cyber-green">{project.compoundPercentage}%</p>
        </div>
        <div className="bg-black/50 p-2 border border-cyber-green/30">
          <p className="text-cyber-green/70">CONTROL</p>
          <p className="font-bold text-cyber-green">{project.controlPercentage}%</p>
        </div>
      </div>

      <Button 
        onClick={onVote}
        className="w-full pixel-button bg-cyber-gradient hover:shadow-neon"
      >
        <Vote className="w-4 h-4 mr-2" />
        VOTE WITH $IP
      </Button>
    </div>
  );
};
