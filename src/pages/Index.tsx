
import { Layout } from '@/components/Layout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { AssetTabs } from '@/components/Dashboard/AssetTabs';
import { ActivityFeed } from '@/components/Dashboard/ActivityFeed';
import { Wallet, Users, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Fractional IP Rights Marketplace
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Stake tokens in premium intellectual property assets. Trade copyrights and patents with cutting-edge blockchain technology.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Market Cap"
            value="$IP 47.2M"
            change="12.3%"
            positive={true}
            icon={<BarChart3 className="w-8 h-8" />}
          />
          <StatCard
            title="Active Stakers"
            value="8,542"
            change="5.7%"
            positive={true}
            icon={<Users className="w-8 h-8" />}
          />
          <StatCard
            title="Total Staked"
            value="$IP 2.2M"
            change="8.9%"
            positive={true}
            icon={<Wallet className="w-8 h-8" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assets - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Featured IP Assets</h2>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue focus:outline-none"
                />
              </div>
            </div>
            <AssetTabs />
          </div>

          {/* Activity Feed - Takes up 1 column */}
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
