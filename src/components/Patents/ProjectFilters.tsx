
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

export const ProjectFilters = () => {
  return (
    <div className="pixel-card p-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button className="pixel-button bg-cyber-green text-black">
            LAUNCHING
          </Button>
          <Button className="border-2 border-cyber-green text-cyber-green bg-transparent hover:bg-cyber-green hover:text-black font-retro text-xs">
            LIVE
          </Button>
          <Button className="border-2 border-cyber-green text-cyber-green bg-transparent hover:bg-cyber-green hover:text-black font-retro text-xs">
            ADVANCING
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-green w-4 h-4" />
            <input
              type="text"
              placeholder="SEARCH PROJECTS..."
              className="pixel-input pl-10 pr-4 py-3 w-64"
            />
          </div>
          <Button className="border-2 border-cyber-purple text-cyber-purple bg-transparent hover:bg-cyber-purple hover:text-black font-retro text-xs">
            <Filter className="w-4 h-4 mr-2" />
            FILTERS
          </Button>
        </div>
      </div>
    </div>
  );
};
