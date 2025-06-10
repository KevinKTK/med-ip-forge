import { createClient } from '@supabase/supabase-js';

// These are public keys and safe to use in frontend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface ApiKeys {
  VITE_WALLETCONNECT_PROJECT_ID: string;
  VITE_WEB3AUTH_CLIENT_ID: string;
  RPC_PROVIDER_URL: string;
  VITE_PUBLIC_PINATA: string;
}

export async function getApiKeys(): Promise<ApiKeys | null> {
  try {
    const { data, error } = await supabase.functions.invoke('get-api-keys');
    if (error) {
      console.error('Error invoking get-api-keys function:', error);
      return null;
    }
    return data as ApiKeys;
  } catch (error) {
    console.error('Unexpected error while fetching API keys:', error);
    return null;
  }
}

// Database types
export interface StakingPool {
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

export interface Artist {
  id: number;
  name: string;
  avatar: string;
  genre: string;
  verified: boolean;
  total_raised: number;
  completed_projects: number;
  followers: number;
  rating: number;
  current_project: string;
  bio: string;
  created_at: string;
}

export interface Project {
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
}

export interface Patent {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: 'Pending' | 'Granted' | 'Rejected';
  filing_date: string;
  patent_number: string;
}
