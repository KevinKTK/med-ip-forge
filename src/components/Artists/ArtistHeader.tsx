
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
          <h1 className="text-3xl font-bold gradient-text">Artist Marketplace</h1>
          <p className="text-gray-400 mt-2">Discover and invest in the future of creative projects</p>
        </div>
        <Button onClick={onCreateProject} className="bg-neon-gradient hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Create Project
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
      
      <div className="flex space-x-4">
        <Button
          variant={activeTab === 'projects' ? 'default' : 'outline'}
          onClick={() => onTabChange('projects')}
          className={activeTab === 'projects' ? 'bg-neon-gradient' : 'neon-border'}
        >
          Active Projects
        </Button>
        <Button
          variant={activeTab === 'artists' ? 'default' : 'outline'}
          onClick={() => onTabChange('artists')}
          className={activeTab === 'artists' ? 'bg-neon-gradient' : 'neon-border'}
        >
          Featured Artists
        </Button>
      </div>
    </div>
  );
};
