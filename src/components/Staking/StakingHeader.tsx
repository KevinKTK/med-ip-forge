import { StatCard } from '@/components/Dashboard/StatCard';
import { TrendingUp, Coins, Timer, Target, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StakingHeaderProps {
  onDeployNewPool: () => void;
}

export const StakingHeader = ({ onDeployNewPool }: StakingHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">$IP Token Staking</h1>
          <p className="text-gray-400 mt-2">Stake Story Protocol $IP tokens into intellectual property assets and future creative projects</p>
        </div>
        <Button
          onClick={onDeployNewPool}
          className="bg-neon-gradient hover:opacity-90"
        >
          Deploy New Pool
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          title="Total Staked"
          value="$IP 45,280"
          change="12.5%"
          positive={true}
          icon={<Coins className="w-8 h-8" />}
        />
        <StatCard
          title="Active Pools"
          value="12"
          change="3"
          positive={true}
          icon={<Target className="w-8 h-8" />}
        />
        <StatCard
          title="Future Projects"
          value="8"
          change="5"
          positive={true}
          icon={<Palette className="w-8 h-8" />}
        />
        <StatCard
          title="Avg APY"
          value="19.8%"
          change="2.1%"
          positive={true}
          icon={<TrendingUp className="w-8 h-8" />}
        />
        <StatCard
          title="Revenue Share"
          value="$IP 2,340"
          change="15.7%"
          positive={true}
          icon={<Timer className="w-8 h-8" />}
        />
      </div>
    </div>
  );
};
