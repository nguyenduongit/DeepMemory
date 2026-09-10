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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      best_times: {
        Row: {
          accuracy: number
          achieved_at: string | null
          duration_ms: number
          group_id: string
          id: string
          mode_id: string
          module_id: string
          question_count: number
          record_key: string
          user_id: string
        }
        Insert: {
          accuracy?: number
          achieved_at?: string | null
          duration_ms: number
          group_id: string
          id?: string
          mode_id: string
          module_id: string
          question_count: number
          record_key: string
          user_id?: string
        }
        Update: {
          accuracy?: number
          achieved_at?: string | null
          duration_ms?: number
          group_id?: string
          id?: string
          mode_id?: string
          module_id?: string
          question_count?: number
          record_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "best_times_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      item_progress: {
        Row: {
          accuracy: number
          average_reaction_ms: number | null
          correct_count: number
          id: string
          item_id: string
          last_practiced_at: string | null
          mastery_level: string
          mastery_score: number
          module_id: string
          seen_count: number
          user_id: string
          wrong_count: number
        }
        Insert: {
          accuracy?: number
          average_reaction_ms?: number | null
          correct_count?: number
          id?: string
          item_id: string
          last_practiced_at?: string | null
          mastery_level?: string
          mastery_score?: number
          module_id: string
          seen_count?: number
          user_id?: string
          wrong_count?: number
        }
        Update: {
          accuracy?: number
          average_reaction_ms?: number | null
          correct_count?: number
          id?: string
          item_id?: string
          last_practiced_at?: string | null
          mastery_level?: string
          mastery_score?: number
          module_id?: string
          seen_count?: number
          user_id?: string
          wrong_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "item_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          module_id: string
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          metadata?: Json | null
          module_id: string
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          module_id?: string
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_groups_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_items: {
        Row: {
          attributes: Json | null
          audio_url: string | null
          code: string | null
          created_at: string | null
          group_id: string | null
          id: string
          image_url: string | null
          module_id: string
          name: string
          sort_order: number | null
          subname: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          audio_url?: string | null
          code?: string | null
          created_at?: string | null
          group_id?: string | null
          id: string
          image_url?: string | null
          module_id: string
          name: string
          sort_order?: number | null
          subname?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          audio_url?: string | null
          code?: string | null
          created_at?: string | null
          group_id?: string | null
          id?: string
          image_url?: string | null
          module_id?: string
          name?: string
          sort_order?: number | null
          subname?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_items_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_progress: {
        Row: {
          best_time_ms: number | null
          completed_sessions: number
          correct_answers: number
          id: string
          mastery_percent: number
          mastery_score: number
          module_id: string
          total_answers: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          best_time_ms?: number | null
          completed_sessions?: number
          correct_answers?: number
          id?: string
          mastery_percent?: number
          mastery_score?: number
          module_id: string
          total_answers?: number
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          best_time_ms?: number | null
          completed_sessions?: number
          correct_answers?: number
          id?: string
          mastery_percent?: number
          mastery_score?: number
          module_id?: string
          total_answers?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          category: string
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          category: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      training_sessions: {
        Row: {
          accuracy: number
          average_reaction_ms: number | null
          completed_at: string | null
          correct_answers: number
          duration_ms: number
          group_id: string | null
          id: string
          mode_id: string
          module_id: string
          total_questions: number
          user_id: string
          wrong_answers: number
        }
        Insert: {
          accuracy: number
          average_reaction_ms?: number | null
          completed_at?: string | null
          correct_answers: number
          duration_ms: number
          group_id?: string | null
          id: string
          mode_id: string
          module_id: string
          total_questions: number
          user_id?: string
          wrong_answers: number
        }
        Update: {
          accuracy?: number
          average_reaction_ms?: number | null
          completed_at?: string | null
          correct_answers?: number
          duration_ms?: number
          group_id?: string | null
          id?: string
          mode_id?: string
          module_id?: string
          total_questions?: number
          user_id?: string
          wrong_answers?: number
        }
        Relationships: [
          {
            foreignKeyName: "training_sessions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          reduced_motion: boolean | null
          sound_enabled: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          reduced_motion?: boolean | null
          sound_enabled?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          reduced_motion?: boolean | null
          sound_enabled?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

