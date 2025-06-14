import { Layout } from '@/components/Layout';
import { ArtistHeader } from '@/components/Artists/ArtistHeader';
import { ArtistFilters } from '@/components/Artists/ArtistFilters';
import { ArtistCard } from '@/components/Artists/ArtistCard';
import { ProjectCard } from '@/components/Artists/ProjectCard';
import { CreateProjectModal } from '@/components/Artists/CreateProjectModal';
import { useState, useEffect } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useArtists } from '@/hooks/useArtists';
import { useStakingPoolDeployer, StakingError } from '@/utils/contractUtils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock artists data
const artists = [
  {
    id: 1,
    name: "Maya Chen",
    avatar: "/placeholder.svg",
    genre: "Digital Art",
    verified: true,
    totalRaised: 125000,
    completedProjects: 3,
    followers: 2400,
    rating: 4.8,
    currentProject: "Abstract Reality Series",
    bio: "Creating immersive digital experiences that blend reality with imagination"
  },
  {
    id: 2,
    name: "Marcus Rivera",
    avatar: "/placeholder.svg",
    genre: "Music",
    verified: true,
    totalRaised: 89000,
    completedProjects: 5,
    followers: 5600,
    rating: 4.9,
    currentProject: "Symphonic AI Album",
    bio: "Composer pushing boundaries between classical music and AI-generated melodies"
  },
  {
    id: 3,
    name: "Luna Nakamura",
    avatar: "/placeholder.svg",
    genre: "Film",
    verified: false,
    totalRaised: 45000,
    completedProjects: 1,
    followers: 890,
    rating: 4.6,
    currentProject: "Future Tokyo Documentary",
    bio: "Independent filmmaker documenting cultural transformation in urban environments"
  }
];

// Mock projects data
const projects = [
  {
    id: 1,
    title: "Neural Dreams Collection",
    artist: "Maya Chen",
    category: "Digital Art",
    targetFunding: 50000,
    currentFunding: 32500,
    stakingApy: 18.5,
    timeRemaining: "14 days",
    description: "AI-generated artwork exploring consciousness and digital identity",
    riskLevel: "Medium",
    milestones: 4,
    completedMilestones: 1
  },
  {
    id: 2,
    title: "Quantum Orchestra Album",
    artist: "Marcus Rivera",
    category: "Music",
    targetFunding: 75000,
    currentFunding: 67500,
    stakingApy: 22.1,
    timeRemaining: "8 days",
    description: "Revolutionary album combining quantum computing with orchestral arrangements",
    riskLevel: "Low",
    milestones: 6,
    completedMilestones: 3
  },
  {
    id: 3,
    title: "Metaverse Fashion Show",
    artist: "Elena Vasquez",
    category: "Fashion",
    targetFunding: 35000,
    currentFunding: 8750,
    stakingApy: 15.8,
    timeRemaining: "25 days",
    description: "First fully immersive fashion show in virtual reality",
    riskLevel: "High",
    milestones: 3,
    completedMilestones: 0
  }
];

const Artists = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: 'All',
    riskLevel: 'All',
    fundingRange: [0, 500000],
    verified: false
  });

  const { projects, stakingPools, patents, isLoading, createProject, updateProjectStakingPool, refreshProjects } = useProjects();
  const { artists: artistsData, getArtistById } = useArtists();
  const { deployContract, isDeploying } = useStakingPoolDeployer();
  const { toast } = useToast();

  const handleCreateProject = async (projectData: any) => {
    try {
      console.log('Creating project with data:', projectData);
      
      // The project is already created by CreateProjectModal. We use the data passed from the modal.
      const newProject = projectData;
      console.log('Project data received:', newProject);

      toast({
        title: "Project Created",
        description: "Your project has been created successfully.",
      });

      // Refresh the projects list
      await refreshProjects();
      
    } catch (error) {
      console.error('Project creation error:', error);
      toast({
        title: "Error Creating Project",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getArtistName = async (artistId: number): Promise<string> => {
    try {
      const artist = await getArtistById(artistId);
      return artist?.name || 'Unknown Artist';
    } catch (error) {
      return 'Unknown Artist';
    }
  };

  const filteredProjects = projects.filter(project => {
    if (selectedFilters.category !== 'All' && project.category !== selectedFilters.category) return false;
    if (selectedFilters.riskLevel !== 'All' && project.risk_level !== selectedFilters.riskLevel) return false;
    if (project.target_funding < selectedFilters.fundingRange[0] || project.target_funding > selectedFilters.fundingRange[1]) return false;
    return true;
  });

  const filteredArtists = artists.filter(artist => {
    if (selectedFilters.category !== 'All' && artist.genre !== selectedFilters.category) return false;
    if (selectedFilters.verified && !artist.verified) return false;
    return true;
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading projects...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <ArtistHeader 
          onCreateProject={() => setShowCreateModal(true)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ArtistFilters 
              filters={selectedFilters}
              onFiltersChange={setSelectedFilters}
            />
          </div>
          
          <div className="lg:col-span-3">
            {activeTab === 'projects' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((project) => {
                  const artist = artistsData.find(a => a.id === project.artist_id);
                  const artistName = artist?.name || 'Unknown Artist';
                  
                  return (
                    <ProjectCard 
                      key={project.id} 
                      project={project}
                      artistName={artistName}
                      stakingPool={stakingPools[project.id]}
                      patent={patents[project.id]}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CreateProjectModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
      />
    </Layout>
  );
};

export default Artists;
