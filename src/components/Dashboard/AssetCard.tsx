
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface AssetCardProps {
  title: string;
  type: 'Copyright' | 'Patent';
  creator: string;
  marketCap: string;
  completion: number;
  apy: string;
  image?: string;
}

export const AssetCard = ({ title, type, creator, marketCap, completion, apy, image }: AssetCardProps) => {
  const typeColor = type === 'Copyright' ? 'text-neon-purple' : 'text-neon-cyan';
  const typeBg = type === 'Copyright' ? 'bg-neon-purple/10' : 'bg-neon-cyan/10';
  
  return (
    <div className="pixel-card pixel-outline p-6 hover:shadow-cyber transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${typeBg} ${typeColor}`}>
              {type}
            </span>
            <span className="text-xs text-gray-400">by {creator}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{title}</h3>
        </div>
        {image && (
          <div className="w-12 h-12 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg flex-shrink-0 ml-4"></div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Market Cap</span>
          <span className="text-white font-medium">{marketCap}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Completion</span>
            <span className="text-white">{completion}%</span>
          </div>
          <Progress value={completion} className="h-2" />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">APY</span>
          <span className="text-neon-green font-medium">{apy}</span>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1 bg-neon-blue hover:bg-neon-blue/80">
            Stake
          </Button>
          <Button size="sm" variant="outline" className="neon-border">
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};
