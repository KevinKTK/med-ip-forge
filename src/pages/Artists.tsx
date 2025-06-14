
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ArtistHeader } from '@/components/Artists/ArtistHeader';
import { ArtistFilters } from '@/components/Artists/ArtistFilters';
import { ArtistCard } from '@/components/Artists/ArtistCard';
import { ProjectCard } from '@/components/Artists/ProjectCard';
import { CreateProjectModal } from '@/components/Artists/CreateProjectModal';
import { StakeProjectModal } from '@/components/Artists/StakeProjectModal';
import { useArtists } from '@/hooks/useArtists';
import { useProjects } from '@/hooks/useProjects';
import { useStaking } from '@/hooks/useStaking';

const Artists = () => {
  const [activeTab, setActiveTab] = useState('artists');
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    category: '',
    riskLevel: '',
    fundingRange: [0, 1000000] as [number, number],
    verified: false,
  });

  const { artists, isLoading: isLoadingArtists, refreshArtists } = useArtists();
  const { projects, isLoading: isLoadingProjects, refreshProjects } = useProjects();
  const { stakingPools } = useStaking();

  const handleCreateProject = (artist: any) => {
    setSelectedArtist(artist);
    setIsCreateProjectModalOpen(true);
  };

  const handleStakeProject = (project: any) => {
    setSelectedProject(project);
    setIsStakeModalOpen(true);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const filteredArtists = artists.filter(artist => {
    if (filters.category && artist.genre !== filters.category) return false;
    if (filters.verified && !artist.verified) return false;
    return true;
  });

  const filteredProjects = projects.filter(project => {
    if (filters.category && project.category !== filters.category) return false;
    if (filters.riskLevel && project.risk_level !== filters.riskLevel) return false;
    if (project.current_funding < filters.fundingRange[0] || project.current_funding > filters.fundingRange[1]) return false;
    return true;
  });

  const getArtistForProject = (artistId: number) => {
    return artists.find(artist => artist.id === artistId);
  };

  const getStakingPoolForProject = (projectId: number) => {
    return stakingPools.find(pool => pool.project_id === projectId);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8 space-y-8">
        <ArtistHeader />
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('artists')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'artists'
                ? 'bg-neon-gradient text-white'
                : 'text-gray-400 hover:text-white border border-gray-600'
            }`}
          >
            Artists
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-neon-gradient text-white'
                : 'text-gray-400 hover:text-white border border-gray-600'
            }`}
          >
            Projects
          </button>
        </div>

        <ArtistFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {activeTab === 'artists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingArtists ? (
              <div className="col-span-full text-center text-gray-400">Loading artists...</div>
            ) : filteredArtists.length > 0 ? (
              filteredArtists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  onCreateProject={() => handleCreateProject(artist)}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400">No artists found matching your filters.</div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingProjects ? (
              <div className="col-span-full text-center text-gray-400">Loading projects...</div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const artist = getArtistForProject(project.artist_id);
                const stakingPool = getStakingPoolForProject(project.id);
                
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    artistName={artist?.name || 'Unknown Artist'}
                    onStake={() => handleStakeProject(project)}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center text-gray-400">No projects found matching your filters.</div>
            )}
          </div>
        )}

        <CreateProjectModal
          isOpen={isCreateProjectModalOpen}
          onClose={() => setIsCreateProjectModalOpen(false)}
          artistId={selectedArtist?.id}
          onProjectCreated={() => {
            refreshProjects();
            setIsCreateProjectModalOpen(false);
          }}
        />

        <StakeProjectModal
          isOpen={isStakeModalOpen}
          onClose={() => setIsStakeModalOpen(false)}
          project={selectedProject}
        />
      </div>
    </Layout>
  );
};

export default Artists;
