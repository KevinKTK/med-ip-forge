
import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { ArtistHeader } from '@/components/Artists/ArtistHeader';
import { ArtistCard } from '@/components/Artists/ArtistCard';
import { ArtistFilters } from '@/components/Artists/ArtistFilters';
import { ProjectCard } from '@/components/Artists/ProjectCard';
import { MyProjectsView } from '@/components/Artists/MyProjectsView';
import { CreateProjectModal } from '@/components/Artists/CreateProjectModal';
import { useArtists } from '@/hooks/useArtists';
import { useProjects } from '@/hooks/useProjects';
import { Tables } from '@/integrations/supabase/types';

type Artist = Tables<'artists'>;
type Project = Tables<'projects'>;
type Patent = Tables<'patents'>; // Use Supabase type which has string id

const Artists = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('rating');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All',
    riskLevel: 'All',
    fundingRange: [0, 500000],
    verified: false
  });
  
  const { artists, isLoading: artistsLoading } = useArtists();
  const { projects, stakingPools, patents: patentsByProject, isLoading: projectsLoading } = useProjects();

  // Convert patent data to expected format - correctly typed as Patents with string ids
  const patents: Record<string, Patent> = useMemo(() => {
    const convertedPatents: Record<string, Patent> = {};
    Object.entries(patentsByProject).forEach(([projectId, patent]) => {
      convertedPatents[projectId] = patent;
    });
    return convertedPatents;
  }, [patentsByProject]);

  const filteredArtists = useMemo(() => {
    return artists.filter(artist => {
      const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            artist.genre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre ? artist.genre === selectedGenre : true;
      return matchesSearch && matchesGenre;
    });
  }, [artists, searchQuery, selectedGenre]);

  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(artists.map(artist => artist.genre))];
    return uniqueGenres.sort();
  }, [artists]);

  const isLoading = artistsLoading || projectsLoading;

  const sortedArtists = useMemo(() => {
    return [...filteredArtists].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'followers':
          return b.followers - a.followers;
        case 'projects':
          return b.completed_projects - a.completed_projects;
        default:
          return 0;
      }
    });
  }, [filteredArtists, sortBy]);

  // Transform artists to match ArtistCard expected interface
  const transformedArtists = useMemo(() => {
    return sortedArtists.map(artist => ({
      ...artist,
      totalRaised: Number(artist.total_raised),
      completedProjects: artist.completed_projects,
      currentProject: artist.current_project || 'No active project',
      verified: artist.verified
    }));
  }, [sortedArtists]);

  const handleCreateProject = () => {
    setShowCreateProject(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8 space-y-8">
        <ArtistHeader 
          onCreateProject={handleCreateProject}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'artists' && (
          <>
            <ArtistFilters
              filters={filters}
              onFiltersChange={setFilters}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {transformedArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>

            {filteredArtists.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">
                  No artists found matching your criteria.
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const artist = artists.find(a => a.id === project.artist_id);
              const artistName = artist ? artist.name : 'Unknown Artist';
              const patent = patents[project.id.toString()]; // Now correctly using Patent with string id

              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  artistName={artistName}
                  patent={patent}
                />
              );
            })}
          </div>
        )}

        {activeTab === 'myProjects' && (
          <MyProjectsView onCreateProject={handleCreateProject} />
        )}

        <CreateProjectModal
          isOpen={showCreateProject}
          onClose={() => setShowCreateProject(false)}
          onSubmit={async (projectData) => {
            console.log('Project created:', projectData);
            setShowCreateProject(false);
          }}
        />
      </div>
    </Layout>
  );
};

export default Artists;
