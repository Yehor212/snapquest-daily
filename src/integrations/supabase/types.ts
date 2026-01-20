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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          category: string
          color: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          category?: string
          color?: string
          created_at?: string
          description: string
          icon?: string
          id?: string
          name: string
          requirement_type: string
          requirement_value?: number
        }
        Update: {
          category?: string
          color?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      challenges: {
        Row: {
          category: string
          created_at: string
          day_number: number
          description: string
          difficulty: string
          expires_at: string
          id: string
          participants_count: number
          title: string
          xp_reward: number
        }
        Insert: {
          category?: string
          created_at?: string
          day_number?: number
          description: string
          difficulty?: string
          expires_at?: string
          id?: string
          participants_count?: number
          title: string
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          day_number?: number
          description?: string
          difficulty?: string
          expires_at?: string
          id?: string
          participants_count?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      event_challenges: {
        Row: {
          created_at: string
          description: string | null
          event_id: string
          id: string
          order_num: number
          title: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          order_num?: number
          title: string
          xp_reward?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          order_num?: number
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_challenges_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "private_events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          event_id: string
          id: string
          joined_at: string
          photos_submitted: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          event_id: string
          id?: string
          joined_at?: string
          photos_submitted?: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          event_id?: string
          id?: string
          joined_at?: string
          photos_submitted?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "private_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_challenges: {
        Row: {
          category: string
          description: string
          difficulty: string
          generated_at: string
          id: string
          is_saved: boolean
          title: string
          user_id: string | null
          xp_reward: number
        }
        Insert: {
          category?: string
          description: string
          difficulty?: string
          generated_at?: string
          id?: string
          is_saved?: boolean
          title: string
          user_id?: string | null
          xp_reward?: number
        }
        Update: {
          category?: string
          description?: string
          difficulty?: string
          generated_at?: string
          id?: string
          is_saved?: boolean
          title?: string
          user_id?: string | null
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "generated_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hunt_progress: {
        Row: {
          completed_at: string | null
          completed_tasks: string[]
          hunt_id: string
          id: string
          started_at: string
          total_xp_earned: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_tasks?: string[]
          hunt_id: string
          id?: string
          started_at?: string
          total_xp_earned?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_tasks?: string[]
          hunt_id?: string
          id?: string
          started_at?: string
          total_xp_earned?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hunt_progress_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "scavenger_hunts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hunt_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hunt_tasks: {
        Row: {
          bonus_xp: number | null
          created_at: string
          description: string | null
          hint: string | null
          hunt_id: string
          id: string
          order_num: number
          title: string
          xp_reward: number
        }
        Insert: {
          bonus_xp?: number | null
          created_at?: string
          description?: string | null
          hint?: string | null
          hunt_id: string
          id?: string
          order_num?: number
          title: string
          xp_reward?: number
        }
        Update: {
          bonus_xp?: number | null
          created_at?: string
          description?: string | null
          hint?: string | null
          hunt_id?: string
          id?: string
          order_num?: number
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "hunt_tasks_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "scavenger_hunts"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_likes: {
        Row: {
          created_at: string
          id: string
          photo_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          photo_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          photo_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_likes_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          challenge_id: string | null
          created_at: string
          event_id: string | null
          filter_applied: string | null
          hunt_task_id: string | null
          id: string
          image_url: string
          is_verified: boolean
          likes_count: number
          thumbnail_url: string | null
          user_id: string
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string
          event_id?: string | null
          filter_applied?: string | null
          hunt_task_id?: string | null
          id?: string
          image_url: string
          is_verified?: boolean
          likes_count?: number
          thumbnail_url?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string | null
          created_at?: string
          event_id?: string | null
          filter_applied?: string | null
          hunt_task_id?: string | null
          id?: string
          image_url?: string
          is_verified?: boolean
          likes_count?: number
          thumbnail_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      private_events: {
        Row: {
          access_code: string
          cover_image: string | null
          created_at: string
          creator_id: string
          description: string | null
          end_date: string
          event_type: string
          id: string
          max_participants: number | null
          name: string
          participants_count: number
          start_date: string
          status: string
        }
        Insert: {
          access_code: string
          cover_image?: string | null
          created_at?: string
          creator_id: string
          description?: string | null
          end_date: string
          event_type?: string
          id?: string
          max_participants?: number | null
          name: string
          participants_count?: number
          start_date: string
          status?: string
        }
        Update: {
          access_code?: string
          cover_image?: string | null
          created_at?: string
          creator_id?: string
          description?: string | null
          end_date?: string
          event_type?: string
          id?: string
          max_participants?: number | null
          name?: string
          participants_count?: number
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_events_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          last_activity_date: string | null
          level: number
          streak: number
          updated_at: string
          username: string | null
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          last_activity_date?: string | null
          level?: number
          streak?: number
          updated_at?: string
          username?: string | null
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          last_activity_date?: string | null
          level?: number
          streak?: number
          updated_at?: string
          username?: string | null
          xp?: number
        }
        Relationships: []
      }
      scavenger_hunts: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          difficulty: string
          duration: string
          ends_at: string | null
          id: string
          is_active: boolean
          participants_count: number
          starts_at: string | null
          theme: string
          title: string
          total_xp: number
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          duration?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          participants_count?: number
          starts_at?: string | null
          theme?: string
          title: string
          total_xp?: number
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          duration?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          participants_count?: number
          starts_at?: string | null
          theme?: string
          title?: string
          total_xp?: number
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_saved_challenges: {
        Row: {
          challenge_id: string
          id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          saved_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "generated_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_saved_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
    Enums: {},
  },
} as const
