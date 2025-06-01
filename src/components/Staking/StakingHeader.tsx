
import { StatCard } from '@/components/Dashboard/StatCard';
import { TrendingUp, Coins, Timer, Target } from 'lucide-react';

export const StakingHeader = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold gradient-text">IP Asset Staking</h1>
        <p className="text-gray-400 mt-2">Stake your tokens into intellectual property assets and earn rewards</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Staked"
          value="$45,280"
          change="12.5%"
          positive={true}
          icon={<Coins className="w-8 h-8" />}
        />
        <StatCard
          title="Active Pools"
          value="8"
          change="2"
          positive={true}
          icon={<Target className="w-8 h-8" />}
        />
        <StatCard
          title="Avg APY"
          value="17.1%"
          change="2.3%"
          positive={true}
          icon={<TrendingUp className="w-8 h-8" />}
        />
        <StatCard
          title="Pending Rewards"
          value="$1,840"
          change="5.7%"
          positive={true}
          icon={<Timer className="w-8 h-8" />}
        />
      </div>
    </div>
  );
};
