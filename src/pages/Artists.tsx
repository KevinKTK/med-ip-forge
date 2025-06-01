
import { Layout } from '@/components/Layout';
import { ArtistHeader } from '@/components/Artists/ArtistHeader';
import { ArtistFilters } from '@/components/Artists/ArtistFilters';
import { ArtistCard } from '@/components/Artists/ArtistCard';
import { ProjectCard } from '@/components/Artists/ProjectCard';
import { CreateProjectModal } from '@/components/Artists/CreateProjectModal';
import { useState } from 'react';

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
    fundingRange: [0, 100000],
    verified: false
  });

  const filteredProjects = projects.filter(project => {
    if (selectedFilters.category !== 'All' && project.category !== selectedFilters.category) return false;
    if (selectedFilters.riskLevel !== 'All' && project.riskLevel !== selectedFilters.riskLevel) return false;
    if (project.targetFunding < selectedFilters.fundingRange[0] || project.targetFunding > selectedFilters.fundingRange[1]) return false;
    return true;
  });

  const filteredArtists = artists.filter(artist => {
    if (selectedFilters.category !== 'All' && artist.genre !== selectedFilters.category) return false;
    if (selectedFilters.verified && !artist.verified) return false;
    return true;
  });

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
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
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
      />
    </Layout>
  );
};

export default Artists;
