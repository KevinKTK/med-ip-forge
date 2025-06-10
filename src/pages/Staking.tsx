
import { Layout } from '@/components/Layout';
import { StakingHeader } from '@/components/Staking/StakingHeader';
import { StakingPoolCard } from '@/components/Staking/StakingPoolCard';
import { StakingFilters } from '@/components/Staking/StakingFilters';
import { RewardsPanel } from '@/components/Staking/RewardsPanel';
import { TransactionHistory } from '@/components/Staking/TransactionHistory';
import { useState, useEffect } from 'react';
import { supabase, StakingPool, Project, Artist } from '@/utils/supabase';
import { useToast } from '@/hooks/use-toast';

const Staking = () => {
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
  const [projects, setProjects] = useState<Record<number, Project>>({});
  const [artists, setArtists] = useState<Record<number, Artist>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [selectedFilters, setSelectedFilters] = useState({
    category: 'All',
    riskLevel: 'All',
    minApy: 0,
    maxCompletion: 100,
    showInactive: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch staking pools
        const { data: poolsData, error: poolsError } = await supabase
          .from('staking_pools')
          .select('*');

        if (poolsError) throw poolsError;

        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*');

        if (projectsError) throw projectsError;

        // Fetch artists
        const { data: artistsData, error: artistsError } = await supabase
          .from('artists')
          .select('*');

        if (artistsError) throw artistsError;

        // Convert arrays to records for easier lookup
        const projectsMap = (projectsData || []).reduce((acc, project) => {
          acc[project.id] = project;
          return acc;
        }, {} as Record<number, Project>);

        const artistsMap = (artistsData || []).reduce((acc, artist) => {
          acc[artist.id] = artist;
          return acc;
        }, {} as Record<number, Artist>);

        setStakingPools(poolsData || []);
        setProjects(projectsMap);
        setArtists(artistsMap);
      } catch (error) {
        toast({
          title: "Error Loading Data",
          description: error instanceof Error ? error.message : "Failed to load staking data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const filteredPools = stakingPools.filter(pool => {
    const project = projects[pool.project_id];
    if (!project) return false;

    if (selectedFilters.category !== 'All' && project.category !== selectedFilters.category) return false;
    if (selectedFilters.riskLevel !== 'All' && project.risk_level !== selectedFilters.riskLevel) return false;
    if (pool.apy < selectedFilters.minApy) return false;
    if ((project.current_funding / project.target_funding) * 100 > selectedFilters.maxCompletion) return false;
    if (!selectedFilters.showInactive && !pool.is_active) return false;
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

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Loading staking pools...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPools.map((pool) => {
                  const project = projects[pool.project_id];
                  const artist = project ? artists[project.artist_id] : undefined;

                  return (
                    <StakingPoolCard
                      key={pool.id}
                      pool={pool}
                      project={project}
                      artistName={artist?.name || 'Unknown Artist'}
                    />
                  );
                })}
              </div>
            )}
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
