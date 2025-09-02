export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          company_description: string | null
          company_name: string
          created_at: string
          id: string
          project_id: string
          relevance_score: number | null
          website_url: string | null
        }
        Insert: {
          company_description?: string | null
          company_name: string
          created_at?: string
          id?: string
          project_id: string
          relevance_score?: number | null
          website_url?: string | null
        }
        Update: {
          company_description?: string | null
          company_name?: string
          created_at?: string
          id?: string
          project_id?: string
          relevance_score?: number | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      company_kpi_data: {
        Row: {
          company_id: string
          data_value: string | null
          id: string
          kpi_id: string
          source_url: string | null
          status: string
        }
        Insert: {
          company_id: string
          data_value?: string | null
          id?: string
          kpi_id: string
          source_url?: string | null
          status?: string
        }
        Update: {
          company_id?: string
          data_value?: string | null
          id?: string
          kpi_id?: string
          source_url?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_kpi_data_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_kpi_data_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      family_offices: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      kpi_frameworks: {
        Row: {
          created_at: string
          framework_name: string
          id: string
          project_id: string
          version: number
        }
        Insert: {
          created_at?: string
          framework_name: string
          id?: string
          project_id: string
          version?: number
        }
        Update: {
          created_at?: string
          framework_name?: string
          id?: string
          project_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_frameworks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis: {
        Row: {
          category: string
          created_at: string
          framework_id: string
          id: string
          kpi_description: string | null
          kpi_name: string
          source_snippet: string | null
          source_url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          framework_id: string
          id?: string
          kpi_description?: string | null
          kpi_name: string
          source_snippet?: string | null
          source_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          framework_id?: string
          id?: string
          kpi_description?: string | null
          kpi_name?: string
          source_snippet?: string | null
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kpis_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "kpi_frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_semantic_keywords: {
        Row: {
          created_at: string
          id: string
          input_category: string
          keywords: string[]
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_category: string
          keywords: string[]
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          input_category?: string
          keywords?: string[]
          project_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          family_office_id: string | null
          has_generated_kpis: boolean
          id: string
          investment_thesis: string | null
          project_title: string
          selected_keywords: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          family_office_id?: string | null
          has_generated_kpis?: boolean
          id?: string
          investment_thesis?: string | null
          project_title: string
          selected_keywords?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          family_office_id?: string | null
          has_generated_kpis?: boolean
          id?: string
          investment_thesis?: string | null
          project_title?: string
          selected_keywords?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_projects_family_office"
            columns: ["family_office_id"]
            isOneToOne: false
            referencedRelation: "family_offices"
            referencedColumns: ["id"]
          },
        ]
      }
      system_prompts: {
        Row: {
          created_at: string
          id: string
          prompt_name: string
          prompt_text: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          prompt_name: string
          prompt_text: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          id?: string
          prompt_name?: string
          prompt_text?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
