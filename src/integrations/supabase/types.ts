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
      image_aliases: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          new_id: string
          old_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          new_id: string
          old_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          new_id?: string
          old_id?: string
        }
        Relationships: []
      }
      image_library: {
        Row: {
          ai_meta: Json | null
          alt_text: string | null
          cloudflare_id: string | null
          cloudflare_uid: string
          created_at: string
          error_msg: string | null
          filename: string
          id: string
          sequence_number: number
          status: string
          tags: string[]
        }
        Insert: {
          ai_meta?: Json | null
          alt_text?: string | null
          cloudflare_id?: string | null
          cloudflare_uid: string
          created_at?: string
          error_msg?: string | null
          filename: string
          id?: string
          sequence_number: number
          status?: string
          tags?: string[]
        }
        Update: {
          ai_meta?: Json | null
          alt_text?: string | null
          cloudflare_id?: string | null
          cloudflare_uid?: string
          created_at?: string
          error_msg?: string | null
          filename?: string
          id?: string
          sequence_number?: number
          status?: string
          tags?: string[]
        }
        Relationships: []
      }
      image_overrides: {
        Row: {
          id: string
          image_url: string
          page_path: string
          section_key: string
          updated_at: string
        }
        Insert: {
          id?: string
          image_url: string
          page_path: string
          section_key: string
          updated_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          page_path?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      main_photos: {
        Row: {
          context_key: string
          context_type: string
          created_at: string
          id: string
          image_id: string
          set_by: string | null
          updated_at: string
        }
        Insert: {
          context_key: string
          context_type: string
          created_at?: string
          id?: string
          image_id: string
          set_by?: string | null
          updated_at?: string
        }
        Update: {
          context_key?: string
          context_type?: string
          created_at?: string
          id?: string
          image_id?: string
          set_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "main_photos_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image_library"
            referencedColumns: ["id"]
          },
        ]
      }
      page_media_assignments: {
        Row: {
          activity_tags: string[]
          assigned_by: string | null
          created_at: string
          id: string
          image_id: string | null
          image_url: string | null
          item_id: string | null
          mood_tags: string[]
          nature_tags: string[]
          page_path: string
          room_tags: string[]
          sort_order: number
          target_tag: string
          updated_at: string
        }
        Insert: {
          activity_tags?: string[]
          assigned_by?: string | null
          created_at?: string
          id?: string
          image_id?: string | null
          image_url?: string | null
          item_id?: string | null
          mood_tags?: string[]
          nature_tags?: string[]
          page_path: string
          room_tags?: string[]
          sort_order?: number
          target_tag: string
          updated_at?: string
        }
        Update: {
          activity_tags?: string[]
          assigned_by?: string | null
          created_at?: string
          id?: string
          image_id?: string | null
          image_url?: string | null
          item_id?: string | null
          mood_tags?: string[]
          nature_tags?: string[]
          page_path?: string
          room_tags?: string[]
          sort_order?: number
          target_tag?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_media_assignments_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image_library"
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
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          id: string
          updated_at: string
          updated_by: string | null
          whatsapp_number: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          id?: string
          updated_at?: string
          updated_by?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          id?: string
          updated_at?: string
          updated_by?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      sync_history: {
        Row: {
          action: string
          affected_items: string[]
          counts: Json
          created_at: string
          id: string
          message: string
          status: string
          triggered_by: string | null
        }
        Insert: {
          action: string
          affected_items?: string[]
          counts?: Json
          created_at?: string
          id?: string
          message: string
          status: string
          triggered_by?: string | null
        }
        Update: {
          action?: string
          affected_items?: string[]
          counts?: Json
          created_at?: string
          id?: string
          message?: string
          status?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      text_overrides: {
        Row: {
          id: string
          page_path: string
          section_key: string
          text_value: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          page_path: string
          section_key: string
          text_value: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          page_path?: string
          section_key?: string
          text_value?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      unique_tags: {
        Row: {
          color: string
          created_at: string
          created_by: string | null
          id: string
          label: string
        }
        Insert: {
          color?: string
          created_at?: string
          created_by?: string | null
          id?: string
          label: string
        }
        Update: {
          color?: string
          created_at?: string
          created_by?: string | null
          id?: string
          label?: string
        }
        Relationships: []
      }
      unit_compositions: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          display_name: string
          id: string
          module_location_ids: string[]
          modules: string[]
          slug: string
          sort_order: number
          unit_type: string
          updated_at: string
          updated_by: string | null
          visible_on: string[]
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          module_location_ids?: string[]
          modules?: string[]
          slug: string
          sort_order?: number
          unit_type?: string
          updated_at?: string
          updated_by?: string | null
          visible_on?: string[]
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          module_location_ids?: string[]
          modules?: string[]
          slug?: string
          sort_order?: number
          unit_type?: string
          updated_at?: string
          updated_by?: string | null
          visible_on?: string[]
        }
        Relationships: []
      }
      unit_gallery_settings: {
        Row: {
          context_key: string
          context_type: string
          created_at: string
          hidden: boolean
          id: string
          image_id: string
          set_by: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          context_key: string
          context_type: string
          created_at?: string
          hidden?: boolean
          id?: string
          image_id: string
          set_by?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          context_key?: string
          context_type?: string
          created_at?: string
          hidden?: boolean
          id?: string
          image_id?: string
          set_by?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_gallery_settings_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image_library"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
      app_role: "admin" | "editor"
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
      app_role: ["admin", "editor"],
    },
  },
} as const
