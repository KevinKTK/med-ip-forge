import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Filter, RotateCcw } from 'lucide-react';

interface StakingFiltersProps {
  filters: {
    category: string;
    riskLevel: string;
    minApy: number;
    maxCompletion: number;
    showInactive: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

export const StakingFilters = ({ filters, onFiltersChange }: StakingFiltersProps) => {
  const categories = ['All', 'Music', 'Visual Arts', 'Literature', 'Film', 'Fashion'];
  const riskLevels = ['All', 'Low', 'Medium', 'High'];
  
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      category: 'All',
      riskLevel: 'All',
      minApy: 0,
      maxCompletion: 100,
      showInactive: false
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-white">
            <Filter className="w-5 h-5 mr-2" />
            Filter Pools
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="neon-border"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filters.category === category ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter('category', category)}
                className={filters.category === category ? "bg-neon-gradient" : "neon-border"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Risk Level</label>
          <div className="flex gap-2">
            {riskLevels.map((risk) => (
              <Button
                key={risk}
                variant={filters.riskLevel === risk ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter('riskLevel', risk)}
                className={filters.riskLevel === risk ? "bg-neon-gradient" : "neon-border"}
              >
                {risk}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Min APY (%)</label>
            <input
              type="number"
              value={filters.minApy}
              onChange={(e) => updateFilter('minApy', parseFloat(e.target.value) || 0)}
              className="w-full bg-background/50 border border-white/10 rounded px-3 py-2 text-white text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Max Completion (%)</label>
            <input
              type="number"
              value={filters.maxCompletion}
              onChange={(e) => updateFilter('maxCompletion', parseFloat(e.target.value) || 100)}
              className="w-full bg-background/50 border border-white/10 rounded px-3 py-2 text-white text-sm"
              placeholder="100"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">Show Inactive Pools</label>
          <Switch
            checked={filters.showInactive}
            onCheckedChange={(checked) => updateFilter('showInactive', checked)}
          />
        </div>
        
        <div className="pt-2">
          <Badge variant="outline" className="w-full justify-center neon-border">
            💡 Higher APY pools may carry additional risk
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
