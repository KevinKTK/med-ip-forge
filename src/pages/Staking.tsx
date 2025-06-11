import { Layout } from '@/components/Layout';
import { StakingHeader } from '@/components/Staking/StakingHeader';
import { StakingPoolCard } from '@/components/Staking/StakingPoolCard';
import { StakingFilters } from '@/components/Staking/StakingFilters';
import { RewardsPanel } from '@/components/Staking/RewardsPanel';
import { TransactionHistory } from '@/components/Staking/TransactionHistory';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DeployStakingPoolModal } from '@/components/Staking/DeployStakingPoolModal';
import { StakingModal } from '@/components/Staking/StakingModal';

const Staking = () => {
  const [stakingPools, setStakingPools] = useState<any[]>([]);
  const [projects, setProjects] = useState<Record<number, any>>({});
  const [artists, setArtists] = useState<Record<number, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isDeployStakingPoolModalOpen, setIsDeployStakingPoolModalOpen] = useState(false);
  const [isStakingModalOpen, setIsStakingModalOpen] = useState(false);
  const [selectedStakingPool, setSelectedStakingPool] = useState<any | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const [selectedFilters, setSelectedFilters] = useState({
    category: 'All',
    riskLevel: 'All',
    minApy: 0,
    maxCompletion: 100,
    showInactive: false
  });

  const fetchData = useCallback(async () => {
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
      }, {} as Record<number, any>);

      const artistsMap = (artistsData || []).reduce((acc, artist) => {
        acc[artist.id] = artist;
        return acc;
      }, {} as Record<number, any>);

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
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeployNewPool = () => {
    setIsDeployStakingPoolModalOpen(true);
  };

  const handleDeploySuccess = () => {
    fetchData(); // Refresh data after successful deployment
  };

  const handleOpenStakingModal = (pool: any, projectData: any) => {
    setSelectedStakingPool(pool);
    setSelectedProject(projectData);
    setIsStakingModalOpen(true);
  };

  const handleCloseStakingModal = () => {
    setIsStakingModalOpen(false);
    setSelectedStakingPool(null);
    setSelectedProject(null);
  };

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
        <StakingHeader onDeployNewPool={handleDeployNewPool} />

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
                      onOpenStakingModal={handleOpenStakingModal}
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
      <DeployStakingPoolModal
        isOpen={isDeployStakingPoolModalOpen}
        onClose={() => setIsDeployStakingPoolModalOpen(false)}
        onDeploySuccess={handleDeploySuccess}
      />
      {selectedStakingPool && selectedProject && (
        <StakingModal
          isOpen={isStakingModalOpen}
          onClose={handleCloseStakingModal}
          stakingPool={selectedStakingPool}
          project={selectedProject}
        />
      )}
    </Layout>
  );
};

export default Staking;
