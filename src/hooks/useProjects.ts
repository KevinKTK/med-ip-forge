
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

type Project = Tables<'projects'> & {
  images?: string[];
  project_status?: string;
  marketing_materials?: any;
  owner_wallet_address?: string;
};
type StakingPool = Tables<'staking_pools'>;
type Patent = Tables<'patents'>;

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stakingPools, setStakingPools] = useState<Record<number, StakingPool>>({});
  const [patents, setPatents] = useState<Record<number, Patent>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      setProjects(projectsData || []);

      // Fetch staking pools for all projects
      const { data: poolsData, error: poolsError } = await supabase
        .from('staking_pools')
        .select('*');

      if (poolsError) throw poolsError;

      // Create a map of project ID to staking pool
      const poolsMap = (poolsData || []).reduce((acc, pool) => {
        acc[pool.project_id] = pool;
        return acc;
      }, {} as Record<number, StakingPool>);

      setStakingPools(poolsMap);

      // Fetch patents for all projects
      const { data: patentsData, error: patentsError } = await supabase
        .from('patents')
        .select('*');

      if (patentsError) throw patentsError;

      // Create a map of project ID to patent
      const patentsMap = (patentsData || []).reduce((acc, patent) => {
        if (patent.project_id) {
          acc[patent.project_id] = patent;
        }
        return acc;
      }, {} as Record<number, Patent>);

      setPatents(patentsMap);
    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: error instanceof Error ? error.message : "Failed to load projects and staking pools",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (projectData: Partial<Project>) => {
    try {
      const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          current_funding: 0,
          completed_milestones: 0,
          images: projectData.images || [],
          marketing_materials: projectData.marketing_materials || {},
          project_status: projectData.project_status || 'draft',
        })
        .select()
        .single();

      if (projectError) throw projectError;

      return newProject;
    } catch (error) {
      throw error;
    }
  };

  const updateProjectStakingPool = async (projectId: number, stakingPoolId: number) => {
    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update({ staking_pool_id: stakingPoolId })
        .eq('id', projectId);

      if (updateError) throw updateError;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    stakingPools,
    patents,
    isLoading,
    createProject,
    updateProjectStakingPool,
    refreshProjects: fetchProjects,
  };
}
