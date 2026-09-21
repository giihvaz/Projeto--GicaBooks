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
      book_comments: {
        Row: {
          avatar: string
          book_id: string
          created_at: string
          id: string
          nome: string
          parent_id: string | null
          texto: string
          user_id: string
        }
        Insert: {
          avatar?: string
          book_id: string
          created_at?: string
          id?: string
          nome?: string
          parent_id?: string | null
          texto: string
          user_id: string
        }
        Update: {
          avatar?: string
          book_id?: string
          created_at?: string
          id?: string
          nome?: string
          parent_id?: string | null
          texto?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "book_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "book_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      community_books: {
        Row: {
          adicionado_por: string | null
          autor: string
          bg: string | null
          blurb: string
          created_at: string
          genero: string
          id: string
          paginas: number
          titulo: string
          user_id: string | null
        }
        Insert: {
          adicionado_por?: string | null
          autor?: string
          bg?: string | null
          blurb?: string
          created_at?: string
          genero?: string
          id: string
          paginas?: number
          titulo: string
          user_id?: string | null
        }
        Update: {
          adicionado_por?: string | null
          autor?: string
          bg?: string | null
          blurb?: string
          created_at?: string
          genero?: string
          id?: string
          paginas?: number
          titulo?: string
          user_id?: string | null
        }
        Relationships: []
      }
      community_playlists: {
        Row: {
          adicionado_por: string | null
          comentario: string
          created_at: string
          id: string
          spotify_id: string
          user_id: string | null
        }
        Insert: {
          adicionado_por?: string | null
          comentario?: string
          created_at?: string
          id: string
          spotify_id: string
          user_id?: string | null
        }
        Update: {
          adicionado_por?: string | null
          comentario?: string
          created_at?: string
          id?: string
          spotify_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string
          bio: string
          created_at: string
          email: string | null
          id: string
          modo: string
          nome: string
          tema: string
          updated_at: string
        }
        Insert: {
          avatar?: string
          bio?: string
          created_at?: string
          email?: string | null
          id: string
          modo?: string
          nome?: string
          tema?: string
          updated_at?: string
        }
        Update: {
          avatar?: string
          bio?: string
          created_at?: string
          email?: string | null
          id?: string
          modo?: string
          nome?: string
          tema?: string
          updated_at?: string
        }
        Relationships: []
      }
      shelf_items: {
        Row: {
          autor: string
          bg: string | null
          book_id: string
          created_at: string
          genero: string
          id: string
          iniciado_em: string | null
          pagina_atual: number
          paginas: number
          status: string
          terminado_em: string | null
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          autor?: string
          bg?: string | null
          book_id: string
          created_at?: string
          genero?: string
          id?: string
          iniciado_em?: string | null
          pagina_atual?: number
          paginas?: number
          status?: string
          terminado_em?: string | null
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          autor?: string
          bg?: string | null
          book_id?: string
          created_at?: string
          genero?: string
          id?: string
          iniciado_em?: string | null
          pagina_atual?: number
          paginas?: number
          status?: string
          terminado_em?: string | null
          titulo?: string
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
      perfil_publico: {
        Args: { _user_id: string }
        Returns: {
          avatar: string
          bio: string
          created_at: string
          id: string
          nome: string
        }[]
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
