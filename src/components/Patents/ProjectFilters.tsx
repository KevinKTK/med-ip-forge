
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

export const ProjectFilters = () => {
  return (
    <div className="glass-card p-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="default"
            className="bg-neon-gradient hover:opacity-90"
          >
            LAUNCHING
          </Button>
          <Button
            variant="outline"
            className="neon-border"
          >
            LIVE
          </Button>
          <Button
            variant="outline"
            className="neon-border"
          >
            ADVANCING
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none"
            />
          </div>
          <Button variant="outline" size="sm" className="neon-border">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
