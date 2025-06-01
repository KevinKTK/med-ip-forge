
import { StatCard } from '@/components/Dashboard/StatCard';
import { Vote, TrendingUp, Coins, Target, Users } from 'lucide-react';

export const PatentsHeader = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Patents Governance</h1>
        <p className="text-gray-400 mt-2">Use $IP tokens to vote on which innovative projects receive funding through democratic governance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          title="Active Proposals"
          value="24"
          change="6"
          positive={true}
          icon={<Vote className="w-8 h-8" />}
        />
        <StatCard
          title="Total Funding"
          value="$8.2M"
          change="18.5%"
          positive={true}
          icon={<Coins className="w-8 h-8" />}
        />
        <StatCard
          title="Projects Funded"
          value="47"
          change="12"
          positive={true}
          icon={<Target className="w-8 h-8" />}
        />
        <StatCard
          title="Governance APY"
          value="15.3%"
          change="2.8%"
          positive={true}
          icon={<TrendingUp className="w-8 h-8" />}
        />
        <StatCard
          title="Voters"
          value="1,247"
          change="156"
          positive={true}
          icon={<Users className="w-8 h-8" />}
        />
      </div>
    </div>
  );
};
