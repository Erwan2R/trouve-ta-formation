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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      demarches: {
        Row: {
          cout: string | null
          delai_instruction: string | null
          fenetre_depot: string | null
          page_publiee: boolean
          slug: string
          validite: string | null
          verifie_le: string | null
        }
        Insert: {
          cout?: string | null
          delai_instruction?: string | null
          fenetre_depot?: string | null
          page_publiee?: boolean
          slug: string
          validite?: string | null
          verifie_le?: string | null
        }
        Update: {
          cout?: string | null
          delai_instruction?: string | null
          fenetre_depot?: string | null
          page_publiee?: boolean
          slug?: string
          validite?: string | null
          verifie_le?: string | null
        }
        Relationships: []
      }
      departements: {
        Row: {
          code: string
          nb_organismes_cache: number
          nom: string
          page_publiee: boolean
          slug: string
        }
        Insert: {
          code: string
          nb_organismes_cache?: number
          nom: string
          page_publiee?: boolean
          slug: string
        }
        Update: {
          code?: string
          nb_organismes_cache?: number
          nom?: string
          page_publiee?: boolean
          slug?: string
        }
        Relationships: []
      }
      lieux: {
        Row: {
          adresse: string
          code_postal: string
          est_siege: boolean
          id: number
          organisme_id: string
          ville_id: number | null
        }
        Insert: {
          adresse: string
          code_postal: string
          est_siege?: boolean
          id?: never
          organisme_id: string
          ville_id?: number | null
        }
        Update: {
          adresse?: string
          code_postal?: string
          est_siege?: boolean
          id?: never
          organisme_id?: string
          ville_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lieux_organisme_id_fkey"
            columns: ["organisme_id"]
            isOneToOne: false
            referencedRelation: "organismes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lieux_ville_id_fkey"
            columns: ["ville_id"]
            isOneToOne: false
            referencedRelation: "villes"
            referencedColumns: ["id"]
          },
        ]
      }
      organisme_titres: {
        Row: {
          financements: string[]
          lieu_id: number | null
          modalites: string | null
          organisme_id: string
          prix: number | null
          titre_id: number
        }
        Insert: {
          financements?: string[]
          lieu_id?: number | null
          modalites?: string | null
          organisme_id: string
          prix?: number | null
          titre_id: number
        }
        Update: {
          financements?: string[]
          lieu_id?: number | null
          modalites?: string | null
          organisme_id?: string
          prix?: number | null
          titre_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "organisme_titres_lieu_id_fkey"
            columns: ["lieu_id"]
            isOneToOne: false
            referencedRelation: "lieux"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisme_titres_organisme_id_fkey"
            columns: ["organisme_id"]
            isOneToOne: false
            referencedRelation: "organismes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisme_titres_titre_id_fkey"
            columns: ["titre_id"]
            isOneToOne: false
            referencedRelation: "titres_referentiel"
            referencedColumns: ["id"]
          },
        ]
      }
      organismes: {
        Row: {
          created_at: string
          id: string
          nom: string
          score_completude: number
          siret: string | null
          slug: string
          statut: Database["public"]["Enums"]["statut_organisme"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nom: string
          score_completude?: number
          siret?: string | null
          slug: string
          statut?: Database["public"]["Enums"]["statut_organisme"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nom?: string
          score_completude?: number
          siret?: string | null
          slug?: string
          statut?: Database["public"]["Enums"]["statut_organisme"]
          updated_at?: string
        }
        Relationships: []
      }
      titres_referentiel: {
        Row: {
          accroche: string | null
          archive_le: string | null
          categorie: string
          code_rncp: string | null
          created_at: string
          duree: string | null
          id: number
          libelle_court: string
          libelle_long: string
          ordre: number
          page_publiee: boolean
          remplace_par_id: number | null
          slug: string
          statut: Database["public"]["Enums"]["statut_titre"]
          titre_proche_id: number | null
        }
        Insert: {
          accroche?: string | null
          archive_le?: string | null
          categorie: string
          code_rncp?: string | null
          created_at?: string
          duree?: string | null
          id?: never
          libelle_court: string
          libelle_long: string
          ordre?: number
          page_publiee?: boolean
          remplace_par_id?: number | null
          slug: string
          statut?: Database["public"]["Enums"]["statut_titre"]
          titre_proche_id?: number | null
        }
        Update: {
          accroche?: string | null
          archive_le?: string | null
          categorie?: string
          code_rncp?: string | null
          created_at?: string
          duree?: string | null
          id?: never
          libelle_court?: string
          libelle_long?: string
          ordre?: number
          page_publiee?: boolean
          remplace_par_id?: number | null
          slug?: string
          statut?: Database["public"]["Enums"]["statut_titre"]
          titre_proche_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "titres_referentiel_remplace_par_id_fkey"
            columns: ["remplace_par_id"]
            isOneToOne: false
            referencedRelation: "titres_referentiel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "titres_referentiel_titre_proche_id_fkey"
            columns: ["titre_proche_id"]
            isOneToOne: false
            referencedRelation: "titres_referentiel"
            referencedColumns: ["id"]
          },
        ]
      }
      villes: {
        Row: {
          departement_code: string
          id: number
          nb_organismes_cache: number
          nom: string
          slug: string
        }
        Insert: {
          departement_code: string
          id?: never
          nb_organismes_cache?: number
          nom: string
          slug: string
        }
        Update: {
          departement_code?: string
          id?: never
          nb_organismes_cache?: number
          nom?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "villes_departement_code_fkey"
            columns: ["departement_code"]
            isOneToOne: false
            referencedRelation: "departements"
            referencedColumns: ["code"]
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
      statut_organisme: "brouillon" | "publie" | "suspendu"
      statut_titre: "actif" | "archive"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      statut_organisme: ["brouillon", "publie", "suspendu"],
      statut_titre: ["actif", "archive"],
    },
  },
} as const
