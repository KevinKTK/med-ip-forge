import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface PatentCardProps {
  title: string;
  status: string;
  patent_number: string;
  filing_date: string;
  category: string;
  description: string;
}

export const PatentCard = ({ title, status, patent_number, filing_date, category, description }: PatentCardProps) => {
  // Determine status styling based on the status string
  const statusColor = status === 'Granted' ? 'text-neon-green' : status === 'Pending' ? 'text-neon-orange' : 'text-neon-cyan';
  const statusBg = status === 'Granted' ? 'bg-neon-green/10' : status === 'Pending' ? 'bg-neon-orange/10' : 'bg-neon-cyan/10';

  return (
    <div className="pixel-card pixel-outline p-6 hover:shadow-cyber transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusBg} ${statusColor}`}>
              {status}
            </span>
            <span className="text-xs text-gray-400">Category: {category}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{title}</h3>
        </div>
        {/* Placeholder for image/icon, similar to AssetCard */}
        <div className="w-12 h-12 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg flex-shrink-0 ml-4"></div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Patent Number</span>
          <span className="text-white font-medium">{patent_number}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Filing Date</span>
          <span className="text-white font-medium">{filing_date}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Description</span>
          </div>
          <p className="text-white text-sm line-clamp-3">{description}</p>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1 bg-neon-blue hover:bg-neon-blue/80">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}; 