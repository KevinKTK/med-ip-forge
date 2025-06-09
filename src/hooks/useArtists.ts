import { useState, useEffect } from 'react';
import { supabase, Artist } from '@/utils/supabase';
import { useToast } from '@/hooks/use-toast';

export function useArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchArtists = async () => {
    try {
      const { data: artistsData, error: artistsError } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false });

      if (artistsError) throw artistsError;

      setArtists(artistsData || []);
    } catch (error) {
      toast({
        title: "Error Loading Artists",
        description: error instanceof Error ? error.message : "Failed to load artists",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createArtist = async (artistData: Omit<Artist, 'id' | 'created_at'>) => {
    try {
      const { data: newArtist, error: artistError } = await supabase
        .from('artists')
        .insert({
          ...artistData,
          total_raised: 0,
          completed_projects: 0,
          followers: 0,
          rating: 0,
        })
        .select()
        .single();

      if (artistError) throw artistError;

      return newArtist;
    } catch (error) {
      throw error;
    }
  };

  const updateArtist = async (artistId: number, updates: Partial<Artist>) => {
    try {
      const { data: updatedArtist, error: updateError } = await supabase
        .from('artists')
        .update(updates)
        .eq('id', artistId)
        .select()
        .single();

      if (updateError) throw updateError;

      return updatedArtist;
    } catch (error) {
      throw error;
    }
  };

  const getArtistById = async (artistId: number) => {
    try {
      const { data: artist, error: artistError } = await supabase
        .from('artists')
        .select('*')
        .eq('id', artistId)
        .single();

      if (artistError) throw artistError;

      return artist;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  return {
    artists,
    isLoading,
    createArtist,
    updateArtist,
    getArtistById,
    refreshArtists: fetchArtists,
  };
} 