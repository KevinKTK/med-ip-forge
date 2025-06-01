
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Clock, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RewardsPanel = () => {
  const { toast } = useToast();

  const handleClaimRewards = () => {
    toast({
      title: "Rewards Claimed!",
      description: "Successfully claimed $1,840 in rewards.",
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-white">
          <Coins className="w-5 h-5 mr-2" />
          Rewards Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-neon-gradient/10 rounded-lg border border-neon-blue/20">
          <p className="text-sm text-gray-400">Total Claimable</p>
          <p className="text-2xl font-bold text-neon-blue">$1,840.52</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-background/30 rounded">
            <div>
              <p className="text-white font-medium">MediTech Patents</p>
              <p className="text-sm text-gray-400">30 days staked</p>
            </div>
            <div className="text-right">
              <p className="text-neon-blue font-bold">$485.20</p>
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                18.5% APY
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-background/30 rounded">
            <div>
              <p className="text-white font-medium">AI Copyright Pool</p>
              <p className="text-sm text-gray-400">45 days staked</p>
            </div>
            <div className="text-right">
              <p className="text-neon-blue font-bold">$1,125.32</p>
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                22.1% APY
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-background/30 rounded">
            <div>
              <p className="text-white font-medium">Green Energy Pool</p>
              <p className="text-sm text-gray-400">60 days staked</p>
            </div>
            <div className="text-right">
              <p className="text-neon-blue font-bold">$230.00</p>
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                15.2% APY
              </Badge>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleClaimRewards}
          className="w-full bg-neon-gradient hover:opacity-90"
        >
          <Download className="w-4 h-4 mr-2" />
          Claim All Rewards
        </Button>
        
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Next payout in <span className="text-neon-blue">2 days, 14 hours</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
