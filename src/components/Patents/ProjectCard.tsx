
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
      case 'LAUNCHING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'LIVE': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ADVANCING': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="glass-card p-6 space-y-4 hover:neon-glow transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg gradient-text">{project.name}</h3>
          <p className="text-sm text-gray-400">{project.ticker}</p>
        </div>
        <Badge className={`${getStatusColor(project.status)} border`}>
          {project.status}
        </Badge>
      </div>

      <div className="w-16 h-16 bg-neon-gradient rounded-lg flex items-center justify-center">
        <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/40"></div>
      </div>

      <p className="text-gray-300 text-sm">{project.description}</p>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Funding Progress</span>
          <span className="text-neon-blue font-semibold">{project.completion}%</span>
        </div>
        <Progress value={project.completion} className="h-2" />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400">Market Cap</p>
          <p className="font-semibold text-white">{project.marketCap}</p>
        </div>
        <div>
          <p className="text-gray-400">Votes</p>
          <p className="font-semibold text-neon-blue">{project.votes.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-black/30 p-2 rounded">
          <p className="text-gray-400">Compound</p>
          <p className="font-semibold">{project.compoundPercentage}%</p>
        </div>
        <div className="bg-black/30 p-2 rounded">
          <p className="text-gray-400">Control</p>
          <p className="font-semibold">{project.controlPercentage}%</p>
        </div>
      </div>

      <Button 
        onClick={onVote}
        className="w-full bg-neon-gradient hover:opacity-90"
      >
        <Vote className="w-4 h-4 mr-2" />
        Vote with $IP
      </Button>
    </div>
  );
};
