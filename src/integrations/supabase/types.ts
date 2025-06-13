export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artists: {
        Row: {
          avatar: string | null
          bio: string | null
          completed_projects: number
          created_at: string
          current_project: string | null
          followers: number
          genre: string
          id: number
          name: string
          rating: number
          total_raised: number
          updated_at: string
          verified: boolean
          wallet_address: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          completed_projects?: number
          created_at?: string
          current_project?: string | null
          followers?: number
          genre: string
          id?: never
          name: string
          rating?: number
          total_raised?: number
          updated_at?: string
          verified?: boolean
          wallet_address?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          completed_projects?: number
          created_at?: string
          current_project?: string | null
          followers?: number
          genre?: string
          id?: never
          name?: string
          rating?: number
          total_raised?: number
          updated_at?: string
          verified?: boolean
          wallet_address?: string | null
        }
        Relationships: []
      }
      funding_contracts: {
        Row: {
          contract_address: string
          created_at: string
          deployer_address: string
          deployment_date: string
          id: number
          max_funding: number
          project_id: number | null
          updated_at: string
        }
        Insert: {
          contract_address: string
          created_at?: string
          deployer_address: string
          deployment_date: string
          id?: never
          max_funding: number
          project_id?: number | null
          updated_at?: string
        }
        Update: {
          contract_address?: string
          created_at?: string
          deployer_address?: string
          deployment_date?: string
          id?: never
          max_funding?: number
          project_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_funding_contracts_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      patents: {
        Row: {
          artist_id: number
          created_at: string
          description: string
          id: string
          ip_id: string | null
          ip_metadata_hash: string
          ip_metadata_uri: string
          license_terms_ids: string[] | null
          nft_metadata_hash: string
          nft_metadata_uri: string
          project_id: number
          status: string
          title: string
          transaction_hash: string | null
        }
        Insert: {
          artist_id: number
          created_at?: string
          description: string
          id?: string
          ip_id?: string | null
          ip_metadata_hash: string
          ip_metadata_uri: string
          license_terms_ids?: string[] | null
          nft_metadata_hash: string
          nft_metadata_uri: string
          project_id: number
          status: string
          title: string
          transaction_hash?: string | null
        }
        Update: {
          artist_id?: number
          created_at?: string
          description?: string
          id?: string
          ip_id?: string | null
          ip_metadata_hash?: string
          ip_metadata_uri?: string
          license_terms_ids?: string[] | null
          nft_metadata_hash?: string
          nft_metadata_uri?: string
          project_id?: number
          status?: string
          title?: string
          transaction_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_patents_artist_id"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_patents_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          artist_id: number
          category: string
          completed_milestones: number
          created_at: string
          current_funding: number
          description: string
          funding_contract_id: number | null
          id: number
          milestones: number
          risk_level: string
          staking_apy: number
          staking_pool_id: number | null
          status: string
          target_funding: number
          time_remaining: string
          title: string
          updated_at: string
        }
        Insert: {
          artist_id: number
          category: string
          completed_milestones?: number
          created_at?: string
          current_funding?: number
          description: string
          funding_contract_id?: number | null
          id?: never
          milestones: number
          risk_level: string
          staking_apy: number
          staking_pool_id?: number | null
          status?: string
          target_funding: number
          time_remaining: string
          title: string
          updated_at?: string
        }
        Update: {
          artist_id?: number
          category?: string
          completed_milestones?: number
          created_at?: string
          current_funding?: number
          description?: string
          funding_contract_id?: number | null
          id?: never
          milestones?: number
          risk_level?: string
          staking_apy?: number
          staking_pool_id?: number | null
          status?: string
          target_funding?: number
          time_remaining?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_projects_funding_contract_id"
            columns: ["funding_contract_id"]
            isOneToOne: false
            referencedRelation: "funding_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_projects_staking_pool_id"
            columns: ["staking_pool_id"]
            isOneToOne: false
            referencedRelation: "staking_pools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      staking_pools: {
        Row: {
          apy: number
          asset_type: string
          available_capacity: number
          contract_address: string
          created_at: string
          current_completion: number
          deployer_address: string
          deployment_date: string
          description: string
          id: number
          is_active: boolean
          lockup_periods: number[]
          name: string
          project_id: number
          risk_level: string
          total_pool_size: number
          total_staked: number
          total_stakers: number
          updated_at: string
        }
        Insert: {
          apy: number
          asset_type?: string
          available_capacity?: number
          contract_address: string
          created_at?: string
          current_completion?: number
          deployer_address: string
          deployment_date: string
          description: string
          id?: never
          is_active?: boolean
          lockup_periods: number[]
          name: string
          project_id: number
          risk_level: string
          total_pool_size?: number
          total_staked?: number
          total_stakers?: number
          updated_at?: string
        }
        Update: {
          apy?: number
          asset_type?: string
          available_capacity?: number
          contract_address?: string
          created_at?: string
          current_completion?: number
          deployer_address?: string
          deployment_date?: string
          description?: string
          id?: never
          is_active?: boolean
          lockup_periods?: number[]
          name?: string
          project_id?: number
          risk_level?: string
          total_pool_size?: number
          total_staked?: number
          total_stakers?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_staking_pools_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database['public']

export type Tables<TableName extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][TableName]['Row']
export type Enums<EnumName extends keyof PublicSchema['Enums']> =
  PublicSchema['Enums'][EnumName]

export type Patent = Tables<'patents'>;
