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
      blog_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_status: string
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          departure_date: string | null
          id: string
          notes: string | null
          package_id: string | null
          payment_percentage: number | null
          payment_status: string
          remaining_balance: number
          total_price: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_status?: string
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          departure_date?: string | null
          id?: string
          notes?: string | null
          package_id?: string | null
          payment_percentage?: number | null
          payment_status?: string
          remaining_balance?: number
          total_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_status?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          departure_date?: string | null
          id?: string
          notes?: string | null
          package_id?: string | null
          payment_percentage?: number | null
          payment_status?: string
          remaining_balance?: number
          total_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      general_faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          published: boolean | null
          question: string
          sort_order: number | null
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          published?: boolean | null
          question: string
          sort_order?: number | null
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          published?: boolean | null
          question?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      islamic_quotes: {
        Row: {
          created_at: string
          id: string
          published: boolean | null
          source: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          published?: boolean | null
          source: string
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          published?: boolean | null
          source?: string
          text?: string
        }
        Relationships: []
      }
      package_faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          package_id: string
          question: string
          sort_order: number | null
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          package_id: string
          question: string
          sort_order?: number | null
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          package_id?: string
          question?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "package_faqs_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          cancellation_policy: string | null
          cover_image: string | null
          created_at: string
          departure_dates: Json | null
          departure_note: string | null
          direct_flight: boolean | null
          distance_madinah: string | null
          distance_makkah: string | null
          duration: string
          early_bird_end_date: string | null
          early_bird_price: number | null
          featured: boolean | null
          five_star: boolean | null
          hotel_madinah: string | null
          hotel_madinah_details: Json | null
          hotel_makkah: string | null
          hotel_makkah_details: Json | null
          id: string
          included: Json | null
          itinerary: Json | null
          meals_included: boolean | null
          not_included: Json | null
          original_price: number | null
          price: number
          published: boolean | null
          rating: number | null
          refund_policy: string | null
          seats_booked: number | null
          show_scarcity: boolean | null
          slug: string
          title: string
          total_seats: number | null
          overview: string | null
          updated_at: string
          visa_included: boolean | null
        }
        Insert: {
          cancellation_policy?: string | null
          cover_image?: string | null
          created_at?: string
          departure_dates?: Json | null
          departure_note?: string | null
          direct_flight?: boolean | null
          distance_madinah?: string | null
          distance_makkah?: string | null
          duration: string
          early_bird_end_date?: string | null
          early_bird_price?: number | null
          featured?: boolean | null
          five_star?: boolean | null
          hotel_madinah?: string | null
          hotel_madinah_details?: Json | null
          hotel_makkah?: string | null
          hotel_makkah_details?: Json | null
          id?: string
          included?: Json | null
          itinerary?: Json | null
          meals_included?: boolean | null
          not_included?: Json | null
          original_price?: number | null
          price: number
          published?: boolean | null
          rating?: number | null
          refund_policy?: string | null
          seats_booked?: number | null
          show_scarcity?: boolean | null
          slug: string
          title: string
          total_seats?: number | null
          overview?: string | null
          updated_at?: string
          visa_included?: boolean | null
        }
        Update: {
          cancellation_policy?: string | null
          cover_image?: string | null
          created_at?: string
          departure_dates?: Json | null
          departure_note?: string | null
          direct_flight?: boolean | null
          distance_madinah?: string | null
          distance_makkah?: string | null
          duration?: string
          early_bird_end_date?: string | null
          early_bird_price?: number | null
          featured?: boolean | null
          five_star?: boolean | null
          hotel_madinah?: string | null
          hotel_madinah_details?: Json | null
          hotel_makkah?: string | null
          hotel_makkah_details?: Json | null
          id?: string
          included?: Json | null
          itinerary?: Json | null
          meals_included?: boolean | null
          not_included?: Json | null
          original_price?: number | null
          price?: number
          published?: boolean | null
          rating?: number | null
          refund_policy?: string | null
          seats_booked?: number | null
          show_scarcity?: boolean | null
          slug?: string
          title?: string
          total_seats?: number | null
          overview?: string | null
          updated_at?: string
          visa_included?: boolean | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: string
          created_at: string
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          id: string
          notes: string | null
          payment_date: string
          payment_mode: string | null
          proof_url: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_mode?: string | null
          proof_url?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_mode?: string | null
          proof_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          id: string
          is_video: boolean | null
          location: string | null
          name: string
          package_id: string | null
          published: boolean | null
          rating: number | null
          text: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_video?: boolean | null
          location?: string | null
          name: string
          package_id?: string | null
          published?: boolean | null
          rating?: number | null
          text: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_video?: boolean | null
          location?: string | null
          name?: string
          package_id?: string | null
          published?: boolean | null
          rating?: number | null
          text?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      trust_badges: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          published: boolean | null
          sort_order: number | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          sort_order?: number | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          sort_order?: number | null
          title?: string
        }
        Relationships: []
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
          role?: Database["public"]["Enums"]["app_role"]
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
