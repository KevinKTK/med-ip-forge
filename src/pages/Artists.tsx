import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { ArtistHeader } from '@/components/Artists/ArtistHeader';
import { ArtistCard } from '@/components/Artists/ArtistCard';
import { ArtistFilters } from '@/components/Artists/ArtistFilters';
import { ProjectCard } from '@/components/Artists/ProjectCard';
import { useArtists } from '@/hooks/useArtists';
import { useProjects } from '@/hooks/useProjects';
import { Patent } from '@/types/patent';

const Artists = () => {
  const [activeTab, setActiveTab] = useState('artists');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('rating');
  
  const { artists, isLoading: artistsLoading } = useArtists();
  const { projects, stakingPools, patents: patentsByProject, isLoading: projectsLoading } = useProjects();

  // Convert patent data to expected format
  const patents: Record<number, Patent> = useMemo(() => {
    const convertedPatents: Record<number, Patent> = {};
    Object.entries(patentsByProject).forEach(([projectId, patent]) => {
      convertedPatents[parseInt(projectId)] = {
        id: parseInt(patent.id), // Convert string to number for compatibility
        title: patent.title,
        description: patent.description,
        status: patent.status,
        patent_number: patent.patent_number || '',
        filing_date: patent.filing_date,
        category: patent.category,
      };
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

        {activeTab === 'artists' && (
          <>
            <ArtistFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              genres={genres}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedArtists.map((artist) => (
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
              const stakingPool = stakingPools[project.id];
              const patent = patents[project.id];

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
      </div>
    </Layout>
  );
};

export default Artists;
