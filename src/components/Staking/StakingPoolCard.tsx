
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Shield, Coins } from 'lucide-react';
import { useState } from 'react';
import { StakingModal } from './StakingModal';

interface StakingPool {
  id: number;
  name: string;
  assetType: string;
  apy: number;
  lockupPeriods: number[];
  currentCompletion: number;
  totalPoolSize: number;
  availableCapacity: number;
  riskLevel: string;
  description: string;
}

interface StakingPoolCardProps {
  pool: StakingPool;
}

export const StakingPoolCard = ({ pool }: StakingPoolCardProps) => {
  const [showStakingModal, setShowStakingModal] = useState(false);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <>
      <Card className="glass-card hover:neon-glow transition-all duration-300 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white">{pool.name}</CardTitle>
              <p className="text-sm text-gray-400 mt-1">{pool.description}</p>
            </div>
            <Badge className={getRiskColor(pool.riskLevel)}>{pool.riskLevel}</Badge>
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            <Badge variant="outline" className="neon-border">
              {pool.assetType}
            </Badge>
            <div className="flex items-center text-neon-blue">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="font-bold">{pool.apy}% APY</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Pool Completion</span>
              <span className="text-white font-medium">{pool.currentCompletion}%</span>
            </div>
            <Progress value={pool.currentCompletion} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Total Pool Size</p>
              <p className="text-white font-medium">{formatNumber(pool.totalPoolSize)}</p>
            </div>
            <div>
              <p className="text-gray-400">Available</p>
              <p className="text-neon-blue font-medium">{formatNumber(pool.availableCapacity)}</p>
            </div>
          </div>
          
          <div>
            <p className="text-gray-400 text-sm mb-2">Lock-up Periods</p>
            <div className="flex gap-2">
              {pool.lockupPeriods.map((period) => (
                <Badge key={period} variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {period}d
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => setShowStakingModal(true)}
              className="flex-1 bg-neon-gradient hover:opacity-90"
            >
              <Coins className="w-4 h-4 mr-2" />
              Stake Now
            </Button>
            <Button variant="outline" className="neon-border">
              <Shield className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <StakingModal 
        isOpen={showStakingModal}
        onClose={() => setShowStakingModal(false)}
        pool={pool}
      />
    </>
  );
};
