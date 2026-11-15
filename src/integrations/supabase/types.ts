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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      application_status_history: {
        Row: {
          application_id: string
          changed_by: string
          created_at: string
          feedback: string | null
          id: string
          new_status: string
          previous_status: string | null
        }
        Insert: {
          application_id: string
          changed_by?: string
          created_at?: string
          feedback?: string | null
          id?: string
          new_status: string
          previous_status?: string | null
        }
        Update: {
          application_id?: string
          changed_by?: string
          created_at?: string
          feedback?: string | null
          id?: string
          new_status?: string
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_status_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          cover_note: string | null
          created_at: string
          email: string
          feedback: string | null
          full_name: string
          id: string
          job_id: string | null
          phone: string
          status: string
          status_updated_at: string
          user_id: string | null
        }
        Insert: {
          cover_note?: string | null
          created_at?: string
          email: string
          feedback?: string | null
          full_name: string
          id?: string
          job_id?: string | null
          phone: string
          status?: string
          status_updated_at?: string
          user_id?: string | null
        }
        Update: {
          cover_note?: string | null
          created_at?: string
          email?: string
          feedback?: string | null
          full_name?: string
          id?: string
          job_id?: string | null
          phone?: string
          status?: string
          status_updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      distress_reports: {
        Row: {
          consent: boolean
          country: string
          created_at: string
          employer: string | null
          full_name: string
          id: string
          phone: string
          situation: string
        }
        Insert: {
          consent?: boolean
          country: string
          created_at?: string
          employer?: string | null
          full_name: string
          id?: string
          phone: string
          situation: string
        }
        Update: {
          consent?: boolean
          country?: string
          created_at?: string
          employer?: string | null
          full_name?: string
          id?: string
          phone?: string
          situation?: string
        }
        Relationships: []
      }
      employer_requests: {
        Row: {
          company_name: string
          consent: boolean
          contact_name: string
          created_at: string
          email: string
          id: string
          location: string
          notes: string | null
          num_workers: number
          phone: string
          roles: string
          status: string
          timeline: string | null
          user_id: string | null
        }
        Insert: {
          company_name: string
          consent?: boolean
          contact_name: string
          created_at?: string
          email: string
          id?: string
          location: string
          notes?: string | null
          num_workers?: number
          phone: string
          roles: string
          status?: string
          timeline?: string | null
          user_id?: string | null
        }
        Update: {
          company_name?: string
          consent?: boolean
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          location?: string
          notes?: string | null
          num_workers?: number
          phone?: string
          roles?: string
          status?: string
          timeline?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      job_seekers: {
        Row: {
          consent: boolean
          created_at: string
          cv_path: string | null
          email: string
          experience_years: number | null
          full_name: string
          id: string
          national_id: string | null
          passport_path: string | null
          phone: string
          preferred_destination: string | null
          skills: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          consent?: boolean
          created_at?: string
          cv_path?: string | null
          email: string
          experience_years?: number | null
          full_name: string
          id?: string
          national_id?: string | null
          passport_path?: string | null
          phone: string
          preferred_destination?: string | null
          skills?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          consent?: boolean
          created_at?: string
          cv_path?: string | null
          email?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          national_id?: string | null
          passport_path?: string | null
          phone?: string
          preferred_destination?: string | null
          skills?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          category: string
          country: string
          currency: string
          description: string
          employer: string
          image_path: string | null
          id: string
          is_published: boolean
          is_sample: boolean
          job_type: string
          location: string
          posted_at: string
          requirements: string
          salary_max: number | null
          salary_min: number | null
          title: string
        }
        Insert: {
          category: string
          country?: string
          currency?: string
          description: string
          employer?: string
          image_path?: string | null
          id?: string
          is_published?: boolean
          is_sample?: boolean
          job_type: string
          location: string
          posted_at?: string
          requirements?: string
          salary_max?: number | null
          salary_min?: number | null
          title: string
        }
        Update: {
          category?: string
          country?: string
          currency?: string
          description?: string
          employer?: string
          image_path?: string | null
          id?: string
          is_published?: boolean
          is_sample?: boolean
          job_type?: string
          location?: string
          posted_at?: string
          requirements?: string
          salary_max?: number | null
          salary_min?: number | null
          title?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          notification_type: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          notification_type?: string
          read_at?: string | null
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          notification_type?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          country: string
          created_at: string
          id: string
          is_sample: boolean
          name: string
          quote: string
          rating: number
          role: string
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          is_sample?: boolean
          name: string
          quote: string
          rating?: number
          role: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          is_sample?: boolean
          name?: string
          quote?: string
          rating?: number
          role?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_admins: { Args: Record<PropertyKey, never>; Returns: boolean }
      promote_recruitment_admin: { Args: { p_email: string }; Returns: boolean }
      claim_first_admin: { Args: never; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      update_application_review: {
        Args: {
          p_application_id: string
          p_feedback?: string
          p_status: string
        }
        Returns: boolean
      }
      update_employer_request_status: {
        Args: { p_id: string; p_status: string }
        Returns: boolean
      }
      update_job_seeker_status: {
        Args: { p_id: string; p_status: string }
        Returns: boolean
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
