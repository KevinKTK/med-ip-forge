
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink, Shield, Globe } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Patent = Database['public']['Tables']['patents']['Row']

interface PatentCardProps {
  patent: Patent;
}

export const PatentCard = ({ patent }: PatentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-cyber-orange text-black border-cyber-orange';
      case 'registered': return 'bg-cyber-green text-black border-cyber-green';
      case 'licensed': return 'bg-cyber-cyan text-black border-cyber-cyan';
      default: return 'bg-cyber-purple text-black border-cyber-purple';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="pixel-card pixel-outline p-6 space-y-4 hover:shadow-cyber transition-all duration-300 animate-pixel-pulse">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-retro text-lg neon-text">{patent.title}</h3>
          <p className="text-sm text-cyber-green/70 font-pixel">{patent.category}</p>
        </div>
        <Badge className={`cyber-badge ${getStatusColor(patent.status)}`}>
          {patent.status.toUpperCase()}
        </Badge>
      </div>

      <div className="molecular-icon text-cyber-pink mx-auto animate-pixel-pulse"></div>

      <p className="text-cyber-green/90 text-sm font-pixel">{patent.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm font-pixel">
        <div>
          <p className="text-cyber-green/70">FILING DATE</p>
          <p className="font-bold text-cyber-green">{formatDate(patent.filing_date)}</p>
        </div>
        <div>
          <p className="text-cyber-green/70">IP ID</p>
          <p className="font-bold neon-text">{patent.ip_id ? `${patent.ip_id.slice(0, 8)}...` : 'Pending'}</p>
        </div>
      </div>

      {patent.patent_number && (
        <div className="bg-black/50 p-2 border border-cyber-green/30">
          <p className="text-cyber-green/70 text-xs font-pixel">PATENT NUMBER</p>
          <p className="font-bold text-cyber-green text-sm">{patent.patent_number}</p>
        </div>
      )}

      <div className="flex gap-2">
        {patent.ip_metadata_uri && (
          <Button 
            variant="outline"
            size="sm"
            className="flex-1 pixel-button border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-black"
            onClick={() => window.open(patent.ip_metadata_uri, '_blank')}
          >
            <Globe className="w-4 h-4 mr-2" />
            METADATA
          </Button>
        )}
        {patent.transaction_hash && (
          <Button 
            variant="outline"
            size="sm"
            className="flex-1 pixel-button border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black"
            onClick={() => window.open(`https://testnet.storyscan.xyz/tx/${patent.transaction_hash}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            VIEW TX
          </Button>
        )}
      </div>
    </div>
  );
};
