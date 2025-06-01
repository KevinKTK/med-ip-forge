
import { Button } from '@/components/ui/button';
import { Calendar, Filter, Search } from 'lucide-react';
import { useState } from 'react';

export const FilterControls = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  const activityTypes = [
    { id: 'all', label: 'All Activities' },
    { id: 'stake', label: 'Stakes' },
    { id: 'trade', label: 'Trades' },
    { id: 'claim', label: 'Claims' },
    { id: 'reward', label: 'Rewards' },
    { id: 'vote', label: 'Votes' },
  ];

  const timeframes = [
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: 'all', label: 'All Time' },
  ];

  return (
    <div className="pixel-card p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Filter className="w-5 h-5 text-cyber-purple" />
        <h3 className="font-retro text-cyber-purple text-sm uppercase">Filters</h3>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="block text-xs font-retro text-cyber-purple/70 uppercase">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-purple w-4 h-4" />
          <input
            type="text"
            placeholder="TX HASH, PROJECT..."
            className="pixel-input pl-10 pr-4 py-2 w-full"
          />
        </div>
      </div>

      {/* Activity Type */}
      <div className="space-y-2">
        <label className="block text-xs font-retro text-cyber-purple/70 uppercase">Activity Type</label>
        <div className="space-y-1">
          {activityTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedFilter(type.id)}
              className={`w-full text-left px-3 py-2 font-pixel text-xs transition-all ${
                selectedFilter === type.id
                  ? 'bg-cyber-purple text-white'
                  : 'text-cyber-purple hover:bg-cyber-purple/10'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeframe */}
      <div className="space-y-2">
        <label className="block text-xs font-retro text-cyber-purple/70 uppercase">Timeframe</label>
        <div className="space-y-1">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.id}
              onClick={() => setSelectedTimeframe(timeframe.id)}
              className={`w-full text-left px-3 py-2 font-pixel text-xs transition-all ${
                selectedTimeframe === timeframe.id
                  ? 'bg-cyber-purple text-white'
                  : 'text-cyber-purple hover:bg-cyber-purple/10'
              }`}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-retro text-cyber-purple/70 uppercase">Asset</label>
        <select className="pixel-input w-full py-2">
          <option value="all">All Assets</option>
          <option value="ip">IP Tokens</option>
          <option value="shares">Project Shares</option>
          <option value="rewards">Rewards</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-retro text-cyber-purple/70 uppercase">Status</label>
        <select className="pixel-input w-full py-2">
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <Button className="pixel-button w-full">
        CLEAR FILTERS
      </Button>
    </div>
  );
};
