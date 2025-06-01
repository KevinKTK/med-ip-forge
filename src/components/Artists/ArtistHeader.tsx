
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Plus, Palette, TrendingUp, Users, DollarSign } from 'lucide-react';

interface ArtistHeaderProps {
  onCreateProject: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ArtistHeader = ({ onCreateProject, activeTab, onTabChange }: ArtistHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-retro neon-text glitch-text" data-text="ARTIST MARKETPLACE">ARTIST MARKETPLACE</h1>
          <p className="text-cyber-green/80 mt-2 font-pixel">Discover and invest in the future of creative projects</p>
        </div>
        <Button onClick={onCreateProject} className="pixel-button bg-cyber-gradient">
          <Plus className="w-4 h-4 mr-2" />
          CREATE PROJECT
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Active Projects"
          value="128"
          change="12%"
          positive={true}
          icon={<Palette className="w-8 h-8" />}
        />
        <StatCard
          title="Total Funded"
          value="$2.4M"
          change="25.1%"
          positive={true}
          icon={<DollarSign className="w-8 h-8" />}
        />
        <StatCard
          title="Verified Artists"
          value="89"
          change="8"
          positive={true}
          icon={<Users className="w-8 h-8" />}
        />
        <StatCard
          title="Avg ROI"
          value="24.5%"
          change="3.2%"
          positive={true}
          icon={<TrendingUp className="w-8 h-8" />}
        />
      </div>
      
      <div className="flex space-x-2">
        <Button
          onClick={() => onTabChange('projects')}
          className={activeTab === 'projects' ? 'pixel-button bg-cyber-green text-black' : 'border-2 border-cyber-green text-cyber-green bg-transparent hover:bg-cyber-green hover:text-black font-retro text-xs'}
        >
          ACTIVE PROJECTS
        </Button>
        <Button
          onClick={() => onTabChange('artists')}
          className={activeTab === 'artists' ? 'pixel-button bg-cyber-green text-black' : 'border-2 border-cyber-green text-cyber-green bg-transparent hover:bg-cyber-green hover:text-black font-retro text-xs'}
        >
          FEATURED ARTISTS
        </Button>
      </div>
    </div>
  );
};
