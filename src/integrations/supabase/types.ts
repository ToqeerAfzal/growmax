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
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
          mobile: string
          password_hash: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          mobile: string
          password_hash: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          mobile?: string
          password_hash?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      deposits: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          is_principal_withdrawn: boolean | null
          locked_until: string | null
          package_id: number
          status: string | null
          transaction_hash: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          is_principal_withdrawn?: boolean | null
          locked_until?: string | null
          package_id: number
          status?: string | null
          transaction_hash: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          is_principal_withdrawn?: boolean | null
          locked_until?: string | null
          package_id?: number
          status?: string | null
          transaction_hash?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deposits_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "staking_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deposits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          admin_id: string | null
          created_at: string | null
          expires_at: string
          id: string
          is_used: boolean | null
          otp_code: string
          purpose: string
          type: string
          user_id: string | null
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          is_used?: boolean | null
          otp_code: string
          purpose: string
          type: string
          user_id?: string | null
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          is_used?: boolean | null
          otp_code?: string
          purpose?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "otp_verifications_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "otp_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ranks: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          min_direct_referrals: number
          min_staked_amount: number
          min_team_members: number
          name: string
          rank_number: number
          rank_reward: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          min_direct_referrals: number
          min_staked_amount: number
          min_team_members: number
          name: string
          rank_number: number
          rank_reward: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          min_direct_referrals?: number
          min_staked_amount?: number
          min_team_members?: number
          name?: string
          rank_number?: number
          rank_reward?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      referral_tree: {
        Row: {
          ancestor_id: string
          created_at: string | null
          id: string
          level: number
          user_id: string
        }
        Insert: {
          ancestor_id: string
          created_at?: string | null
          id?: string
          level: number
          user_id: string
        }
        Update: {
          ancestor_id?: string
          created_at?: string | null
          id?: string
          level?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_tree_ancestor_id_fkey"
            columns: ["ancestor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_tree_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_levels: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          level: number
          percentage: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          level: number
          percentage: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          level?: number
          percentage?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      reward_transactions: {
        Row: {
          amount: number
          created_at: string | null
          deposit_id: string | null
          description: string | null
          from_user_id: string | null
          id: string
          level: number | null
          reward_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          deposit_id?: string | null
          description?: string | null
          from_user_id?: string | null
          id?: string
          level?: number | null
          reward_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          deposit_id?: string | null
          description?: string | null
          from_user_id?: string | null
          id?: string
          level?: number | null
          reward_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_transactions_deposit_id_fkey"
            columns: ["deposit_id"]
            isOneToOne: false
            referencedRelation: "deposits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_transactions_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      staking_packages: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          max_amount: number
          min_amount: number
          multiplier: number | null
          name: string
          reward_percentage: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          max_amount: number
          min_amount: number
          multiplier?: number | null
          name: string
          reward_percentage: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          max_amount?: number
          min_amount?: number
          multiplier?: number | null
          name?: string
          reward_percentage?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          setting_key: string
          setting_type: string | null
          setting_value: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          setting_key: string
          setting_type?: string | null
          setting_value: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          setting_key?: string
          setting_type?: string | null
          setting_value?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          available_rewards: number | null
          created_at: string | null
          direct_referrals: number | null
          email: string
          email_verified: boolean | null
          id: string
          is_active: boolean | null
          kyc_status: string | null
          mobile: string
          mobile_verified: boolean | null
          password_hash: string
          rank_id: number | null
          referral_code: string
          referred_by: string | null
          total_business: number | null
          total_rewards: number | null
          total_staked: number | null
          total_withdrawn: number | null
          updated_at: string | null
          wallet_address: string | null
        }
        Insert: {
          available_rewards?: number | null
          created_at?: string | null
          direct_referrals?: number | null
          email: string
          email_verified?: boolean | null
          id?: string
          is_active?: boolean | null
          kyc_status?: string | null
          mobile: string
          mobile_verified?: boolean | null
          password_hash: string
          rank_id?: number | null
          referral_code: string
          referred_by?: string | null
          total_business?: number | null
          total_rewards?: number | null
          total_staked?: number | null
          total_withdrawn?: number | null
          updated_at?: string | null
          wallet_address?: string | null
        }
        Update: {
          available_rewards?: number | null
          created_at?: string | null
          direct_referrals?: number | null
          email?: string
          email_verified?: boolean | null
          id?: string
          is_active?: boolean | null
          kyc_status?: string | null
          mobile?: string
          mobile_verified?: boolean | null
          password_hash?: string
          rank_id?: number | null
          referral_code?: string
          referred_by?: string | null
          total_business?: number | null
          total_rewards?: number | null
          total_staked?: number | null
          total_withdrawn?: number | null
          updated_at?: string | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawals: {
        Row: {
          amount: number
          created_at: string | null
          deposit_id: string | null
          fee: number
          id: string
          net_amount: number
          penalty: number | null
          status: string | null
          transaction_hash: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          deposit_id?: string | null
          fee: number
          id?: string
          net_amount: number
          penalty?: number | null
          status?: string | null
          transaction_hash?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          deposit_id?: string | null
          fee?: number
          id?: string
          net_amount?: number
          penalty?: number | null
          status?: string | null
          transaction_hash?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_deposit_id_fkey"
            columns: ["deposit_id"]
            isOneToOne: false
            referencedRelation: "deposits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_business_volume: {
        Args: { user_uuid: string }
        Returns: number
      }
      check_rank_eligibility: {
        Args: Record<PropertyKey, never> | { user_uuid: string }
        Returns: number
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
