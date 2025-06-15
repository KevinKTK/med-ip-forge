
import { StatCard } from '@/components/Dashboard/StatCard';
import { History, TrendingUp, Coins, Target, Clock } from 'lucide-react';

export const HistoryHeader = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-retro neon-text mb-4 glitch-text" data-text="TRANSACTION HISTORY">TRANSACTION HISTORY</h1>
        <p className="text-cyber-purple/80 font-pixel text-lg">Comprehensive log of all your IP token activities, trades, stakes, and rewards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          title="Total Transactions"
          value="1,247"
          change="156"
          positive={true}
          icon={<History className="w-8 h-8" />}
        />
        <StatCard
          title="Volume (30d)"
          value="$IP 45.2K"
          change="18.5%"
          positive={true}
          icon={<Coins className="w-8 h-8" />}
        />
        <StatCard
          title="Stakes Active"
          value="23"
          change="3"
          positive={true}
          icon={<Target className="w-8 h-8" />}
        />
        <StatCard
          title="Rewards Claimed"
          value="$IP 8.4K"
          change="12.8%"
          positive={true}
          icon={<TrendingUp className="w-8 h-8" />}
        />
        <StatCard
          title="Avg Time"
          value="2.3s"
          change="0.4s"
          positive={false}
          icon={<Clock className="w-8 h-8" />}
        />
      </div>
    </div>
  );
};
