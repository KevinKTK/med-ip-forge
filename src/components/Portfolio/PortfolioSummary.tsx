
import { StatCard } from '@/components/Dashboard/StatCard';
import { Wallet, TrendingUp, DollarSign, PieChart } from 'lucide-react';

export const PortfolioSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Total Portfolio Value"
        value="$IP 89,420"
        change="15.7%"
        positive={true}
        icon={<DollarSign className="w-8 h-8" />}
      />
      <StatCard
        title="Total Staked"
        value="$IP 76,250"
        change="8.3%"
        positive={true}
        icon={<Wallet className="w-8 h-8" />}
      />
      <StatCard
        title="Total Return"
        value="$IP 13,170"
        change="22.1%"
        positive={true}
        icon={<TrendingUp className="w-8 h-8" />}
      />
      <StatCard
        title="Assets Owned"
        value="12"
        change="3"
        positive={true}
        icon={<PieChart className="w-8 h-8" />}
      />
    </div>
  );
};
