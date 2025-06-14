import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface ProjectFiltersProps {
  onSelectStatus: (status: string | null) => void;
  onSearch: (query: string) => void;
  currentStatus: string | null;
  currentSearchQuery: string;
}

export const ProjectFilters = ({ onSelectStatus, onSearch, currentStatus, currentSearchQuery }: ProjectFiltersProps) => {
  const handleStatusClick = (status: string | null) => {
    onSelectStatus(status);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="pixel-card p-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => handleStatusClick('LAUNCHING')}
            className={`pixel-button ${
              currentStatus === 'LAUNCHING' ? 'bg-cyber-purple text-white' : 'border-2 border-cyber-purple text-white bg-transparent hover:bg-cyber-purple hover:text-white'
            } text-xs`}
          >
            LAUNCHING
          </Button>
          <Button
            onClick={() => handleStatusClick('LIVE')}
            className={`pixel-button ${
              currentStatus === 'LIVE' ? 'bg-cyber-purple text-white' : 'border-2 border-cyber-purple text-white bg-transparent hover:bg-cyber-purple hover:text-white'
            } text-xs`}
          >
            LIVE
          </Button>
          <Button
            onClick={() => handleStatusClick('ADVANCING')}
            className={`pixel-button ${
              currentStatus === 'ADVANCING' ? 'bg-cyber-purple text-white' : 'border-2 border-cyber-purple text-white bg-transparent hover:bg-cyber-purple hover:text-white'
            } text-xs`}
          >
            ADVANCING
          </Button>
          <Button
            onClick={() => handleStatusClick(null)}
            className={`pixel-button ${
              currentStatus === null ? 'bg-cyber-purple text-white' : 'border-2 border-cyber-purple text-white bg-transparent hover:bg-cyber-purple hover:text-white'
            } text-xs`}
          >
            ALL
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-purple w-4 h-4" />
            <input
              type="text"
              placeholder="SEARCH PROJECTS..."
              value={currentSearchQuery}
              onChange={handleSearchChange}
              className="pixel-input pl-10 pr-4 py-3 w-64 text-white placeholder-gray-400"
            />
          </div>
          <Button className="border-2 border-cyber-magenta text-white bg-transparent hover:bg-cyber-magenta hover:text-black text-xs">
            <Filter className="w-4 h-4 mr-2" />
            FILTERS
          </Button>
        </div>
      </div>
    </div>
  );
};
