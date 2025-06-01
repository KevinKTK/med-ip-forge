
import { Button } from '@/components/ui/button';
import { Wallet, Copy, ExternalLink, Coins } from 'lucide-react';

export const WalletSelector = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold gradient-text mb-4 flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Wallet Connection
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-green-400">Connected Wallet</p>
                <p className="text-sm text-gray-400 font-mono">0x742d...4A7f</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="neon-border">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="neon-border">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-black/30 rounded-lg text-center">
              <Coins className="w-8 h-8 text-neon-blue mx-auto mb-2" />
              <p className="text-lg font-bold text-white">12,450 $IP</p>
              <p className="text-sm text-gray-400">Available Balance</p>
            </div>
            
            <div className="p-4 bg-black/30 rounded-lg text-center">
              <Wallet className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">8,920 $IP</p>
              <p className="text-sm text-gray-400">Staked in Governance</p>
            </div>
            
            <div className="p-4 bg-black/30 rounded-lg text-center">
              <Coins className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">1,240 $IP</p>
              <p className="text-sm text-gray-400">Pending Rewards</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Governance Power</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Voting Power</span>
            <span className="font-semibold text-neon-blue">0.72%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Rank</span>
            <span className="font-semibold text-white">#147 / 1,247</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Governance Level</span>
            <span className="font-semibold text-purple-400">Silver Voter</span>
          </div>
        </div>
      </div>
    </div>
  );
};
