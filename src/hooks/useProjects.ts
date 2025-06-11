import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: number;
  title: string;
  artist_id: number;
  category: string;
  target_funding: number;
  current_funding: number;
  staking_apy: number;
  time_remaining: string;
  description: string;
  risk_level: string;
  milestones: number;
  completed_milestones: number;
  created_at: string;
  staking_pool_id?: number;
  funding_contract_id?: number;
}

interface StakingPool {
  id: number;
  project_id: number;
  contract_address: string;
  deployer_address: string;
  deployment_date: string;
  apy: number;
  lockup_periods: number[];
  total_staked: number;
  total_stakers: number;
  is_active: boolean;
  created_at: string;
  name: string;
  asset_type: string;
  current_completion: number;
  total_pool_size: number;
  available_capacity: number;
  risk_level: string;
  description: string;
}

interface Patent {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: 'Pending' | 'Granted' | 'Rejected';
  filing_date: string;
  patent_number: string;
}

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

      // Create a map of project ID to patent with proper type casting
      const patentsMap = (patentsData || []).reduce((acc, patent) => {
        acc[patent.project_id] = {
          ...patent,
          status: patent.status as 'Pending' | 'Granted' | 'Rejected'
        };
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

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'staking_pool_id'>) => {
    try {
      const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          current_funding: 0,
          completed_milestones: 0,
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
