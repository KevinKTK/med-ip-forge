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
        }
        Relationships: []
      }
      patents: {
        Row: {
          created_at: string
          description: string
          filing_date: string
          id: number
          patent_number: string
          project_id: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          filing_date: string
          id?: never
          patent_number: string
          project_id: number
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          filing_date?: string
          id?: never
          patent_number?: string
          project_id?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patents_project_id_fkey"
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
            foreignKeyName: "projects_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_staking_pool_id_fkey"
            columns: ["staking_pool_id"]
            isOneToOne: false
            referencedRelation: "staking_pools"
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
            foreignKeyName: "staking_pools_project_id_fkey"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
