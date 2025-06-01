
import { Layout } from '@/components/Layout';
import { StakingHeader } from '@/components/Staking/StakingHeader';
import { StakingPoolCard } from '@/components/Staking/StakingPoolCard';
import { StakingFilters } from '@/components/Staking/StakingFilters';
import { RewardsPanel } from '@/components/Staking/RewardsPanel';
import { TransactionHistory } from '@/components/Staking/TransactionHistory';
import { useState } from 'react';

// Mock staking pools data
const stakingPools = [
  {
    id: 1,
    name: "MediTech Patent Pool",
    assetType: "Patent",
    apy: 18.5,
    lockupPeriods: [30, 90, 180, 365],
    currentCompletion: 75,
    totalPoolSize: 1000000,
    availableCapacity: 250000,
    riskLevel: "Medium",
    description: "Revolutionary medical device patents"
  },
  {
    id: 2,
    name: "AI Copyright Collective",
    assetType: "Copyright",
    apy: 22.1,
    lockupPeriods: [90, 180, 365],
    currentCompletion: 45,
    totalPoolSize: 2500000,
    availableCapacity: 1375000,
    riskLevel: "High",
    description: "Next-gen AI algorithm copyrights"
  },
  {
    id: 3,
    name: "Green Energy Patents",
    assetType: "Patent",
    apy: 15.2,
    lockupPeriods: [30, 90, 180],
    currentCompletion: 90,
    totalPoolSize: 800000,
    availableCapacity: 80000,
    riskLevel: "Low",
    description: "Sustainable energy technology patents"
  },
  {
    id: 4,
    name: "Entertainment IP Bundle",
    assetType: "Copyright",
    apy: 12.8,
    lockupPeriods: [30, 90, 180, 365],
    currentCompletion: 65,
    totalPoolSize: 1500000,
    availableCapacity: 525000,
    riskLevel: "Low",
    description: "Film and music copyright portfolio"
  }
];

const Staking = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    assetType: 'All',
    riskLevel: 'All',
    minApy: 0,
    maxCompletion: 100
  });

  const filteredPools = stakingPools.filter(pool => {
    if (selectedFilters.assetType !== 'All' && pool.assetType !== selectedFilters.assetType) return false;
    if (selectedFilters.riskLevel !== 'All' && pool.riskLevel !== selectedFilters.riskLevel) return false;
    if (pool.apy < selectedFilters.minApy) return false;
    if (pool.currentCompletion > selectedFilters.maxCompletion) return false;
    return true;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <StakingHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StakingFilters 
              filters={selectedFilters}
              onFiltersChange={setSelectedFilters}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPools.map((pool) => (
                <StakingPoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <RewardsPanel />
            <TransactionHistory />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Staking;
