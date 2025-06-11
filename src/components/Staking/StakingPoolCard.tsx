
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Clock, Shield, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StakingPoolCardProps {
  pool: {
    name: string;
    description: string;
    apy: number;
    total_staked: number;
    total_stakers: number;
    current_completion: number;
    risk_level: string;
    contract_address: string;
  };
  project?: {
    id: number;
    title: string;
    description: string;
  };
  artistName: string;
}

const formatIP = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' IP';
};

export const StakingPoolCard: React.FC<StakingPoolCardProps> = ({ pool, project, artistName }) => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader>
        <CardTitle className="text-white">{pool.name}</CardTitle>
        <CardDescription className="text-gray-400">{pool.description}</CardDescription>
        {artistName && (
          <p className="text-sm text-gray-500">by {artistName}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">
              <TrendingUp className="w-4 h-4 inline-block mr-1" />
              APY
            </p>
            <p className="text-xl font-bold text-neon-green">{pool.apy}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">
              <Users className="w-4 h-4 inline-block mr-1" />
              Total Stakers
            </p>
            <p className="text-xl font-bold text-white">{pool.total_stakers}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-400">
            <Clock className="w-4 h-4 inline-block mr-1" />
            Total Staked
          </p>
          <p className="text-xl font-bold text-white">{formatIP(pool.total_staked)}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Current Completion</span>
            <span className="text-neon-blue">{pool.current_completion}%</span>
          </div>
          <Progress value={pool.current_completion} className="h-2" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">
              <Shield className="w-4 h-4 inline-block mr-1" />
              Risk Level
            </p>
            <Badge variant="secondary">{pool.risk_level}</Badge>
          </div>
          <Button variant="outline" className="neon-border">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Contract
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
