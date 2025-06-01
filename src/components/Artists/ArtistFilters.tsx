
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Filter, RotateCcw } from 'lucide-react';

interface ArtistFiltersProps {
  filters: {
    category: string;
    riskLevel: string;
    fundingRange: number[];
    verified: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

export const ArtistFilters = ({ filters, onFiltersChange }: ArtistFiltersProps) => {
  const categories = ['All', 'Digital Art', 'Music', 'Film', 'Fashion', 'Gaming', 'Literature'];
  const riskLevels = ['All', 'Low', 'Medium', 'High'];
  
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      category: 'All',
      riskLevel: 'All',
      fundingRange: [0, 100000],
      verified: false
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-white">
            <Filter className="w-5 h-5 mr-2" />
            Filter Projects
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
      
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm text-gray-400 mb-3 block">Category</label>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filters.category === category ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter('category', category)}
                className={`w-full justify-start ${
                  filters.category === category ? "bg-neon-gradient" : "neon-border"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-3 block">Risk Level</label>
          <div className="space-y-2">
            {riskLevels.map((risk) => (
              <Button
                key={risk}
                variant={filters.riskLevel === risk ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter('riskLevel', risk)}
                className={`w-full justify-start ${
                  filters.riskLevel === risk ? "bg-neon-gradient" : "neon-border"
                }`}
              >
                {risk}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-3 block">
            Funding Range: ${filters.fundingRange[0].toLocaleString()} - ${filters.fundingRange[1].toLocaleString()}
          </label>
          <Slider
            value={filters.fundingRange}
            onValueChange={(value) => updateFilter('fundingRange', value)}
            max={100000}
            min={0}
            step={5000}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">Verified Artists Only</label>
          <Switch
            checked={filters.verified}
            onCheckedChange={(checked) => updateFilter('verified', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
