
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';
import { Tables } from '@/integrations/supabase/types';

type MyProject = Tables<'projects'>;

export function useMyProjects() {
  const [projects, setProjects] = useState<MyProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { address } = useAccount();

  const fetchMyProjects = async () => {
    if (!address) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_wallet_address', address)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      toast({
        title: "Error Loading Projects",
        description: error instanceof Error ? error.message : "Failed to load your projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (projectId: number, updates: any) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId);

      if (error) throw error;

      // Update local state
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId ? { ...project, ...updates } : project
        )
      );

      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (projectId: number) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.filter(project => project.id !== projectId));

      toast({
        title: "Project Deleted",
        description: "Your project has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, [address]);

  return {
    projects,
    isLoading,
    updateProject,
    deleteProject,
    refreshProjects: fetchMyProjects,
  };
}
