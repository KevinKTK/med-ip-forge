
import { Layout } from '@/components/Layout';
import { PortfolioSummary } from '@/components/Portfolio/PortfolioSummary';
import { AllocationChart } from '@/components/Portfolio/AllocationChart';
import { PerformanceChart } from '@/components/Portfolio/PerformanceChart';
import { AssetTable } from '@/components/Portfolio/AssetTable';

const Portfolio = () => {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Your Portfolio
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Track your intellectual property investments and manage your staked assets.
          </p>
        </div>

        {/* Portfolio Summary Stats */}
        <PortfolioSummary />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Chart */}
          <div className="lg:col-span-1">
            <PerformanceChart />
          </div>
          
          {/* Allocation Chart */}
          <div className="lg:col-span-1">
            <AllocationChart />
          </div>
        </div>

        {/* Assets Table */}
        <AssetTable />
      </div>
    </Layout>
  );
};

export default Portfolio;
